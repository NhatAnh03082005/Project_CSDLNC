import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Heart, User, Briefcase, Hash } from "lucide-react"; // Thêm icon Hash cho mã nhân viên
import axios from "axios"; // Đảm bảo đã import axios
import { useAuth } from "../../context/AuthContext";
export default function LoginPage() {
  const navigate = useNavigate(); 
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffCode, setStaffCode] = useState(""); // State mới cho mã nhân viên
  const {setUser, setIsAuthenticated} = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    let response;
    
    if (selectedRole === "customer") {
      // Gửi yêu cầu đăng nhập khách hàng đến Backend
      response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
        role: "customer"
      });
      setUser(response.data.data);
      setIsAuthenticated(true);
      
    } else if (selectedRole === "staff") {
      // Gửi yêu cầu đăng nhập nhân viên
      response = await axios.post("http://localhost:3000/api/auth/login", {
        staffCode,
        role: "staff"
      });
    }
    console.log(response);
    

    // Nếu đăng nhập thành công (Backend trả về status 200)
    if (response.data.status === 200) {
      // 1. Lưu token vào bộ nhớ trình duyệt để dùng cho các trang sau
      localStorage.setItem("token", response.data.token);
      
      alert("Đăng nhập thành công!");

      // 2. Chuyển hướng trang
      if (selectedRole === "customer") {
        navigate("/customer"); 
      } else {
        navigate("/staff/demo");
      }
    }
  } catch (error) {
    // Nếu có lỗi (Sai mật khẩu, email không tồn tại...), hiện thông báo lỗi
    console.error("Lỗi đăng nhập:", error);
    alert(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
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
                  <User className={`h-8 w-8 mx-auto mb-2 ${selectedRole === "customer" ? "text-blue-600" : "text-gray-400"}`} />
                  <div className="text-sm font-medium text-center">Khách hàng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("staff")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === "staff" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mx-auto mb-2 ${selectedRole === "staff" ? "text-blue-600" : "text-gray-400"}`} />
                  <div className="text-sm font-medium text-center">Nhân viên</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Hiển thị Input tùy theo vai trò */}
              {selectedRole === "staff" ? (
                /* Giao diện cho NHÂN VIÊN */
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
                /* Giao diện cho KHÁCH HÀNG (Mặc định hoặc khi chọn Customer) */
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
                  <div className="flex justify-end">
                    <Link to="#" className="text-sm text-blue-600 hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
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
              <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
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
          của PetCare
        </p>
      </div>
    </div>
  );
}