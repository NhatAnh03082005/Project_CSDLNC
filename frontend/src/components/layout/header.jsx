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
  Calendar,
  X,
  CreditCard,
  Settings,
  ChevronRight,
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
      await authAPI.logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      useAuthStore.getState().logout();
      useCartStore.getState().clearCart();
      navigate("/login");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-sm font-semibold transition-all duration-300 group ${
      isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-500"
    }`;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="/customer" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
            <img
              src="/logo.png"
              alt="PetCareX Logo"
              className="h-11 w-11 object-contain drop-shadow-sm"
            />
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter text-blue-900 group-hover:text-blue-800 transition-colors">
                PetCareX
              </span>
              <span className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">Premium Care</span>
            </div>
          </Link>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { to: "/customer", label: "Trang chủ" },
            { to: "/services", label: "Dịch vụ" },
            { to: "/products", label: "Sản phẩm" },
            { to: "/about", label: "Về chúng tôi" },
          ].map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-1/2"}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <Link to="/invoices">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Lịch sử hóa đơn">
              <History className="h-5 w-5" />
            </Button>
          </Link>

          {/* Shopping Cart */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <ShoppingCart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-blue-600 text-white border-2 border-white shadow-lg animate-in zoom-in">
                    {getItemCount()}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[380px] mt-4 p-0 bg-white shadow-2xl rounded-2xl border-slate-100 overflow-hidden" align="end">
              <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                <DropdownMenuLabel className="p-0 text-base font-bold text-slate-900">Giỏ hàng của bạn</DropdownMenuLabel>
              </div>
              <div className="max-h-[400px] overflow-y-auto px-2 py-2 thin-scrollbar">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.maSanPham} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all group">
                      <div className="h-16 w-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-50">
                        {/* If items have images, they could go here */}
                        <ShoppingBagIcon className="w-6 h-6 text-slate-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {item.tenSanPham || item.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.loaiSanPham || item.type} • SL: {item.soLuong || item.quantity}
                        </p>
                        <p className="text-sm font-bold text-blue-600 mt-1.5">
                          {formatPrice((item.donGia || item.price || 0) * (item.soLuong || item.quantity))}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => removeItem(item.maSanPham)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex h-16 w-16 rounded-full bg-slate-50 items-center justify-center text-slate-300 mb-4">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                    <p className="text-slate-500 font-medium">Giỏ hàng đang trống</p>
                    <Link to="/products" className="text-sm text-blue-600 font-bold hover:underline mt-2 inline-block">Mua sắm ngay</Link>
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-5 bg-slate-50/30 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Tổng giá trị</span>
                    <span className="text-xl font-black text-blue-600">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                  <Button asChild className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all hover:translate-y-[-1px]">
                    <Link to="/checkout" className="flex items-center gap-2">
                       Thanh toán ngay <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-11 w-11 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 hover:bg-blue-50 transition-all group p-1"
              >
                <Avatar className="h-full w-full rounded-xl transition-transform group-hover:scale-95 duration-300">
                  <AvatarImage src="/avatar-placeholder.png" alt="User" />
                  <AvatarFallback className="bg-blue-600 text-white font-bold">
                    KH
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 mt-4 p-2 bg-white shadow-2xl rounded-2xl border-slate-100" align="end">
              <div className="px-4 py-4 mb-2 bg-blue-600 rounded-xl text-white">
                <p className="text-sm font-medium opacity-80 mb-0.5">Tài khoản khách hàng</p>
                <p className="text-base font-bold truncate">
                  {isAuthenticated ? user.Email : "Chưa đăng nhập"}
                </p>
              </div>
              
              <div className="space-y-1">
                <HeaderMenuItem to="/profile" icon={<User className="h-4 w-4" />} label="Quản lý hồ sơ" />
                <HeaderMenuItem to="/pets" icon={<FolderOpen className="h-4 w-4" />} label="Hồ sơ thú cưng" />
                <HeaderMenuItem to="/appointments" icon={<Calendar className="h-4 w-4" />} label="Lịch hẹn của tôi" />
                <HeaderMenuItem to="/vaccination-packages" icon={<ClipboardPlus className="h-4 w-4" />} label="Gói tiêm phòng" />
                <HeaderMenuItem to="/reviews" icon={<Star className="h-4 w-4" />} label="Đánh giá dịch vụ" />
              </div>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem
                className="flex items-center gap-3 p-3 rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer transition-all mx-1 font-bold"
                onClick={() => handleLogout()}
              >
                <LogOut className="h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function HeaderMenuItem({ to, icon, label }) {
  return (
    <DropdownMenuItem asChild>
      <Link to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all mx-1 font-semibold text-slate-700 hover:text-blue-600 group">
        <div className="h-8 w-8 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
          {React.cloneElement(icon, { className: "h-4 w-4 transition-colors group-hover:text-blue-600" })}
        </div>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}

function ShoppingBagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

