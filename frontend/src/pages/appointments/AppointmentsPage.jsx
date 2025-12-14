import React, { useState } from "react";
// Giữ lại các hooks của React Router DOM (đã chuyển đổi trước đó)
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom"; 

// 1. Chuyển đổi import alias (@/) sang đường dẫn tương đối (../../...)
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
import { Heart, ArrowLeft, Calendar, Clock, MapPin, User, X } from "lucide-react";

// Mock data (Giữ nguyên)
const branches = [
  { id: 1, name: "PetCare Quận 1", address: "123 Nguyễn Huệ, Quận 1, TP.HCM" },
  { id: 2, name: "PetCare Quận 3", address: "456 Võ Văn Tần, Quận 3, TP.HCM" },
  { id: 3, name: "PetCare Bình Thạnh", address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM" },
];

const mockAppointments = [
  {
    id: 1,
    branchId: 1,
    service: "exam",
    date: "2025-12-15",
    time: "09:00",
    petName: "Milo",
    status: "pending",
    createdAt: "2025-12-10",
  },
  {
    id: 2,
    branchId: 2,
    service: "vaccination",
    date: "2025-12-18",
    time: "14:30",
    petName: "Luna",
    status: "confirmed",
    createdAt: "2025-12-09",
  },
  {
    id: 3,
    branchId: 1,
    service: "exam",
    date: "2025-12-20",
    time: "10:00",
    petName: "Max",
    status: "pending",
    createdAt: "2025-12-11",
  },
];

const serviceNames = {
  exam: "Khám bệnh",
  vaccination: "Tiêm phòng",
  products: "Mua sản phẩm",
};

const statusNames = {
  pending: "Đang chờ xử lý",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
};

// 2. Component logic chính (Đổi tên thành AppointmentsPage)
export default function AppointmentsPage() {
  // Lấy giá trị từ URL Query (ví dụ: ?branch=1&service=exam&date=...)
  // Không cần useNavigate ở đây nếu nó không được sử dụng
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch");
  const service = searchParams.get("service");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [appointments, setAppointments] = useState(mockAppointments);
  // Loại bỏ khai báo kiểu TypeScript: useState<number | null>(null)
  const [cancellingId, setCancellingId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(!!date && !!time);

  const getBranchName = (id) => {
    return branches.find((b) => b.id === id)?.name || "Không xác định";
  };

  const getBranchAddress = (id) => {
    return branches.find((b) => b.id === id)?.address || "";
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
    setCancellingId(null);
  };

  // Logic thêm Appointment mới (chạy khi component render và có query params)
  // Logic này cần được chuyển vào useEffect HOẶC dùng cờ trạng thái (state flag) để tránh side effects
  // Tuy nhiên, vì code gốc đã dùng cờ trạng thái `showSuccessMessage` trong thân component, chúng ta giữ nguyên logic để tránh thay đổi lớn.
  if (showSuccessMessage && date && time && branchId) {
    const newAppointment = {
      id: Date.now(),
      branchId: Number.parseInt(branchId),
      service: service || "exam",
      date,
      time,
      petName: "Thú cưng của bạn",
      status: "pending", // Loại bỏ as const
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Kiểm tra trùng lặp
    const exists = appointments.some(
      (apt) => apt.branchId === newAppointment.branchId && apt.date === date && apt.time === time,
    );

    if (!exists) {
      setAppointments([newAppointment, ...appointments]);
    }
    // Đặt lại cờ để tránh lặp vô hạn
    setShowSuccessMessage(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Lịch hẹn của tôi</h1>
          <p className="text-gray-600">Quản lý các lịch hẹn khám bệnh và tiêm phòng</p>
        </div>

        {/* Success Message */}
        {date && time && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Đặt lịch thành công!</p>
                  <p className="text-sm text-green-700">
                    Lịch hẹn của bạn đã được tạo và đang chờ xác nhận từ chi nhánh.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => {
              const isConfirmed = appointment.status === "confirmed";
              const isPending = appointment.status === "pending";

              return (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {/* Loại bỏ khai báo kiểu TypeScript: as keyof typeof serviceNames */}
                          {serviceNames[appointment.service]} 
                          <Badge
                            variant={isConfirmed ? "default" : "secondary"}
                            className={isConfirmed ? "bg-green-600" : ""}
                          >
                            {/* Loại bỏ khai báo kiểu TypeScript: as keyof typeof statusNames */}
                            {statusNames[appointment.status]} 
                          </Badge>
                        </CardTitle>
                        <CardDescription>{getBranchName(appointment.branchId)}</CardDescription>
                      </div>
                      {isPending && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setCancellingId(appointment.id)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {new Date(appointment.date).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{appointment.time}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 text-pretty">{getBranchAddress(appointment.branchId)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{appointment.petName}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
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
                <Link to="/">
                  <Button className="mt-2">Đặt lịch ngay</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => cancellingId && handleCancelAppointment(cancellingId)}
            >
              Hủy lịch hẹn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}