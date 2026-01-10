import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { appointmentAPI, employeeAPI } from "../../../api/services";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  PawPrint,
  User,
  Loader2,
  AlertCircle,
  MapPin,
  Search,
  Stethoscope,
  Syringe,
  FileText,
  X,
} from "lucide-react";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch appointments on mount or when selectedDate/showAllAppointments changes
  useEffect(() => {
    fetchAppointments();
    fetchBranch();
  }, [selectedDate, showAllAppointments]);

  const fetchBranch = async () => {
    try {
      const response = await employeeAPI.getBranch();
      const data = response.data;
      if (data.success) setBranchName(data.data?.tenChiNhanh || "");
    } catch (err) {
      console.error("Error fetching branch:", err);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get appointments for doctor on selected date or all future appointments
      const dateParam = showAllAppointments ? null : selectedDate;
      const response = await appointmentAPI.getDoctorAppointments(dateParam);
      const data = response.data;
      if (data.success) {
        setAppointments(data.data?.appointments || []);
      } else {
        setError(data.message || "Không thể lấy danh sách lịch hẹn");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Lỗi khi lấy danh sách lịch hẹn"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (appointment) => {
    setSelectedApp(appointment);
    setShowDetail(true);
  };

  const filteredAppointments = appointments.filter(
    (app) =>
      (app.tenKhachHang &&
        app.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.tenThucung &&
        app.tenThucung.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.sdtKhachHang && app.sdtKhachHang.includes(searchTerm))
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      "Đã lên lịch": {
        label: "Đã lên lịch",
        color: "bg-blue-50 text-blue-700",
      },
      "Chờ xác nhận": {
        label: "Chờ xác nhận",
        color: "bg-yellow-50 text-yellow-700",
      },
      "Đã xác nhận": {
        label: "Đã xác nhận",
        color: "bg-green-50 text-green-700",
      },
      "Hoàn thành": {
        label: "Hoàn thành",
        color: "bg-green-50 text-green-700",
      },
      "Đã hoàn thành": {
        label: "Đã hoàn thành",
        color: "bg-blue-50 text-blue-700",
      },
      "Đã hủy": { label: "Đã hủy", color: "bg-red-50 text-red-700" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-50 text-gray-700" }
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans selection:bg-blue-100">
      <StaffHeader
        branchName={branchName}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="flex max-w-[1920px] mx-auto">
        <StaffSidebar />

        <main className="flex-1 p-8 min-w-0 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600">
                Lịch hẹn của bác sĩ
              </h1>
              <p className="text-gray-600 mt-1">
                Tra cứu lịch sử lịch hẹn của bác sĩ
              </p>
            </div>
            {/* Main Card */}
            <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
              <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                      <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
                      Lịch hẹn của tôi
                    </CardTitle>
                    <CardDescription className="mt-1 text-base text-gray-500 font-medium flex items-center gap-2">
                      {showAllAppointments ? (
                        <>
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>
                            Từ hôm nay trở đi{" "}
                            {!loading && appointments.length > 0 && (
                              <span>({appointments.length} lịch hẹn)</span>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            Ngày{" "}
                            {!loading &&
                              appointments.length > 0 &&
                              selectedDate && (
                                <span>
                                  {new Date(selectedDate).toLocaleDateString(
                                    "vi-VN"
                                  )}{" "}
                                  ({appointments.length} lịch hẹn)
                                </span>
                              )}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Date Picker */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <Input
                        type="date"
                        className="w-full sm:w-[180px] pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setShowAllAppointments(false);
                        }}
                        disabled={showAllAppointments}
                      />
                    </div>
                    {/* View All Button */}
                    <Button
                      variant={showAllAppointments ? "default" : "outline"}
                      className={`h-11 px-4 rounded-xl transition-all font-medium ${
                        showAllAppointments
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                      }`}
                      onClick={() => {
                        setShowAllAppointments(!showAllAppointments);
                        if (!showAllAppointments) {
                          setSelectedDate(today);
                        }
                      }}
                    >
                      {showAllAppointments ? (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Xem tất cả
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Xem tất cả
                        </>
                      )}
                    </Button>
                    {/* Search Input */}
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
              <CardContent className="p-0 bg-gray-50/50 h-[335px] overflow-y-auto">
                {/* Error State */}
                {error && (
                  <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2 p-4">
                  {/* Loading State */}
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      <p className="text-gray-600 mt-3">Đang tải dữ liệu...</p>
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
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
                          setSelectedDate(today);
                          setShowAllAppointments(false);
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
                      {filteredAppointments.map((app) => {
                        const statusInfo = getStatusBadge(app.trangThai);
                        return (
                          <div
                            key={app.maLichHen}
                            onClick={() => handleViewDetail(app)}
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
                                      : app.gioHen}
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
                                {app.tenThucung && (
                                  <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                                    <PawPrint className="h-3 w-3" />
                                    {app.tenThucung}
                                  </p>
                                )}
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
                                        {app.loaiDichVu || "Khám bệnh"}
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
                                    ${statusInfo.color}
                                  `}
                                >
                                  {statusInfo.label}
                                </Badge>
                              </div>
                            </div>

                            {/* Ghi chú nếu có */}
                            {app.ghiChu && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-600">
                                  <strong className="text-gray-700">
                                    Ghi chú:
                                  </strong>{" "}
                                  {app.ghiChu}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Dialog */}
          <Dialog open={showDetail} onOpenChange={setShowDetail}>
            <DialogContent className="max-w-xl w-full max-h-[85vh] rounded-3xl bg-white shadow-2xl border-0 p-0 overflow-hidden flex flex-col [&>button]:hidden">
              <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-4 text-white relative overflow-hidden flex-shrink-0">
                <div className="absolute right-3 top-3 opacity-[0.06]">
                  <FileText className="h-20 w-20 transform rotate-12" />
                </div>
                <button
                  onClick={() => setShowDetail(false)}
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
                        <User className="inline h-3 w-3 mr-1 mb-0.5" /> Khách
                        hàng
                      </span>
                      <span className="h-px flex-1 bg-gray-100"></span>
                    </div>
                    <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-blue-200">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shadow-sm text-base font-bold text-blue-700 border border-blue-200 flex-shrink-0">
                        {selectedApp.tenKhachHang?.charAt(0) || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-base leading-tight truncate">
                          {selectedApp.tenKhachHang}
                        </p>
                        <p className="text-gray-500 text-xs font-medium mt-0.5">
                          {selectedApp.sdtKhachHang}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-px flex-1 bg-gray-100"></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                        <Calendar className="inline h-3 w-3 mr-1 mb-0.5" />{" "}
                        Thông tin
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
                          {selectedApp.gioHen && ` - ${selectedApp.gioHen}`}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-blue-200">
                        <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider block">
                          Dịch vụ
                        </span>
                        <p className="text-gray-900 font-bold text-sm mt-0.5 break-words">
                          {selectedApp.loaiDichVu || "Không có"}
                        </p>
                      </div>
                    </div>
                    {selectedApp.tenThucung && (
                      <div className="bg-white border border-blue-200 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-sm text-slate-600 font-medium">
                          Thú cưng
                        </span>
                        <span className="text-sm font-bold text-gray-900 truncate ml-2">
                          {selectedApp.tenThucung}
                        </span>
                      </div>
                    )}
                    <div className="bg-white border border-blue-200 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">
                        Trạng thái
                      </span>
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 text-xs font-bold border ${
                          selectedApp.trangThai === "Đã lên lịch"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : selectedApp.trangThai === "Đã xác nhận"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : selectedApp.trangThai === "Hoàn thành" ||
                              selectedApp.trangThai === "Đã hoàn thành"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : selectedApp.trangThai === "Đã hủy"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-gray-50 text-gray-700 border-gray-100"
                        }`}
                      >
                        {getStatusBadge(selectedApp.trangThai).label}
                      </Badge>
                    </div>
                    {selectedApp.ghiChu && (
                      <div className="bg-white rounded-xl p-3 border border-blue-200">
                        <span className="text-[9px] uppercase font-bold text-blue-500 tracking-wider block">
                          Ghi chú
                        </span>
                        <p className="text-gray-900 font-semibold text-sm mt-0.5">
                          {selectedApp.ghiChu}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
