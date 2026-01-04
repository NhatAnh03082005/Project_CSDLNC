import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Heart,
  Award,
  Users,
  Building2,
  CheckCircle2,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#f0f7ff] py-20 lg:py-32">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-100/50 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 text-sm font-semibold animate-bounce-slow">
                <Sparkles className="w-4 h-4" />
                <span>10+ Năm Kinh Nghiệm Chuyên Sâu</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                PetCareX - Nơi <span className="text-blue-600">Tình Yêu</span> <br />
                Gặp Gỡ <span className="italic text-slate-700">Chuyên Môn</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-xl font-medium leading-relaxed">
                Chúng tôi không chỉ khám bệnh, chúng tôi chăm sóc từng hơi thở và nhịp đập của những người bạn nhỏ bằng cả trái tim và công nghệ tiên tiến nhất.
              </p>

              {/* Removed buttons as requested */}

            </div>
            
            <div className="relative animate-in fade-in slide-in-from-right duration-1000">
              <div className="absolute -inset-4 bg-blue-100/50 rounded-[2.5rem] blur-2xl -z-10" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
                  alt="PetCare Team"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block border border-blue-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Chuẩn Quốc Tế</p>
                    <p className="text-xs text-slate-500">Trang thiết bị 5 sao</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={<Building2 className="text-blue-600" />} val="10" label="Chi nhánh" />
          <StatCard icon={<Users className="text-green-600" />} val="60+" label="Bác sĩ chuyên khoa" />
          <StatCard icon={<Heart className="text-pink-600" />} val="100K+" label="Thú cưng hạnh phúc" />
          <StatCard icon={<Award className="text-orange-600" />} val="15+" label="Giải thưởng uy tín" />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 container mx-auto px-4 space-y-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-block p-4 rounded-2xl bg-blue-50 text-blue-600">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Sứ mệnh mang lại <br /><span className="text-blue-600 underline underline-offset-8 decoration-4">hạnh phúc trọn vẹn</span></h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              PetCareX ra đời với khát vọng thay đổi tiêu chuẩn chăm sóc thú cưng tại Việt Nam. Chúng tôi tin rằng mỗi bé đều xứng đáng có một cuộc sống khỏe mạnh, được bao bọc bởi tình yêu thương và sự chăm sóc y tế chuyên nghiệp nhất.
            </p>
            <div className="grid gap-4">
              <FeatureItem text="Chẩn đoán chính xác đến từng chi tiết nhỏ" />
              <FeatureItem text="Điều trị bằng sự thấu hiểu và lòng trắc ẩn" />
              <FeatureItem text="Xây dựng niềm tin bền vững với chủ nuôi" />
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="/veterinarian-examining-dog-with-stethoscope-in-mod.png" alt="Mission" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
          </div>
        </div>

        {/* Core Values with Grid */}
        <div className="pt-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Giá trị tạo nên sự khác biệt</h2>
            <p className="text-slate-500">Chúng tôi hoạt động dựa trên 3 trụ cột vững chắc</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Zap className="h-8 w-8" />} 
              title="Đổi mới không ngừng" 
              desc="Luôn tiên phong cập nhật các công nghệ chẩn đoán và phương pháp điều trị tiên tiến nhất thế giới."
              color="bg-purple-50 text-purple-600"
            />
            <ValueCard 
              icon={<Heart className="h-8 w-8" />} 
              title="Tận tâm tuyệt đối" 
              desc="Chăm sóc mỗi thú cưng như thành viên trong gia đình, đặt sự an cư của các bé lên hàng đầu."
              color="bg-pink-50 text-pink-600"
            />
            <ValueCard 
              icon={<ShieldCheck className="h-8 w-8" />} 
              title="Minh bạch & Trách nhiệm" 
              desc="Cam kết rõ ràng trong quy trình điều trị và chi phí, đảm bảo quyền lợi tốt nhất cho khách hàng."
              color="bg-green-50 text-green-600"
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

function StatCard({ icon, val, label }) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 text-center border border-white hover:scale-105 transition-all group">
      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: "h-7 w-7" })}
      </div>
      <div className="text-4xl font-black text-slate-900 mb-1">{val}</div>
      <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
      </div>
      <span className="font-bold text-slate-700">{text}</span>
    </div>
  );
}

function ValueCard({ icon, title, desc, color }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group relative overflow-hidden">
      <div className={`inline-block p-4 rounded-2xl mb-6 ${color} transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
      <div className="absolute top-0 right-0 p-4 opacity-5">
        {React.cloneElement(icon, { className: "h-24 w-24" })}
      </div>
    </div>
  );
}

