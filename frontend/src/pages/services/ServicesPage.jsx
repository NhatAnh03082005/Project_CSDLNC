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
  Heart,
  Stethoscope,
  Shield,
  Award,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#f8fbff] py-20 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-green-100/50 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 text-sm font-semibold animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              <span>Tiêu chuẩn chăm sóc 5 sao</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Dịch vụ <span className="text-blue-600">Y tế Thú cưng</span> <br className="hidden md:block" />
              Đẳng cấp Quốc tế
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Chúng tôi kết hợp giữa tình yêu thương và công nghệ y khoa tiên tiến nhất để mang lại sức khỏe trọn vẹn cho người bạn bốn chân của bạn.
            </p>

            {/* Removed buttons as requested */}

          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="container mx-auto px-4 py-24 space-y-32">
        
        {/* Service 1: Medical Exam */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-blue-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10">
                <img
                  src="/veterinarian-examining-dog-with-stethoscope-in-mod.png"
                  alt="Khám bệnh thú cưng"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">10+ Năm</p>
                    <p className="text-xs text-slate-500">Kinh nghiệm lâm sàng</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-blue-50 text-blue-600">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Khám bệnh <span className="text-blue-600 italic">chuyên sâu</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Chúng tôi thực hiện quy trình khám bệnh toàn diện, từ khám lâm sàng đến các xét nghiệm cận lâm sàng hiện đại.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureRow icon={<CheckCircle2 className="text-blue-500" />} text="Máy X-quang, siêu âm Doppler màu thế hệ mới" />
                <FeatureRow icon={<CheckCircle2 className="text-blue-500" />} text="Xét nghiệm máu & phân tích sinh hóa tự động" />
                <FeatureRow icon={<CheckCircle2 className="text-blue-500" />} text="Đội ngũ bác sĩ tu nghiệp tại Châu Âu" />
              </div>

              <div className="pt-4">
                <Link to="/branches?service=exam">
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold group/btn shadow-lg transition-all hover:scale-[1.02]">
                    <Calendar className="mr-2 h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Đặt lịch ngay
                    <ChevronRight className="ml-2 h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Vaccination */}
        <div className="group relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block p-4 rounded-2xl bg-green-50 text-green-600">
                  <Syringe className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Lộ trình <span className="text-green-600 italic">vắc-xin</span> chuẩn
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Bảo vệ thú cưng khỏi 7 căn bệnh nguy hiểm nhất bằng nguồn vắc-xin nhập khẩu chính ngạch từ Pháp và Mỹ.
                </p>
              </div>

              <div className="grid gap-4">
                <FeatureRow icon={<Shield className="text-green-500" />} text="Vắc-xin bảo quản chuẩn GSP 2-8°C khắt khe" />
                <FeatureRow icon={<Shield className="text-green-500" />} text="Hệ thống nhắc hẹn tự động qua SMS/App" />
                <FeatureRow icon={<Shield className="text-green-500" />} text="Theo dõi phản ứng sau tiêm tại chỗ 30 phút" />
              </div>

              <div className="pt-4">
                <Link to="/branches?service=vaccination">
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold group/btn shadow-lg transition-all hover:scale-[1.02] shadow-green-100">
                    <Syringe className="mr-2 h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    Đặt lịch tiêm ngay
                    <ChevronRight className="ml-2 h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-green-50 rounded-[2.5rem] -z-10 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-green-900/10">
                <img
                  src="/veterinarian-giving-vaccine-injection-to-cute-pupp.png"
                  alt="Tiêm phòng thú cưng"
                  className="w-full h-full object-cover aspect-[4/3] transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl font-bold">Cam kết từ chúng tôi</h2>
            <p className="text-slate-400 text-lg">Chúng tôi không chỉ là bệnh viện, chúng tôi là người đồng hành đáng tin cậy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Heart className="w-10 h-10 text-pink-500" />}
              title="Tâm huyết"
              desc="Luôn đặt sự thoải mái của thú cưng lên hàng đầu trong mọi quy trình."
            />
            <ValueCard 
              icon={<Shield className="w-10 h-10 text-blue-500" />}
              title="Minh bạch"
              desc="Công khai phác đồ điều trị và chi phí rõ ràng cho khách hàng."
            />
            <ValueCard 
              icon={<TrendingUp className="w-10 h-10 text-cyan-500" />}
              title="Cải tiến"
              desc="Liên tục cập nhật công nghệ và phác đồ y khoa mới nhất thế giới."
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8 bg-blue-50 p-12 lg:p-20 rounded-[3rem] border border-blue-100 shadow-inner">
          <h3 className="text-3xl md:text-4xl font-bold text-blue-900">Sẵn sàng để thú cưng của bạn được chăm sóc tốt nhất?</h3>
          <p className="text-lg text-blue-700/80">Liên hệ ngay để nhận được tư vấn từ các chuyên gia hàng đầu của chúng tôi.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button variant="outline" size="lg" className="h-16 px-12 rounded-full border-blue-200 text-blue-700 bg-white hover:bg-white text-xl font-bold">
              Gọi ngay: 1900 1234
            </Button>
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

function ValueCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all group scale-95 hover:scale-100">
      <div className="inline-flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{desc}</p>
    </div>
  );
}