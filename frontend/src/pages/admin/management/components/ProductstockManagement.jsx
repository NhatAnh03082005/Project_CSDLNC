import React, { useState, useEffect, useMemo } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { branchAPI, productAPI } from "../../../../api/services";
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

export default function ProductstockManagement() {
  const [localQty, setLocalQty] = useState({});
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [productsStock, setProductsStock] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(true); // loading chung
  const [error, setError] = useState(null);

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("0"); // string cho input

  // ✅ chỉ hiện sản phẩm CHƯA có trong kho của chi nhánh
  const availableProducts = useMemo(() => {
    const stockIds = new Set(productsStock.map((p) => p.MaSanPham));
    return allProducts.filter((p) => !stockIds.has(p.MaSanPham));
  }, [productsStock, allProducts]);

  // Fetch danh sách chi nhánh + sản phẩm khi mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [bRes, pRes] = await Promise.all([
          branchAPI.getAll(),
          productAPI.getAll(),
        ]);

        const branchesData = bRes.data?.data ?? bRes.data ?? [];
        const productsData = pRes.data?.data ?? pRes.data ?? [];

        setBranches(branchesData);
        setAllProducts(productsData);
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
      fetchProductsStock(selectedBranch.MaChiNhanh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchProductsStock = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getProductsStock(branchId);

      const list = res.data?.data ?? res.data ?? [];

      setProductsStock(list);

      // init localQty theo tồn kho
      const next = {};
      list.forEach((p) => (next[p.MaSanPham] = String(p.SoLuongTon ?? 0)));
      setLocalQty(next);

      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải tồn kho:", err);
      setError("Không thể tải tồn kho");
      setProductsStock([]);
      setLocalQty({});
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setProductsStock([]);
    setLocalQty({});
    setSelectedProduct("");
    setInitialQuantity("0");
    setIsAddProductDialogOpen(false);
    setError(null);
  };

  const handleAddProductToStock = async () => {
    if (!selectedBranch?.MaChiNhanh) return;

    if (!selectedProduct) {
      alert("Vui lòng chọn sản phẩm");
      return;
    }

    const qty = Number(initialQuantity);
    if (!Number.isInteger(qty) || qty < 0) {
      alert("Vui lòng nhập số lượng hợp lệ (số nguyên >= 0)");
      return;
    }

    try {
      await branchAPI.addProductToStock(selectedBranch.MaChiNhanh, {
        MaSanPham: selectedProduct,
        SoLuongTon: qty,
      });

      await fetchProductsStock(selectedBranch.MaChiNhanh);

      // reset dialog
      setSelectedProduct("");
      setInitialQuantity("0");
      setIsAddProductDialogOpen(false);

      alert("Thêm sản phẩm vào kho thành công");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      alert(err.response?.data?.message || "Không thể thêm sản phẩm vào kho");
    }
  };

  const handleUpdateQuantity = async (maSanPham) => {
    if (!selectedBranch?.MaChiNhanh) return;

    const qty = Number(localQty[maSanPham]);
    if (!Number.isInteger(qty) || qty < 0) {
      alert("Số lượng phải là số nguyên >= 0");
      return;
    }

    try {
      setUpdatingQuantities((prev) => ({ ...prev, [maSanPham]: true }));

      await branchAPI.updateProductQty(selectedBranch.MaChiNhanh, maSanPham, {
        SoLuongTon: qty,
      });

      await fetchProductsStock(selectedBranch.MaChiNhanh);
      alert("Cập nhật số lượng thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      alert(err.response?.data?.message || "Không thể cập nhật số lượng");
    } finally {
      setUpdatingQuantities((prev) => ({ ...prev, [maSanPham]: false }));
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
                    {branch.ThanhPho} - Xem sản phẩm tồn kho
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
                Sản phẩm tại {selectedBranch.TenChiNhanh}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Quản lý số lượng sản phẩm tồn kho
              </CardDescription>
            </div>

            <Dialog
              open={isAddProductDialogOpen}
              onOpenChange={setIsAddProductDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-teal-100 text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                  disabled={availableProducts.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  Thêm sản phẩm vào kho
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-teal-600 font-semibold">
                    Thêm sản phẩm vào kho
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Chỉ hiển thị các sản phẩm chưa có trong kho chi nhánh
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="productSelect">Chọn sản phẩm</Label>

                    {availableProducts.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        Chi nhánh này đã có tất cả sản phẩm trong danh mục.
                      </div>
                    ) : (
                      <select
                        id="productSelect"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Chọn sản phẩm</option>
                        {availableProducts.map((product) => (
                          <option
                            key={product.MaSanPham}
                            value={product.MaSanPham}
                          >
                            {product.TenSanPham} ({product.LoaiSanPham})
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
                    onClick={handleAddProductToStock}
                    variant="outline"
                    className="bg-teal-100 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                    disabled={availableProducts.length === 0}
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
          ) : productsStock.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có sản phẩm nào trong kho
            </div>
          ) : (
            <div className="space-y-3">
              {productsStock.map((product) => (
                <div
                  key={product.MaSanPham}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-teal-600">
                      {product.TenSanPham}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.LoaiSanPham} - {product.DonGia} VNĐ
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="text-sm text-green-600">Số lượng:</Label>

                    <Input
                      type="number"
                      min="0"
                      className="w-24"
                      value={localQty[product.MaSanPham] ?? "0"}
                      onChange={(e) =>
                        setLocalQty((prev) => ({
                          ...prev,
                          [product.MaSanPham]: e.target.value,
                        }))
                      }
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-100 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                      onClick={() => handleUpdateQuantity(product.MaSanPham)}
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
