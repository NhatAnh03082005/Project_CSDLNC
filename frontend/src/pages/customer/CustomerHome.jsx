import React from "react";
// 1. Thay thế Link của 'next/link' bằng Link của 'react-router-dom'
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  Calendar,
  Syringe,
  ShoppingBag,
  Heart,
  Clock,
  MapPin,
  User,
  FolderOpen,
  ClipboardPlus,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";

export default function CustomerHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCareX</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {/* Sửa Link href -> to */}
            <Link to="/" className="text-sm font-medium hover:text-blue-600">
              Trang chủ
            </Link>
            <Link
              to="/services"
              className="text-sm font-medium hover:text-blue-600"
            >
              Dịch vụ
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium hover:text-blue-600"
            >
              Sản phẩm
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-blue-600"
            >
              Về chúng tôi
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* Cart Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96" align="end">
                <DropdownMenuLabel>Giỏ hàng của bạn</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {/* Cart Items */}
                  <div className="p-2 space-y-2">
                    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Royal Canin Mini Adult
                        </p>
                        <p className="text-xs text-gray-600">Thức ăn</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">SL: 2</span>
                          <span className="text-sm font-semibold">
                            900.000₫
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="text-red-600">×</span>
                      </Button>
                    </div>
                    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">Nexgard Spectra</p>
                        <p className="text-xs text-gray-600">Thuốc</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">SL: 1</span>
                          <span className="text-sm font-semibold">
                            165.000₫
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="text-red-600">×</span>
                      </Button>
                    </div>
                    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Vòng cổ chống bọ chét
                        </p>
                        <p className="text-xs text-gray-600">Phụ kiện</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">SL: 1</span>
                          <span className="text-sm font-semibold">
                            120.000₫
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="text-red-600">×</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-lg text-blue-600">1.185.000₫</span>
                  </div>
                  {/* Sửa Link href -> to */}
                  <Link to="/checkout">
                    <Button className="w-full">Thanh toán</Button>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="/abstract-geometric-shapes.png"
                      alt="User"
                    />
                    <AvatarFallback>KH</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Khách hàng
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      khachhang@email.com
                    </p>
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
                  <Link
                    to="/vaccination-packages"
                    className="flex items-center w-full"
                  >
                    Đăng ký gói tiêm phòng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  <Link to="/reviews" className="flex items-center w-full">
                    Đánh giá
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance text-blue-900">
              PetCare - Đồng hành cùng thú cưng của bạn
            </h1>
            <p className="text-lg text-gray-600 text-pretty leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe thú
              cưng, PetCare tự hào là một trong những hệ thống phòng khám thú y
              uy tín và chuyên nghiệp hàng đầu tại Việt Nam. Chúng tôi cam kết
              mang đến dịch vụ chăm sóc toàn diện, tận tâm và chất lượng cao
              nhất cho những người bạn bốn chân của bạn.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Mở cửa: 8:00 - 20:00</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>10+ chi nhánh</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Ảnh minh họa Hero */}
            <img
              src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
              alt="Bác sĩ thú y chăm sóc thú cưng"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe cho thú cưng
            của bạn
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Đặt lịch khám bệnh</CardTitle>
              <CardDescription>
                Đặt lịch hẹn khám sức khỏe định kỳ hoặc khi có vấn đề
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/branches?service=exam">
                <Button className="w-full">Đặt lịch ngay</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Syringe className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Tiêm phòng</CardTitle>
              <CardDescription>
                Tiêm phòng đầy đủ các loại vaccine cho thú cưng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/branches?service=vaccination">
                <Button className="w-full">Đặt lịch tiêm</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Mua sản phẩm</CardTitle>
              <CardDescription>
                Thức ăn, phụ kiện và các sản phẩm chăm sóc thú cưng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/branches?service=products">
                <Button className="w-full">Xem sản phẩm</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 fill-white" />
                <span className="text-lg font-bold">PetCare</span>
              </div>
              <p className="text-blue-200 text-sm">
                Hệ thống phòng khám thú y uy tín, chăm sóc thú cưng với tình yêu
                thương
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
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
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