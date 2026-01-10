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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  MapPin,
  Phone,
  Clock,
  ArrowLeft,
  Calendar,
  Syringe,
  ShoppingBag,
  Loader2,
  ChevronRight,
  Sparkles,
  Search,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { branchAPI, appointmentAPI } from "../../api/services";
import { Pagination } from "../../components/ui/pagination";
import Header from "../../components/layout/header";
import { toast } from "../../lib/toast";

const serviceInfo = {
  exam: {
    title: "Đặt lịch khám bệnh",
    icon: Stethoscope,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
  },
  vaccination: {
    title: "Đặt lịch tiêm phòng",
    icon: Syringe,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700 shadow-green-100",
  },
  products: {
    title: "Xem sản phẩm",
    icon: ShoppingBag,
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    buttonColor: "bg-orange-600 hover:bg-orange-700 shadow-orange-100",
  },
};

export default function BranchesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const service = searchParams.get("service") || "exam";
  const currentService = serviceInfo[service] || serviceInfo.exam;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  const fetchBranches = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchAPI.getAll({
        page,
        limit: 6,
        service: service,
      });

      if (response.data && response.data.success) {
        setBranches(response.data.data.branches || []);
        setPagination(response.data.data.pagination || {});
      } else {
        setError("Không thể tải danh sách chi nhánh");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách chi nhánh:", error);
      setError(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tải danh sách chi nhánh"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(1);
  }, [service]);

  const handlePageChange = (newPage) => {
    fetchBranches(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ServiceIcon = currentService?.icon || Calendar;

  const checkIsOpen = (tgMoCua, tgDongCua) => {
    if (!tgMoCua || !tgDongCua) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      if (typeof timeStr === "string") {
        const parts = timeStr.split(":");
        if (parts.length >= 2)
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
      if (timeStr instanceof Date)
        return timeStr.getHours() * 60 + timeStr.getMinutes();
      if (timeStr.hours !== undefined)
        return timeStr.hours * 60 + (timeStr.minutes || 0);
      return null;
    };

    const openTime = parseTime(tgMoCua);
    const closeTime = parseTime(tgDongCua);
    if (openTime === null || closeTime === null) return false;

    if (openTime <= closeTime)
      return currentTime >= openTime && currentTime <= closeTime;
    return currentTime >= openTime || currentTime <= closeTime;
  };

  const handleBranchSelect = (branch) => {
    if (service === "products") {
      navigate(`/products-list?branch=${branch.MaChiNhanh}`);
    } else {
      setSelectedBranch(branch);
      setAppointmentDate("");
      setSelectedDoctor(null);
      setAvailableDoctors([]);
      setBookingStep(1);
      setIsDialogOpen(true);
    }
  };

  const fetchAvailableDoctors = async (date) => {
    if (!date || !selectedBranch) return;
    try {
      setLoadingDoctors(true);
      const loaiDichVu = service === "exam" ? "Khám bệnh" : "Tiêm phòng";
      const response = await appointmentAPI.getAvailableDoctors({
        MaChiNhanh: selectedBranch.MaChiNhanh,
        ThoiGianHen: date,
        LoaiDichVu: loaiDichVu,
      });

      if (response.data.success) {
        setAvailableDoctors(response.data.data.doctors || []);
        setSelectedDoctor(null);
      } else {
        setAvailableDoctors([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bác sĩ:", error);
      setAvailableDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setAppointmentDate(date);
    setSelectedDoctor(null);
    if (date) {
      fetchAvailableDoctors(date);
    } else {
      setAvailableDoctors([]);
    }
  };

  const handleCreateAppointment = async () => {
    if (appointmentDate && selectedBranch && selectedDoctor) {
      try {
        const loaiDichVu = service === "exam" ? "Khám bệnh" : "Tiêm phòng";
        const response = await appointmentAPI.create({
          MaChiNhanh: selectedBranch.MaChiNhanh,
          LoaiDichVu: loaiDichVu,
          ThoiGianHen: appointmentDate,
          BacSiPhuTrach: selectedDoctor.MaNhanVien,
        });

        if (response.data.success) {
          setIsDialogOpen(false);
          setAppointmentDate("");
          setSelectedDoctor(null);
          setAvailableDoctors([]);
          setBookingStep(1);
          navigate("/appointments?success=true");
        } else {
          toast.error(response.data.message || "Đặt lịch thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi đặt lịch:", error);
        toast.error(
          error.response?.data?.message ||
            "Đặt lịch thất bại. Vui lòng thử lại!"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Header */}
      <section
        className={`bg-gradient-to-br ${
          service === "exam"
            ? "from-blue-50"
            : service === "vaccination"
            ? "from-green-50"
            : "from-orange-50"
        } to-white border-b border-slate-100 py-12 lg:py-16 overflow-hidden relative`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-5 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link
                to="/customer"
                className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Quay lại trang chủ
              </Link>
              <div className="flex items-center gap-4">
                <div
                  className={`h-16 w-16 rounded-2xl ${currentService.bgColor} flex items-center justify-center shadow-sm`}
                >
                  <ServiceIcon
                    className={`h-8 w-8 ${currentService.textColor}`}
                  />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-none">
                    {service === "exam" ? (
                      <>
                        Đặt lịch{" "}
                        <span className="text-blue-600">khám bệnh</span>
                      </>
                    ) : service === "vaccination" ? (
                      <>
                        Đặt lịch{" "}
                        <span className="text-green-600">tiêm phòng</span>
                      </>
                    ) : (
                      <>
                        Xem <span className="text-orange-600">sản phẩm</span>
                      </>
                    )}
                  </h1>
                  <p className="text-slate-500 mt-2 font-medium">
                    {service === "products"
                      ? "Khám phá danh mục sản phẩm tại các chi nhánh"
                      : "Đặt lịch hẹn chăm sóc với các chuyên gia hàng đầu"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {error ? (
          <Card className="p-16 text-center border-dashed border-2 rounded-[2.5rem]">
            <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Đã xảy ra lỗi
            </h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">{error}</p>
            <Button
              onClick={() => fetchBranches(1)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl h-12"
            >
              Thử lại ngay
            </Button>
          </Card>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Đang tìm kiếm chi nhánh...
            </p>
          </div>
        ) : branches.length > 0 ? (
          <div className="space-y-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <Card
                  key={branch.MaChiNhanh}
                  className={`group shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[2.5rem] overflow-hidden flex flex-col border-2 ${
                    service === "exam"
                      ? "border-blue-200"
                      : service === "vaccination"
                      ? "border-green-200"
                      : "border-orange-200"
                  }`}
                >
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center transition-colors ${
                          service === "exam"
                            ? "group-hover:bg-blue-50"
                            : service === "vaccination"
                            ? "group-hover:bg-green-50"
                            : "group-hover:bg-orange-50"
                        }`}
                      >
                        <MapPin
                          className={`h-6 w-6 text-slate-400 transition-colors ${
                            service === "exam"
                              ? "group-hover:text-blue-600"
                              : service === "vaccination"
                              ? "group-hover:text-green-600"
                              : "group-hover:text-orange-600"
                          }`}
                        />
                      </div>
                      <Badge
                        variant="secondary"
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          checkIsOpen(branch.TGMoCua, branch.TGDongCua)
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                      >
                        {checkIsOpen(branch.TGMoCua, branch.TGDongCua)
                          ? "Đang mở cửa"
                          : "Hiện đóng cửa"}
                      </Badge>
                    </div>
                    <CardTitle
                      className={`text-2xl font-black text-slate-900 transition-colors ${
                        service === "exam"
                          ? "group-hover:text-blue-600"
                          : service === "vaccination"
                          ? "group-hover:text-green-600"
                          : "group-hover:text-orange-600"
                      }`}
                    >
                      {branch.TenChiNhanh}
                    </CardTitle>
                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-500 line-clamp-2">
                          {branch.DiaChi}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">
                          {branch.SDT}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-600">
                          {(() => {
                            const formatTime = (time) => {
                              if (!time) return "";
                              if (typeof time === "string")
                                return time.substring(0, 5);
                              if (time instanceof Date)
                                return time.toTimeString().substring(0, 5);
                              if (time.hours !== undefined)
                                return `${String(time.hours).padStart(
                                  2,
                                  "0"
                                )}:${String(time.minutes || 0).padStart(
                                  2,
                                  "0"
                                )}`;
                              return time.toString().substring(0, 5);
                            };
                            const openTime = formatTime(branch.TGMoCua);
                            const closeTime = formatTime(branch.TGDongCua);
                            return openTime && closeTime
                              ? `${openTime} - ${closeTime}`
                              : "Thông tin đang cập nhật";
                          })()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-auto mt-auto">
                    <Button
                      className={`w-full h-14 rounded-2xl text-white font-bold text-lg shadow-lg transition-all ${currentService.buttonColor}`}
                      onClick={() => handleBranchSelect(branch)}
                    >
                      {service === "products"
                        ? "Xem cửa hàng"
                        : "Chọn chi nhánh"}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

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
          <Card className="p-20 text-center border-dashed border-2 rounded-[3rem] bg-slate-50/50">
            <div className="h-20 w-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Không tìm thấy chi nhánh
            </h3>
            <p className="text-slate-500 mb-8 font-medium">
              Hiện tại không có chi nhánh nào hỗ trợ dịch vụ này.
            </p>
            <Link to="/customer">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-8">
                Quay về trang chủ
              </Button>
            </Link>
          </Card>
        )}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setBookingStep(1);
            setAppointmentDate("");
            setSelectedDoctor(null);
          }
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                Đặt lịch hẹn
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm mt-1 font-medium opacity-90">
                {bookingStep === 1
                  ? "Bước 1: Chọn thời gian khám phù hợp"
                  : "Bước 2: Chọn bác sĩ chuyên gia phụ trách"}
              </DialogDescription>
            </DialogHeader>

            {/* Step Indicator */}
            <div className="flex items-center gap-3 mt-6">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  bookingStep >= 1 ? "bg-white" : "bg-white/20"
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  bookingStep >= 2 ? "bg-white" : "bg-white/20"
                }`}
              />
            </div>
          </div>

          <div className="p-8 space-y-6 bg-white">
            {/* Active Step Content */}
            {bookingStep === 1 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {selectedBranch && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {selectedBranch.TenChiNhanh}
                      </p>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {selectedBranch.DiaChi}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label
                    htmlFor="date"
                    className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1"
                  >
                    Thời gian mong muốn
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    <Input
                      id="date"
                      type="date"
                      className="h-14 pl-12 rounded-2xl border-slate-200 focus:ring-blue-600 text-lg font-medium"
                      value={appointmentDate}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium px-1 italic">
                    * Vui lòng chọn ngày để xem danh sách bác sĩ rảnh.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-sm">
                      Ngày:{" "}
                      {appointmentDate ? (() => {
                        const parts = appointmentDate.split("-");
                        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                        return date.toLocaleDateString("vi-VN");
                      })() : ""}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBookingStep(1)}
                    className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-lg"
                  >
                    Thay đổi
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Chuyên gia phụ trách
                  </Label>

                  {loadingDoctors ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        Đang tìm bác sĩ rảnh...
                      </p>
                    </div>
                  ) : availableDoctors.length > 0 ? (
                    <div className="grid gap-3 max-h-72 overflow-y-auto pr-2 thin-scrollbar">
                      {availableDoctors.map((doctor) => {
                        const isAvailable = doctor.TrangThai === "Rảnh";
                        const isSelected =
                          selectedDoctor?.MaNhanVien === doctor.MaNhanVien;

                        const formatTime = (time) => {
                          if (!time) return "";
                          if (typeof time === "string") {
                            if (time.includes("T") && time.includes("Z")) {
                              const date = new Date(time);
                              return `${String(date.getUTCHours()).padStart(
                                2,
                                "0"
                              )}:${String(date.getUTCMinutes()).padStart(
                                2,
                                "0"
                              )}`;
                            }
                            return time;
                          }
                          if (time instanceof Date)
                            return `${String(time.getUTCHours()).padStart(
                              2,
                              "0"
                            )}:${String(time.getUTCMinutes()).padStart(
                              2,
                              "0"
                            )}`;
                          if (
                            time &&
                            typeof time === "object" &&
                            "hours" in time
                          )
                            return `${String(time.hours).padStart(
                              2,
                              "0"
                            )}:${String(time.minutes || 0).padStart(2, "0")}`;
                          return String(time);
                        };

                        return (
                          <div
                            key={doctor.MaNhanVien}
                            onClick={() =>
                              isAvailable && setSelectedDoctor(doctor)
                            }
                            className={`
                              p-4 rounded-2xl cursor-pointer transition-all border-2 flex items-center justify-between group
                              ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50/50"
                                  : isAvailable
                                  ? "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50"
                                  : "border-slate-50 bg-slate-50/50 opacity-50 cursor-not-allowed"
                              }
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                                  isSelected
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {doctor.HoTen.charAt(0)}
                              </div>
                              <div>
                                <p
                                  className={`font-bold text-sm ${
                                    isSelected
                                      ? "text-blue-700"
                                      : "text-slate-900"
                                  }`}
                                >
                                  {doctor.HoTen}
                                </p>
                                {doctor.GioLamViec && (
                                  <p className="text-[11px] text-slate-400 font-medium">
                                    Ca trực:{" "}
                                    {formatTime(doctor.GioLamViec.BatDau)} -{" "}
                                    {formatTime(doctor.GioLamViec.KetThuc)}
                                  </p>
                                )}
                              </div>
                            </div>

                            {isSelected ? (
                              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            ) : isAvailable ? (
                              <div className="h-6 w-6 rounded-full border-2 border-slate-200 group-hover:border-blue-300 transition-colors" />
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-slate-100 text-slate-400 text-[9px] uppercase font-bold"
                              >
                                Bận
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                      <Calendar className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                      <p className="font-bold text-xs uppercase tracking-wider">
                        Không có bác sĩ sẵn sàng
                      </p>
                      <p className="text-[10px] mt-1">
                        Vui lòng chọn ngày khác hoặc chi nhánh khác
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
            {bookingStep === 1 ? (
              <>
                <Button
                  variant="ghost"
                  className="h-12 px-6 rounded-xl text-slate-500 font-bold hover:bg-white"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-50 group"
                  onClick={() => setBookingStep(2)}
                  disabled={!appointmentDate}
                >
                  Tiếp theo
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="h-12 px-6 rounded-xl text-slate-500 font-bold hover:bg-white"
                  onClick={() => setBookingStep(1)}
                >
                  Quay lại
                </Button>
                <Button
                  className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-50"
                  onClick={handleCreateAppointment}
                  disabled={!selectedDoctor || loadingDoctors}
                >
                  Xác nhận đặt lịch
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .thin-scrollbar::-webkit-scrollbar { width: 4px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
