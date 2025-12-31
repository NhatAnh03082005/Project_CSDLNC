import React, { useState } from "react";
// 1. Thay thế Next.js hooks bằng React Router DOM hooks
import { useSearchParams, useNavigate } from "react-router-dom";
// 2. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 3. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Heart, ArrowLeft, ShoppingBag, Plus, Minus } from "lucide-react";

// Mock data (Giữ nguyên)
// Loại bỏ khai báo kiểu TypeScript: { [key: string]: string }
const branches = { 
  "1": "PetCare Quận 1",
  "2": "PetCare Quận 3",
  "3": "PetCare Bình Thạnh",
  "4": "PetCare Thủ Đức",
  "5": "PetCare Gò Vấp",
};

const products = [
  {
    id: 1,
    branchId: 1,
    name: "Royal Canin Mini Adult",
    type: "Thức ăn",
    price: 450000,
    description: "Thức ăn cho chó trưởng thành giống nhỏ",
  },
  {
    id: 2,
    branchId: 1,
    name: "Whiskas Adult Tuna",
    type: "Thức ăn",
    price: 85000,
    description: "Thức ăn cho mèo trưởng thành vị cá ngừ",
  },
  {
    id: 3,
    branchId: 1,
    name: "Nexgard Spectra",
    type: "Thuốc",
    price: 165000,
    description: "Viên nhai phòng trị ký sinh trùng cho chó",
  },
  {
    id: 4,
    branchId: 1,
    name: "Vòng cổ chống bọ chét",
    type: "Phụ kiện",
    price: 120000,
    description: "Vòng cổ chống bọ chét hiệu quả 8 tháng",
  },
  {
    id: 5,
    branchId: 1,
    name: "Pedigree Adult",
    type: "Thức ăn",
    price: 320000,
    description: "Thức ăn cho chó trưởng thành mọi giống",
  },
  {
    id: 6,
    branchId: 1,
    name: "Vitamin tổng hợp",
    type: "Thuốc",
    price: 95000,
    description: "Vitamin tăng cường sức khỏe cho thú cưng",
  },
  {
    id: 7,
    branchId: 2,
    name: "Pro Plan Adult",
    type: "Thức ăn",
    price: 520000,
    description: "Thức ăn cao cấp cho chó trưởng thành",
  },
  {
    id: 8,
    branchId: 2,
    name: "Me-O Adult",
    type: "Thức ăn",
    price: 75000,
    description: "Thức ăn cho mèo trưởng thành",
  },
  {
    id: 9,
    branchId: 2,
    name: "Thuốc tẩy giun",
    type: "Thuốc",
    price: 45000,
    description: "Thuốc tẩy giun an toàn cho chó mèo",
  },
  {
    id: 10,
    branchId: 2,
    name: "Lược chải lông",
    type: "Phụ kiện",
    price: 65000,
    description: "Lược chải lông chuyên dụng",
  },
  {
    id: 11,
    branchId: 4,
    name: "Hill's Science Diet",
    type: "Thức ăn",
    price: 680000,
    description: "Thức ăn dinh dưỡng cao cấp cho chó",
  },
  {
    id: 12,
    branchId: 4,
    name: "Thuốc nhỏ mắt",
    type: "Thuốc",
    price: 55000,
    description: "Thuốc nhỏ mắt cho thú cưng",
  },
  {
    id: 13,
    branchId: 5,
    name: "SmartHeart Adult",
    type: "Thức ăn",
    price: 280000,
    description: "Thức ăn cho chó trưởng thành",
  },
  {
    id: 14,
    branchId: 5,
    name: "Đồ chơi cao su",
    type: "Phụ kiện",
    price: 45000,
    description: "Đồ chơi cao su cho chó",
  },
];

function ProductsListContent() {
  const [searchParams] = useSearchParams();
  // Loại bỏ const router = useRouter() vì không dùng
  const branchId = searchParams.get("branch") || "1";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Loại bỏ khai báo kiểu TypeScript: (typeof products)[0] | null
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Filter products by branch
  const branchProducts = products.filter((product) => product.branchId === Number.parseInt(branchId));

  // Loại bỏ khai báo kiểu TypeScript: (product: (typeof products)[0])
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsDialogOpen(true);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setIsDialogOpen(false);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // Loại bỏ khai báo kiểu TypeScript: (price: number)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Loại bỏ khai báo kiểu TypeScript: (type: string)
  const getProductTypeColor = (type) => {
    switch (type) {
      case "Thức ăn":
        return "bg-green-100 text-green-800";
      case "Thuốc":
        return "bg-blue-100 text-blue-800";
      case "Phụ kiện":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          {/* Sửa Link href -> to */}
          <Link to="/branches?service=products">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Danh sách sản phẩm</h1>
              {/* Lấy tên chi nhánh từ mock data */}
              <p className="text-gray-600 mt-1">{branches[branchId]}</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {branchProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <CardHeader>
                  <CardTitle className="text-balance">{product.name}</CardTitle>
                  <CardDescription>
                    <Badge className={getProductTypeColor(product.type)}>{product.type}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 text-pretty">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-900">{formatPrice(product.price)}</span>
                    <Button size="sm" variant="outline">
                      Chọn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">Không có sản phẩm nào tại chi nhánh này.</p>
            {/* Sửa Link href -> to */}
            <Link to="/branches?service=products">
              <Button className="mt-4">Chọn chi nhánh khác</Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Quantity Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn số lượng</DialogTitle>
            <DialogDescription>
              {/* Sử dụng selectedProduct an toàn */}
              {selectedProduct?.name} - {formatPrice(selectedProduct?.price || 0)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label className="mb-4 block">Số lượng</Label>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-20 text-center">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value) || 1;
                    if (val >= 1 && val <= 99) {
                      setQuantity(val);
                    }
                  }}
                  min={1}
                  max={99}
                  className="text-center text-2xl font-bold"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= 99}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-900">
                  {/* Tính toán tổng cộng an toàn */}
                  {formatPrice((selectedProduct?.price || 0) * quantity)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddToCart}>Thêm vào giỏ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Loại bỏ Suspense và xuất Component chính
export default ProductsListContent;