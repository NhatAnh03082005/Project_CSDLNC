import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import {
  Heart,
  ArrowLeft,
  Calendar,
  Building2,
  Phone,
  MapPin,
  User,
  X,
  Loader2,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  History,
  Stethoscope,
  Syringe,
  Sparkles,
} from "lucide-react";
import { appointmentAPI } from "../../api/services";
import { Pagination } from "../../components/ui/pagination";

const serviceConfig = {
  "Khám bệnh": {
    label: "Khám bệnh",
    icon: Stethoscope,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  "Tiêm phòng": {
    label: "Tiêm phòng",
    icon: Syringe,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
};

const statusConfig = {
  "Đã lên lịch": {
    label: "Đã lên lịch",
    variant: "secondary",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "Đã xác nhận": {
    label: "Đã xác nhận",
    variant: "default",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  "Đã hủy": {
    label: "Đã hủy",
    variant: "destructive",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  "Hoàn thành": {
    label: "Hoàn thành",
    variant: "default",
    className: "bg-green-50 text-green-700 border-green-200",
  },
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showSuccess = searchParams.get("success") === "true";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
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
        fetchAppointments(pagination.page);
        setCancellingId(null);
      }
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn:", error);
      alert(
        error.response?.data?.message ||
          "Hủy lịch hẹn thất bại. Vui lòng thử lại!"
      );
    }
  };

  const formatDate = (dateStr) => {
    let date;
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      date = new Date(dateStr.split("T")[0]);
    } else {
      date = new Date(dateStr);
    }
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-[2.5rem] shadow-md p-8 border border-blue-100">
          <div className="flex items-center gap-4">
            <Link to="/customer">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors h-10 w-10 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Lịch hẹn của tôi
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi và quản lý các cuộc hẹn chăm sóc sức khỏe thú cưng của
                bạn
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {showSuccess && (
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative overflow-hidden bg-green-50 border border-green-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-green-100/50">
                <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-green-200/30 rounded-full blur-2xl" />
                <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-green-900 mb-1">
                    Đặt lịch thành công!
                  </h3>
                  <p className="text-green-700 font-medium">
                    Lịch hẹn của bạn đã được tiếp nhận và sẽ được xử lý sớm
                    nhất. Chúng tôi sẽ thông báo cho bạn ngay khi có cập nhật.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-green-700 hover:bg-green-100 rounded-full flex-shrink-0"
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.delete("success");
                    navigate(`/appointments?${newSearchParams.toString()}`, {
                      replace: true,
                    });
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                  <History className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <p className="text-blue-600 font-medium animate-pulse text-lg">
                  Đang tải danh sách lịch hẹn...
                </p>
              </div>
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {appointments.map((appointment, index) => {
                  const status = statusConfig[appointment.TrangThai] || {
                    label: appointment.TrangThai,
                    className: "",
                  };
                  const service = serviceConfig[appointment.LoaiDichVu] || {
                    label: appointment.LoaiDichVu,
                    icon: Calendar,
                    color: "text-slate-600",
                    bgColor: "bg-slate-50",
                  };
                  const ServiceIcon = service.icon;
                  const canCancel = appointment.TrangThai === "Đã lên lịch";

                  return (
                    <Card
                      key={appointment.MaLichHen}
                      className="group bg-white border border-sky-200 shadow-lg shadow-blue-50/50 hover:shadow-2xl transition-all duration-300 rounded-[1.75rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      {/* HEADER */}
                      <div className="relative px-5 pt-5 pb-3">
                        {/* Icon */}
                        <div className="absolute -top-3 left-5">
                          <div
                            className={`h-12 w-12 rounded-full ${service.color.replace(
                              "text",
                              "bg"
                            )} flex items-center justify-center shadow-md border-[3px] border-white group-hover:scale-105 transition-transform duration-300`}
                          >
                            <ServiceIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        {/* Title + Badge */}
                        <div className="flex items-start justify-between pt-5">
                          <div className="min-w-0">
                            <h3
                              className={`text-lg font-black ${service.color} uppercase tracking-tight leading-none`}
                            >
                              {service.label}
                            </h3>
                            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              ID: {appointment.MaLichHen}
                            </p>
                          </div>

                          <Badge
                            className={`shrink-0 px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider border shadow-sm ${status.className}`}
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                      {/* Divider */}
                      <div className="border-b border-dashed border-sky-200" />
                      {/* BODY */}
                      <div className="px-5 py-4 space-y-3">
                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="leading-tight">
                            <div className="text-sm font-bold text-slate-800">
                              {
                                formatDate(appointment.ThoiGianHen).split(
                                  ", "
                                )[1]
                              }
                            </div>
                            <div className="text-xs font-medium text-slate-500">
                              {
                                formatDate(appointment.ThoiGianHen).split(
                                  ", "
                                )[0]
                              }
                            </div>
                          </div>
                        </div>

                        {/* Info list */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-blue-500/70" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 line-clamp-1">
                              {appointment.TenBacSiPhuTrach ||
                                "Đang cập nhật..."}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center">
                              <Building2 className="h-3.5 w-3.5 text-red-400/70" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 line-clamp-1">
                              {appointment.TenChiNhanh}
                            </span>
                          </div>

                          <div className="flex items-start gap-2 mt-1">
                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center mt-0.5">
                              <MapPin className="h-3.5 w-3.5 text-emerald-500/70" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 line-clamp-2 leading-snug">
                              {appointment.DiaChiChiNhanh}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* FOOTER */}
                      {canCancel && (
                        <div className="px-5 pb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-10 rounded-xl text-xs font-bold
                 bg-white text-red-600 border border-red-600
                 hover:bg-red-600 hover:text-white
                 transition-all"
                            onClick={() =>
                              setCancellingId(appointment.MaLichHen)
                            }
                          >
                            <X className="h-3.5 w-3.5 mr-1.5" />
                            Hủy lịch hẹn
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })}

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center pt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-blue-200 space-y-6">
                <div className="p-6 bg-blue-50 rounded-full">
                  <History className="h-12 w-12 text-blue-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Chưa có lịch hẹn nào
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-sm">
                    Hãy đặt lịch ngay để người bạn nhỏ của bạn được chăm sóc bởi
                    đội ngũ bác sĩ tốt nhất.
                  </p>
                </div>
                <Link to="/customer">
                  <Button
                    variant="premium"
                    className="gap-2 rounded-2xl px-8 py-6 text-lg font-bold shadow-xl shadow-blue-100 transition-all hover:scale-105"
                  >
                    <Plus className="h-6 w-6" />
                    Đặt lịch chăm sóc ngay
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <AlertDialog
          open={!!cancellingId}
          onOpenChange={() => setCancellingId(null)}
        >
          <AlertDialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
            <div className="bg-gradient-to-br from-red-500 via-rose-500 to-red-600 p-8 pb-12 text-white text-center relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <AlertCircle className="h-24 w-24 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <AlertDialogTitle className="text-2xl font-black">
                  Hủy lịch hẹn?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-red-50 mt-2 font-medium">
                  Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy
                  lịch hẹn này không?
                </AlertDialogDescription>
              </div>

              {/* Decorative Wave Divider */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg
                  viewBox="0 0 1440 120"
                  className="w-full h-auto translate-y-[1px]"
                >
                  <path
                    fill="#ffffff"
                    fillOpacity="1"
                    d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="p-8 pt-4 bg-white flex flex-col sm:flex-row gap-4">
              <AlertDialogCancel className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                Giữ lịch hẹn
              </AlertDialogCancel>
              <AlertDialogAction
                className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
                onClick={handleCancelAppointment}
              >
                Xác nhận hủy
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      </div>
    </div>
  );
}
