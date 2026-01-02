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
import { Heart, User, Briefcase, Hash } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
export default function LoginPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffCode, setStaffCode] = useState("");
  const { setUser, setIsAuthenticated } = useAuth();

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
      }

      if (response.data.status === 200) {
        localStorage.setItem("token", response.data.token);

        // Lưu thông tin user vào context
        setUser(response.data.data);
        setIsAuthenticated(true);

        alert("Đăng nhập thành công!");

        // Điều hướng dựa trên Role trả về từ Server
        const userRole = response.data.data.Role;

        if (userRole === "customer") {
          navigate("/customer");
        } else if (userRole === "admin") {
          navigate("/admin/demo"); // Trang dành cho Quản lý chi nhánh
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img
            src="Logo.png"
            alt="PetCareX Logo"
            className="h-11 w-11 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900">PetCareX</h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center">
              Chọn vai trò và đăng nhập vào hệ thống
            </CardDescription>
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
                    selectedRole === "customer"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User
                    className={`h-8 w-8 mx-auto mb-2 ${
                      selectedRole === "customer"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-sm font-medium text-center">
                    Khách hàng
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("staff")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "staff"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Briefcase
                    className={`h-8 w-8 mx-auto mb-2 ${
                      selectedRole === "staff"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-sm font-medium text-center">
                    Nhân viên
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {selectedRole === "staff" ? (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <Label htmlFor="staffCode">Mã số nhân viên</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="staffCode"
                      type="text"
                      placeholder="Nhập mã nhân viên (VD: NV001)"
                      className="pl-10"
                      value={staffCode}
                      onChange={(e) => setStaffCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
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
                  {/* <div className="flex justify-end">
                    <Link
                      to="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div> */}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedRole}
              >
                Đăng nhập
              </Button>
            </form>

            <div className="text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <Link to="#" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          của PetCareX
        </p>
      </div>
    </div>
  );
}
