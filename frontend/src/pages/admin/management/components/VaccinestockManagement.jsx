import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Syringe, Wallet, Search } from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { Button } from "../../../../components/ui/button";
import { branchAPI, vaccinationAPI } from "../../../../api/services";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
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

export default function VaccinestockManagement() {
  const navigate = useNavigate();
  const onBackToManagement = () => navigate("/admin/management");

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [vaccinesStock, setVaccinesStock] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);

  const [localQty, setLocalQty] = useState({});
  const [updatingQuantities, setUpdatingQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddVaccineDialogOpen, setIsAddVaccineDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("0");

  // ✅ chỉ hiện vaccine CHƯA có trong kho chi nhánh
  const availableVaccines = useMemo(() => {
    const stockIds = new Set((vaccinesStock || []).map((v) => v.MaVacXin));
    return (allVaccines || []).filter((v) => !stockIds.has(v.MaVacXin));
  }, [vaccinesStock, allVaccines]);

  // Filter vaccines stock based on search term
  const filteredVaccinesStock = useMemo(() => {
    if (!searchTerm.trim()) return vaccinesStock;

    const searchLower = searchTerm.toLowerCase();
    return (vaccinesStock || []).filter((vaccine) => {
      const matchName = vaccine.TenVacXin?.toLowerCase().includes(searchLower);
      const matchPrice = vaccine.GiaTien?.toString().includes(searchTerm);
      const matchQty = vaccine.SoLuongTon?.toString().includes(searchTerm);

      return matchName || matchPrice || matchQty;
    });
  }, [vaccinesStock, searchTerm]);

  // Fetch danh sách chi nhánh + vaccine khi mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [bRes, vRes] = await Promise.all([
          branchAPI.getAll(),
          vaccinationAPI.getAll(),
        ]);

        const branchesData = bRes.data?.data ?? bRes.data ?? [];
        const vaccinesData = vRes.data?.data ?? vRes.data ?? [];

        setBranches(Array.isArray(branchesData) ? branchesData : []);
        setAllVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu ban đầu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch tồn kho khi chọn chi nhánh
  useEffect(() => {
    if (selectedBranch?.MaChiNhanh) {
      fetchVaccinesStock(selectedBranch.MaChiNhanh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchVaccinesStock = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getVaccinesStock(branchId);
      const list = res.data?.data ?? res.data ?? [];

      const safeList = Array.isArray(list) ? list : [];
      setVaccinesStock(safeList);

      const next = {};
      safeList.forEach((v) => (next[v.MaVacXin] = String(v.SoLuongTon ?? 0)));
      setLocalQty(next);

      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải tồn kho:", err);
      setError("Không thể tải tồn kho");
      setVaccinesStock([]);
      setLocalQty({});
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setVaccinesStock([]);
    setLocalQty({});
    setSelectedVaccine("");
    setInitialQuantity("0");
    setIsAddVaccineDialogOpen(false);
    setError(null);
  };

  const handleAddVaccineToStock = async () => {
    if (!selectedBranch?.MaChiNhanh) return;
    if (!selectedVaccine) return alert("Vui lòng chọn vắc-xin");

    const qty = Number(initialQuantity);
    if (!Number.isInteger(qty) || qty < 0) {
      return alert("Vui lòng nhập số lượng hợp lệ (số nguyên >= 0)");
    }

    try {
      await branchAPI.addVaccineToStock(selectedBranch.MaChiNhanh, {
        MaVacXin: selectedVaccine,
        SoLuongTon: qty,
      });

      await fetchVaccinesStock(selectedBranch.MaChiNhanh);

      setSelectedVaccine("");
      setInitialQuantity("0");
      setIsAddVaccineDialogOpen(false);

      alert("Thêm vắc-xin vào kho thành công");
    } catch (err) {
      console.error("Lỗi khi thêm vắc-xin:", err);
      alert(err.response?.data?.message || "Không thể thêm vắc-xin vào kho");
    }
  };

  const handleUpdateQuantity = async (maVacXin) => {
    if (!selectedBranch?.MaChiNhanh) return;

    const qty = Number(localQty[maVacXin]);
    if (!Number.isInteger(qty) || qty < 0) {
      return alert("Số lượng phải là số nguyên >= 0");
    }

    try {
      setUpdatingQuantities((prev) => ({ ...prev, [maVacXin]: true }));

      await branchAPI.updateVaccineQty(selectedBranch.MaChiNhanh, maVacXin, {
        SoLuongTon: qty,
      });

      await fetchVaccinesStock(selectedBranch.MaChiNhanh);
      alert("Cập nhật số lượng thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      alert(err.response?.data?.message || "Không thể cập nhật số lượng");
    } finally {
      setUpdatingQuantities((prev) => ({ ...prev, [maVacXin]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* PAGE HEADER */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 space-y-4">
            <div className="flex items-center justify-between">
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
                      ? `Kho vắc-xin - ${selectedBranch.TenChiNhanh}`
                      : "Quản lý kho vắc-xin"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {selectedBranch
                      ? "Quản lý số lượng tồn kho vắc-xin theo từng chi nhánh"
                      : "Chọn chi nhánh để xem và quản lý tồn kho vắc-xin"}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              {selectedBranch && (
                <Dialog
                  open={isAddVaccineDialogOpen}
                  onOpenChange={setIsAddVaccineDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                      <Plus className="h-4 w-4" />
                      Thêm vắc-xin
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Thêm vắc-xin vào kho
                      </DialogTitle>
                      <DialogDescription className="text-gray-500 mt-2">
                        Chỉ hiển thị các vắc-xin chưa có trong kho chi nhánh.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="vaccineSelect">Chọn vắc-xin</Label>
                          {availableVaccines.length === 0 ? (
                            <div className="text-sm text-gray-500">
                              Chi nhánh này đã có tất cả vắc-xin trong danh mục.
                            </div>
                          ) : (
                            <select
                              id="vaccineSelect"
                              value={selectedVaccine}
                              onChange={(e) =>
                                setSelectedVaccine(e.target.value)
                              }
                              className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="">Chọn vắc-xin</option>
                              {availableVaccines.map((v) => (
                                <option key={v.MaVacXin} value={v.MaVacXin}>
                                  {v.TenVacXin}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="initialQuantity">
                            Số lượng ban đầu
                          </Label>
                          <Input
                            id="initialQuantity"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={initialQuantity}
                            onChange={(e) => setInitialQuantity(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        onClick={handleAddVaccineToStock}
                        className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        disabled={availableVaccines.length === 0}
                      >
                        Thêm vào kho
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Search Bar - chỉ hiện khi đã chọn chi nhánh */}
            {selectedBranch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, giá tiền hoặc số lượng tồn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>
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
            // =========================
            // Danh sách chi nhánh (1 dòng 5 cột)
            // =========================
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
          ) : filteredVaccinesStock.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                {searchTerm.trim()
                  ? "Không tìm thấy vắc-xin nào phù hợp"
                  : "Chưa có vắc-xin nào trong kho"}
              </CardContent>
            </Card>
          ) : (
            // =========================
            // Trong 1 chi nhánh (card grid 1 dòng 5 cột)
            // =========================
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredVaccinesStock.map((v) => (
                <Card
                  key={v.MaVacXin}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  <CardContent className="pr-4 pl-4">
                    {/* Header */}
                    <div className="mb-4 pr-4">
                      <h3 className="text-lg font-bold text-sky-600 mb-2 line-clamp-2">
                        {v.TenVacXin}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {v.MaVacXin}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>Vắc-xin</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {Number(v.GiaTien ?? 0).toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <Label className="text-sm text-gray-600">
                        Số lượng tồn
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        className="h-9"
                        value={localQty[v.MaVacXin] ?? "0"}
                        onChange={(e) =>
                          setLocalQty((prev) => ({
                            ...prev,
                            [v.MaVacXin]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
                      onClick={() => handleUpdateQuantity(v.MaVacXin)}
                      disabled={!!updatingQuantities[v.MaVacXin]}
                    >
                      {updatingQuantities[v.MaVacXin]
                        ? "Đang lưu..."
                        : "Cập nhật"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
