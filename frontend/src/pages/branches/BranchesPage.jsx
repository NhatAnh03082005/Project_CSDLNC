import React, { useState } from "react";
// 1. Thay thế Next.js hooks bằng React Router DOM hooks
import { useNavigate, useSearchParams } from "react-router-dom";
// 2. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 3. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
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
import { Heart, MapPin, Phone, Clock, ArrowLeft, Calendar, Syringe, ShoppingBag } from "lucide-react";

// Mock data (Giữ nguyên)
const branches = [
  {
    id: 1,
    name: "PetCare Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    openTime: "08:00",
    closeTime: "20:00",
    services: ["exam", "vaccination", "products"],
  },
  {
    id: 2,
    name: "PetCare Quận 3",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    phone: "028 2345 6789",
    openTime: "08:00",
    closeTime: "20:00",
    services: ["exam", "vaccination", "products"],
  },
  {
    id: 3,
    name: "PetCare Bình Thạnh",
    address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    phone: "028 3456 7890",
    openTime: "08:00",
    closeTime: "19:00",
    services: ["exam", "vaccination"],
  },
  {
    id: 4,
    name: "PetCare Thủ Đức",
    address: "321 Võ Văn Ngân, Thủ Đức, TP.HCM",
    phone: "028 4567 8901",
    openTime: "09:00",
    closeTime: "20:00",
    services: ["exam", "vaccination", "products"],
  },
  {
    id: 5,
    name: "PetCare Gò Vấp",
    address: "654 Quang Trung, Gò Vấp, TP.HCM",
    phone: "028 5678 9012",
    openTime: "08:00",
    closeTime: "18:00",
    services: ["exam", "products"],
  },
];

const serviceInfo = {
  exam: {
    title: "Đặt lịch khám bệnh",
    icon: Calendar,
    color: "blue",
  },
  vaccination: {
    title: "Đặt lịch tiêm phòng",
    icon: Syringe,
    color: "green",
  },
  products: {
    title: "Xem sản phẩm",
    icon: ShoppingBag,
    color: "orange",
  },
};

// Đổi tên từ BranchesContent thành BranchesPage và Export mặc định
export default function BranchesPage() {
  // Thay thế useRouter bằng useNavigate
  const navigate = useNavigate();
  // Thay thế useSearchParams của Next.js
  const [searchParams] = useSearchParams();
  
  // Logic lấy service từ query params
  const service = searchParams.get("service") || "exam";
  // Loại bỏ khai báo kiểu TypeScript: as keyof typeof serviceInfo
  const currentService = serviceInfo[service] || serviceInfo.exam; 

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Loại bỏ khai báo kiểu TypeScript: useState<number | null>(null)
  const [selectedBranch, setSelectedBranch] = useState(null); 
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  // Filter branches that provide the selected service
  const filteredBranches = branches.filter((branch) => branch.services.includes(service));

  const ServiceIcon = currentService.icon;

  // Loại bỏ khai báo kiểu TypeScript: (branchId: number)
  const handleBranchSelect = (branchId) => {
    if (service === "products") {
      // Thay thế router.push bằng navigate()
      navigate(`/products-list?branch=${branchId}`);
    } else {
      setSelectedBranch(branchId);
      setIsDialogOpen(true);
    }
  };

  const handleCreateAppointment = () => {
    if (appointmentDate && appointmentTime && selectedBranch) {
      // Thay thế router.push bằng navigate()
      navigate(
        `/appointments?branch=${selectedBranch}&service=${service}&date=${appointmentDate}&time=${appointmentTime}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-12 w-12 rounded-full bg-${currentService.color}-100 flex items-center justify-center`}>
              <ServiceIcon className={`h-6 w-6 text-${currentService.color}-600`} />
            </div>
            <h1 className="text-3xl font-bold text-blue-900">{currentService.title}</h1>
          </div>
          <p className="text-gray-600 text-pretty">
            Chọn chi nhánh phù hợp để {service === "products" ? "xem sản phẩm" : "đặt lịch hẹn"}
          </p>
        </div>

        {/* Branches Grid */}
        {filteredBranches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <Card key={branch.id} className="hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-balance">{branch.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      Mở cửa
                    </Badge>
                  </CardTitle>
                  <CardDescription className="space-y-2 mt-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-pretty">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {branch.openTime} - {branch.closeTime}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => handleBranchSelect(branch.id)}>
                    {service === "products" ? "Xem sản phẩm" : "Chọn chi nhánh này"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">Không có chi nhánh nào cung cấp dịch vụ này hiện tại.</p>
            <Link to="/">
              <Button className="mt-4">Quay về trang chủ</Button>
            </Link>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập thời gian hẹn</DialogTitle>
            <DialogDescription>Vui lòng chọn ngày và giờ bạn muốn đặt lịch hẹn</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Ngày hẹn</Label>
              <Input
                id="date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Giờ hẹn</Label>
              <Input
                id="time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateAppointment} disabled={!appointmentDate || !appointmentTime}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Loại bỏ hoàn toàn wrapper Suspense bên ngoài.