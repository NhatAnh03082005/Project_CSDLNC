import React from "react";
// 1. Thay thế Link của 'next/link' bằng Link của 'react-router-dom'
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button.jsx";
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
  Heart,
  User,
  FolderOpen,
  ClipboardPlus,
  Star,
  ShoppingBag,
  Award,
  Shield,
  Sparkles,
} from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
            <Link
              to="/services"
              className="text-sm font-medium hover:text-blue-600"
            >
              Dịch vụ
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium text-blue-600"
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
                <DropdownMenuItem className="text-red-600">
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Sản phẩm chất lượng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cung cấp đầy đủ các sản phẩm chăm sóc thú cưng từ thức ăn, thuốc men
            đến phụ kiện
          </p>
        </div>

        <div className="space-y-8">
          {/* Food Products */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8 text-orange-600" />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl mb-3">
                    Thức ăn dinh dưỡng
                  </CardTitle>
                  <CardDescription className="text-base">
                    Thức ăn cao cấp từ các thương hiệu hàng đầu thế giới
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thương hiệu uy tín:
                        </span>{" "}
                        Royal Canin, Hill's, Pedigree, Whiskas và nhiều thương
                        hiệu nổi tiếng khác
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">100% chính hãng:</span>{" "}
                        Nguồn gốc xuất xứ rõ ràng, đầy đủ giấy tờ chứng nhận
                        chất lượng
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Dinh dưỡng cân bằng:
                        </span>{" "}
                        Công thức đặc biệt cho từng loại thú cưng và độ tuổi
                        khác nhau
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                <img
                  src="/premium-pet-food-bags-and-bowls-colorful-display.png"
                  alt="Thức ăn thú cưng"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>

          {/* Medicine Products */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-full min-h-[300px] lg:min-h-[400px] order-2 lg:order-1">
                <img
                  src="/veterinary-medicine-bottles-and-supplements-for-pe.png"
                  alt="Thuốc thú y"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-8 flex flex-col justify-center order-1 lg:order-2">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl mb-3">
                    Thuốc và thực phẩm chức năng
                  </CardTitle>
                  <CardDescription className="text-base">
                    Đa dạng các loại thuốc điều trị và vitamin cho thú cưng
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thuốc chuyên dụng:
                        </span>{" "}
                        Thuốc điều trị ký sinh trùng, kháng sinh, thuốc da liễu
                        được nhập khẩu chính hãng
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thực phẩm chức năng:
                        </span>{" "}
                        Vitamin, khoáng chất, canxi, omega-3 giúp tăng cường sức
                        khỏe
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Tư vấn chuyên nghiệp:
                        </span>{" "}
                        Bác sĩ tư vấn miễn phí về cách sử dụng thuốc đúng cách
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Accessories Products */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl mb-3">
                    Phụ kiện thú cưng
                  </CardTitle>
                  <CardDescription className="text-base">
                    Đồ chơi, vòng cổ, quần áo và các phụ kiện đáng yêu
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Phụ kiện đa dạng:</span>{" "}
                        Vòng cổ, dây dắt, quần áo, giày dép, nệm nằm và nhiều
                        sản phẩm khác
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Chất liệu an toàn:
                        </span>{" "}
                        Sản phẩm thân thiện môi trường, không gây hại cho sức
                        khỏe thú cưng
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thiết kế thời trang:
                        </span>{" "}
                        Nhiều mẫu mã đẹp mắt, phong cách để thú cưng luôn nổi
                        bật
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                <img
                  src="/cute-pet-accessories-toys-collars-and-clothing-dis.png"
                  alt="Phụ kiện thú cưng"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          {/* Sửa Link href -> to */}
          <Link to="/branches?service=products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Mua sản phẩm ngay
            </Button>
          </Link>
        </div>
      </section>

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