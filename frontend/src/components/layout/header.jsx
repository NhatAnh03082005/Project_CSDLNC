import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom"; 
import { 
  ShoppingCart, 
  User, 
  FolderOpen, 
  ClipboardPlus, 
  Star, 
  Heart, 
  LogOut,
  History, 
  Calendar 
} from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/services";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Header() {
  const { user, setUser, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const handleLogout = async () => {
    try {
      const response = await authAPI.logout();
      if (response.data.success) {
        localStorage.removeItem("token");

        setUser(null);
        setIsAuthenticated(false);
        useAuthStore.getState().logout();
        navigate("/login");
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        useAuthStore.getState().logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      useAuthStore.getState().logout();
      navigate("/login");
    }
  }

  const navLinkClass = ({ isActive }) => 
    `text-sm font-medium transition-colors hover:text-blue-600 ${
      isActive ? "text-blue-600" : "text-gray-600"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/customer" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCareX</span>
          </Link>
        </div>

        {/* Navigation Desktop sử dụng NavLink */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/customer" className={navLinkClass}>
            Trang chủ
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Dịch vụ
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Sản phẩm
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            Về chúng tôi
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
  <Link to="/invoices">
    <Button variant="ghost" size="icon" title="Lịch sử hóa đơn">
      <History className="h-5 w-5" />
    </Button>
  </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                    {getItemCount()}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end">
              <DropdownMenuLabel>Giỏ hàng của bạn</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const formatPrice = (price) => {
                      return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(price);
                    };
                    const total = (item.donGia || item.price || 0) * (item.soLuong || item.quantity);
                    return (
                      <div key={item.maSanPham} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.tenSanPham || item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.loaiSanPham || item.type} • SL: {item.soLuong || item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-blue-600 mt-1">{formatPrice(total)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => removeItem(item.maSanPham)}
                        >
                          ×
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>Giỏ hàng trống</p>
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center font-bold text-gray-900">
                      <span>Tổng cộng:</span>
                      <span className="text-lg text-blue-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(getTotal())}
                      </span>
                    </div>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="/checkout">Thanh toán ngay</Link>
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-gray-100 hover:border-blue-200">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar-placeholder.png" alt="User" />
                  <AvatarFallback className="bg-blue-100 text-blue-700">KH</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 py-1">
                  <p className="text-sm font-semibold text-gray-900">Khách hàng</p>
                  <p className="text-xs text-gray-500 truncate">
                    {isAuthenticated && <span>{user.Email}</span>}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-3 h-4 w-4 text-gray-500" /> Quản lý hồ sơ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/pets" className="cursor-pointer">
                  <FolderOpen className="mr-3 h-4 w-4 text-gray-500" /> Hồ sơ thú cưng
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/appointments" className="cursor-pointer">
                  <Calendar className="mr-3 h-4 w-4 text-gray-500" /> Lịch hẹn của tôi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/vaccination-packages" className="cursor-pointer">
                  <ClipboardPlus className="mr-3 h-4 w-4 text-gray-500" /> Gói tiêm phòng
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/reviews" className="cursor-pointer">
                  <Star className="mr-3 h-4 w-4 text-gray-500" /> Đánh giá dịch vụ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                onClick={() => handleLogout()}
              >
                <LogOut className="mr-3 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}