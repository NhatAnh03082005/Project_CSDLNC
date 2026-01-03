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
} from "lucide-react";
import { branchAPI, appointmentAPI } from "../../api/services";
import { Pagination } from "../../components/ui/pagination";
import Header from "../../components/layout/header";

const serviceInfo = {
  exam: {
    title: "Đặt lịch khám bệnh",
    icon: Calendar,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  vaccination: {
    title: "Đặt lịch tiêm phòng",
    icon: Syringe,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  products: {
    title: "Xem sản phẩm",
    icon: ShoppingBag,
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
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
  const [appointmentTime, setAppointmentTime] = useState("");
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

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

  const filteredBranches = branches;

  const ServiceIcon = currentService?.icon || Calendar;

  // Hàm tính toán trạng thái mở/đóng cửa dựa trên thời gian thực
  const checkIsOpen = (tgMoCua, tgDongCua) => {
    if (!tgMoCua || !tgDongCua) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Phút trong ngày

    // Parse giờ mở cửa và đóng cửa
    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      // Nếu là string dạng "HH:MM"
      if (typeof timeStr === "string") {
        const parts = timeStr.split(":");
        if (parts.length === 2) {
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      }
      // Nếu là Date object
      if (timeStr instanceof Date) {
        return timeStr.getHours() * 60 + timeStr.getMinutes();
      }
      // Nếu là object có hours và minutes
      if (timeStr.hours !== undefined) {
        return timeStr.hours * 60 + (timeStr.minutes || 0);
      }
      return null;
    };

    const openTime = parseTime(tgMoCua);
    const closeTime = parseTime(tgDongCua);

    if (openTime === null || closeTime === null) return false;

    // Nếu giờ mở cửa <= giờ đóng cửa (ví dụ: 08:00 - 21:00)
    if (openTime <= closeTime) {
      return currentTime >= openTime && currentTime <= closeTime;
    }
    // Nếu giờ mở cửa > giờ đóng cửa (qua đêm, ví dụ: 22:00 - 06:00)
    else {
      return currentTime >= openTime || currentTime <= closeTime;
    }
  };

  const handleBranchSelect = (branch) => {
    if (service === "products") {
      navigate(`/products-list?branch=${branch.MaChiNhanh}`);
    } else {
      setSelectedBranch(branch);
      setAppointmentDate("");
      setAppointmentTime("");
      setSelectedDoctor(null);
      setAvailableDoctors([]);
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
        const doctors = response.data.data.doctors || [];
        setAvailableDoctors(doctors);
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
          setAppointmentTime("");
          setSelectedDoctor(null);
          setAvailableDoctors([]);
          navigate("/appointments?success=true");
        } else {
          alert(response.data.message || "Đặt lịch thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi đặt lịch:", error);
        alert(
          error.response?.data?.message ||
            "Đặt lịch thất bại. Vui lòng thử lại!"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/customer">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`h-12 w-12 rounded-full ${
                currentService?.bgColor || "bg-blue-100"
              } flex items-center justify-center`}
            >
              {ServiceIcon && (
                <ServiceIcon
                  className={`h-6 w-6 ${
                    currentService?.textColor || "text-blue-600"
                  }`}
                />
              )}
            </div>
            <h1 className="text-3xl font-bold text-blue-900">
              {currentService?.title || "Đặt lịch"}
            </h1>
          </div>
          <p className="text-gray-600 text-pretty">
            Chọn chi nhánh phù hợp để{" "}
            {service === "products" ? "xem sản phẩm" : "đặt lịch hẹn"}
          </p>
        </div>

        {error ? (
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button onClick={() => fetchBranches(1)}>Thử lại</Button>
          </Card>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredBranches.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map((branch) => (
                <Card
                  key={branch.MaChiNhanh}
                  className="hover:shadow-lg transition-all hover:scale-105"
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-balance">{branch.TenChiNhanh}</span>
                      <Badge
                        variant="secondary"
                        className={
                          checkIsOpen(branch.TGMoCua, branch.TGDongCua)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {checkIsOpen(branch.TGMoCua, branch.TGDongCua)
                          ? "Mở cửa"
                          : "Đóng cửa"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="space-y-2 mt-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-pretty">
                          {branch.DiaChi}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{branch.SDT}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {(() => {
                            const formatTime = (time) => {
                              if (!time) return "";
                              if (typeof time === "string") {
                                return time.substring(0, 5);
                              }
                              if (time instanceof Date) {
                                return time.toTimeString().substring(0, 5);
                              }
                              if (time.hours !== undefined) {
                                return `${String(time.hours).padStart(
                                  2,
                                  "0"
                                )}:${String(time.minutes || 0).padStart(
                                  2,
                                  "0"
                                )}`;
                              }
                              return time.toString().substring(0, 5);
                            };

                            const openTime = formatTime(branch.TGMoCua);
                            const closeTime = formatTime(branch.TGDongCua);

                            return openTime && closeTime
                              ? `${openTime} - ${closeTime}`
                              : "-";
                          })()}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-black text-white hover:bg-blue-800"
                      onClick={() => handleBranchSelect(branch)}
                    >
                      {service === "products"
                        ? "Xem sản phẩm"
                        : "Chọn chi nhánh này"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

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
            <p className="text-gray-600 text-lg">
              Không có chi nhánh nào cung cấp dịch vụ này hiện tại.
            </p>
            <Link to="/customer">
              <Button className="mt-4">Quay về trang chủ</Button>
            </Link>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Đặt lịch hẹn</DialogTitle>
            <DialogDescription>
              Vui lòng chọn ngày và bác sĩ bạn muốn đặt lịch hẹn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBranch && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-900">
                  {selectedBranch.TenChiNhanh}
                </p>
                <p className="text-sm text-gray-600">{selectedBranch.DiaChi}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date">Ngày hẹn *</Label>
              <Input
                id="date"
                type="date"
                value={appointmentDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {appointmentDate && (
              <div className="space-y-2">
                <Label>Chọn bác sĩ *</Label>
                {loadingDoctors ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : availableDoctors.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableDoctors.map((doctor) => {
                      const isAvailable = doctor.TrangThai === "Rảnh";
                      const hasSchedule =
                        doctor.CoLichLamViec || doctor.GioLamViec !== null;

                      const formatTime = (time) => {
                        if (!time) return "";

                        if (typeof time === "string") {
                          if (time.includes("T") && time.includes("Z")) {
                            const date = new Date(time);
                            const hours = date.getUTCHours();
                            const minutes = date.getUTCMinutes();
                            return `${String(hours).padStart(2, "0")}:${String(
                              minutes
                            ).padStart(2, "0")}`;
                          }
                          return time;
                        }

                        if (time instanceof Date) {
                          const hours = time.getUTCHours();
                          const minutes = time.getUTCMinutes();
                          return `${String(hours).padStart(2, "0")}:${String(
                            minutes
                          ).padStart(2, "0")}`;
                        }

                        if (
                          time &&
                          typeof time === "object" &&
                          "hours" in time
                        ) {
                          return `${String(time.hours).padStart(
                            2,
                            "0"
                          )}:${String(time.minutes || 0).padStart(2, "0")}`;
                        }

                        return String(time);
                      };

                      return (
                        <div
                          key={doctor.MaNhanVien}
                          onClick={() =>
                            isAvailable && setSelectedDoctor(doctor)
                          }
                          className={`
                            p-3 border rounded-lg cursor-pointer transition-all
                            ${
                              selectedDoctor?.MaNhanVien === doctor.MaNhanVien
                                ? "border-blue-500 bg-blue-50"
                                : isAvailable
                                ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {doctor.HoTen}
                              </p>
                              {doctor.GioLamViec && (
                                <p className="text-sm text-gray-600">
                                  Giờ làm việc:{" "}
                                  {formatTime(doctor.GioLamViec.BatDau)} -{" "}
                                  {formatTime(doctor.GioLamViec.KetThuc)}
                                </p>
                              )}
                              {!doctor.GioLamViec && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Chưa có lịch làm việc
                                </p>
                              )}
                              {!isAvailable && hasSchedule && (
                                <p className="text-xs text-orange-600 mt-1">
                                  {doctor.TrangThai === "Đã đầy"
                                    ? "Đã đầy lịch"
                                    : "Không thể đặt lịch"}
                                </p>
                              )}
                            </div>
                            <div className="ml-4">
                              {selectedDoctor?.MaNhanVien ===
                              doctor.MaNhanVien ? (
                                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              ) : isAvailable ? (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-200 text-gray-600"
                                >
                                  {doctor.TrangThai}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 border border-gray-200 rounded-lg">
                    <p>Không có bác sĩ rảnh vào ngày này</p>
                    <p className="text-sm mt-1">Vui lòng chọn ngày khác</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setAppointmentDate("");
                setAppointmentTime("");
                setSelectedDoctor(null);
                setAvailableDoctors([]);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateAppointment}
              disabled={!appointmentDate || !selectedDoctor || loadingDoctors}
            >
              Xác nhận đặt lịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
