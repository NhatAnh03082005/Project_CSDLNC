import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
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
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Royal Canin Mini Adult",
      category: "Thức ăn",
      price: 450000,
      description: "Thức ăn cho chó trưởng thành giống nhỏ",
    },
    {
      id: 2,
      name: "Nexgard Spectra",
      category: "Thuốc",
      price: 165000,
      description: "Thuốc trị ve, bọ chét",
    },
    {
      id: 3,
      name: "Vòng cổ chống bọ chét",
      category: "Phụ kiện",
      price: 120000,
      description: "Vòng cổ phòng ngừa bọ chét",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter((prod) => prod.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const saveEdit = () => {
    setProducts(
      products.map((prod) =>
        prod.id === selectedProduct.id ? { ...prod, ...editFormData } : prod
      )
    );
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>
              Quản lý tất cả sản phẩm trong hệ thống
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>
                  Thêm sản phẩm mới vào danh mục
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Tên sản phẩm</Label>
                  <Input
                    id="productName"
                    placeholder="Royal Canin Mini Adult"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <select
                    id="category"
                    className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="food">Thức ăn</option>
                    <option value="medicine">Thuốc</option>
                    <option value="accessory">Phụ kiện</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input id="price" type="number" placeholder="450000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" placeholder="Mô tả sản phẩm" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-blue-100 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
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
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-gray-500">{product.category}</div>
                <div className="text-sm font-medium text-blue-600">
                  {product.price.toLocaleString("vi-VN")} ₫
                </div>
                <div className="text-sm text-gray-500">
                  {product.description}
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
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  onClick={() => handleDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin sản phẩm {selectedProduct?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-productName">Tên sản phẩm</Label>
                <Input
                  id="edit-productName"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Danh mục</Label>
                <select
                  id="edit-category"
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      category: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Thức ăn">Thức ăn</option>
                  <option value="Thuốc">Thuốc</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Giá (VNĐ)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      price: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Input
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={saveEdit}
                className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="gap-0">
            <DialogHeader className="pb-4">
              <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <strong>{selectedProduct?.name}</strong> khỏi hệ thống?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
              <Button
                onClick={confirmDelete}
                className="bg-red-100 text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
