import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Building2,
  Package,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  UserCog,
  ClipboardList,
  ShoppingCart,
  Activity,
  LogOut,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

export default function AdminDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            <Link to="/admin/demo">
              <Button variant="default" className="w-full justify-start gap-3">
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
              <Button variant="ghost" className="w-full justify-start gap-3">
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Quản trị
                </h1>
                <p className="text-gray-500 mt-1">
                  Tổng quan hệ thống và quản lý toàn bộ chi nhánh
                </p>
              </div>
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Tổng doanh thu</span>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">2.4 tỷ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+12.5%</span>
                    <span className="text-gray-500 ml-2">
                      so với tháng trước
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Khách hàng</span>
                    <Users className="h-4 w-4 text-green-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">10,234</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+8.2%</span>
                    <span className="text-gray-500 ml-2">khách hàng mới</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Lượt khám</span>
                    <Calendar className="h-4 w-4 text-orange-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">8,456</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">+15.3%</span>
                    <span className="text-gray-500 ml-2">tháng này</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center justify-between">
                    <span>Nhân viên</span>
                    <UserCog className="h-4 w-4 text-purple-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl">142</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600">10 chi nhánh</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
