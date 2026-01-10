import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { employeeAPI, appointmentAPI } from "../../../api/services";
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
  Syringe,
  Stethoscope,
  Clock,
  Search,
  User,
  Phone,
  Info,
  X,
} from "lucide-react";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";
export default function StaffDemoPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  // State cho dữ liệu
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    tongSo: 0,
    choXacNhan: 0,
    hoanThanh: 0,
    daHuy: 0,
  });
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today); // Default to today's date

  // State cho các thống kê mới
  const [pendingMedicalCount, setPendingMedicalCount] = useState(0);
  const [pendingVaccinationCount, setPendingVaccinationCount] = useState(0);

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
    fetchStatsData();
  }, [selectedDate]); // Refetch when selectedDate changes

  // Fetch các thống kê cho cards
  const fetchStatsData = async () => {
    try {
      // Lấy số hồ sơ khám bệnh chờ
      const medicalResponse = await fetch("/api/medical/records/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (medicalResponse.ok) {
        const medicalData = await medicalResponse.json();
        setPendingMedicalCount(medicalData.data?.length || 0);
      }

      // Lấy số hồ sơ tiêm phòng chờ
      const vaccinationResponse = await fetch(
        "/api/vaccinations/records/pending",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (vaccinationResponse.ok) {
        const vaccinationData = await vaccinationResponse.json();
        setPendingVaccinationCount(vaccinationData.data?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

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
  const filteredAppointments = appointments
    .filter(
      (app) =>
        (app.tenKhachHang &&
          app.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.sdtKhachHang && app.sdtKhachHang.includes(searchTerm))
    )
    .sort((a, b) => {
      // Sắp xếp theo trạng thái (priority)
      const statusPriority = {
        "Đã lên lịch": 1,
        "Đã xác nhận": 2,
        "Hoàn thành": 3,
        "Đã hủy": 4,
      };
      const priorityA = statusPriority[a.trangThai] || 999;
      const priorityB = statusPriority[b.trangThai] || 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Nếu cùng trạng thái, sắp xếp theo thời gian
      const timeA = new Date(a.thoiGianHen || 0).getTime();
      const timeB = new Date(b.thoiGianHen || 0).getTime();
      return timeA - timeB;
    });

  const toLocalYMD = (d) => {
    const x = d instanceof Date ? d : new Date(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayYMD = toLocalYMD(new Date());

  const todayAppointmentsCount = appointments.filter((app) => {
    if (!app.thoiGianHen) return false;

    // Ưu tiên dùng thoiGianHen, fallback về ngayHen
    const dateToCheck = app.thoiGianHen;

    // Nếu backend trả đúng "YYYY-MM-DD" thì dùng luôn
    // Nếu lỡ trả dạng datetime, normalize về local YMD
    const appYMD =
      dateToCheck.length === 10 && dateToCheck[4] === "-"
        ? dateToCheck
        : toLocalYMD(dateToCheck);

    return appYMD === todayYMD;
  }).length;

  return (
    <div className="min-h-screen bg-blue-50 font-sans selection:bg-blue-100">
      <StaffHeader
        branchName={branchName}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="flex max-w-[1920px] mx-auto">
        <StaffSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 min-w-0 bg-blue-50">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="space-y-8">
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-medium text-blue-600">
                        Lịch hẹn hôm nay
                      </p>
                      <p className="text-4xl font-bold text-blue-900 mt-2">
                        {todayAppointmentsCount || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <Calendar className="h-7 w-7 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-sky-200 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-medium text-sky-600">
                        Chờ khám
                      </p>
                      <p className="text-4xl font-bold text-sky-900 mt-2">
                        {pendingMedicalCount}
                      </p>
                    </div>
                    <div className="bg-sky-50 p-3 rounded-xl">
                      <Stethoscope className="h-7 w-7 text-sky-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-medium text-cyan-600">
                        Chờ tiêm
                      </p>
                      <p className="text-4xl font-bold text-cyan-900 mt-2">
                        {pendingVaccinationCount}
                      </p>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-xl">
                      <Syringe className="h-7 w-7 text-cyan-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách lịch hẹn - tìm kiếm */}
            <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
              <CardHeader className="bg-white px-8 pt-8 pb-0 border-b border-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                      <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
                      Lịch hẹn của chi nhánh
                    </CardTitle>
                    <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                      Danh sách lịch hẹn của chi nhánh {branchName || ""}{" "}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Date Picker Custom Style */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <Input
                        type="date"
                        className="w-full sm:w-[180px] pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 placeholder:text-gray-400"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    {/* Search Input Custom Style */}
                    <div className="relative w-full lg:w-[300px] group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <Input
                        placeholder="Tìm theo tên hoặc SĐT..."
                        className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 text-sm placeholder:text-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-gray-50/50">
                <div className="space-y-2 p-4">
                  {filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Calendar className="h-10 w-10 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Chưa có lịch hẹn nào
                      </h3>
                      <p className="text-gray-500 max-w-sm mt-1">
                        Không tìm thấy lịch hẹn phù hợp với bộ lọc hiện tại.
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
                    <div className="space-y-2">
                      {/* Header Row */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-3 text-center">Thời gian</div>
                        <div className="col-span-3 text-center">Khách hàng</div>
                        <div className="col-span-3 text-center">Dịch vụ</div>
                        <div className="col-span-3 text-center">Trạng thái</div>
                      </div>

                      {/* Appointment Rows */}
                      {filteredAppointments.map((app) => (
                        <div
                          key={app.maLichHen}
                          onClick={() => handleShowDetail(app)}
                          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
                        >
                          {/* Hover Effect Background */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Thời gian */}
                            <div className="md:col-span-3">
                              <div className="text-center">
                                <div className="text-2xl font-black text-blue-600 group-hover:text-blue-700">
                                  {app.thoiGianHen
                                    ? app.thoiGianHen
                                        .split("-")
                                        .reverse()
                                        .join("/")
                                    : ""}
                                </div>
                                {app.thoiGianHen && (
                                  <div className="text-xs font-medium text-gray-500 mt-1">
                                    {new Date(
                                      app.thoiGianHen
                                    ).toLocaleDateString("vi-VN", {
                                      weekday: "long",
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Khách hàng */}
                            <div className="md:col-span-3 text-center">
                              <p className="text-sm font-bold text-gray-800">
                                {app.tenKhachHang}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {app.sdtKhachHang}
                              </p>
                            </div>

                            {/* Dịch vụ */}
                            <div className="md:col-span-3">
                              <div className="flex items-center justify-center gap-2">
                                {app.loaiDichVu
                                  ?.toLowerCase()
                                  .includes("tiêm") ? (
                                  <>
                                    <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                      <Syringe className="h-3 w-3 text-green-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-green-600">
                                      {app.loaiDichVu}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                      <Stethoscope className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-blue-600">
                                      {app.loaiDichVu}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Trạng thái */}
                            <div className="md:col-span-3 flex justify-center">
                              <Badge
                                variant="secondary"
                                className={`text-[10px] uppercase font-bold tracking-wider border-0
                                  ${
                                    app.trangThai === "Đã lên lịch"
                                      ? "bg-blue-50 text-blue-600"
                                      : app.trangThai === "Hoàn thành"
                                      ? "bg-green-50 text-green-600"
                                      : app.trangThai === "Đã hủy"
                                      ? "bg-red-50 text-red-600"
                                      : "bg-gray-100 text-gray-600"
                                  }
                                `}
                              >
                                {app.trangThai}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {(selectedDate || searchTerm) && (
              <div className="px-4 pb-3 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 rounded-xl transition-all"
                  onClick={() => {
                    setSelectedDate("");
                    setSearchTerm("");
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </main>

        {/* DIALOG HIỂN THỊ CHI TIẾT LỊCH HẸN*/}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-xl w-full max-h-[85vh] rounded-3xl bg-white shadow-2xl border-0 p-0 overflow-hidden flex flex-col [&>button]:hidden">
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-4 text-white relative overflow-hidden flex-shrink-0">
              <div className="absolute right-3 top-3 opacity-[0.06]">
                <FileText className="h-20 w-20 transform rotate-12" />
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute right-3 top-3 h-9 w-9 rounded-full flex items-center justify-center text-white/90 hover:bg-white/15 hover:text-white transition z-20"
              >
                <X className="h-5 w-5" />
              </button>
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
              <div className="flex-1 overflow-y-auto px-5 pt-3 pb-5 space-y-4 custom-scrollbar">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-gray-100"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                      <User className="inline h-3 w-3 mr-1 mb-0.5" /> Khách hàng
                    </span>
                    <span className="h-px flex-1 bg-gray-100"></span>
                  </div>
                  <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-blue-200">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shadow-sm text-base font-bold text-blue-700 border border-blue-200 flex-shrink-0">
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
                    <div className="bg-white rounded-xl p-3 border border-blue-200">
                      <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider block">
                        Thời gian hẹn
                      </span>
                      <p className="text-gray-900 font-bold text-sm mt-0.5 break-words">
                        {selectedApp.thoiGianHen
                          ? selectedApp.thoiGianHen
                              .split("-")
                              .reverse()
                              .join("/")
                          : ""}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-blue-200">
                      <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider block">
                        Dịch vụ
                      </span>
                      <p className="text-gray-900 font-bold text-sm mt-0.5 break-words">
                        {selectedApp.loaiDichVu}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">
                      Bác sĩ phụ trách
                    </span>
                    <span className="text-sm font-bold text-gray-900 truncate ml-2">
                      {selectedApp.bacSi?.hoTen || "Chưa phân công"}
                    </span>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-medium">
                      Trạng thái
                    </span>
                    <Badge
                      variant="outline"
                      className={`
                        px-3 py-1 text-xs font-bold border
                        ${
                          selectedApp.trangThai === "Đã lên lịch"
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : selectedApp.trangThai === "Đã xác nhận"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : selectedApp.trangThai === "Đã hủy"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-gray-50 text-gray-700 border-gray-100"
                        }
                      `}
                    >
                      {selectedApp.trangThai}
                    </Badge>
                  </div>
                  {selectedApp.ngayLap && (
                    <div className="bg-white rounded-xl p-3 border border-blue-200">
                      <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider block">
                        Thời gian lập
                      </span>
                      <p className="text-gray-900 font-semibold text-sm mt-0.5">
                        {new Date(selectedApp.ngayLap).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
