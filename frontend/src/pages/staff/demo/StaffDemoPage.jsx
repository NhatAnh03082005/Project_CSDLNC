import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { authAPI, employeeAPI, appointmentAPI } from "../../../api/services";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Menu,
  LogOut,
  Home,
  Receipt,
  Stethoscope,
  Syringe,
  Clock,
  FilePlus,
  Search,
  User,
  Phone,
  Info,
  History,
  Pill,
} from "lucide-react";
export default function StaffDemoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [branchName, setBranchName] = useState("");

  // Fetch branch info on mount
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await employeeAPI.getBranch();
        const data = response.data;
        if (data.success) {
          setBranchName(data.data?.tenChiNhanh || "");
        }
      } catch (err) {
        console.error("Error fetching branch:", err);
      }
    };
    fetchBranch();
  }, []);

  // Get display name and role
  const displayName = user?.HoTen || user?.TenNguoiDung || "Nhân viên";
  const displayRole =
    user?.ViTri === "Bác sĩ thú y" ? "Bác sĩ thú y" : "Nhân viên";
  const nameInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  // State cho dữ liệu
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    tongSo: 0,
    choXacNhan: 0,
    hoanThanh: 0,
    daHuy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(""); // Default to empty to show all

  // Fetch branch info on mount
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await employeeAPI.getBranch();
        const data = response.data;
        if (data.success) {
          setBranchName(data.data?.tenChiNhanh || "");
        }
      } catch (err) {
        console.error("Error fetching branch:", err);
      }
    };
    fetchBranch();
  }, []);

  // Fetch appointments and stats
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Pass selectedDate to getToday API (which is now getTodayAppointments with date support)
      // Note: First param is maChiNhanh (null to auto-detect), second is date
      const response = await appointmentAPI.getToday(null, selectedDate);
      const data = response.data;
      if (data.success) {
        setAppointments(data.data.appointments || []);
        setStats(
          data.data.thongKe || {
            tongSo: 0,
            choXacNhan: 0,
            hoanThanh: 0,
            daHuy: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]); // Refetch when selectedDate changes

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      localStorage.removeItem("token");
      useAuthStore.getState().logout();
      navigate("/login");
    }
  };

  const handleShowDetail = async (app) => {
    try {
      // Fetch details if needed, or just show what we have
      const response = await appointmentAPI.getById(app.maLichHen);
      if (response.data.success) {
        setSelectedApp(response.data.data);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  };

  // Logic tìm kiếm đa năng theo Tên hoặc SĐT
  const filteredAppointments = appointments.filter(
    (app) =>
      (app.tenKhachHang &&
        app.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.sdtKhachHang && app.sdtKhachHang.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      {/* Header*/}
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
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur-[2px]"></div>
                <div className="relative h-10 w-10 rounded-full bg-white p-0.5">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold shadow-inner">
                    {nameInitials}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1920px] mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block w-72 border-r border-gray-100 bg-white min-h-[calc(100vh-4rem)] sticky top-16 shadow-[4px_0_24px_rgba(0,0,0,0.01)] z-40">
          <nav className="p-6 space-y-2">
            <div className="pb-4 mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4">
                Menu chính
              </span>
            </div>

            <Link to="/staff/demo">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 h-11 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === "/staff/demo"
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Home
                  className={`h-5 w-5 ${
                    location.pathname === "/staff/demo"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                Trang chủ
              </Button>
            </Link>

            <Link to="/staff/create-record">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <FilePlus className="h-5 w-5 text-gray-400" />
                Tra cứu hồ sơ
              </Button>
            </Link>

            {/* Nút Lập hóa đơn - vô hiệu hóa nếu là Bác sĩ thú y */}
            <Link
              to="/staff/invoice"
              onClick={(e) => {
                if (user?.ViTri === "Bác sĩ thú y") {
                  e.preventDefault();
                }
              }}
              className={
                user?.ViTri === "Bác sĩ thú y" ? "pointer-events-none" : ""
              }
            >
              <Button
                variant="ghost"
                disabled={user?.ViTri === "Bác sĩ thú y"}
                className={`w-full justify-start gap-3 h-11 rounded-xl text-base font-medium transition-all ${
                  user?.ViTri === "Bác sĩ thú y"
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Receipt
                  className={`h-5 w-5 ${
                    user?.ViTri === "Bác sĩ thú y"
                      ? "text-gray-300"
                      : "text-gray-400"
                  }`}
                />
                Lập hóa đơn
              </Button>
            </Link>

            <div className="pt-6 pb-2 mt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4">
                Quản lý
              </span>
            </div>

            <Link to="/staff/work-schedule">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <Clock className="h-5 w-5 text-gray-400" />
                Lịch làm việc
              </Button>
            </Link>

            {/* Xem lịch hẹn của bác sĩ - chỉ cho bác sĩ thú y */}
            {user?.ViTri === "Bác sĩ thú y" && (
              <Link to="/staff/doctor-appointments">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <Calendar className="h-5 w-5 text-gray-400" />
                  Lịch hẹn của tôi
                </Button>
              </Link>
            )}

            {/* Xem lịch sử khám bệnh - chỉ cho bác sĩ thú y */}
            {user?.ViTri === "Bác sĩ thú y" && (
              <Link to="/staff/medical-history">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <History className="h-5 w-5 text-gray-400" />
                  Lịch sử khám bệnh
                </Button>
              </Link>
            )}

            {/* Tra cứu thuốc - chỉ cho bác sĩ thú y */}
            {user?.ViTri === "Bác sĩ thú y" && (
              <Link to="/staff/medicines">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                >
                  <Pill className="h-5 w-5 text-gray-400" />
                  Tra cứu thuốc
                </Button>
              </Link>
            )}

            {/* Nút Hồ sơ khám bệnh - vô hiệu hóa nếu không phải Bác sĩ thú y */}
            <Link
              to="/staff/medical-records"
              onClick={(e) => {
                if (user?.ViTri !== "Bác sĩ thú y") {
                  e.preventDefault();
                }
              }}
              className={
                user?.ViTri !== "Bác sĩ thú y" ? "pointer-events-none" : ""
              }
            >
              <Button
                variant="ghost"
                disabled={user?.ViTri !== "Bác sĩ thú y"}
                className={`w-full justify-start gap-3 h-11 rounded-xl text-base font-medium transition-all ${
                  user?.ViTri !== "Bác sĩ thú y"
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Stethoscope
                  className={`h-5 w-5 ${
                    user?.ViTri !== "Bác sĩ thú y"
                      ? "text-gray-300"
                      : "text-gray-400"
                  }`}
                />
                Hồ sơ khám bệnh
              </Button>
            </Link>
            {/* Nút Hồ sơ tiêm phòng - vô hiệu hóa nếu không phải Bác sĩ thú y */}
            <Link
              to="/staff/vaccination-records"
              onClick={(e) => {
                if (user?.ViTri !== "Bác sĩ thú y") {
                  e.preventDefault();
                }
              }}
              className={
                user?.ViTri !== "Bác sĩ thú y" ? "pointer-events-none" : ""
              }
            >
              <Button
                variant="ghost"
                disabled={user?.ViTri !== "Bác sĩ thú y"}
                className={`w-full justify-start gap-3 h-11 rounded-xl text-base font-medium transition-all ${
                  user?.ViTri !== "Bác sĩ thú y"
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Syringe
                  className={`h-5 w-5 ${
                    user?.ViTri !== "Bác sĩ thú y"
                      ? "text-gray-300"
                      : "text-gray-400"
                  }`}
                />
                Hồ sơ tiêm phòng
              </Button>
            </Link>

            <div className="pt-8 mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-w-0">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Lịch hẹn nhân viên
                </h1>
                <p className="text-gray-500 mt-2 text-lg font-light">
                  Quản lý danh sách lịch hẹn và thông tin khách hàng
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
                    Thời gian
                  </div>
                  <div className="text-xl font-bold text-gray-900 font-mono">
                    {new Date().toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách lịch hẹn - tìm kiếm */}
            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
              <CardHeader className="bg-white px-8 pt-8 pb-6 border-b border-gray-50">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
                      Danh sách lịch hẹn
                    </CardTitle>
                    <CardDescription className="pl-4 mt-1 text-base">
                      Xem và quản lý tất cả các lịch hẹn trong hệ thống
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    {/* Date Picker Custom Style */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <Input
                        type="date"
                        className="w-full sm:w-[180px] pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    {/* Search Input Custom Style */}
                    <div className="relative w-full xl:w-[400px] group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <Input
                        placeholder="Tìm kiếm theo tên hoặc SĐT khách hàng..."
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-gray-50/50 min-h-[400px]">
                <div className="p-6 space-y-4">
                  {filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Calendar className="h-10 w-10 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Chưa có lịch hẹn nào
                      </h3>
                      <p className="text-gray-500 max-w-sm mt-1">
                        Không tìm thấy lịch hẹn phù hợp với bộ lọc hiện tại. Vui
                        lòng thử lại với ngày hoặc từ khóa khác.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6 rounded-full px-6 border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200"
                        onClick={() => {
                          setSelectedDate("");
                          setSearchTerm("");
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  ) : (
                    filteredAppointments.map((app) => (
                      <div
                        key={app.maLichHen}
                        className="group relative bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-300 transition-all duration-300 ease-out"
                      >
                        {/* Status Indicator Bar */}
                        <div
                          className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full
                            ${
                              app.trangThai === "Đã lên lịch"
                                ? "bg-orange-500"
                                : app.trangThai === "Đã xác nhận"
                                ? "bg-green-500"
                                : app.trangThai === "Đã hủy"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }
                         `}
                        ></div>

                        <div className="pl-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          {/* Time & Date */}
                          <div className="flex items-center gap-6 min-w-[140px]">
                            <div className="text-center">
                              <div
                                className={`text-2xl font-black tracking-tight ${
                                  app.trangThai === "Hoàn thành"
                                    ? "text-gray-400"
                                    : "text-gray-900 group-hover:text-blue-600 transition-colors"
                                }`}
                              >
                                {app.thoiGianHen}
                              </div>
                              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1 bg-gray-50 px-2 py-0.5 rounded-md inline-block">
                                {app.ngayLap}
                              </div>
                            </div>
                            <div className="h-10 w-px bg-gray-100 hidden lg:block"></div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {app.tenKhachHang}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0 border-0
                                    ${
                                      app.trangThai === "Đã lên lịch"
                                        ? "bg-orange-50 text-orange-600"
                                        : app.trangThai === "Đã xác nhận"
                                        ? "bg-green-50 text-green-600"
                                        : app.trangThai === "Đã hủy"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-gray-100 text-gray-500"
                                    }
                                  `}
                                >
                                  {app.trangThai}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                <span>{app.sdtKhachHang}</span>
                              </div>
                            </div>

                            <div className="space-y-1.5 pl-0 md:pl-6 md:border-l border-gray-100">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                                  <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                                </div>
                                <span className="font-medium">
                                  {app.loaiDichVu}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="h-6 w-6 rounded-full bg-purple-50 flex items-center justify-center">
                                  <User className="h-3.5 w-3.5 text-purple-500" />
                                </div>
                                <span>
                                  BS:{" "}
                                  <span className="font-semibold text-gray-800">
                                    {app.tenBacSiPhuTrach || "Chưa phân công"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex items-center pt-4 lg:pt-0">
                            <Button
                              size="sm"
                              className="h-10 px-5 rounded-xl bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all font-medium gap-2 group/btn"
                              onClick={() => handleShowDetail(app)}
                            >
                              <FileText className="h-4 w-4 text-gray-400 group-hover/btn:text-blue-500 transition-colors" />
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* DIALOG HIỂN THỊ CHI TIẾT LỊCH HẸN*/}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl w-full max-h-[90vh] rounded-3xl bg-white shadow-2xl border-0 p-0 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText className="h-24 w-24 transform rotate-12" />
              </div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2 relative z-10">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Chi tiết lịch hẹn
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1 relative z-10 font-medium opacity-90 text-sm">
                Mã: {selectedApp?.maLichHen}
              </DialogDescription>
            </div>

            {selectedApp && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-gray-100"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                      <User className="inline h-3 w-3 mr-1 mb-0.5" /> Khách hàng
                    </span>
                    <span className="h-px flex-1 bg-gray-100"></span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-base font-bold text-gray-700 border border-gray-100 flex-shrink-0">
                      {selectedApp.khachHang?.hoTen?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 text-base leading-tight truncate">
                        {selectedApp.khachHang?.hoTen}
                      </p>
                      <p className="text-gray-500 text-xs font-medium mt-0.5">
                        {selectedApp.khachHang?.sdt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-gray-100"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                      <Calendar className="inline h-3 w-3 mr-1 mb-0.5" /> Thông
                      tin
                    </span>
                    <span className="h-px flex-1 bg-gray-100"></span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-100">
                      <span className="text-[9px] uppercase font-bold text-blue-400 tracking-wider block">
                        Thời gian
                      </span>
                      <p className="text-blue-900 font-bold text-sm mt-0.5 break-words">
                        {selectedApp.thoiGianHen}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-100">
                      <span className="text-[9px] uppercase font-bold text-purple-400 tracking-wider block">
                        Dịch vụ
                      </span>
                      <p className="text-purple-900 font-bold text-sm mt-0.5 break-words">
                        {selectedApp.loaiDichVu}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl p-2.5 flex justify-between items-center shadow-sm">
                    <span className="text-xs text-gray-500 font-medium">
                      Bác sĩ phụ trách
                    </span>
                    <span className="text-xs font-bold text-gray-800 truncate ml-2">
                      {selectedApp.bacSi?.hoTen || "Chưa phân công"}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className={`
                        px-3 py-1 text-xs font-bold border-2
                        ${
                          selectedApp.trangThai === "Đã lên lịch"
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : selectedApp.trangThai === "Đã xác nhận"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : selectedApp.trangThai === "Đã hủy"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-gray-50 text-gray-600 border-gray-100"
                        }
                      `}
                    >
                      {selectedApp.trangThai}
                    </Badge>
                  </div>
                </div>

                {/* Pets List */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-gray-100"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                      Thú cưng ({selectedApp.thuCung?.length || 0})
                    </span>
                    <span className="h-px flex-1 bg-gray-100"></span>
                  </div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedApp.thuCung?.map((pet) => (
                      <div
                        key={pet.maThuCung}
                        className="flex items-center justify-between p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shadow-inner group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-600 transition-all flex-shrink-0">
                            {pet.tenThuCung.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-gray-800 truncate">
                              {pet.tenThuCung}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide truncate">
                              {pet.giong} • {pet.loai}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold bg-white border border-gray-100 shadow-sm flex-shrink-0 ml-2"
                        >
                          {pet.gioiTinh}
                        </Badge>
                      </div>
                    ))}
                    {(!selectedApp.thuCung ||
                      selectedApp.thuCung.length === 0) && (
                      <div className="text-center py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-[10px] italic">
                          Chưa có thông tin thú cưng
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant="outline"
                className="rounded-xl border-gray-200 font-bold text-gray-600 hover:text-gray-900 hover:border-gray-300 text-sm px-4 h-9"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
