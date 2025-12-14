import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Heart, User, FolderOpen, ClipboardPlus, Star, Plus, Trash2, Calendar, Gift, Clock } from "lucide-react";

// Mock data for registered packages
// Loại bỏ khai báo kiểu TypeScript: (typeof availablePackages)[0] | null
const registeredPackages = [
  {
    id: 1,
    name: "Gói tiêm phòng cơ bản cho chó",
    duration: "6 tháng",
    benefits: "Miễn phí tái khám 1 lần, giảm 10% chi phí khám bệnh",
    startDate: "01/01/2025",
    endDate: "01/07/2025",
  },
  {
    id: 2,
    name: "Gói tiêm phòng toàn diện cho mèo",
    duration: "12 tháng",
    benefits: "Miễn phí tái khám 3 lần, giảm 20% chi phí khám bệnh, tặng 1 lần tắm spa",
    startDate: "15/12/2024",
    endDate: "15/12/2025",
  },
];

// Mock data for available packages
const availablePackages = [
  {
    id: 3,
    name: "Gói tiêm phòng cơ bản cho chó",
    duration: "6 tháng",
    benefits: "Miễn phí tái khám 1 lần, giảm 10% chi phí khám bệnh",
  },
  {
    id: 4,
    name: "Gói tiêm phòng nâng cao cho chó",
    duration: "12 tháng",
    benefits: "Miễn phí tái khám 2 lần, giảm 15% chi phí khám bệnh",
  },
  {
    id: 5,
    name: "Gói tiêm phòng cơ bản cho mèo",
    duration: "6 tháng",
    benefits: "Miễn phí tái khám 1 lần, giảm 10% chi phí khám bệnh",
  },
  {
    id: 6,
    name: "Gói tiêm phòng toàn diện cho mèo",
    duration: "12 tháng",
    extra: "3 lần miễn phí tái khám, tặng 1 lần tắm spa",
    benefits: "Miễn phí tái khám 3 lần, giảm 20% chi phí khám bệnh, tặng 1 lần tắm spa",
  },
  {
    id: 7,
    name: "Gói tiêm phòng VIP cho thú cưng",
    duration: "12 tháng",
    benefits: "Miễn phí tái khám không giới hạn, giảm 30% chi phí khám bệnh, tặng gói chăm sóc spa trọn năm",
  },
];

export default function VaccinationPackagesPage() {
  // Loại bỏ khai báo kiểu TypeScript: (typeof registeredPackages)
  const [packages, setPackages] = useState(registeredPackages);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Loại bỏ khai báo kiểu TypeScript: (id: number)
  const handleDelete = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  // Loại bỏ khai báo kiểu TypeScript: (pkg: (typeof availablePackages)[0])
  const handleRegister = (pkg) => {
    const newPackage = {
      id: pkg.id,
      name: pkg.name,
      duration: pkg.duration,
      benefits: pkg.benefits,
      startDate: new Date().toLocaleDateString("vi-VN"),
      // Tính toán ngày kết thúc (chỉ là ví dụ, không chính xác 6 tháng)
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
    };
    setPackages([...packages, newPackage]);
    setDialogOpen(false);
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
          <nav className="hidden md:flex items-center gap-6">
            {/* Sửa Link href -> to */}
            <Link to="/" className="text-sm font-medium hover:text-blue-600">
              Trang chủ
            </Link>
            <Link to="/services" className="text-sm font-medium hover:text-blue-600">
              Dịch vụ
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-blue-600">
              Sản phẩm
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-blue-600">
              Về chúng tôi
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                    <AvatarFallback>KH</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Khách hàng</p>
                    <p className="text-xs leading-none text-muted-foreground">khachhang@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/profile" className="flex items-center w-full">
                    Quản lý hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/pets" className="flex items-center w-full">
                    Thêm/xóa/cập nhật hồ sơ thú cưng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ClipboardPlus className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/vaccination-packages" className="flex items-center w-full">
                    Đăng ký gói tiêm phòng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/reviews" className="flex items-center w-full">
                    Đánh giá
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Gói tiêm phòng của tôi</h1>
              <p className="text-gray-600">Quản lý các gói tiêm phòng đã đăng ký cho thú cưng của bạn</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Đăng ký gói mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Đăng ký gói tiêm phòng</DialogTitle>
                  <DialogDescription>Chọn gói tiêm phòng phù hợp cho thú cưng của bạn</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {availablePackages.map((pkg) => (
                    <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{pkg.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Thời hạn: {pkg.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{pkg.benefits}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRegister(pkg)}
                            disabled={packages.some((p) => p.id === pkg.id)}
                          >
                            {packages.some((p) => p.id === pkg.id) ? "Đã đăng ký" : "Đăng ký"}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {packages.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ClipboardPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có gói tiêm phòng nào</h3>
                <p className="text-gray-600 mb-6">
                  Đăng ký gói tiêm phòng để nhận ưu đãi và chăm sóc tốt hơn cho thú cưng
                </p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Đăng ký gói mới</Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Đang hoạt động
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Thời hạn:</strong> {pkg.duration}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Ưu đãi:</strong> {pkg.benefits}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Thời gian:</strong> {pkg.startDate} - {pkg.endDate}
                              </span>
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(pkg.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 fill-white" />
                <span className="text-lg font-bold">PetCare</span>
              </div>
              <p className="text-blue-200 text-sm">
                Hệ thống phòng khám thú y uy tín, chăm sóc thú cưng với tình yêu thương
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Dịch vụ</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Khám bệnh</li>
                <li>Tiêm phòng</li>
                <li>Phẫu thuật</li>
                <li>Chăm sóc spa</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Hotline: 1900 xxxx</li>
                <li>Email: info@petcare.vn</li>
                <li>Giờ làm việc: 8:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Theo dõi</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.259.013-3.668.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-200">
            <p>&copy; 2025 PetCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}