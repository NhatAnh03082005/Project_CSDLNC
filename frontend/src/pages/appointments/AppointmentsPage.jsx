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
  Clock,
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
    bgColor: "bg-blue-50"
  },
  "Tiêm phòng": {
    label: "Tiêm phòng",
    icon: Syringe,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
};

const statusConfig = {
  "Đã lên lịch": {
    label: "Đã lên lịch",
    variant: "secondary",
    className: "bg-blue-50 text-blue-700 border-blue-200"
  },
  "Đã xác nhận": {
    label: "Đã xác nhận",
    variant: "default",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  "Đã hủy": {
    label: "Đã hủy",
    variant: "destructive",
    className: "bg-red-50 text-red-700 border-red-200"
  },
  "Hoàn thành": {
    label: "Hoàn thành",
    variant: "default",
    className: "bg-green-50 text-green-700 border-green-200"
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
      alert(error.response?.data?.message || "Hủy lịch hẹn thất bại. Vui lòng thử lại!");
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
    <div className="min-h-screen bg-white">

      {/* Hero Header */}
      <section className="bg-slate-50 border-b border-slate-100 py-12 lg:py-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-5 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link to="/customer" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Quay lại trang chính
              </Link>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <History className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none">
                    Lịch hẹn của tôi
                  </h1>
                  <p className="text-slate-500 mt-2 font-medium">
                    Theo dõi và quản lý các cuộc hẹn chăm sóc sức khỏe thú cưng của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {showSuccess && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative overflow-hidden bg-green-50 border border-green-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-green-100/50">
              <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-green-200/30 rounded-full blur-2xl" />
              <div className="h-16 w-16 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-green-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-green-900 mb-1">Đặt lịch thành công!</h3>
                <p className="text-green-700 font-medium">Lịch hẹn của bạn đã được tiếp nhận và sẽ được xử lý sớm nhất. Chúng tôi sẽ thông báo cho bạn ngay khi có cập nhật.</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-green-700 hover:bg-green-100 rounded-full flex-shrink-0"
                onClick={() => {
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.delete("success");
                  navigate(`/appointments?${newSearchParams.toString()}`, { replace: true });
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
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải danh sách lịch hẹn...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid gap-6">
              {appointments.map((appointment, index) => {
                const status = statusConfig[appointment.TrangThai] || { label: appointment.TrangThai, className: "" };
                const service = serviceConfig[appointment.LoaiDichVu] || { label: appointment.LoaiDichVu, icon: Calendar, color: "text-slate-600", bgColor: "bg-slate-50" };
                const ServiceIcon = service.icon;
                const canCancel = appointment.TrangThai === "Đã lên lịch";

                return (
                  <Card
                    key={appointment.MaLichHen}
                    className="group border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="md:flex h-full">
                      <div className={`md:w-48 lg:w-56 ${service.bgColor} flex flex-col items-center justify-center p-8 border-r border-slate-50 transition-colors group-hover:bg-opacity-80`}>
                        <ServiceIcon className={`h-12 w-12 ${service.color} mb-4`} />
                        <span className={`text-sm font-black uppercase tracking-widest ${service.color}`}>
                          {service.label}
                        </span>
                      </div>
                      
                      <div className="flex-1 p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              Lịch hẹn #{appointment.MaLichHen}
                            </h3>
                            <div className="flex items-center gap-2">
                               <MapPin className="h-4 w-4 text-slate-400" />
                               <span className="text-sm font-bold text-slate-500">{appointment.TenChiNhanh}</span>
                            </div>
                          </div>
                          <Badge className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider border ${status.className}`}>
                            {status.label}
                          </Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Calendar className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Thời gian</p>
                                <p className="text-sm font-bold text-slate-700">{formatDate(appointment.ThoiGianHen)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Bác sĩ phụ trách</p>
                                <p className="text-sm font-bold text-slate-700">{appointment.TenBacSiPhuTrach || "Đang cập nhật..."}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Địa điểm</p>
                                <p className="text-sm font-bold text-slate-700 line-clamp-1">{appointment.DiaChiChiNhanh}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Thông tin liên hệ</p>
                                <p className="text-sm font-bold text-slate-700">{appointment.SDTChiNhanh}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {canCancel && (
                          <div className="flex justify-end pt-4 border-t border-slate-50 mt-4">
                            <Button
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 px-6 rounded-xl font-bold transition-all"
                              onClick={() => setCancellingId(appointment.MaLichHen)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Hủy lịch hẹn
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
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
            <Card className="p-20 text-center border-dashed border-2 rounded-[3.5rem] bg-slate-50/50">
              <div className="h-24 w-24 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                <Calendar className="h-12 w-12 text-blue-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Bạn chưa có lịch hẹn nào</h3>
              <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto">Hãy đặt lịch ngay để người bạn nhỏ của bạn được chăm sóc bởi đội ngũ bác sĩ tốt nhất.</p>
              <Link to="/customer">
                <Button className="h-14 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-black shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                  Đặt lịch chăm sóc ngay
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
        <AlertDialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="bg-gradient-to-br from-red-500 via-rose-500 to-red-600 p-8 pb-12 text-white text-center relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <AlertCircle className="h-24 w-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <AlertDialogTitle className="text-2xl font-black">Hủy lịch hẹn?</AlertDialogTitle>
              <AlertDialogDescription className="text-red-50 mt-2 font-medium">
                Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy lịch hẹn này không?
              </AlertDialogDescription>
            </div>
            
            {/* Decorative Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" className="w-full h-auto translate-y-[1px]">
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
  );
}

