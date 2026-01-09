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
} from "lucide-react";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDetail, setShowDetail] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
    fetchBranch();
  }, [selectedDate]);

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
      // Get appointments for doctor on selected date using appointmentAPI
      const response = await appointmentAPI.getToday(null, selectedDate);
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
      "Chờ xác nhận": {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800",
      },
      "Đã xác nhận": {
        label: "Đã xác nhận",
        color: "bg-blue-100 text-blue-800",
      },
      "Đã hoàn thành": {
        label: "Đã hoàn thành",
        color: "bg-green-100 text-green-800",
      },
      "Đã hủy": { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
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
            {/* Header */}
            <div className="mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Lịch hẹn của tôi
                </h1>
                <p className="text-gray-600 mt-1">
                  Xem danh sách lịch hẹn được gán cho bạn
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Bộ lọc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày khám
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tìm kiếm
                    </label>
                    <Input
                      placeholder="Tìm theo tên khách, thú cưng, SĐT..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error State */}
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6 flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading ? (
              <Card>
                <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </CardContent>
              </Card>
            ) : filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-lg">Không có lịch hẹn nào</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Chọn ngày khác hoặc kiểm tra bộ lọc
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((app) => {
                  const statusInfo = getStatusBadge(app.trangThai);
                  return (
                    <Card
                      key={app.maLichHen}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewDetail(app)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {app.tenKhachHang}
                              </h3>
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <PawPrint className="h-4 w-4 text-gray-400" />
                                <span>Thú cưng: {app.tenThucung}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{app.sdtKhachHang}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{app.gioHen}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{app.tenChiNhanh || "Chi nhánh"}</span>
                              </div>
                            </div>
                            {app.ghiChu && (
                              <div className="text-sm bg-gray-50 p-2 rounded border border-gray-200">
                                <p className="text-gray-700">
                                  <strong>Ghi chú:</strong> {app.ghiChu}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Dialog */}
          <Dialog open={showDetail} onOpenChange={setShowDetail}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
              </DialogHeader>
              {selectedApp && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khách hàng
                    </label>
                    <p className="text-gray-900">{selectedApp.tenKhachHang}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thú cưng
                    </label>
                    <p className="text-gray-900">{selectedApp.tenThucung}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <p className="text-gray-900">{selectedApp.sdtKhachHang}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ hẹn
                    </label>
                    <p className="text-gray-900">{selectedApp.gioHen}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <Badge
                      className={getStatusBadge(selectedApp.trangThai).color}
                    >
                      {getStatusBadge(selectedApp.trangThai).label}
                    </Badge>
                  </div>
                  {selectedApp.ghiChu && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                      </label>
                      <p className="text-gray-900">{selectedApp.ghiChu}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
