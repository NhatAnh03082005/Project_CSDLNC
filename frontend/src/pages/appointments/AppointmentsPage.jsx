import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Heart, ArrowLeft, Calendar, Clock, MapPin, User, X, Loader2, CheckCircle2 } from "lucide-react";
import { appointmentAPI } from "../../api/services";
import { Pagination } from "../../components/ui/pagination";

const serviceNames = {
  "Khám bệnh": "Khám bệnh",
  "Tiêm phòng": "Tiêm phòng",
};

const statusNames = {
  "Đã lên lịch": "Đã lên lịch",
  "Đã xác nhận": "Đã xác nhận",
  "Đã hủy": "Đã hủy",
  "Hoàn thành": "Hoàn thành",
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll({
        page,
        limit: 10,
      });

      if (response.data.success) {
        setAppointments(response.data.data.appointments || []);
        setPagination(response.data.data.pagination || {});
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchAppointments(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelAppointment = async () => {
    if (!cancellingId) return;

    try {
      const response = await appointmentAPI.cancel(cancellingId);
      if (response.data.success) {
        alert(response.data.message || "Hủy lịch hẹn thành công");
        fetchAppointments(pagination.page);
        setCancellingId(null);
        setCancellingAppointment(null);
      } else {
        alert(response.data.message || "Hủy lịch hẹn thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn:", error);
      const errorMessage = error.response?.data?.message || error.message || "Hủy lịch hẹn thất bại. Vui lòng thử lại!";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/customer" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/services" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Dịch vụ
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Sản phẩm
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Về chúng tôi
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link to="/customer">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Lịch hẹn của tôi</h1>
          <p className="text-gray-600">Quản lý các lịch hẹn khám bệnh và tiêm phòng</p>
        </div>

        {showSuccess && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">Đặt lịch thành công!</p>
                    <p className="text-sm text-green-700">
                      Lịch hẹn của bạn đã được tạo và đang chờ xác nhận từ chi nhánh.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-700 hover:text-green-900 hover:bg-green-100 flex-shrink-0"
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.delete("success");
                    navigate(`/appointments?${newSearchParams.toString()}`, { replace: true });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : appointments.length > 0 ? (
            <>
              {appointments.map((appointment) => {
                const isCompleted = appointment.TrangThai === "Hoàn thành";
                const isPending = appointment.TrangThai === "Đã lên lịch";
                const canCancel = isPending;

                return (
                  <Card key={appointment.MaLichHen} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl flex items-center gap-2">
                            {serviceNames[appointment.LoaiDichVu] || appointment.LoaiDichVu}
                            <Badge
                              variant={isCompleted ? "default" : "secondary"}
                              className={isCompleted ? "bg-green-600" : ""}
                            >
                              {statusNames[appointment.TrangThai] || appointment.TrangThai}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{appointment.TenChiNhanh}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">
                              {(() => {
                                const dateStr = appointment.ThoiGianHen;
                                let date;
                                if (typeof dateStr === 'string' && dateStr.includes('T')) {
                                  const dateOnly = dateStr.split('T')[0];
                                  const [year, month, day] = dateOnly.split('-');
                                  date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                } else if (typeof dateStr === 'string') {
                                  const [year, month, day] = dateStr.split('-');
                                  date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                } else {
                                  date = new Date(dateStr);
                                }
                                return date.toLocaleDateString("vi-VN", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              })()}
                            </span>
                          </div>
                          {appointment.TenBacSiPhuTrach && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">BS: {appointment.TenBacSiPhuTrach}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700 text-pretty">{appointment.DiaChiChiNhanh}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{appointment.SDTChiNhanh}</span>
                          </div>
                        </div>
                      </div>
                        {canCancel && appointment.TrangThai !== "Hoàn thành" && appointment.TrangThai !== "Đã hủy" && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            onClick={() => setCancellingId(appointment.MaLichHen)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Hủy lịch hẹn
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">Chưa có lịch hẹn nào</p>
                  <p className="text-gray-600">Đặt lịch hẹn ngay để chăm sóc thú cưng của bạn</p>
                </div>
                <Link to="/customer">
                  <Button className="mt-2">Đặt lịch ngay</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={!!cancellingId} onOpenChange={() => {
        setCancellingId(null);
        setCancellingAppointment(null);
      }}>
        <AlertDialogContent className="bg-white border-gray-300 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Xác nhận hủy lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-900 text-gray-900 hover:bg-gray-100 hover:border-gray-900 transition-colors">
              Không
            </AlertDialogCancel>
            <AlertDialogAction
              className="border border-red-600 bg-white text-red-600 hover:bg-red-50 hover:border-red-700 transition-colors shadow-sm"
              onClick={handleCancelAppointment}
            >
              Hủy lịch hẹn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}