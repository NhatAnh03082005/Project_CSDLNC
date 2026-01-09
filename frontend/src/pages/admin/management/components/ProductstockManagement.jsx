import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Tag, Wallet, MapPin, Search } from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { Button } from "../../../../components/ui/button";
import { branchAPI, productAPI } from "../../../../api/services";
import { toast } from "../../../../lib/toast";
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

export default function ProductstockManagement() {
  const navigate = useNavigate();
  const onBackToManagement = () => navigate("/admin/management");

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [productsStock, setProductsStock] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [localQty, setLocalQty] = useState({});
  const [updatingQuantities, setUpdatingQuantities] = useState({}); // ✅ FIX: thiếu state này
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("1");

  // ✅ chỉ hiện sản phẩm CHƯA có trong kho của chi nhánh
  const availableProducts = useMemo(() => {
    const stockIds = new Set(productsStock.map((p) => p.MaSanPham));
    return allProducts.filter((p) => !stockIds.has(p.MaSanPham));
  }, [productsStock, allProducts]);

  // Filter products stock based on search term
  const filteredProductsStock = useMemo(() => {
    if (!searchTerm.trim()) return productsStock;

    const searchLower = searchTerm.toLowerCase();
    return productsStock.filter((product) => {
      const matchName = product.TenSanPham?.toLowerCase().includes(searchLower);
      const matchType =
        product.LoaiSanPham?.toLowerCase().includes(searchLower);
      const matchPrice = product.DonGia?.toString().includes(searchTerm);
      const matchQty = product.SoLuongTon?.toString().includes(searchTerm);

      return matchName || matchType || matchPrice || matchQty;
    });
  }, [productsStock, searchTerm]);

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

        setBranches(Array.isArray(branchesData) ? branchesData : []);
        setAllProducts(Array.isArray(productsData) ? productsData : []);
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
    if (selectedBranch?.MaChiNhanh)
      fetchProductsStock(selectedBranch.MaChiNhanh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchProductsStock = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getProductsStock(branchId);
      const list = res.data?.data ?? res.data ?? [];

      setProductsStock(Array.isArray(list) ? list : []);

      // init localQty theo tồn kho
      const next = {};
      (Array.isArray(list) ? list : []).forEach(
        (p) => (next[p.MaSanPham] = String(p.SoLuongTon ?? 0))
      );
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
    setInitialQuantity("1");
    setIsAddProductDialogOpen(false);
    setError(null);
  };

  const handleAddProductToStock = async () => {
    if (!selectedBranch?.MaChiNhanh) return;

    if (!selectedProduct) {
      toast.warning("Vui lòng chọn sản phẩm");
      return;
    }

    const qty = Number(initialQuantity);
    if (!Number.isInteger(qty) || qty < 0) {
      toast.warning("Vui lòng nhập số lượng hợp lệ (số nguyên >= 0)");
      return;
    }

    try {
      await branchAPI.addProductToStock(selectedBranch.MaChiNhanh, {
        MaSanPham: selectedProduct,
        SoLuongTon: qty,
      });

      await fetchProductsStock(selectedBranch.MaChiNhanh);

      setSelectedProduct("");
      setInitialQuantity("1");
      setIsAddProductDialogOpen(false);

      toast.success("Thêm sản phẩm vào kho thành công");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      toast.error(
        err.response?.data?.message || "Không thể thêm sản phẩm vào kho"
      );
    }
  };

  const handleUpdateQuantity = async (maSanPham) => {
    if (!selectedBranch?.MaChiNhanh) return;

    const qty = Number(localQty[maSanPham]);
    if (!Number.isInteger(qty) || qty < 0) {
      toast.warning("Số lượng phải là số nguyên >= 0");
      return;
    }

    try {
      setUpdatingQuantities((prev) => ({ ...prev, [maSanPham]: true }));

      await branchAPI.updateProductQty(selectedBranch.MaChiNhanh, maSanPham, {
        SoLuongTon: qty,
      });

      await fetchProductsStock(selectedBranch.MaChiNhanh);
      toast.success("Cập nhật số lượng thành công");
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      toast.error(err.response?.data?.message || "Không thể cập nhật số lượng");
    } finally {
      setUpdatingQuantities((prev) => ({ ...prev, [maSanPham]: false }));
    }
  };

  // =========================
  // UI: Layout chung (giống các trang khác)
  // =========================
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
                      ? `Kho sản phẩm - ${selectedBranch.TenChiNhanh}`
                      : "Quản lý kho sản phẩm"}
                  </h1>

                  <p className="text-gray-600 mt-1">
                    {selectedBranch
                      ? "Quản lý số lượng tồn kho theo từng chi nhánh"
                      : "Chọn chi nhánh để xem và quản lý tồn kho sản phẩm"}
                  </p>
                </div>
              </div>

              {/* ACTIONS (chỉ hiện khi đã chọn chi nhánh) */}
              {selectedBranch && (
                <Dialog
                  open={isAddProductDialogOpen}
                  onOpenChange={setIsAddProductDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                      <Plus className="h-4 w-4" />
                      Thêm sản phẩm
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Thêm sản phẩm vào kho
                      </DialogTitle>
                      <DialogDescription className="text-gray-500 mt-2">
                        Chỉ hiển thị các sản phẩm chưa có trong kho chi nhánh.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="productSelect">Chọn sản phẩm</Label>
                          {availableProducts.length === 0 ? (
                            <div className="text-sm text-gray-500">
                              Chi nhánh này đã có tất cả sản phẩm trong danh
                              mục.
                            </div>
                          ) : (
                            <select
                              id="productSelect"
                              value={selectedProduct}
                              onChange={(e) =>
                                setSelectedProduct(e.target.value)
                              }
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
                          <Label htmlFor="initialQuantity">
                            Số lượng ban đầu
                          </Label>
                          <Input
                            id="initialQuantity"
                            type="number"
                            min="1"
                            placeholder="1"
                            value={initialQuantity}
                            onChange={(e) => setInitialQuantity(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        onClick={handleAddProductToStock}
                        className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        disabled={availableProducts.length === 0}
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
                  placeholder="Tìm kiếm theo tên, loại sản phẩm, đơn giá hoặc số lượng tồn..."
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
            // UI: Danh sách chi nhánh (1 dòng 5 cột)
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
          ) : (
            // =========================
            // UI: Trong 1 chi nhánh (tồn kho dạng card 1 dòng 5 cột)
            // =========================
            <>
              {filteredProductsStock.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-gray-500">
                    {searchTerm.trim()
                      ? "Không tìm thấy sản phẩm nào phù hợp"
                      : "Chưa có sản phẩm nào trong kho"}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {filteredProductsStock.map((product) => (
                    <Card
                      key={product.MaSanPham}
                      className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                    >
                      <CardContent className="pr-4 pl-4">
                        {/* Header */}
                        <div className="mb-4 pr-4">
                          <h3 className="text-lg font-bold text-sky-600 mb-2 line-clamp-2">
                            {product.TenSanPham}
                          </h3>
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            {product.MaSanPham}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>
                              {product.LoaiSanPham || "Chưa phân loại"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span>
                              {Number(product.DonGia || 0).toLocaleString()} VNĐ
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
                            value={localQty[product.MaSanPham] ?? "0"}
                            onChange={(e) =>
                              setLocalQty((prev) => ({
                                ...prev,
                                [product.MaSanPham]: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
                          onClick={() =>
                            handleUpdateQuantity(product.MaSanPham)
                          }
                          disabled={!!updatingQuantities[product.MaSanPham]}
                        >
                          {updatingQuantities[product.MaSanPham]
                            ? "Đang lưu..."
                            : "Cập nhật"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
