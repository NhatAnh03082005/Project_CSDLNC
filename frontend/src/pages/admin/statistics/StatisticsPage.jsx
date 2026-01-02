import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Users,
  DollarSign,
  ShoppingBag,
  Syringe,
  Sparkles,
  UserCheck,
} from "lucide-react";

export default function StatisticsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="PetCare Logo"
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Thống kê hệ thống
                </h1>
                <p className="text-gray-600 mt-1">
                  Chọn loại thống kê bạn muốn xem
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Revenue Card */}
            <Card
              className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
              onClick={() => navigate("/admin/statistics/revenue")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">
                  Thống kê doanh thu
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Xem doanh thu theo thời gian của tất cả chi nhánh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border-blue-200"
                >
                  Xem thống kê
                </Button>
              </CardContent>
            </Card>

            {/* Product Card */}
            <Card
              className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50 cursor-pointer"
              onClick={() => navigate("/admin/statistics/product")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-sky-100 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-sky-600">
                  Thống kê sản phẩm
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thống kê sản phẩm bán chạy nhất và ít nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors border-sky-200"
                >
                  Xem thống kê
                </Button>
              </CardContent>
            </Card>

            {/* Vaccine Card */}
            <Card
              className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 cursor-pointer"
              onClick={() => navigate("/admin/statistics/vaccine")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-cyan-100 rounded-full">
                    <Syringe className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-cyan-600">
                  Thống kê loại vacxin
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thống kê vacxin được sử dụng nhiều nhất và ít nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-colors border-cyan-200"
                >
                  Xem thống kê
                </Button>
              </CardContent>
            </Card>

            {/* Service Card */}
            <Card
              className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
              onClick={() => navigate("/admin/statistics/service")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">
                  Thống kê dịch vụ
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thống kê dịch vụ được sử dụng nhiều nhất và ít nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border-blue-200"
                >
                  Xem thống kê
                </Button>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card
              className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50 cursor-pointer"
              onClick={() => navigate("/admin/statistics/customer")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-sky-100 rounded-full">
                    <Users className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-sky-600">
                  Thống kê khách hàng
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thống kê tổng số khách hàng, khách hàng mới, và lâu chưa quay
                  lại
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors border-sky-200"
                >
                  Xem thống kê
                </Button>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card
              className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 cursor-pointer"
              onClick={() => navigate("/admin/statistics/performance")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-cyan-100 rounded-full">
                    <UserCheck className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-cyan-600">
                  Thống kê hiệu suất nhân viên
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Xem hiệu suất làm việc của nhân viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-colors border-cyan-200"
                >
                  Xem thống kê
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
