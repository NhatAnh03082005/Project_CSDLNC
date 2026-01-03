import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Trash2,
  Sparkles,
  Syringe,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { Button } from "../../../../components/ui/button";
import { branchAPI, serviceAPI, employeeAPI } from "../../../../api/services";
import { Card, CardContent } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";

export default function ServiceManagement() {
  const navigate = useNavigate();
  const onBackToManagement = () => navigate("/admin/management");

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [servicesBranch, setServicesBranch] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] =
    useState(false);

  const [selectedService, setSelectedService] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // ✅ Stats theo chi nhánh (tổng SP tồn, tổng vaccine tồn, số bác sĩ)
  const [branchStats, setBranchStats] = useState({
    productCount: 0,
    vaccineCount: 0,
    doctorCount: 0,
  });

  // ✅ chỉ hiện dịch vụ CHƯA có trong chi nhánh
  const availableServices = useMemo(() => {
    const branchServiceIds = new Set(
      (servicesBranch || []).map((s) => s.LoaiDichVu)
    );
    return (allServices || []).filter(
      (s) => !branchServiceIds.has(s.LoaiDichVu)
    );
  }, [servicesBranch, allServices]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [bRes, sRes] = await Promise.all([
          branchAPI.getAll(),
          serviceAPI.getAll(),
        ]);

        const branchesData = bRes.data?.data ?? bRes.data ?? [];
        const servicesData = sRes.data?.data ?? sRes.data ?? [];

        setBranches(Array.isArray(branchesData) ? branchesData : []);
        setAllServices(Array.isArray(servicesData) ? servicesData : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu ban đầu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedBranch?.MaChiNhanh) {
      fetchServicesOfBranch(selectedBranch.MaChiNhanh);
      fetchBranchStats(selectedBranch.MaChiNhanh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchServicesOfBranch = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getServicesStock(branchId);
      const list = res.data?.data ?? res.data ?? [];
      setServicesBranch(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải dịch vụ:", err);
      setError("Không thể tải dịch vụ");
      setServicesBranch([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Lấy stats chi nhánh
  // NOTE: doctorCount cần API getEmployees theo chi nhánh. Nếu chưa có, doctorCount sẽ 0.
  const fetchBranchStats = async (branchId) => {
    try {
      // Fetch products and vaccines for the branch
      const [pRes, vRes] = await Promise.all([
        branchAPI.getProductsStock(branchId),
        branchAPI.getVaccinesStock(branchId),
      ]);

      const products = pRes?.data?.data ?? pRes?.data ?? [];
      const vaccines = vRes?.data?.data ?? vRes?.data ?? [];

      // Fetch employees and filter by branch fields
      const empRes = await employeeAPI.getAll();
      const allEmployees = empRes?.data?.data ?? empRes?.data ?? [];

      // Try to match employees by branch identifier. backend `getAllEmployees` returns `TenChiNhanh`.
      const branchObj = (branches || []).find(
        (b) => String(b.MaChiNhanh) === String(branchId)
      );
      const branchName = branchObj?.TenChiNhanh;

      const employees = (allEmployees || []).filter((e) => {
        // prefer matching by TenChiNhanh (available from backend join)
        if (
          branchName &&
          String(e.TenChiNhanh || "").trim() === String(branchName).trim()
        )
          return true;

        const bid = String(branchId);
        return (
          String(e.MaChiNhanh || "") === bid ||
          String(e.ChiNhanh || "") === bid ||
          String(e.BranchId || "") === bid ||
          String(e.ChiNhanhId || "") === bid
        );
      });

      const productCount = (products || []).reduce(
        (sum, x) => sum + Number(x.SoLuongTon ?? 0),
        0
      );
      const vaccineCount = (vaccines || []).reduce(
        (sum, x) => sum + Number(x.SoLuongTon ?? 0),
        0
      );

      const doctorCount = (employees || []).filter((e) =>
        String(e.ViTri || "")
          .toLowerCase()
          .includes("bác sĩ")
      ).length;

      setBranchStats({ productCount, vaccineCount, doctorCount });
    } catch (e) {
      console.error("fetchBranchStats error:", e);
      setBranchStats({ productCount: 0, vaccineCount: 0, doctorCount: 0 });
    }
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setServicesBranch([]);
    setSelectedService("");
    setIsAddServiceDialogOpen(false);
    setError(null);
  };

  const handleAddServiceToBranch = async () => {
    if (!selectedBranch?.MaChiNhanh) return;
    if (!selectedService) return alert("Vui lòng chọn dịch vụ để thêm");

    try {
      await branchAPI.addServiceToBranch(selectedBranch.MaChiNhanh, {
        LoaiDichVu: selectedService,
      });

      await fetchServicesOfBranch(selectedBranch.MaChiNhanh);
      setSelectedService("");
      setIsAddServiceDialogOpen(false);
      alert("Thêm dịch vụ thành công");
    } catch (err) {
      console.error("Lỗi khi thêm dịch vụ:", err);
      alert(err.response?.data?.message || "Không thể thêm dịch vụ");
    }
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setIsDeleteServiceDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!selectedBranch?.MaChiNhanh || !serviceToDelete) return;

    try {
      await branchAPI.deleteServiceFromBranch(
        selectedBranch.MaChiNhanh,
        serviceToDelete.LoaiDichVu
      );

      await fetchServicesOfBranch(selectedBranch.MaChiNhanh);
      setIsDeleteServiceDialogOpen(false);
      setServiceToDelete(null);
      alert("Xóa dịch vụ thành công");
    } catch (err) {
      console.error("Lỗi khi xóa dịch vụ:", err);
      alert(err.response?.data?.message || "Không thể xóa dịch vụ");
    }
  };

  const getServiceConfig = (serviceName = "") => {
    const name = serviceName.toLowerCase();

    if (name.includes("tiêm phòng")) {
      return {
        type: "vaccine",
        icon: Syringe,
        text: "text-cyan-600",
        badge: "bg-cyan-100 text-cyan-600",
        border: "border-cyan-600",
        bg: "bg-gradient-to-br from-white to-cyan-50",
      };
    }
    if (name.includes("mua hàng")) {
      return {
        type: "product",
        icon: ShoppingBag,
        text: "text-sky-600",
        badge: "bg-sky-100 text-sky-600",
        border: "border-sky-600",
        bg: "bg-gradient-to-br from-white to-sky-50",
      };
    }
    if (name.includes("khám bệnh")) {
      return {
        type: "doctor",
        icon: Stethoscope,
        text: "text-blue-600",
        badge: "bg-blue-100 text-blue-600",
        border: "border-blue-600",
        bg: "bg-gradient-to-br from-white to-blue-50",
      };
    }
    return {
      type: "other",
      icon: Sparkles,
      badge: "bg-purple-100 text-purple-700",
    };
  };

  // ✅ hiển thị đúng 1 chỉ số theo loại dịch vụ
  const getPrimaryMetric = (type) => {
    if (type === "doctor") {
      return {
        label: "Tổng số bác sĩ tại chi nhánh",
        value: Number(branchStats.doctorCount || 0).toLocaleString("vi-VN"),
      };
    }
    if (type === "vaccine") {
      return {
        label: "Tổng số vắc xin tại chi nhánh",
        value: Number(branchStats.vaccineCount || 0).toLocaleString("vi-VN"),
      };
    }
    if (type === "product") {
      return {
        label: "Tổng số sản phẩm tại chi nhánh",
        value: Number(branchStats.productCount || 0).toLocaleString("vi-VN"),
      };
    }
    // mặc định: show đủ 3 (hoặc bạn có thể đổi thành “—”)
    return {
      label: "Tổng số lượng",
      value: `${Number(branchStats.productCount || 0).toLocaleString(
        "vi-VN"
      )} / ${Number(branchStats.vaccineCount || 0).toLocaleString(
        "vi-VN"
      )} / ${Number(branchStats.doctorCount || 0).toLocaleString("vi-VN")}`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* PAGE HEADER */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                onClick={
                  selectedBranch ? handleBackToBranches : onBackToManagement
                }
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {selectedBranch
                    ? `Dịch vụ - ${selectedBranch.TenChiNhanh}`
                    : "Quản lý dịch vụ theo chi nhánh"}
                </h1>

                <p className="text-gray-600 mt-1">
                  {selectedBranch
                    ? "Thêm / xóa dịch vụ đang áp dụng tại chi nhánh"
                    : "Chọn chi nhánh để xem và quản lý danh sách dịch vụ"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            {selectedBranch && (
              <Dialog
                open={isAddServiceDialogOpen}
                onOpenChange={setIsAddServiceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
                    disabled={availableServices.length === 0}
                  >
                    <Plus className="h-4 w-4" />
                    Thêm dịch vụ
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      Thêm dịch vụ cho chi nhánh
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                      Chỉ hiển thị các dịch vụ chưa có trong chi nhánh.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="serviceSelect">Chọn dịch vụ</Label>

                        {availableServices.length === 0 ? (
                          <div className="text-sm text-gray-500">
                            Chi nhánh này đã có tất cả dịch vụ trong danh mục.
                          </div>
                        ) : (
                          <select
                            id="serviceSelect"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Chọn dịch vụ</option>
                            {availableServices.map((s) => (
                              <option key={s.LoaiDichVu} value={s.LoaiDichVu}>
                                {s.LoaiDichVu}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      onClick={handleAddServiceToBranch}
                      className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      disabled={availableServices.length === 0}
                    >
                      Thêm vào chi nhánh
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* CONTENT */}
          {loading ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Đang tải dữ liệu...
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {error}
              </CardContent>
            </Card>
          ) : !selectedBranch ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {branches.map((branch) => (
                <Card
                  key={branch.MaChiNhanh}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  <CardContent>
                    <div className="mb-4 pr-4">
                      <h3 className="text-lg font-bold text-sky-600 mb-2">
                        {branch.TenChiNhanh}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {branch.MaChiNhanh}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-7">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>
                        {branch.Phuong}, {branch.ThanhPho}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
                      onClick={() => setSelectedBranch(branch)}
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : servicesBranch.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                Chưa có dịch vụ nào
              </CardContent>
            </Card>
          ) : (
            // ✅ mỗi card chỉ show 1 metric theo loại dịch vụ
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesBranch.map((service) => {
                const cfg = getServiceConfig(service.LoaiDichVu);
                const Icon = cfg.icon;
                const metric = getPrimaryMetric(cfg.type);

                return (
                  <Card
                    key={service.LoaiDichVu}
                    className={`relative rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${cfg.border} ${cfg.bg}`}
                  >
                    <CardContent>
                      {/* Trash icon nhỏ góc phải */}
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service)}
                        className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-lg bg-red-50 text-red-600 hover:text-white border border-red-100 hover:bg-red-600 transition-colors"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      {/* Header: Icon + Tên dịch vụ (center theo icon) */}
                      <div className="flex items-center gap-3 pr-12">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${cfg.badge}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                          <div
                            className={`text-xl font-bold leading-tight ${cfg.text}`}
                          >
                            {service.LoaiDichVu}
                          </div>
                        </div>
                      </div>

                      {/* Value */}
                      <div
                        className={`mt-6 mb-4 text-4xl font-bold ${cfg.text}`}
                      >
                        {metric.value}
                      </div>

                      {/* dưới tên: label */}
                      <div className="mt-1 text-sm text-gray-600">
                        {metric.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteServiceDialogOpen}
          onOpenChange={setIsDeleteServiceDialogOpen}
        >
          <DialogContent className="gap-0 sm:max-w-[520px]">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-red-600 font-semibold">
                Xác nhận xóa dịch vụ
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa dịch vụ{" "}
                <strong className="text-red-600 font-semibold">
                  {serviceToDelete?.LoaiDichVu}
                </strong>{" "}
                khỏi chi nhánh này?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-3 gap-2">
              <Button
                onClick={confirmDeleteService}
                className="h-10 bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
