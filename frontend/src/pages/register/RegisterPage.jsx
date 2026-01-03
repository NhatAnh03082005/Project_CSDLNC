import React, { useState } from "react";
// 1. Thay thế Next.js hooks bằng React Router DOM hooks
import { useNavigate } from "react-router-dom";
// 2. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 3. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Heart } from "lucide-react";
import { authAPI } from "../../api/services";
import { useCartStore } from "../../store/cartStore";
// Xóa bỏ "use client" và import type React

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
      NgaySinh: formData.dateOfBirth
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-10 w-10 text-blue-600 fill-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">PetCare</h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Đăng ký tài khoản</CardTitle>
            <CardDescription className="text-center">
              Tạo tài khoản để trải nghiệm dịch vụ chăm sóc thú cưng tốt nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CCCD */}
                <div className="space-y-2">
                  <Label htmlFor="cccd">
                    CCCD/CMND <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cccd"
                    name="cccd"
                    type="text"
                    placeholder="001234567890"
                    value={formData.cccd}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Giới tính <span className="text-red-500">*</span>
                  </Label>
                  {/* Đảm bảo select sử dụng styling chuẩn của Input/UI */}
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
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
                  {/* Sửa Link href -> to */}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link to="#" className="text-blue-600 hover:underline">
                    Chính sách bảo mật
                  </Link>{" "}
                  của PetCare
                </label>
              </div>

              {/* Register Button */}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Đăng ký
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm mt-6">
              Đã có tài khoản?{" "}
              {/* Sửa Link href -> to */}
              <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">Tài khoản đăng ký mặc định sẽ là khách hàng</p>
      </div>
    </div>
  );
}