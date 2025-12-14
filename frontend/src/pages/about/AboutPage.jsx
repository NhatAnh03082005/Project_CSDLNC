import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Heart,
  User,
  FolderOpen,
  ClipboardPlus,
  Star,
  Award,
  Users,
  Building2,
  CheckCircle2,
  Target,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
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
            <Link to="/about" className="text-sm font-medium text-blue-600">
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
                  <Link to="/profile" className="flex items-center w-full">
                    Quản lý hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 h-4 w-4" />
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
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
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
          </div>
          <div className="relative">
            <img
              src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
              alt="PetCare Team"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">10+</div>
              <div className="text-sm text-gray-600">Chi nhánh</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">50+</div>
              <div className="text-sm text-gray-600">Bác sĩ thú y</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-orange-600 fill-orange-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">
                Thú cưng được chăm sóc
              </div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-1">10+</div>
              <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
            </CardContent>
          </Card>
        </div>

        {/* Mission & Values */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-gray-600 leading-relaxed">
              PetCare cam kết mang đến dịch vụ chăm sóc sức khỏe toàn diện và
              chuyên nghiệp nhất cho thú cưng của bạn. Chúng tôi tin rằng mỗi
              thú cưng đều xứng đáng được yêu thương, chăm sóc và điều trị với
              sự tận tâm cao nhất. Sứ mệnh của chúng tôi là giúp những người bạn
              bốn chân của bạn sống khỏe mạnh, hạnh phúc và trọn vẹn từng khoảnh
              khắc bên gia đình.
            </p>
          </Card>
          <Card className="p-8">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  <strong>Chuyên nghiệp:</strong> Đội ngũ bác sĩ giàu kinh
                  nghiệm, trang thiết bị hiện đại
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  <strong>Tận tâm:</strong> Chăm sóc từng thú cưng như chính thú
                  cưng của mình
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  <strong>Uy tín:</strong> Minh bạch trong chẩn đoán và điều trị
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Tại sao chọn PetCare?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Đội ngũ bác sĩ chuyên môn cao
              </h3>
              <p className="text-gray-600">
                Bác sĩ thú y được đào tạo bài bản tại các trường đại học hàng
                đầu, có kinh nghiệm lâu năm và luôn cập nhật kiến thức mới nhất
              </p>
            </Card>
            <Card className="p-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Cơ sở vật chất hiện đại
              </h3>
              <p className="text-gray-600">
                Trang bị đầy đủ máy móc, thiết bị y tế tiên tiến như máy
                X-quang, siêu âm, xét nghiệm máu tự động đảm bảo chẩn đoán chính
                xác
              </p>
            </Card>
            <Card className="p-6">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-orange-600 fill-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Dịch vụ tận tâm chu đáo
              </h3>
              <p className="text-gray-600">
                Chăm sóc thú cưng của bạn với sự tận tình, chu đáo từ lúc tiếp
                đón đến khi điều trị và chăm sóc sau khám
              </p>
            </Card>
          </div>
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
                <li>Giờ làm việc: 8:00 - 20:00 hàng ngày</li>
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
