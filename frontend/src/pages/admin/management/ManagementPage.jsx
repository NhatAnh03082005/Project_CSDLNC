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
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="flex">
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            <Link to="/admin/demo">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link to="/admin/statistics">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Activity className="h-4 w-4" />
                Thống kê
              </Button>
            </Link>

            <Link to="/admin/management">
              <Button variant="default" className="w-full justify-start gap-3">
                <Users className="h-4 w-4" />
                Quản lý
              </Button>
            </Link>

            <div className="pt-4 border-t mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {selectedManagement ? (
              <ManagementDetail
                type={selectedManagement}
                onBack={() => setSelectedManagement(null)}
              />
            ) : (
              <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quản lý</h1>
                  <p className="text-gray-500 mt-1">
                    Chọn mục quản lý bạn muốn thao tác
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("branch")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý chi nhánh
                      </CardTitle>
                      <CardDescription>
                        Quản lý thông tin chi nhánh công ty
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-purple-100 hover:bg-purple-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("employee")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
                        <UserCog className="h-6 w-6 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý nhân viên
                      </CardTitle>
                      <CardDescription>
                        Thêm, sửa, xóa nhân viên trên toàn công ty
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("transfer")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                        <History className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Lịch sử điều động
                      </CardTitle>
                      <CardDescription>
                        Xem lịch sử điều chuyển công tác nhân viên
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("productsStock")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-sky-100 flex items-center justify-center mb-2">
                        <Package className="h-6 w-6 text-sky-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý kho sản phẩm
                      </CardTitle>
                      <CardDescription>
                        Quản lý tồn kho sản phẩm tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-sky-100 hover:bg-sky-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("product")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-2">
                        <ShoppingBag className="h-6 w-6 text-cyan-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý sản phẩm
                      </CardTitle>
                      <CardDescription>
                        Thêm, chỉnh sửa các sản phẩm bán tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-cyan-100 hover:bg-cyan-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("promotion")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                        <Tag className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý khuyến mãi
                      </CardTitle>
                      <CardDescription>
                        Thêm, chỉnh sửa các chương trình khuyến mãi
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-green-100 hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("vaccinesStock")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
                        <Package className="h-6 w-6 text-amber-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý kho vắc-xin
                      </CardTitle>
                      <CardDescription>
                        Quản lý tồn kho vắc-xin tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-amber-100 hover:bg-amber-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("vaccine")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                        <Syringe className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">Quản lý vắc-xin</CardTitle>
                      <CardDescription>
                        Quản lý các loại vắc-xin sử dụng trên hệ thống
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-orange-100 hover:bg-orange-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("service")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-red-600" />
                      </div>
                      <CardTitle className="text-lg">Quản lý dịch vụ</CardTitle>
                      <CardDescription>
                        Quản lý dịch vụ tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-red-100 hover:bg-red-600 hover:text-white transition-colors"
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
    </div>
  );
}
