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
  Menu,
  Bell,
  Settings,
  Shield,
  UserCog,
  ClipboardList,
  ShoppingCart,
  Activity,
  LogOut,
} from "lucide-react";

export default function AdminDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">PetCareX Admin</div>
              <div className="text-xs text-gray-500">Hệ thống quản trị</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 border-l pl-3">
              <div className="text-right">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-500">Quản trị viên</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

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
