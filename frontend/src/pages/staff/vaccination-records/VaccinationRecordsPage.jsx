import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Syringe,
  Loader2,
  AlertCircle,
  RefreshCw,
  PawPrint,
  Calendar,
  User,
  Package,
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

  // Package selection
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null); // null = "Không chọn gói"

  // Vaccine selection
  const [vaccines, setVaccines] = useState([]);
  const [vaccinesLoading, setVaccinesLoading] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  // Fetch pending records on mount
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

  // Lấy danh sách gói đã đăng ký của khách hàng
  const fetchCustomerPackages = async (maKhachHang) => {
    setPackagesLoading(true);
    try {
      const response = await api.get(
        `/vaccinations/customer/${maKhachHang}/subscriptions`
      );
      if (response.data.success) {
        // Chỉ lấy các gói đang hoạt động
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

  // Lấy tất cả vaccine
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

  // Lấy vaccine trong gói
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

  // Khi chọn gói thay đổi
  const handlePackageChange = async (packageId) => {
    setSelectedPackage(packageId);
    setSelectedVaccine(null); // Reset vaccine selection

    if (packageId === null || packageId === "none") {
      // Không chọn gói -> hiển thị tất cả vaccine
      await fetchAllVaccines();
    } else {
      // Chọn gói -> hiển thị vaccine trong gói
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

    // Fetch packages của khách hàng
    await fetchCustomerPackages(record.maKhachHang);
    // Fetch tất cả vaccine (mặc định)
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
      const updateData = {
        MaVacXin: selectedVaccine,
      };

      // Nếu có chọn gói, gửi kèm MaGoiDK
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
        fetchPendingRecords(); // Refresh list
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
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Syringe className="h-8 w-8 text-green-600" />
                  Cập nhật hồ sơ tiêm phòng
                </h1>
                <p className="text-gray-500 mt-1">
                  Chọn hồ sơ để cập nhật thông tin tiêm phòng
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchPendingRecords}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />{" "}
                Làm mới
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Danh sách hồ sơ chờ cập nhật</span>
                  {!loading && (
                    <Badge variant="secondary">
                      {pendingRecords.length} hồ sơ
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Click vào hồ sơ để chọn vaccine tiêm
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 mx-auto mb-4 text-green-500 animate-spin" />
                    <p className="text-gray-500">Đang tải danh sách hồ sơ...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    <AlertCircle className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">Lỗi</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                ) : pendingRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Syringe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold">
                      Không có hồ sơ nào chờ cập nhật
                    </p>
                    <p className="text-sm mt-1">
                      Tất cả hồ sơ tiêm phòng đã được chọn vaccine
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRecords.map((record) => (
                      <Card
                        key={`${record.maHoaDon}-${record.stt}`}
                        className="cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                        onClick={() => handleSelectRecord(record)}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                              <PawPrint className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {record.tenKhachHang} - {record.tenThuCung}
                              </h4>
                              <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />{" "}
                                  {record.maKhachHang}
                                </span>
                                <span>
                                  {record.loaiThuCung} - {record.giongThuCung}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Ngày tạo:{" "}
                                {record.ngayLap}
                                <span className="mx-2">|</span>
                                Mã HĐ: {record.maHoaDon}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            Chờ chọn vaccine
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cập nhật hồ sơ tiêm phòng</DialogTitle>
                  <DialogDescription>
                    Chọn vaccine cho {selectedRecord?.tenKhachHang} -{" "}
                    {selectedRecord?.tenThuCung}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-semibold">Khách hàng:</span>{" "}
                          {selectedRecord?.tenKhachHang}
                        </div>
                        <div>
                          <span className="font-semibold">Thú cưng:</span>{" "}
                          {selectedRecord?.tenThuCung} (
                          {selectedRecord?.loaiThuCung} -{" "}
                          {selectedRecord?.giongThuCung})
                        </div>
                        <div>
                          <span className="font-semibold">Mã KH:</span>{" "}
                          {selectedRecord?.maKhachHang}
                        </div>
                        <div>
                          <span className="font-semibold">Mã HĐ:</span>{" "}
                          {selectedRecord?.maHoaDon} - STT:{" "}
                          {selectedRecord?.stt}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chọn gói tiêm phòng */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Chọn gói tiêm phòng đã đăng ký
                    </Label>
                    {packagesLoading ? (
                      <div className="text-center py-4">
                        <Loader2 className="h-6 w-6 mx-auto text-green-500 animate-spin" />
                        <p className="text-sm text-gray-500 mt-2">
                          Đang tải danh sách gói...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Option "Không chọn gói" */}
                        <Card
                          className={`cursor-pointer transition-all p-3 ${
                            selectedPackage === null ||
                            selectedPackage === "none"
                              ? "border-green-500 bg-green-50"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => handlePackageChange(null)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                selectedPackage === null ||
                                selectedPackage === "none"
                                  ? "border-green-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {(selectedPackage === null ||
                                selectedPackage === "none") && (
                                <div className="h-2 w-2 rounded-full bg-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-700">
                                {packages.length === 0
                                  ? "Khách hàng chưa đăng ký gói nào"
                                  : "Không sử dụng gói (Hiển thị tất cả vaccine)"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {packages.length === 0
                                  ? "Sẽ hiển thị tất cả vaccine có trong hệ thống"
                                  : "Chọn vaccine từ toàn bộ danh mục"}
                              </p>
                            </div>
                          </div>
                        </Card>

                        {/* Danh sách gói đã đăng ký */}
                        {packages.map((pkg) => (
                          <Card
                            key={pkg.MaGoiDK}
                            className={`cursor-pointer transition-all p-3 ${
                              selectedPackage === pkg.MaGoiDK
                                ? "border-green-500 bg-green-50"
                                : "hover:border-gray-300"
                            }`}
                            onClick={() => handlePackageChange(pkg.MaGoiDK)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  selectedPackage === pkg.MaGoiDK
                                    ? "border-green-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedPackage === pkg.MaGoiDK && (
                                  <div className="h-2 w-2 rounded-full bg-green-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{pkg.LoaiGoi}</p>
                                <p className="text-xs text-gray-500">
                                  Mã: {pkg.MaGoiDK} | Ưu đãi: {pkg.UuDai}% |
                                  HSD:{" "}
                                  {new Date(
                                    pkg.ThoiGianKetThuc
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 text-xs"
                              >
                                {pkg.TrangThai}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chọn Vaccine */}
                  <div className="space-y-2">
                    <Label>Chọn Vaccine *</Label>
                    {vaccinesLoading ? (
                      <div className="text-center py-4">
                        <Loader2 className="h-6 w-6 mx-auto text-green-500 animate-spin" />
                        <p className="text-sm text-gray-500 mt-2">
                          Đang tải danh sách vaccine...
                        </p>
                      </div>
                    ) : vaccines.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p>
                          Không có vaccine nào{" "}
                          {selectedPackage ? "trong gói này" : "khả dụng"}
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-2 max-h-60 overflow-y-auto">
                        {vaccines.map((vaccine) => (
                          <Card
                            key={vaccine.MaVacXin}
                            className={`cursor-pointer transition-all p-3 ${
                              selectedVaccine === vaccine.MaVacXin
                                ? "border-green-500 bg-green-50"
                                : "hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedVaccine(vaccine.MaVacXin)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  selectedVaccine === vaccine.MaVacXin
                                    ? "border-green-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedVaccine === vaccine.MaVacXin && (
                                  <div className="h-2 w-2 rounded-full bg-green-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {vaccine.TenVacXin}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Mã: {vaccine.MaVacXin} |
                                  {vaccine.GiaSauUuDai !== undefined ? (
                                    <>
                                      {" "}
                                      Giá gốc:{" "}
                                      <s>
                                        {vaccine.GiaGoc?.toLocaleString(
                                          "vi-VN"
                                        )}
                                        đ
                                      </s>{" "}
                                      → Giá ưu đãi:{" "}
                                      <span className="text-green-600 font-semibold">
                                        {vaccine.GiaSauUuDai?.toLocaleString(
                                          "vi-VN"
                                        )}
                                        đ
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      Giá:{" "}
                                      {vaccine.GiaTien?.toLocaleString("vi-VN")}
                                      đ
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-start gap-3 pt-6 border-t border-gray-100 mt-6 ml-4">
                    <Button
                      type="submit"
                      disabled={submitting || !selectedVaccine}
                      className="flex-none px-6 h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-md shadow-green-100 gap-2 transition-all active:scale-95"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Lưu hồ sơ tiêm phòng
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="text-gray-500 hover:bg-gray-100 px-4 h-10 text-sm font-medium rounded-xl"
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
