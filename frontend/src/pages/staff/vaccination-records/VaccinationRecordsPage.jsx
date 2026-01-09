import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import { employeeAPI } from "../../../api/services";
import { toast } from "../../../lib/toast";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import {
  Save,
  Syringe,
  Loader2,
  AlertCircle,
  RefreshCw,
  PawPrint,
  Calendar,
  User,
  Search,
  X,
  FileText,
  Package,
  CheckCircle2,
} from "lucide-react";

export default function VaccinationRecordsPage() {
  const [pendingRecords, setPendingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Packages
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null); // null = không dùng gói

  // Vaccines
  const [vaccines, setVaccines] = useState([]);
  const [vaccinesLoading, setVaccinesLoading] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  useEffect(() => {
    fetchPendingRecords();
    fetchBranch();
  }, []);

  const fetchBranch = async () => {
    try {
      const response = await employeeAPI.getBranch();
      const data = response.data;
      if (data.success) setBranchName(data.data?.tenChiNhanh || "");
    } catch (err) {
      console.error("Error fetching branch:", err);
    }
  };

  const fetchPendingRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/vaccinations/records/pending");
      if (response.data.success) {
        setPendingRecords(response.data.data || []);
      } else {
        setError(response.data.message || "Không thể lấy danh sách hồ sơ");
      }
    } catch (err) {
      console.error("Error fetching pending records:", err);
      setError(
        err.response?.data?.message || "Lỗi khi lấy danh sách hồ sơ tiêm phòng"
      );
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách gói đã đăng ký (active)
  const fetchCustomerPackages = async (maKhachHang) => {
    setPackagesLoading(true);
    try {
      const response = await api.get(
        `/vaccinations/customer/${maKhachHang}/subscriptions`
      );
      if (response.data.success) {
        const activePackages = (response.data.data || []).filter(
          (p) => p.TrangThai === "Đang hoạt động"
        );
        setPackages(activePackages);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
      setPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  };

  const fetchAllVaccines = async () => {
    setVaccinesLoading(true);
    try {
      const response = await api.get("/vaccinations");
      if (response.data) {
        const vaccineList = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setVaccines(vaccineList);
      }
    } catch (err) {
      console.error("Error fetching vaccines:", err);
      setVaccines([]);
    } finally {
      setVaccinesLoading(false);
    }
  };

  const fetchPackageVaccines = async (maGoiDK) => {
    setVaccinesLoading(true);
    try {
      const response = await api.get(
        `/vaccinations/packages/${maGoiDK}/vaccines`
      );
      if (response.data.success) {
        setVaccines(response.data.data || []);
      } else {
        setVaccines([]);
      }
    } catch (err) {
      console.error("Error fetching package vaccines:", err);
      setVaccines([]);
    } finally {
      setVaccinesLoading(false);
    }
  };

  const handlePackageChange = async (packageId) => {
    setSelectedPackage(packageId);
    setSelectedVaccine(null);

    if (packageId === null || packageId === "none") {
      await fetchAllVaccines();
    } else {
      await fetchPackageVaccines(packageId);
    }
  };

  const handleSelectRecord = async (record) => {
    setSelectedRecord(record);
    setSelectedVaccine(null);
    setSelectedPackage(null);
    setPackages([]);
    setVaccines([]);
    setShowForm(true);

    await fetchCustomerPackages(record.maKhachHang);
    await fetchAllVaccines();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVaccine) {
      toast.warning("Vui lòng chọn vaccine");
      return;
    }

    setSubmitting(true);
    try {
      const updateData = { MaVacXin: selectedVaccine };
      if (selectedPackage && selectedPackage !== "none") {
        updateData.MaGoiDK = selectedPackage;
      }

      const response = await api.put(
        `/vaccinations/records/${selectedRecord.maHoaDon}/${selectedRecord.stt}`,
        updateData
      );

      if (response.data.success) {
        toast.success("Cập nhật hồ sơ tiêm phòng thành công!");
        setShowForm(false);
        setSelectedRecord(null);
        setSelectedVaccine(null);
        setSelectedPackage(null);
        fetchPendingRecords();
      } else {
        toast.error(response.data.message || "Không thể cập nhật hồ sơ");
      }
    } catch (err) {
      console.error("Error updating record:", err);
      toast.error(
        err.response?.data?.message || "Không thể cập nhật hồ sơ tiêm phòng"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = pendingRecords.filter((r) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.tenKhachHang && r.tenKhachHang.toLowerCase().includes(q)) ||
      (r.tenThuCung && r.tenThuCung.toLowerCase().includes(q)) ||
      (r.maKhachHang && r.maKhachHang.toLowerCase().includes(q)) ||
      (r.maHoaDon && r.maHoaDon.toLowerCase().includes(q))
    );
  });

  const formatMoney = (v) => {
    if (v === null || v === undefined) return "—";
    try {
      return `${Number(v).toLocaleString("vi-VN")}đ`;
    } catch {
      return `${v}đ`;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans selection:bg-blue-100">
      <StaffHeader
        branchName={branchName}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="flex max-w-[1920px] mx-auto">
        <StaffSidebar />

        <main className="flex-1 p-8 min-w-0 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-green-700 flex items-center gap-3">
                <Syringe className="h-8 w-8 text-green-600" />
                Cập nhật hồ sơ tiêm phòng
              </h1>
              <p className="text-gray-600 mt-1">
                Chọn hồ sơ đang chờ để chọn gói/vaccine tiêm phòng
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Main Card */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-bold text-green-700 flex items-center gap-2">
                        <span className="bg-green-600 w-2 h-6 rounded-full block" />
                        Danh sách hồ sơ chờ cập nhật
                      </CardTitle>
                      <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                        {filteredRecords.length} hồ sơ
                      </CardDescription>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      {/* Search */}
                      <div className="relative w-full lg:w-[500px] group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-500 group-focus-within:text-green-600 transition-colors" />
                        </div>
                        <Input
                          placeholder="Tìm theo khách hàng hoặc thú cưng..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-green-100 focus:border-green-400 rounded-xl transition-all h-11 text-sm placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-gray-50/50 h-[300px] pb-5">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                      <p className="text-gray-600">
                        Đang tải danh sách hồ sơ...
                      </p>
                    </div>
                  ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                      <Syringe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold">Không có hồ sơ phù hợp</p>
                      <p className="text-sm mt-1">
                        Hãy thử từ khóa khác hoặc xóa bộ lọc tìm kiếm
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 h-full overflow-y-auto p-4">
                      {filteredRecords.map((record) => (
                        <div
                          key={`${record.maHoaDon}-${record.stt}`}
                          onClick={() => handleSelectRecord(record)}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-green-500/10 hover:border-green-400 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl" />

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Left */}
                            <div className="md:col-span-5 flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                                <PawPrint className="h-6 w-6 text-green-700" />
                              </div>

                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                  {record.tenKhachHang} •{" "}
                                  <span className="text-green-700">
                                    {record.tenThuCung}
                                  </span>
                                </p>
                                <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center gap-1">
                                    <User className="h-3 w-3" />{" "}
                                    {record.maKhachHang}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {record.loaiThuCung} ({record.giongThuCung})
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="md:col-span-4">
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 font-semibold">
                                  <Calendar className="h-3 w-3" />
                                  Ngày tạo: {formatDate(record.ngayLap)}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 font-semibold">
                                  <FileText className="h-3 w-3" />
                                  {record.maHoaDon} • {record.stt}
                                </span>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="md:col-span-3 flex md:justify-end">
                              <Badge className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold">
                                Chờ chọn vaccine
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Dialog (same style as MedicalRecordsPage) */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="max-w-3xl w-full max-h-[90vh] rounded-3xl bg-white shadow-2xl border-0 p-0 overflow-hidden flex flex-col [&>button]:hidden">
                {/* Top gradient header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white relative overflow-hidden flex-shrink-0">
                  <div className="absolute right-3 top-3 opacity-[0.07]">
                    <Syringe className="h-20 w-20 transform rotate-12" />
                  </div>

                  <button
                    onClick={() => setShowForm(false)}
                    className="absolute right-3 top-3 h-9 w-9 rounded-full flex items-center justify-center text-white/90 hover:bg-white/15 hover:text-white transition z-20"
                    disabled={submitting}
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <DialogTitle className="text-lg font-bold flex items-center gap-2 relative z-10">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    Cập nhật hồ sơ tiêm phòng
                  </DialogTitle>

                  <DialogDescription className="text-green-100 mt-1 relative z-10 font-medium opacity-90 text-sm">
                    {selectedRecord
                      ? `${selectedRecord.tenKhachHang} • ${selectedRecord.tenThuCung} • HĐ ${selectedRecord.maHoaDon} (STT ${selectedRecord.stt})`
                      : "Chọn gói/vaccine tiêm phòng"}
                  </DialogDescription>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4">
                  {/* Quick info card */}
                  {selectedRecord && (
                    <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
                            Khách hàng
                          </p>
                          <p className="font-bold text-gray-900 mt-1">
                            {selectedRecord.tenKhachHang}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            <span className="font-semibold">
                              {selectedRecord.maKhachHang}
                            </span>
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
                            Thú cưng
                          </p>
                          <p className="font-bold text-gray-900 mt-1">
                            {selectedRecord.tenThuCung}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {selectedRecord.loaiThuCung}
                            {` (${selectedRecord.giongThuCung})`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-green-200 px-3 py-1 font-semibold text-green-700">
                          <Calendar className="h-3 w-3" />
                          Ngày tạo: {formatDate(selectedRecord.ngayLap)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-green-200 px-3 py-1 font-semibold text-green-700">
                          <FileText className="h-3 w-3" />
                          {selectedRecord.maHoaDon} • {selectedRecord.stt}
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Packages (same spacing + card radio style like Medical fields) */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Gói tiêm phòng (tùy chọn)
                      </Label>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                        {packagesLoading ? (
                          <div className="flex items-center justify-center py-6 gap-2 text-gray-600">
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                            <span className="text-sm">
                              Đang tải danh sách gói...
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {/* none */}
                            <button
                              type="button"
                              onClick={() => handlePackageChange(null)}
                              className={`w-full text-left rounded-xl p-3 border transition-all ${
                                selectedPackage === null ||
                                selectedPackage === "none"
                                  ? "bg-white border-green-300 shadow-sm"
                                  : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedPackage === null ||
                                    selectedPackage === "none"
                                      ? "border-green-600"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {(selectedPackage === null ||
                                    selectedPackage === "none") && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                  )}
                                </div>

                                <div className="flex-1">
                                  <p className="font-bold text-gray-900">
                                    Không dùng gói (hiển thị tất cả vaccine)
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Chọn vaccine từ toàn bộ danh mục hệ thống
                                  </p>
                                </div>
                              </div>
                            </button>

                            {/* packages */}
                            {packages.length === 0 ? (
                              <div className="text-xs text-gray-500 px-2 py-1">
                                Khách hàng chưa có gói đang hoạt động.
                              </div>
                            ) : (
                              packages.map((pkg) => (
                                <button
                                  type="button"
                                  key={pkg.MaGoiDK}
                                  onClick={() =>
                                    handlePackageChange(pkg.MaGoiDK)
                                  }
                                  className={`w-full text-left rounded-xl p-3 border transition-all ${
                                    selectedPackage === pkg.MaGoiDK
                                      ? "bg-white border-green-300 shadow-sm"
                                      : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedPackage === pkg.MaGoiDK
                                          ? "border-green-600"
                                          : "border-slate-300"
                                      }`}
                                    >
                                      {selectedPackage === pkg.MaGoiDK && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="font-bold text-gray-900 truncate">
                                          {pkg.LoaiGoi}
                                        </p>
                                        <Badge className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">
                                          {pkg.TrangThai}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Mã: {pkg.MaGoiDK} • Ưu đãi: {pkg.UuDai}%
                                        • HSD:{" "}
                                        {new Date(
                                          pkg.ThoiGianKetThuc
                                        ).toLocaleDateString("vi-VN")}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vaccines */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
                        Vaccine <span className="text-red-500">*</span>
                      </Label>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                        {vaccinesLoading ? (
                          <div className="flex items-center justify-center py-6 gap-2 text-gray-600">
                            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                            <span className="text-sm">
                              Đang tải danh sách vaccine...
                            </span>
                          </div>
                        ) : vaccines.length === 0 ? (
                          <div className="text-center py-6 text-gray-500 text-sm">
                            Không có vaccine nào{" "}
                            {selectedPackage ? "trong gói này" : "khả dụng"}.
                          </div>
                        ) : (
                          <div className="grid gap-2 max-h-72 overflow-y-auto pr-1">
                            {vaccines.map((vaccine) => {
                              const isActive =
                                selectedVaccine === vaccine.MaVacXin;
                              const hasDiscount =
                                vaccine.GiaSauUuDai !== undefined;

                              return (
                                <button
                                  type="button"
                                  key={vaccine.MaVacXin}
                                  onClick={() =>
                                    setSelectedVaccine(vaccine.MaVacXin)
                                  }
                                  className={`w-full text-left rounded-xl p-3 border transition-all ${
                                    isActive
                                      ? "bg-white border-green-300 shadow-sm"
                                      : "bg-white/40 border-transparent hover:bg-white hover:border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                        isActive
                                          ? "border-green-600"
                                          : "border-slate-300"
                                      }`}
                                    >
                                      {isActive && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                          <p className="font-bold text-gray-900 truncate">
                                            {vaccine.TenVacXin}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Mã: {vaccine.MaVacXin}
                                          </p>
                                        </div>

                                        {isActive && (
                                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Đã chọn
                                          </span>
                                        )}
                                      </div>

                                      <div className="mt-2 text-xs text-gray-600">
                                        {hasDiscount ? (
                                          <>
                                            Giá gốc:{" "}
                                            <s className="text-gray-400">
                                              {formatMoney(vaccine.GiaGoc)}
                                            </s>{" "}
                                            <span className="mx-1">→</span>
                                            <span className="font-extrabold text-green-700">
                                              {formatMoney(vaccine.GiaSauUuDai)}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            Giá:{" "}
                                            <span className="font-extrabold text-gray-900">
                                              {formatMoney(vaccine.GiaTien)}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        disabled={submitting}
                        className="h-11 rounded-xl"
                      >
                        Hủy
                      </Button>

                      <Button
                        type="submit"
                        disabled={submitting || !selectedVaccine}
                        className="px-6 h-11 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md shadow-green-100 gap-2 transition-all active:scale-95"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Lưu hồ sơ
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
