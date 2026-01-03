import React from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import {
  UserCog,
  Tag,
  Package,
  ShoppingBag,
  Syringe,
  Sparkles,
  MapPin,
  History,
} from "lucide-react";

export default function ManagementPage() {
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
                <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Quản lý hệ thống
                </h1>
                <p className="text-gray-600 mt-1">
                  Chọn mục quản lý bạn muốn thao tác
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card
              className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
              onClick={() => navigate("/admin/management/branch")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">
                  Quản lý chi nhánh
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quản lý thông tin chi nhánh công ty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border-blue-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50 cursor-pointer"
              onClick={() => navigate("/admin/management/employee")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-sky-100 rounded-full">
                    <UserCog className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-sky-600">
                  Quản lý nhân viên
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thêm, sửa, xóa nhân viên trên toàn công ty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors border-sky-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 cursor-pointer"
              onClick={() => navigate("/admin/management/transfer")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-cyan-100 rounded-full">
                    <History className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-cyan-600">
                  Lịch sử điều động
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Xem lịch sử điều chuyển công tác nhân viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-colors border-cyan-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
              onClick={() => navigate("/admin/management/products-stock")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">
                  Quản lý kho sản phẩm
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quản lý tồn kho sản phẩm tại các chi nhánh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border-blue-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50 cursor-pointer"
              onClick={() => navigate("/admin/management/product")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-sky-100 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-sky-600">
                  Quản lý sản phẩm
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thêm, chỉnh sửa các sản phẩm bán tại các chi nhánh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors border-sky-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 cursor-pointer"
              onClick={() => navigate("/admin/management/promotion")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-cyan-100 rounded-full">
                    <Tag className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-cyan-600">
                  Quản lý khuyến mãi
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Thêm, chỉnh sửa các chương trình khuyến mãi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-colors border-cyan-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
              onClick={() => navigate("/admin/management/vaccines-stock")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-blue-600">
                  Quản lý kho vắc-xin
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quản lý tồn kho vắc-xin tại các chi nhánh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors border-blue-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50 cursor-pointer"
              onClick={() => navigate("/admin/management/vaccine")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-sky-100 rounded-full">
                    <Syringe className="h-6 w-6 text-sky-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                  Quản lý vắc-xin
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quản lý các loại vắc-xin sử dụng trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors border-sky-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>

            <Card
              className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 cursor-pointer"
              onClick={() => navigate("/admin/management/service")}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-cyan-100 rounded-full">
                    <Sparkles className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-cyan-600">
                  Quản lý dịch vụ
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quản lý dịch vụ tại các chi nhánh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-cyan-100 text-cyan-600 hover:bg-cyan-600 hover:text-white transition-colors border-cyan-200"
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
