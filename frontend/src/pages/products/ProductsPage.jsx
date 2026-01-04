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
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#fff9f5] py-20 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-100/50 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100/50 text-orange-600 text-sm font-semibold animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              <span>Chất lượng hàng đầu cho thú cưng</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Sản phẩm <span className="text-orange-600">Chăm sóc</span> <br className="hidden md:block" />
              Chất lượng cao
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Từ dinh dưỡng hàng ngày đến những phụ kiện thời trang nhất, chúng tôi mang đến những giải pháp tốt nhất cho sự phát triển khỏe mạnh của thú cưng.
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
              <div className="absolute -inset-4 bg-orange-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-900/10">
                <img
                  src="/premium-pet-food-bags-and-bowls-colorful-display.png"
                  alt="Thức ăn thú cưng"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block border border-orange-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">50+ Nhãn hiệu</p>
                    <p className="text-xs text-slate-500">Đối tác toàn cầu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-orange-50 text-orange-600">
                  <Utensils className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Thức ăn <span className="text-orange-600 italic">dinh dưỡng</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Cung cấp năng lượng và dưỡng chất thiết yếu giúp thú cưng phát triển toàn diện về thể chất và trí tuệ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureItem icon={<CheckCircle2 className="text-orange-500" />} text="Nguyên liệu 100% tự nhiên, không chất bảo quản" />
                <FeatureItem icon={<CheckCircle2 className="text-orange-500" />} text="Phát triển theo công thức chuyên gia thú y" />
                <FeatureItem icon={<CheckCircle2 className="text-orange-500" />} text="Đa dạng hương vị phù hợp với khẩu vị bé" />
              </div>

            {/* Removed button as requested */}

            </div>
          </div>
        </div>

        {/* Category 2: Medicine */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-green-50 text-green-600">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Thuốc & <span className="text-green-600 italic">Dược phẩm</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Giải pháp y tế an toàn, hiệu quả được các bác sĩ thú y tin dùng để bảo vệ sức khỏe người bạn nhỏ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureItem icon={<Shield className="text-green-500" />} text="Thuốc điều trị & dự phòng nhập khẩu chính ngạch" />
                <FeatureItem icon={<Shield className="text-green-500" />} text="Thực phẩm chức năng tăng cường hệ miễn dịch" />
                <FeatureItem icon={<Shield className="text-green-500" />} text="Tư vấn liều lượng phù hợp cho từng độ tuổi" />
              </div>

            {/* Removed button as requested */}

            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-green-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-green-900/10">
                <img
                  src="/veterinary-medicine-bottles-and-supplements-for-pe.png"
                  alt="Thuốc thú y"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category 3: Accessories */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-purple-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/10">
                <img
                  src="/cute-pet-accessories-toys-collars-and-clothing-dis.png"
                  alt="Phụ kiện thú cưng"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-purple-50 text-purple-600">
                  <Tags className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Phụ kiện <span className="text-purple-600 italic">thời trang</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Thể hiện phong cách độc đáo của thú cưng với những bộ sưu tập phụ kiện thời thượng và bền bỉ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureItem icon={<Award className="text-purple-500" />} text="Chất liệu vải cao cấp, không gây kích ứng da" />
                <FeatureItem icon={<Award className="text-purple-500" />} text="Thiết kế tiện lợi, dễ dàng sử dụng & vệ sinh" />
                <FeatureItem icon={<Award className="text-purple-500" />} text="Luôn cập nhật xu hướng thời trang thú cưng mới" />
              </div>

            {/* Removed button as requested */}

            </div>
          </div>
        </div>
      </section>
      {/* Main CTA at the bottom */}
      <section className="container mx-auto px-4 pb-24 text-center">
        <Link to="/branches?service=products">
          <Button size="lg" className="h-16 px-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold shadow-xl shadow-orange-200 transition-all hover:-translate-y-1">
            Xem sản phẩm
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </section>

      {/* Trust Badges Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <TrustItem 
              icon={<Shield className="w-10 h-10 text-orange-600" />}
              title="100% Chính hãng"
              desc="Cam kết chất lượng từ các nhãn hàng uy tín nhất."
            />
            <TrustItem 
              icon={<Heart className="w-10 h-10 text-orange-600" />}
              title="Tận tâm phục vụ"
              desc="Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn."
            />
            <TrustItem 
              icon={<ShoppingBag className="w-10 h-10 text-orange-600" />}
              title="Giao hàng nhanh"
              desc="Nhận hàng ngay trong ngày tại nội thành."
            />
            <TrustItem 
              icon={<Award className="w-10 h-10 text-orange-600" />}
              title="Giá cả hợp lý"
              desc="Luôn có các chương trình ưu đãi hấp dẫn."
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

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="text-center space-y-4 p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all group cursor-default">
      <div className="inline-flex items-center justify-center mb-2 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}