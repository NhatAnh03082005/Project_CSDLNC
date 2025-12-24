import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Heart, User, FolderOpen, ClipboardPlus, Star, Plus, Trash2, Calendar, Gift, Clock } from "lucide-react";

// Mock data for registered packages
// Loại bỏ khai báo kiểu TypeScript: (typeof availablePackages)[0] | null
const registeredPackages = [
  {
    id: 1,
    name: "Gói tiêm phòng cơ bản cho chó",
    duration: "6 tháng",
    benefits: "Miễn phí tái khám 1 lần, giảm 10% chi phí khám bệnh",
    startDate: "01/01/2025",
    endDate: "01/07/2025",
  },
  {
    id: 2,
    name: "Gói tiêm phòng toàn diện cho mèo",
    duration: "12 tháng",
    benefits: "Miễn phí tái khám 3 lần, giảm 20% chi phí khám bệnh, tặng 1 lần tắm spa",
    startDate: "15/12/2024",
    endDate: "15/12/2025",
  },
];

// Mock data for available packages
const availablePackages = [
  {
    id: 3,
    name: "Gói tiêm phòng cơ bản cho chó",
    duration: "6 tháng",
    benefits: "Miễn phí tái khám 1 lần, giảm 10% chi phí khám bệnh",
  },
  {
    id: 4,
    name: "Gói tiêm phòng nâng cao cho chó",
    duration: "12 tháng",
    benefits: "Miễn phí tái khám 2 lần, giảm 15% chi phí khám bệnh",
  },
  {
    id: 5,
    name: "Gói tiêm phòng cơ bản cho mèo",
    duration: "6 tháng",
    benefits: "Miễn phí tái khám 1 lần, giảm 10% chi phí khám bệnh",
  },
  {
    id: 6,
    name: "Gói tiêm phòng toàn diện cho mèo",
    duration: "12 tháng",
    extra: "3 lần miễn phí tái khám, tặng 1 lần tắm spa",
    benefits: "Miễn phí tái khám 3 lần, giảm 20% chi phí khám bệnh, tặng 1 lần tắm spa",
  },
  {
    id: 7,
    name: "Gói tiêm phòng VIP cho thú cưng",
    duration: "12 tháng",
    benefits: "Miễn phí tái khám không giới hạn, giảm 30% chi phí khám bệnh, tặng gói chăm sóc spa trọn năm",
  },
];

export default function VaccinationPackagesPage() {
  // Loại bỏ khai báo kiểu TypeScript: (typeof registeredPackages)
  const [packages, setPackages] = useState(registeredPackages);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Loại bỏ khai báo kiểu TypeScript: (id: number)
  const handleDelete = (id) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  // Loại bỏ khai báo kiểu TypeScript: (pkg: (typeof availablePackages)[0])
  const handleRegister = (pkg) => {
    const newPackage = {
      id: pkg.id,
      name: pkg.name,
      duration: pkg.duration,
      benefits: pkg.benefits,
      startDate: new Date().toLocaleDateString("vi-VN"),
      // Tính toán ngày kết thúc (chỉ là ví dụ, không chính xác 6 tháng)
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
    };
    setPackages([...packages, newPackage]);
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Gói tiêm phòng của tôi</h1>
              <p className="text-gray-600">Quản lý các gói tiêm phòng đã đăng ký cho thú cưng của bạn</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Đăng ký gói mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Đăng ký gói tiêm phòng</DialogTitle>
                  <DialogDescription>Chọn gói tiêm phòng phù hợp cho thú cưng của bạn</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {availablePackages.map((pkg) => (
                    <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{pkg.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Thời hạn: {pkg.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{pkg.benefits}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRegister(pkg)}
                            disabled={packages.some((p) => p.id === pkg.id)}
                          >
                            {packages.some((p) => p.id === pkg.id) ? "Đã đăng ký" : "Đăng ký"}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {packages.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ClipboardPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có gói tiêm phòng nào</h3>
                <p className="text-gray-600 mb-6">
                  Đăng ký gói tiêm phòng để nhận ưu đãi và chăm sóc tốt hơn cho thú cưng
                </p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Đăng ký gói mới</Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{pkg.name}</CardTitle>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Đang hoạt động
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Thời hạn:</strong> {pkg.duration}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Ưu đãi:</strong> {pkg.benefits}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Thời gian:</strong> {pkg.startDate} - {pkg.endDate}
                              </span>
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(pkg.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}