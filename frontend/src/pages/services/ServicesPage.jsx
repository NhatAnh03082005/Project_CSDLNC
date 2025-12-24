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
  Heart,
  User,
  FolderOpen,
  ClipboardPlus,
  Star,
  Stethoscope,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Dịch vụ của chúng tôi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe chuyên
            nghiệp cho thú cưng của bạn
          </p>
        </div>

        {/* Medical Examination Service */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 flex flex-col justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-3xl mb-3">
                  Khám bệnh chuyên sâu
                </CardTitle>
                <CardDescription className="text-base">
                  Đội ngũ bác sĩ thú y giàu kinh nghiệm với hơn 10 năm hoạt động
                  trong ngành
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">Bác sĩ đầu ngành:</span>{" "}
                      Đội ngũ bác sĩ được đào tạo chuyên sâu tại các trường đại
                      học hàng đầu trong và ngoài nước
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">
                        Trang thiết bị hiện đại:
                      </span>{" "}
                      Máy X-quang, siêu âm, xét nghiệm máu và các thiết bị chuẩn
                      đoán tiên tiến nhất
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">
                        Quy trình chuẩn quốc tế:
                      </span>{" "}
                      Áp dụng các phác đồ điều trị theo tiêu chuẩn quốc tế, đảm
                      bảo hiệu quả cao nhất
                    </p>
                  </div>
                </div>
                <Link to="/branches?service=exam">
                  <Button size="lg" className="w-full sm:w-auto gap-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold border border-blue-700 rounded">
                    <Calendar className="h-5 w-5" />
                    Đặt lịch ngay
                  </Button>
                </Link>
              </CardContent>
            </div>
            <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
              <img
                src="/veterinarian-examining-dog-with-stethoscope-in-mod.png"
                alt="Bác sĩ thú y khám bệnh"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </Card>

        {/* Vaccination Service */}
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative h-full min-h-[300px] lg:min-h-[400px] order-2 lg:order-1">
              <img
                src="/veterinarian-giving-vaccine-injection-to-cute-pupp.png"
                alt="Tiêm phòng cho thú cưng"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-8 flex flex-col justify-center order-1 lg:order-2">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Syringe className="h-8 w-8 text-green-600" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-3xl mb-3">
                  Tiêm phòng đầy đủ
                </CardTitle>
                <CardDescription className="text-base">
                  Vaccine chính hãng từ các hãng dược phẩm uy tín trên thế giới
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">Vaccine nhập khẩu:</span>{" "}
                      Các loại vaccine mới nhất từ Mỹ, Pháp, Hà Lan đảm bảo chất
                      lượng và hiệu quả cao
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">
                        Lộ trình tiêm phòng khoa học:
                      </span>{" "}
                      Tư vấn lịch tiêm phòng phù hợp với từng loại thú cưng và
                      độ tuổi
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <span className="font-semibold">Bảo hành sức khỏe:</span>{" "}
                      Cam kết theo dõi và hỗ trợ sau tiêm phòng, đảm bảo thú
                      cưng luôn khỏe mạnh
                    </p>
                  </div>
                </div>
                <Link to="/branches?service=vaccination">
                  <Button size="lg" className="w-full sm:w-auto gap-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold border border-blue-700 rounded">
                    <Syringe className="h-5 w-5" />
                    Đặt lịch tiêm
                  </Button>
                </Link>
              </CardContent>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}