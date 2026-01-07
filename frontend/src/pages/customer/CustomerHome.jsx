import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Calendar,
  Syringe,
  ShoppingBag,
  Heart,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../context/AuthContext";

export default function CustomerHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 bg-gradient-to-br from-blue-50 to-white">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-l-[100px] -z-10 transform translate-x-20 skew-x-[-12deg]" />
        <div className="absolute top-40 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-md font-bold shadow-sm">
                <Sparkles className="w-6 h-6" />
                <span>Chào mừng {user?.HoTen || "Bạn"} đến với PetCareX</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                Chăm Sóc <br />
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Thú Cưng
                </span>{" "}
                <br />
                <span className="text-slate-900">Tận Tâm & Chuyên Nghiệp</span>
              </h1>

              <p className="text-xl text-slate-600 max-w-xl font-medium leading-relaxed">
                Hơn 10 năm kinh nghiệm đồng hành cùng hàng triệu gia đình Việt.
                Chúng tôi cam kết mang lại nụ cười và sức khỏe cho người bạn nhỏ
                của bạn.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/services">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 text-lg font-bold"
                  >
                    Khám phá dịch vụ
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-6 px-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">50K+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Khách hàng
                    </p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">4.9/5</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Đánh giá
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right duration-1000">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-[3rem] blur-2xl -z-10" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img
                  src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
                  alt="PetCare Team"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Floating Status Cards */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl animate-float border border-slate-50 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500 flex items-center justify-center text-white">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Đã Kiểm Định
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Tiêu chuẩn quốc tế
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black">
              Giải pháp toàn diện cho{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                thú cưng
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Bất kể nhu cầu của bạn là gì, PetCareX luôn sẵn sàng hỗ trợ với
              đội ngũ bác sĩ hàng đầu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              to="/branches?service=exam"
              title="Khám bệnh tổng quát"
              desc="Chẩn đoán chính xác bằng trang thiết bị y tế hiện đại bậc nhất."
              icon={<Calendar className="h-8 w-8 text-blue-600" />}
              bgColor="border border-blue-200"
              btnText="Đặt lịch khám ngay"
              btnClass="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
              titleColor="text-blue-600"
            />

            <ServiceCard
              to="/branches?service=vaccination"
              title="Tiêm phòng & Vaccine"
              desc="Gói tiêm phòng đa dạng, bảo vệ thú cưng khỏi các bệnh truyền nhiễm."
              icon={<Syringe className="h-8 w-8 text-green-600" />}
              bgColor="border border-green-200"
              btnText="Đặt lịch tiêm chủng"
              btnClass="bg-green-600 hover:bg-green-700 text-white shadow-green-100"
              titleColor="text-green-600"
            />

            <ServiceCard
              to="/branches?service=products"
              title="Cửa hàng phụ kiện"
              desc="Hàng ngàn sản phẩm dinh dưỡng và phụ kiện thời trang cao cấp."
              icon={<ShoppingBag className="h-8 w-8 text-orange-600" />}
              bgColor="border border-orange-200"
              btnText="Xem sản phẩm"
              btnClass="bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100"
              titleColor="text-orange-600"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges / Features Section */}
      <section className="py-5 bg-white/50 backdrop-blur-sm border-y border-blue-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <TrustItem
              icon={<Clock className="h-6 w-6" />}
              title="Hỗ trợ 24/7"
              desc="Luôn sẵn sàng khi bạn cần"
            />
            <TrustItem
              icon={<Star className="h-6 w-6" />}
              title="Chất lượng 5★"
              desc="Dịch vụ hàng đầu Việt Nam"
            />
            <TrustItem
              icon={<Users className="h-6 w-6" />}
              title="Đội ngũ chuyên gia"
              desc="60+ Bác sĩ giàu kinh nghiệm"
            />
            <TrustItem
              icon={<MapPin className="h-6 w-6" />}
              title="Mạng lưới rộng"
              desc="10+ Chi nhánh toàn quốc"
            />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function ServiceCard({
  to,
  title,
  desc,
  icon,
  bgColor,
  btnText,
  btnClass,
  titleColor = "text-slate-900",
}) {
  const borderColor = btnClass.includes("blue")
    ? "border-t-blue-500"
    : btnClass.includes("sky")
    ? "border-t-sky-500"
    : "border-t-cyan-500";
  return (
    <Card
      className={`border-t-4 ${borderColor} shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[2.5rem] overflow-hidden group bg-gradient-to-br from-white ${bgColor.replace(
        "bg-",
        "to-"
      )}`}
    >
      <CardHeader className="p-8 pb-4">
        <div
          className={`h-20 w-20 rounded-2xl ${bgColor} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}
        >
          {icon}
        </div>
        <CardTitle className={`text-2xl font-black ${titleColor} mb-2`}>
          {title}
        </CardTitle>
        <CardDescription className="text-slate-500 font-medium leading-relaxed">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <Link to={to}>
          <Button
            className={`w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all ${btnClass}`}
          >
            {btnText}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 leading-none mb-1">{title}</h4>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}
