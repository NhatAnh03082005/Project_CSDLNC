import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Activity, Users, LogOut, ChevronDown } from "lucide-react";

import { authAPI } from "../../../api/services";
import { useAuthStore } from "../../../store/authStore";
export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate(); // [Sửa] Khai báo navigate bên trong component

  // [Sửa] Lấy các hàm cập nhật trạng thái từ Zustand Store
  const { setUser, setIsAuthenticated } = useAuthStore();

  const isActive = (path) => location.pathname === path;

  // [Sửa] Logic logout đồng bộ
  const handleLogout = async () => {
    try {
      // 1. Gọi API logout phía Server
      await authAPI.logout();
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      // 2. Xóa thông tin ở Local dù API thành công hay thất bại
      localStorage.removeItem("token");

      // 3. Cập nhật State trong Store
      setUser(null);
      setIsAuthenticated(false);
      useAuthStore.getState().logout(); // Gọi hàm dọn dẹp của Zustand

      // 4. Điều hướng về trang đăng nhập
      navigate("/login");
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* thêm relative để dùng absolute centering */}
      <div className="relative flex h-16 items-center px-6 max-w-[1920px] mx-auto">
        {/* Logo (Left) */}
        <Link
          to="/admin/demo"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">PC</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-base text-gray-900">
              PetCareX Admin
            </div>
            <div className="text-[10px] text-gray-500 leading-none">
              Hệ thống quản trị
            </div>
          </div>
        </Link>

        {/* Navigation (CENTER) */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10">
          <Link to="/admin/demo">
            <Button
              variant="ghost"
              className={`gap-2 relative ${
                isActive("/admin/demo")
                  ? "font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
              {isActive("/admin/demo") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </Button>
          </Link>

          <Link to="/admin/statistics">
            <Button
              variant="ghost"
              className={`gap-2 relative ${
                isActive("/admin/statistics")
                  ? "font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Activity className="h-4 w-4" />
              Thống kê
              {isActive("/admin/statistics") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </Button>
          </Link>

          <Link to="/admin/management">
            <Button
              variant="ghost"
              className={`gap-2 relative ${
                isActive("/admin/management")
                  ? "font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Users className="h-4 w-4" />
              Quản lý
              {isActive("/admin/management") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </Button>
          </Link>
        </nav>

        {/* User (Right) */}
        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 hover:bg-gray-100 h-auto py-2 px-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      Admin User
                    </div>
                    <div className="text-xs text-gray-500">Quản trị viên</div>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                    AD
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@petcarex.com</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* CHỈ CÒN ĐĂNG XUẤT */}
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
