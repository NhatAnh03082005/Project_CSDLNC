// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../../../components/ui/button";
import { branchAPI, vaccinationAPI } from "../../../../api/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
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
// Import Icons
import { Plus, ArrowLeft } from "lucide-react";

export default function VaccinestockManagement() {
  const [localQty, setLocalQty] = useState({});
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [vaccinesStock, setVaccinesStock] = useState([]);
  const [allVaccines, setAllVaccines] = useState([]);
  const [updatingQuantities, setUpdatingQuantities] = useState({});

  const [loading, setLoading] = useState(true); // loading chung
  const [error, setError] = useState(null);

  const [isAddVaccineDialogOpen, setIsAddVaccineDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("0"); // string cho input

  // ✅ chỉ hiện sản phẩm CHƯA có trong kho của chi nhánh
  const availableVaccines = useMemo(() => {
    const stockIds = new Set(vaccinesStock.map((v) => v.MaVacXin));
    return allVaccines.filter((v) => !stockIds.has(v.MaVacXin));
  }, [vaccinesStock, allVaccines]);

  // Fetch danh sách chi nhánh + sản phẩm khi mount
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
        setBranches(branchesData);
        setAllVaccines(vaccinesData);
        setError(null);
      } catch (err) {
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

      setVaccinesStock(list);
      // init localQty theo tồn kho
      const next = {};
      list.forEach((v) => (next[v.MaVacXin] = String(v.SoLuongTon ?? 0)));
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

    if (!selectedVaccine) {
      alert("Vui lòng chọn vaccine để thêm vào kho");
      return;
    }

    const qty = Number(initialQuantity);
    if (!Number.isInteger(qty) || qty < 0) {
      alert("Vui lòng nhập số lượng hợp lệ (số nguyên >= 0)");
      return;
    }

    try {
      await branchAPI.addVaccineToStock(selectedBranch.MaChiNhanh, {
        MaVacXin: selectedVaccine,
        SoLuongTon: qty,
      });

      await fetchVaccinesStock(selectedBranch.MaChiNhanh);
      // reset dialog
      setSelectedVaccine("");
      setInitialQuantity("0");
      setIsAddVaccineDialogOpen(false);
      alert("Thêm vaccine vào kho thành công");
    } catch (err) {
      console.error("Lỗi khi thêm vaccine:", err);
      alert(err.response?.data?.message || "Không thể thêm vaccine vào kho");
    }
  };

  const handleUpdateQuantity = async (maVacXin) => {
    if (!selectedBranch?.MaChiNhanh) return;

    const qty = Number(localQty[maVacXin]);
    if (!Number.isInteger(qty) || qty < 0) {
      alert("Số lượng phải là số nguyên >= 0");
      return;
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

  // =========================
  // UI: Danh sách chi nhánh
  // =========================
  if (!selectedBranch) {
    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-teal-600 font-semibold text-xl">
            Danh sách chi nhánh
          </CardTitle>
          <CardDescription className="text-gray-600">
            Chọn chi nhánh để xem và quản lý tồn kho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <Button
                key={branch.MaChiNhanh}
                variant="outline"
                className="justify-start h-auto p-4 bg-transparent"
                onClick={() => setSelectedBranch(branch)}
              >
                <div className="text-left">
                  <div className="font-semibold text-teal-600">
                    {branch.TenChiNhanh}
                  </div>
                  <div className="text-sm text-gray-500">
                    {branch.ThanhPho} - Xem vắc xin tồn kho
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // =========================
  // UI: Trong 1 chi nhánh
  // =========================
  return (
    <>
      <Button
        variant="outline"
        className="bg-teal-100 text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
        onClick={handleBackToBranches}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách chi nhánh
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-teal-600 font-semibold text-xl">
                Vắc xin tại {selectedBranch.TenChiNhanh}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Quản lý số lượng vắc xin tồn kho
              </CardDescription>
            </div>

            <Dialog
              open={isAddVaccineDialogOpen}
              onOpenChange={setIsAddVaccineDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-teal-100 text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                  disabled={availableVaccines.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  Thêm vắc xin vào kho
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-teal-600 font-semibold">
                    Thêm vắc xin vào kho
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Chỉ hiển thị các vắc xin chưa có trong kho chi nhánh
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="vaccineSelect">Chọn vắc xin</Label>

                    {availableVaccines.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        Chi nhánh này đã có tất cả vắc xin trong danh mục.
                      </div>
                    ) : (
                      <select
                        id="vaccineSelect"
                        value={selectedVaccine}
                        onChange={(e) => setSelectedVaccine(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Chọn vắc xin</option>
                        {availableVaccines.map((vaccine) => (
                          <option
                            key={vaccine.MaVacXin}
                            value={vaccine.MaVacXin}
                          >
                            {vaccine.TenVacXin}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialQuantity">Số lượng ban đầu</Label>
                    <Input
                      id="initialQuantity"
                      type="number"
                      placeholder="0"
                      value={initialQuantity}
                      onChange={(e) => setInitialQuantity(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleAddVaccineToStock}
                    variant="outline"
                    className="bg-teal-100 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                    disabled={availableVaccines.length === 0}
                  >
                    Thêm vào kho
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải tồn kho...
            </div>
          ) : vaccinesStock.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có vắc xin nào trong kho
            </div>
          ) : (
            <div className="space-y-3">
              {vaccinesStock.map((vaccine) => (
                <div
                  key={vaccine.MaVacXin}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-teal-600">
                      {vaccine.TenVacXin}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Number(vaccine.GiaTien ?? 0).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="text-sm text-green-600">Số lượng:</Label>

                    <Input
                      type="number"
                      min="0"
                      className="w-24"
                      value={localQty[vaccine.MaVacXin] ?? "0"}
                      onChange={(e) =>
                        setLocalQty((prev) => ({
                          ...prev,
                          [vaccine.MaVacXin]: e.target.value,
                        }))
                      }
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                      onClick={() => handleUpdateQuantity(vaccine.MaVacXin)}
                    >
                      Cập nhật
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
