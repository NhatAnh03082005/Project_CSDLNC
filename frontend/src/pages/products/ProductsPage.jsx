import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Heart,
  Star,
  ShoppingBag,
  Award,
  Shield,
  Sparkles,
  ChevronRight,
  Utensils,
  Stethoscope,
  Tags,
  CheckCircle2,
} from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white py-20 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-100/50 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-10 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50/30 border border-orange-200 text-orange-600 text-md font-semibold animate-bounce-slow">
              <Sparkles className="w-6 h-6" />
              <span>Chất lượng hàng đầu cho thú cưng</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Sản phẩm <span className="text-orange-600">Chăm sóc</span>{" "}
              <br className="hidden md:block" />
              Chất lượng cao
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Từ dinh dưỡng hàng ngày đến những phụ kiện thời trang, chúng tôi
              mang đến những giải pháp tốt nhất cho sự phát triển khỏe mạnh của
              thú cưng.
            </p>

            {/* Removed button as requested */}
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="container mx-auto px-4 py-24 space-y-32">
        {/* Category 1: Nutrition */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-indigo-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-900/10 border-8 border-white">
                <img
                  src="/premium-pet-food-bags-and-bowls-colorful-display.png"
                  alt="Thức ăn thú cưng"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      50+ Nhãn hiệu
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Đối tác toàn cầu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                  <Utensils className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Thức ăn{" "}
                  <span className="text-indigo-600 italic">dinh dưỡng</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Cung cấp năng lượng và dưỡng chất thiết yếu giúp thú cưng phát
                  triển toàn diện về thể chất và trí tuệ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureRow
                  icon={<CheckCircle2 className="text-indigo-500" />}
                  text="Nguyên liệu 100% tự nhiên, không chất bảo quản"
                />
                <FeatureRow
                  icon={<CheckCircle2 className="text-indigo-500" />}
                  text="Phát triển theo công thức chuyên gia thú y"
                />
                <FeatureRow
                  icon={<CheckCircle2 className="text-indigo-500" />}
                  text="Đa dạng hương vị phù hợp với khẩu vị bé"
                />
              </div>

              <div className="pt-4">
                <Link to="/branches?service=products">
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold group/btn shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <Utensils className="mr-2 h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Khám phá ngay
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category 2: Medicine */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Thuốc &{" "}
                  <span className="text-teal-600 italic">Dược phẩm</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Giải pháp y tế an toàn, hiệu quả được các bác sĩ thú y tin
                  dùng để bảo vệ sức khỏe người bạn nhỏ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureRow
                  icon={<Shield className="text-teal-500" />}
                  text="Thuốc điều trị & dự phòng nhập khẩu chính ngạch"
                />
                <FeatureRow
                  icon={<Shield className="text-teal-500" />}
                  text="Thực phẩm chức năng tăng cường hệ miễn dịch"
                />
                <FeatureRow
                  icon={<Shield className="text-teal-500" />}
                  text="Tư vấn liều lượng phù hợp cho từng độ tuổi"
                />
              </div>

              <div className="pt-4">
                <Link to="/branches?service=products">
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold group/btn shadow-lg transition-all hover:scale-[1.02] shadow-teal-100"
                  >
                    <Stethoscope className="mr-2 h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Xem chi tiết
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-teal-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/10 border-8 border-white">
                <img
                  src="/veterinary-medicine-bottles-and-supplements-for-pe.png"
                  alt="Thuốc thú y"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Chuẩn y khoa
                    </p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">
                      An toàn tuyệt đối
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category 3: Accessories */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-rose-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-900/10 border-8 border-white">
                <img
                  src="/cute-pet-accessories-toys-collars-and-clothing-dis.png"
                  alt="Phụ kiện thú cưng"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Phong cách
                    </p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">
                      Hot Trends 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600">
                  <Tags className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Phụ kiện{" "}
                  <span className="text-rose-600 italic">thời trang</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Thể hiện phong cách độc đáo của thú cưng với những bộ sưu tập
                  phụ kiện thời thượng và bền bỉ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureRow
                  icon={<Award className="text-rose-500" />}
                  text="Chất liệu vải cao cấp, không gây kích ứng da"
                />
                <FeatureRow
                  icon={<Award className="text-rose-500" />}
                  text="Thiết kế tiện lợi, dễ dàng sử dụng & vệ sinh"
                />
                <FeatureRow
                  icon={<Award className="text-rose-500" />}
                  text="Luôn cập nhật xu hướng thời trang thú cưng mới"
                />
              </div>

              <div className="pt-4">
                <Link to="/branches?service=products">
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold group/btn shadow-lg transition-all hover:scale-[1.02] shadow-rose-100"
                  >
                    <Tags className="mr-2 h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Khám phá ngay
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-orange-50 py-24 overflow-hidden relative border-t border-orange-100">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-5">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight mb-1">
              Cam kết từ chúng tôi
            </h2>
            <p className="text-xl text-slate-700 max-w-none mx-auto font-medium leading-relaxed md:whitespace-nowrap">
              Sản phẩm chính hãng, giao nhanh, và dịch vụ hậu mãi tận tâm.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <ValueCard
              icon={<Shield className="w-10 h-10 text-blue-600" />}
              title="100% Chính hãng"
              desc="Cam kết chất lượng từ các nhãn hàng uy tín nhất."
              color="blue"
            />
            <ValueCard
              icon={<Heart className="w-10 h-10 text-rose-600" />}
              title="Tận tâm phục vụ"
              desc="Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn."
              color="rose"
            />
            <ValueCard
              icon={<ShoppingBag className="w-10 h-10 text-purple-600" />}
              title="Giao hàng nhanh"
              desc="Nhận hàng ngay trong ngày tại nội thành."
              color="purple"
            />
            <ValueCard
              icon={<Award className="w-10 h-10 text-green-600" />}
              title="Giá cả hợp lý"
              desc="Luôn có các chương trình ưu đãi hấp dẫn."
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Global Style for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}

function ValueCard({ icon, title, desc, color = "blue" }) {
  const colorClasses = {
    rose: {
      border: "border-rose-200 text-rose-600 hover:border-rose-300",
      icon: "bg-rose-50 border-rose-100",
    },
    blue: {
      border: "border-blue-200 text-blue-600 hover:border-blue-300",
      icon: "bg-blue-50 border-blue-100",
    },
    green: {
      border: "border-green-200 text-green-600 hover:border-green-300",
      icon: "bg-green-50 border-green-100",
    },
    purple: {
      border: "border-purple-200 text-purple-600 hover:border-purple-300",
      icon: "bg-purple-50 border-purple-100",
    },
  };

  return (
    <div
      className={`p-8 rounded-[2.5rem] bg-white border-2 ${colorClasses[color].border} text-center transition-all group hover:scale-105 hover:shadow-xl`}
    >
      <div
        className={`inline-flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform p-4 rounded-2xl border ${colorClasses[color].icon}`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 group-hover:text-slate-500 transition-colors">
        {desc}
      </p>
    </div>
  );
}
