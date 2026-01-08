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
import { Heart, CheckCircle2, ShieldCheck } from "lucide-react";
import { authAPI } from "../../api/services";
import { useCartStore } from "../../store/cartStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cccd: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Map dữ liệu từ state React sang định dạng Backend mong đợi
    const dataToSubmit = {
      HoTen: formData.fullName,
      GioiTinh: formData.gender === "male" ? "Nam" : "Nữ", // Khớp với sql.NVarChar(3)
      SDT: formData.phone,
      CCCD: formData.cccd,
      Email: formData.email,
      MatKhau: formData.password,
      NgaySinh: formData.dateOfBirth,
    };

    try {
      // Gửi dữ liệu đến Backend sử dụng authAPI
      const response = await authAPI.register(dataToSubmit);

      if (response.status === 201 || response.status === 200) {
        // Xóa giỏ hàng khi đăng ký thành công (để tránh giữ giỏ hàng từ session trước)
        clearCart();
        alert("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      // Hiển thị lỗi từ backend (ví dụ: Email đã tồn tại)
      alert(error.response?.data?.message || "Đăng ký thất bại");
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

      {/* Right Side: Clean Registration Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[480px] space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-blue-600 tracking-tight">
              Đăng ký tài khoản
            </h1>
            <p className="text-slate-500 font-medium">
              Tạo tài khoản để trải nghiệm dịch vụ của PetCareX
            </p>
          </div>
          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-slate-700"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CCCD */}
              <div className="space-y-2">
                <Label
                  htmlFor="cccd"
                  className="text-sm font-medium text-slate-700"
                >
                  CCCD/CMND <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cccd"
                  name="cccd"
                  type="text"
                  placeholder="Nhập CCCD/CMND"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.cccd}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium text-slate-700"
                >
                  Ngày sinh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="text-sm font-medium text-slate-700"
                >
                  Giới tính <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="h-10 placeholder:text-slate-400 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50 transition-all"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2 pt-2">
              <input type="checkbox" id="terms" required className="mt-1" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <Link to="#" className="text-blue-600 hover:underline">
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link to="#" className="text-blue-600 hover:underline">
                  Chính sách bảo mật
                </Link>{" "}
                của PetCareX
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              variant="premium"
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-100 transition-all"
            >
              Đăng ký tài khoản
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center text-md font-bold text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
