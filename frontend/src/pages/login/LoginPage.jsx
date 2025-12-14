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
import { Heart, User, Briefcase } from "lucide-react";

// Xóa bỏ "use client" và import type React

export default function LoginPage() {
  // Thay thế useRouter() bằng useNavigate()
  const navigate = useNavigate(); 
  
  // 4. Loại bỏ khai báo kiểu TypeScript: useState<"customer" | "staff" | null>(null)
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 5. Loại bỏ khai báo kiểu TypeScript cho sự kiện: (e: React.FormEvent)
  const handleLogin = (e) => {
    e.preventDefault();

    // Thay thế router.push bằng navigate()
    if (selectedRole === "customer") {
      navigate("/"); // Chuyển hướng đến trang chủ khách hàng
    } else if (selectedRole === "staff") {
      navigate("/staff/demo"); // Chuyển hướng đến khu vực nhân viên
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-10 w-10 text-blue-600 fill-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">PetCare</h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">Chọn vai trò và đăng nhập vào hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Vai trò</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "customer" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User
                    className={`h-8 w-8 mx-auto mb-2 ${
                      selectedRole === "customer" ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <div className="text-sm font-medium text-center">Khách hàng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("staff")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "staff" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Briefcase
                    className={`h-8 w-8 mx-auto mb-2 ${selectedRole === "staff" ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <div className="text-sm font-medium text-center">Nhân viên</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@petcare.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                {/* Sửa Link href -> to */}
                <Link to="#" className="text-sm text-blue-600 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedRole}
              >
                Đăng nhập
              </Button>
            </form>

            {/* Register Link */}
            <div className="text-center text-sm">
              Chưa có tài khoản?{" "}
              {/* Sửa Link href -> to */}
              <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          {/* Sửa Link href -> to */}
          <Link to="#" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          của PetCare
        </p>
      </div>
    </div>
  );
}