import React from "react";
import { Button } from "../ui/button";
import { Menu, LogOut } from "lucide-react";
import { authAPI } from "../../api/services";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function StaffHeader({
  branchName,
  isProfileOpen,
  setIsProfileOpen,
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const displayName = user?.HoTen || user?.Email || "Người dùng";
  const displayRole = user?.ViTri || "Nhân viên";
  const nameInitials =
    displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "U";

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-6 max-w-[1920px] mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-500 hover:text-gray-900"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-sm rounded-full opacity-20"></div>
            <img
              src="/logo.png"
              alt="PetCare Logo"
              className="relative h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 tracking-tight">
              PetCareX Staff
            </div>
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {branchName || "Đang tải..."}
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-gray-900">
                {displayName}
              </div>
              <div className="text-xs font-medium text-gray-500">
                {displayRole}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="group cursor-pointer transition-all duration-200 focus:outline-none"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur-[2px]"></div>
                <div className="relative h-10 w-10 rounded-full bg-white p-0.5">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold shadow-inner">
                    {nameInitials}
                  </div>
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="font-bold text-gray-900 text-sm">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {displayRole}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-4 py-2 h-auto rounded-none text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-medium text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
