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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50/50">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-transparent py-20 lg:py-32">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-100/50 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-md font-semibold animate-bounce-slow">
                <Sparkles className="w-6 h-6" />
                <span>10+ Năm Kinh Nghiệm Chuyên Sâu</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  PetCareX{" "}
                </span>{" "}
                <br />
                Nơi Tình Yêu <br /> Gặp Gỡ <br />
                <span className="italic text-slate-700">Chuyên Môn</span>
              </h1>

              <p className="text-xl text-slate-600 max-w-xl font-medium leading-relaxed">
                Chúng tôi không chỉ khám bệnh, chúng tôi chăm sóc từng hơi thở
                và nhịp đập của những người bạn nhỏ bằng cả trái tim và công
                nghệ tiên tiến nhất.
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
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right duration-1000">
              <div className="absolute -inset-4 bg-blue-100/50 rounded-[2.5rem] blur-2xl -z-10" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img
                  src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
                  alt="PetCare Team"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block border border-blue-50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Chuẩn Quốc Tế
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Trang thiết bị 5 sao
                    </p>
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
          <StatCard
            icon={<Building2 className="text-blue-600" />}
            val="10"
            label="Chi nhánh"
            color="blue"
          />
          <StatCard
            icon={<Users className="text-teal-600" />}
            val="60+"
            label="Bác sĩ giỏi"
            color="teal"
          />
          <StatCard
            icon={<Heart className="text-rose-600" />}
            val="100K+"
            label="Thú cưng"
            color="rose"
          />
          <StatCard
            icon={<Award className="text-amber-600" />}
            val="15+"
            label="Giải thưởng"
            color="amber"
          />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 container mx-auto px-4 space-y-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-block p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Sứ mệnh mang lại <br />
              <span className="text-blue-600 italic">hạnh phúc trọn vẹn</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              PetCareX ra đời with khát vọng thay đổi tiêu chuẩn chăm sóc thú
              cưng tại Việt Nam. Chúng tôi tin rằng mỗi bé đều xứng đáng có một
              cuộc sống khỏe mạnh, được bao bọc bởi tình yêu thương và sự chăm
              sóc y tế chuyên nghiệp nhất.
            </p>
            <div className="grid gap-4">
              <FeatureItem text="Chẩn đoán chính xác đến từng chi tiết nhỏ" />
              <FeatureItem text="Điều trị bằng sự thấu hiểu và lòng trắc ẩn" />
              <FeatureItem text="Xây dựng niềm tin bền vững với chủ nuôi" />
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-blue-50 rounded-[3rem] -z-10" />
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img
                src="/veterinarian-examining-dog-with-stethoscope-in-mod.png"
                alt="Mission"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Core Values with Grid */}
        <div className="pt-24 inline-flex flex-col w-full">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent leading-tight mb-1">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              Niềm tin được xây dựng từ sự tận tâm và chuyên nghiệp
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Zap className="h-8 w-8" />}
              title="Đổi mới"
              desc="Luôn tiên phong cập nhật các công nghệ chẩn đoán và phương pháp điều trị tiên tiến nhất thế giới."
              color="purple"
            />
            <ValueCard
              icon={<Heart className="h-8 w-8" />}
              title="Tận tâm"
              desc="Chăm sóc mỗi thú cưng như thành viên trong gia đình, đặt sự an nhiên của các bé lên hàng đầu."
              color="rose"
            />
            <ValueCard
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Minh bạch"
              desc="Cam kết rõ ràng trong quy trình điều trị và chi phí, đảm bảo quyền lợi tốt nhất cho khách hàng."
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

function StatCard({ icon, val, label, color }) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-100 text-blue-600 shadow-blue-900/5",
    teal: "bg-teal-50 border-teal-100 text-teal-600 shadow-teal-900/5",
    rose: "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-900/5",
    amber: "bg-amber-50 border-amber-100 text-amber-600 shadow-amber-900/5",
  };

  const selectedTheme = colorMap[color] || colorMap.blue;
  const borderColor = selectedTheme
    .split(" ")
    .find((c) => c.startsWith("border-"));

  return (
    <div
      className={`bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl ${selectedTheme
        .split(" ")
        .pop()} text-center border-2 ${borderColor} hover:scale-105 transition-all group`}
    >
      <div
        className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all border ${selectedTheme
          .split(" ")
          .slice(0, 3)
          .join(" ")}`}
      >
        {React.cloneElement(icon, { className: "h-8 w-8" })}
      </div>
      <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
        {val}
      </div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  );
}

function FounderCard({ image, name, role, desc }) {
  return (
    <div className="group relative bg-white rounded-[2.5rem] overflow-hidden border-2 border-slate-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
      <div className="grid md:grid-cols-5 h-full">
        <div className="md:col-span-2 relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700 aspect-[4/5]"
          />
          <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="md:col-span-3 p-8 flex flex-col justify-center space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <p className="text-blue-600 font-bold text-sm tracking-wide mt-1 uppercase">
              {role}
            </p>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 animate-pulse">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
      </div>
      <span className="font-bold text-slate-700">{text}</span>
    </div>
  );
}

function ValueCard({ icon, title, desc, color = "blue" }) {
  const colorClasses = {
    rose: {
      border: "border-rose-100 text-rose-600 hover:border-rose-200",
      icon: "bg-rose-50 border-rose-100/50",
    },
    blue: {
      border: "border-blue-100 text-blue-600 hover:border-blue-200",
      icon: "bg-blue-50 border-blue-100/50",
    },
    green: {
      border: "border-green-100 text-green-600 hover:border-green-200",
      icon: "bg-green-50 border-green-100/50",
    },
    purple: {
      border: "border-purple-100 text-purple-600 hover:border-purple-200",
      icon: "bg-purple-50 border-purple-100/50",
    },
  };

  return (
    <div
      className={`p-10 rounded-[2.5rem] bg-white border-2 ${colorClasses[color].border} text-center transition-all group hover:scale-105 hover:shadow-xl relative overflow-hidden`}
    >
      <div
        className={`inline-flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform p-5 rounded-2xl border ${colorClasses[color].icon}`}
      >
        {React.cloneElement(icon, { className: "h-8 w-8" })}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      {/* Decorative background icon */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {React.cloneElement(icon, { className: "h-32 w-32" })}
      </div>
    </div>
  );
}
