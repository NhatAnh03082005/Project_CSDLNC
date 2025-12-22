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
import { Plus, ArrowLeft } from "lucide-react";

export default function InventoryManagement() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const allProducts = [
    { id: 1, name: "Royal Canin Mini Adult", category: "Thức ăn" },
    { id: 2, name: "Nexgard Spectra", category: "Thuốc" },
    { id: 3, name: "Vòng cổ chống bọ chét", category: "Phụ kiện" },
    { id: 4, name: "Pedigree Adult", category: "Thức ăn" },
    { id: 5, name: "Whiskas Adult", category: "Thức ăn" },
    { id: 6, name: "Thuốc tẩy giun", category: "Thuốc" },
  ];

  const branches = [
    "PetCare Quận 1",
    "PetCare Quận 3",
    "PetCare Bình Thạnh",
    "PetCare Thủ Đức",
    "PetCare Gò Vấp",
    "PetCare Tân Bình",
    "PetCare Phú Nhuận",
    "PetCare Quận 7",
    "PetCare Quận 10",
    "PetCare Bình Tân",
  ];

  const products = [
    {
      id: 1,
      name: "Royal Canin Mini Adult",
      type: "Thức ăn",
      quantity: 45,
      price: 450000,
    },
    {
      id: 2,
      name: "Nexgard Spectra",
      type: "Thuốc",
      quantity: 28,
      price: 165000,
    },
    {
      id: 3,
      name: "Vòng cổ chống bọ chét",
      type: "Phụ kiện",
      quantity: 67,
      price: 120000,
    },
    {
      id: 4,
      name: "Pedigree Adult",
      type: "Thức ăn",
      quantity: 52,
      price: 380000,
    },
  ];

  if (selectedBranch) {
    return (
      <>
        <Button
          variant="ghost"
          className="gap-2 mb-4 hover:text-red-600 hover:bg-red-50"
          onClick={() => setSelectedBranch(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách chi nhánh
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sản phẩm tại {selectedBranch}</CardTitle>
                <CardDescription>
                  Quản lý số lượng sản phẩm tồn kho
                </CardDescription>
              </div>
              <Dialog
                open={isAddProductDialogOpen}
                onOpenChange={setIsAddProductDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm sản phẩm vào kho
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm sản phẩm vào kho</DialogTitle>
                    <DialogDescription>
                      Chọn sản phẩm từ danh sách và nhập số lượng
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="productSelect">Chọn sản phẩm</Label>
                      <select
                        id="productSelect"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {allProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.category})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialQuantity">Số lượng ban đầu</Label>
                      <Input
                        id="initialQuantity"
                        type="number"
                        placeholder="0"
                        defaultValue="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddProductDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={() => setIsAddProductDialogOpen(false)}>
                      Thêm vào kho
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
                  <div className="flex-1">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.type}</div>
                    <div className="text-sm font-medium text-blue-600">
                      {product.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor={`quantity-${product.id}`}
                      className="text-sm"
                    >
                      Số lượng:
                    </Label>
                    <Input
                      id={`quantity-${product.id}`}
                      type="number"
                      defaultValue={product.quantity}
                      className="w-24"
                    />
                    <Button size="sm">Cập nhật</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn chi nhánh</CardTitle>
        <CardDescription>
          Chọn chi nhánh để xem và quản lý tồn kho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {branches.map((branch, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="text-left">
                <div className="font-semibold">{branch}</div>
                <div className="text-sm text-gray-500">
                  Xem sản phẩm tồn kho
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
