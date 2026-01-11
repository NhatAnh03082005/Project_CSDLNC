import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Tag, Wallet, Search } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import AdminHeader from "../../components/AdminHeader";
import { productAPI } from "../../../../api/services";
import { toast } from "../../../../lib/toast";
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

export default function ProductManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin/management");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [addFormData, setAddFormData] = useState({
    TenSanPham: "",
    LoaiSanPham: "",
    DonGia: "",
  });

  const [editFormData, setEditFormData] = useState({
    TenSanPham: "",
    LoaiSanPham: "",
    DonGia: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([productAPI.getAll()]);

      const productsRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;

      const productsData = productsRes?.data?.data ?? productsRes?.data ?? [];

      setProducts(Array.isArray(productsData) ? productsData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...addFormData,
        DonGia:
          addFormData.DonGia === "" ? "" : Number(addFormData.DonGia || 0),
      };

      await productAPI.create(payload);
      await fetchData();

      setIsAddDialogOpen(false);
      setAddFormData({
        TenSanPham: "",
        LoaiSanPham: "",
        DonGia: "",
      });

      toast.success("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Không thể thêm sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      TenSanPham: product.TenSanPham || "",
      LoaiSanPham: product.LoaiSanPham || "",
      DonGia: product.DonGia ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      const payload = {
        ...editFormData,
        DonGia:
          editFormData.DonGia === "" ? "" : Number(editFormData.DonGia || 0),
      };

      await productAPI.update(selectedProduct.MaSanPham, payload);
      await fetchData();

      setIsEditDialogOpen(false);
      setSelectedProduct(null);

      toast.success("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(err.response?.data?.message || "Không thể cập nhật sản phẩm");
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchName = product.TenSanPham?.toLowerCase().includes(searchLower);
    const matchType = product.LoaiSanPham?.toLowerCase().includes(searchLower);
    const matchPrice = product.DonGia?.toString().includes(searchTerm);

    return matchName || matchType || matchPrice;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchData} className="mt-4 mx-auto block">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                  onClick={onBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Quản lý sản phẩm
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý tất cả sản phẩm trên hệ thống
                  </p>
                </div>
              </div>

              {/* ADD DIALOG */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                    <Plus className="h-4 w-4" />
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      Thêm sản phẩm mới
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                      Điền đầy đủ thông tin để tạo một sản phẩm mới vào hệ
                      thống.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="TenSanPham">Tên sản phẩm</Label>
                        <Input
                          id="TenSanPham"
                          placeholder="Nhập tên sản phẩm"
                          value={addFormData.TenSanPham}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              TenSanPham: e.target.value,
                            })
                          }
                          className="h-10 text-black placeholder:text-gray-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="LoaiSanPham">Loại sản phẩm</Label>
                        <Input
                          id="LoaiSanPham"
                          placeholder="Thức ăn / Thuốc / Phụ kiện"
                          value={addFormData.LoaiSanPham}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              LoaiSanPham: e.target.value,
                            })
                          }
                          className="h-10 text-black placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="DonGia">Đơn giá (VNĐ)</Label>
                      <Input
                        id="DonGia"
                        type="number"
                        placeholder="Nhập đơn giá"
                        value={addFormData.DonGia}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            DonGia: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      onClick={handleAdd}
                      className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Thêm sản phẩm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, loại sản phẩm hoặc đơn giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Grid Layout - Product Cards (5 cards / row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                {searchTerm.trim()
                  ? "Không tìm thấy sản phẩm nào phù hợp"
                  : "Không có sản phẩm nào"}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card
                  key={product.MaSanPham}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  {/* Edit Button - Top Right */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>

                  <CardContent className="pr-4 pl-4">
                    {/* Header */}
                    <div className="mb-6 pr-8">
                      <h3 className="text-lg font-bold text-sky-600 mb-2 line-clamp-2">
                        {product.TenSanPham?.replace(/^Phụ kiện - /, "") ||
                          product.TenSanPham}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {product.MaSanPham}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{product.LoaiSanPham || "Chưa phân loại"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {Number(product.DonGia || 0).toLocaleString()} VNĐ
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* EDIT DIALOG */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Chỉnh sửa sản phẩm
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Cập nhật thông tin cho sản phẩm{" "}
                  <strong className="text-blue-600">
                    {selectedProduct?.MaSanPham}
                  </strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-TenSanPham">Tên sản phẩm</Label>
                    <Input
                      id="edit-TenSanPham"
                      value={editFormData.TenSanPham}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          TenSanPham: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-LoaiSanPham">Loại sản phẩm</Label>
                    <Input
                      id="edit-LoaiSanPham"
                      value={editFormData.LoaiSanPham}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          LoaiSanPham: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-DonGia">Đơn giá (VNĐ)</Label>
                  <Input
                    id="edit-DonGia"
                    type="number"
                    value={editFormData.DonGia}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        DonGia: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  onClick={saveEdit}
                  className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
