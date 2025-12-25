import React from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Menu,
  Bell,
  LogOut,
  Home,
  Receipt,
  Stethoscope,
  Syringe,
  Clock,
  FilePlus,
} from "lucide-react";

// Xóa bỏ "use client"

export default function StaffDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
          <img src="/logo.png" alt="PetCare Logo" className="h-8 w-8 rounded-full object-cover"/>
            <div>
              <div className="font-semibold text-sm">PetCareX Staff</div>
              <div className="text-xs text-gray-500">Chi nhánh Quận 1</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <div className="flex items-center gap-3 border-l pl-3">
              <div className="text-right">
                <div className="text-sm font-medium">Nguyễn Văn A</div>
                <div className="text-xs text-gray-500">Nhân viên</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                NA
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {/* Sửa Link href -> to */}
            <Link to="/staff/demo">
              <Button variant="default" className="w-full justify-start gap-3">
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
            </Link>
            <Link to="/staff/create-record">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <FilePlus className="h-4 w-4" />
                Tạo hồ sơ
              </Button>
            </Link>
            <Link to="/staff/invoice">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Receipt className="h-4 w-4" />
                Lập hóa đơn
              </Button>
            </Link>
            <Link to="/staff/work-schedule">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Clock className="h-4 w-4" />
                Tra cứu lịch làm việc
              </Button>
            </Link>
            <Link to="/staff/medical-records">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Stethoscope className="h-4 w-4" />
                Cập nhật hồ sơ khám bệnh
              </Button>
            </Link>
            <Link to="/staff/vaccination-records">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Syringe className="h-4 w-4" />
                Cập nhật hồ sơ tiêm phòng
              </Button>
            </Link>
            <div className="pt-4 border-t">
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Nhân viên</h1>
              <p className="text-gray-500 mt-1">Quản lý lịch hẹn và tra cứu thông tin</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Hôm nay</CardDescription>
                  <CardTitle className="text-3xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">Lịch hẹn</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Đang chờ</CardDescription>
                  <CardTitle className="text-3xl text-orange-600">8</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">Chưa xác nhận</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Hoàn thành</CardDescription>
                  <CardTitle className="text-3xl text-green-600">12</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">Đã khám xong</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Hủy</CardDescription>
                  <CardTitle className="text-3xl text-red-600">4</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">Lịch hủy hôm nay</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content without Tabs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh sách lịch hẹn hôm nay</CardTitle>
                    <CardDescription>Quản lý và xác nhận lịch hẹn khách hàng</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Chọn ngày
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Appointment Item 1 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">09:00</div>
                          <div className="text-xs text-gray-500">30 phút</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Trần Thị B - Mèo Miu</h4>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              Chờ xác nhận
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Loại dịch vụ: Khám bệnh</div>
                            <div>Triệu chứng: Mèo kém ăn, uể oải 2 ngày</div>
                            <div className="text-xs text-gray-500 mt-1">SĐT: 0912345678</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Xác nhận
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Item 2 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">10:30</div>
                          <div className="text-xs text-gray-500">45 phút</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Lê Văn C - Chó Lulu</h4>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Đã xác nhận
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Loại dịch vụ: Tiêm phòng</div>
                            <div>Ghi chú: Tiêm vaccine 5 bệnh</div>
                            <div className="text-xs text-gray-500 mt-1">SĐT: 0987654321</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Item 3 */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-400">14:00</div>
                          <div className="text-xs text-gray-500">30 phút</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-500">Phạm Thị D - Chó Golden</h4>
                            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                              Đã hoàn thành
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            <div>Loại dịch vụ: Khám định kỳ</div>
                            <div>Đã khám xong lúc 14:25</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}