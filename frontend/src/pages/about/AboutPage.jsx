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
     

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance text-blue-900">
              PetCareX - Đồng hành cùng thú cưng của bạn
            </h1>
            <p className="text-lg text-gray-600 text-pretty leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe thú
              cưng, PetCareX tự hào là một trong những hệ thống phòng khám thú y
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
              PetCareX cam kết mang đến dịch vụ chăm sóc sức khỏe toàn diện và
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
            Tại sao chọn PetCareX?
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
    </div>
  );
}
