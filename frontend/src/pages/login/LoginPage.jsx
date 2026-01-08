import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Heart,
  User,
  Briefcase,
  Hash,
  ShieldCheck,
  Lock,
  Stethoscope,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffCode, setStaffCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const { setUser, setIsAuthenticated } = useAuth();
  const loginStore = useAuthStore((state) => state.login);

  // Trong file LoginPage.jsx

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (selectedRole === "customer") {
        response = await axios.post("http://localhost:3000/api/auth/login", {
          email,
          password,
          role: "customer",
        });
      } else if (selectedRole === "staff") {
        // Gửi mã nhân viên lên server
        response = await axios.post("http://localhost:3000/api/auth/login", {
          staffCode,
          role: "staff",
        });
      } else if (selectedRole === "admin") {
        const envAdminCode = import.meta.env.VITE_ADMIN_CODE || "NV001";
        if (adminCode === envAdminCode) {
          // For Admin role with code, we can bypass backend login if preferred or use fixed response
          const adminUser = {
            maNguoiDung: "ADMIN",
            tenNguoiDung: "Quản trị viên hệ thống",
            Role: "admin",
          };
          const token = "admin-session-token";

          localStorage.setItem("token", token);
          loginStore(adminUser, token);
          setUser(adminUser);
          setIsAuthenticated(true);

          alert("Đăng nhập quyền Quản trị viên thành công!");
          navigate("/admin");
          return; // Exit early
        } else {
          alert("Mã quản trị viên không hợp lệ!");
          return;
        }
      }

      if (response.data.status === 200) {
        const token = response.data.token;
        const userData = response.data.data;

        // Lưu token vào localStorage
        localStorage.setItem("token", token);

        // Lưu thông tin user vào authStore (có persist)
        loginStore(userData, token);

        // Lưu thông tin user vào context
        setUser(userData);
        setIsAuthenticated(true);

        alert("Đăng nhập thành công!");

        // Điều hướng dựa trên Role trả về từ Server
        const userRole = userData.Role;

        if (userRole === "customer") {
          navigate("/customer");
        } else if (userRole === "admin") {
          navigate("/admin"); // Trang dành cho Quản lý chi nhánh
        } else if (userRole === "staff") {
          navigate("/staff/demo"); // Trang dành cho Bác sĩ, Tiếp tân, Bán hàng
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Modern Corporate Branding (Full Bleed) */}
      <div className="relative hidden lg:flex flex-col justify-end p-16 bg-slate-900 overflow-hidden">
        {/* Full Bleed Background Image */}
        <div className="absolute inset-0">
          <img
            src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
            alt="Happy Veterinarian with Dog"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Corporate Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/60 to-transparent" />
        </div>

        {/* Branding Content */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              PetCareX
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Hệ thống quản lý thú cưng <br />
              <span className="text-blue-400">Chuyên nghiệp & Hiện đại</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed opacity-90">
              Nền tảng công nghệ tiên tiến giúp tối ưu hóa vận hành phòng khám
              và nâng cao trải nghiệm chăm sóc khách hàng.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  Quản lý toàn diện
                </p>
                <p className="text-xs text-blue-200">
                  Hồ sơ bệnh án, kho dược & lịch hẹn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  Bảo mật tuyệt đối
                </p>
                <p className="text-xs text-blue-200">
                  Dữ liệu được mã hóa chuẩn y tế
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Clean Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[460px] space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-blue-600 tracking-tight">
              Đăng nhập hệ thống
            </h1>
            <p className="text-slate-500 font-medium">
              Vui lòng chọn vai trò của bạn để tiếp tục
            </p>
          </div>

          {/* Role Selection - Corporate Style */}
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole("customer")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                selectedRole === "customer"
                  ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100 ring-1 ring-blue-600"
                  : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
              }`}
            >
              <User
                className={`h-6 w-6 ${
                  selectedRole === "customer"
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  selectedRole === "customer"
                    ? "text-blue-700"
                    : "text-slate-500"
                }`}
              >
                Khách hàng
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("staff")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                selectedRole === "staff"
                  ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100 ring-1 ring-blue-600"
                  : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
              }`}
            >
              <Stethoscope
                className={`h-6 w-6 ${
                  selectedRole === "staff" ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  selectedRole === "staff" ? "text-blue-700" : "text-slate-500"
                }`}
              >
                Nhân viên
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                selectedRole === "admin"
                  ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100 ring-1 ring-blue-600"
                  : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
              }`}
            >
              <ShieldCheck
                className={`h-6 w-6 ${
                  selectedRole === "admin" ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  selectedRole === "admin" ? "text-blue-700" : "text-slate-500"
                }`}
              >
                Quản trị
              </span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {!selectedRole ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <User className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">
                  Chọn vai trò ở trên để đăng nhập
                </p>
              </div>
            ) : selectedRole === "staff" ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mã số nhân viên
                  </Label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="staffCode"
                      type="text"
                      placeholder="Nhập mã nhân viên"
                      className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            ) : selectedRole === "admin" ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mã quản trị viên
                  </Label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="adminCode"
                      type="password"
                      placeholder="Nhập mã quản lý"
                      className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold placeholder:text-slate-400 placeholder:font-normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mật khẩu
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu của bạn"
                      className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all font-semibold placeholder:text-slate-400 placeholder:font-normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className={`w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-blue-100 transition-all hover:translate-y-[-2px] active:translate-y-0 ${
                !selectedRole
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 text-white"
              }`}
              disabled={!selectedRole}
            >
              Đăng nhập
            </Button>
          </form>

          <p className="text-center text-md font-bold text-slate-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
