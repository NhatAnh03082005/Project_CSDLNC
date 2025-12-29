import React, { useState, useEffect } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { productAPI } from "../../../../api/services";
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
import { Plus, Edit } from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      await productAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        TenSanPham: "",
        LoaiSanPham: "",
        DonGia: "",
      });
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error("Error adding product:", err);
      alert(err.response?.data?.message || "Không thể thêm sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      TenSanPham: product.TenSanPham || "",
      LoaiSanPham: product.LoaiSanPham || "",
      DonGia: product.DonGia || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await productAPI.update(selectedProduct.MaSanPham, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err.response?.data?.message || "Không thể cập nhật sản phẩm");
    }
  };

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-emerald-600 font-semibold text-xl">
              Danh sách sản phẩm
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả sản phẩm trên hệ thống
            </CardDescription>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-emerald-100 text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-emerald-600 font-semibold">
                  Thêm sản phẩm mới
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Thêm sản phẩm mới vào danh mục
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
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
                    className="text-black placeholder:text-gray-600"
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
                    className="text-black placeholder:text-gray-600"
                  />
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
                        DonGia: Number(e.target.value),
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="bg-emerald-100 text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Thêm sản phẩm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có sản phẩm nào
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.MaSanPham}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-emerald-600">
                    {product.MaSanPham} - {product.TenSanPham}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.LoaiSanPham} - {product.DonGia} VNĐ
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-600 font-semibold">
                Chỉnh sửa sản phẩm
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin sản phẩm{" "}
                <strong>{selectedProduct?.MaSanPham}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
                />
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
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={saveEdit}
                variant="outline"
                className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
