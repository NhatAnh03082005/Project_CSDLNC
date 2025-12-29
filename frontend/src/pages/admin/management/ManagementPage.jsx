import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  BarChart3,
  Users,
  Activity,
  LogOut,
  UserCog,
  Tag,
  Package,
  ArrowLeft,
  ShoppingBag,
  Syringe,
  Sparkles,
  MapPin,
  History,
} from "lucide-react";

import ManagementDetail from "./ManagementDetail";

export default function ManagementPage() {
  const [selectedManagement, setSelectedManagement] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {selectedManagement ? (
            <ManagementDetail
              type={selectedManagement}
              onBack={() => setSelectedManagement(null)}
            />
          ) : (
            <>
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
                  className="border-t-4 border-t-purple-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50 cursor-pointer"
                  onClick={() => setSelectedManagement("branch")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      Quản lý chi nhánh
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quản lý thông tin chi nhánh công ty
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-purple-100 hover:bg-purple-600 hover:text-white transition-colors border-purple-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-indigo-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-indigo-50 cursor-pointer"
                  onClick={() => setSelectedManagement("employee")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <UserCog className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                      Quản lý nhân viên
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Thêm, sửa, xóa nhân viên trên toàn công ty
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors border-indigo-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
                  onClick={() => setSelectedManagement("transfer")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <History className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Lịch sử điều động
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Xem lịch sử điều chuyển công tác nhân viên
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors border-blue-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50 cursor-pointer"
                  onClick={() => setSelectedManagement("productsStock")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-sky-100 rounded-full">
                        <Package className="h-6 w-6 text-sky-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">
                      Quản lý kho sản phẩm
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quản lý tồn kho sản phẩm tại các chi nhánh
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-sky-100 hover:bg-sky-600 hover:text-white transition-colors border-sky-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50 cursor-pointer"
                  onClick={() => setSelectedManagement("product")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-cyan-100 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-cyan-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent">
                      Quản lý sản phẩm
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Thêm, chỉnh sửa các sản phẩm bán tại các chi nhánh
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-cyan-100 hover:bg-cyan-600 hover:text-white transition-colors border-cyan-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-green-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 cursor-pointer"
                  onClick={() => setSelectedManagement("promotion")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Tag className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      Quản lý khuyến mãi
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Thêm, chỉnh sửa các chương trình khuyến mãi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-green-100 hover:bg-green-600 hover:text-white transition-colors border-green-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-amber-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50 cursor-pointer"
                  onClick={() => setSelectedManagement("vaccinesStock")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-amber-100 rounded-full">
                        <Package className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                      Quản lý kho vắc-xin
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quản lý tồn kho vắc-xin tại các chi nhánh
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-amber-100 hover:bg-amber-600 hover:text-white transition-colors border-amber-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-orange-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-orange-50 cursor-pointer"
                  onClick={() => setSelectedManagement("vaccine")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Syringe className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Quản lý vắc-xin
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quản lý các loại vắc-xin sử dụng trên hệ thống
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-orange-100 hover:bg-orange-600 hover:text-white transition-colors border-orange-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="border-t-4 border-t-red-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-red-50 cursor-pointer"
                  onClick={() => setSelectedManagement("service")}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-3 bg-red-100 rounded-full">
                        <Sparkles className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                      Quản lý dịch vụ
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quản lý dịch vụ tại các chi nhánh
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full bg-red-100 hover:bg-red-600 hover:text-white transition-colors border-red-300"
                    >
                      Quản lý
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
