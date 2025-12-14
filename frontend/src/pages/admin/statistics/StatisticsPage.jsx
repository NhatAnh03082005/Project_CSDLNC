import React, { useState } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
// Import Icons
import {
  BarChart3,
  Users,
  Menu,
  Bell,
  Settings,
  Shield,
  Activity,
  LogOut,
  DollarSign,
  Syringe,
  ClipboardList,
  UserCheck,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom"; // Giữ Link của React Router DOM

// ======================================================================
// 1. COMPONENT CHÍNH: StatisticsPage
// ======================================================================
export default function StatisticsPage() {
  // Loại bỏ khai báo kiểu TypeScript: useState<string | null>(null)
  const [selectedStat, setSelectedStat] = useState(null);

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
              <div className="font-bold text-sm">PetCare Admin</div>
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
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/statistics">
              <Button variant="default" className="w-full justify-start gap-3">
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
            {selectedStat ? (
              <StatisticsDetail
                type={selectedStat}
                onBack={() => setSelectedStat(null)}
              />
            ) : (
              <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Thống kê</h1>
                  <p className="text-gray-500 mt-1">
                    Chọn loại thống kê bạn muốn xem
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Revenue Card */}
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStat("revenue")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Thống kê doanh thu
                      </CardTitle>
                      <CardDescription>
                        Xem doanh thu theo thời gian và chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Vaccine Card */}
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStat("vaccine")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                        <Syringe className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Thống kê loại vacxin
                      </CardTitle>
                      <CardDescription>
                        Thống kê vacxin được sử dụng nhiều nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Service Card */}
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStat("service")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                        <ClipboardList className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Thống kê dịch vụ
                      </CardTitle>
                      <CardDescription>
                        Thống kê dịch vụ được sử dụng nhiều nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Customer Card */}
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStat("customer")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Thống kê khách hàng
                      </CardTitle>
                      <CardDescription>
                        Thống kê khách hàng mới, cũ và lâu chưa quay lại
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Performance Card */}
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStat("performance")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center mb-2">
                        <UserCheck className="h-6 w-6 text-pink-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Thống kê hiệu suất nhân viên
                      </CardTitle>
                      <CardDescription>
                        Xem KPI và hiệu suất làm việc của nhân viên
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Xem thống kê
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

// ======================================================================
// 2. COMPONENT CON: StatisticsDetail
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function StatisticsDetail({ type, onBack }) {
  // Loại bỏ khai báo kiểu TypeScript: useState("month") và useState("1")
  const [timeUnit, setTimeUnit] = useState("month");
  const [timeValue, setTimeValue] = useState("1");

  const getTitleByType = () => {
    switch (type) {
      case "revenue":
        return "Thống kê doanh thu";
      case "vaccine":
        return "Thống kê loại vacxin";
      case "service":
        return "Thống kê dịch vụ";
      case "customer":
        return "Thống kê khách hàng";
      case "performance":
        return "Thống kê hiệu suất nhân viên";
      default:
        return "Thống kê";
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getTitleByType()}
          </h1>
          <p className="text-gray-500 mt-1">
            Xem chi tiết thống kê theo các tiêu chí
          </p>
        </div>
      </div>

      {type !== "customer" && type !== "performance" && (
        <Card>
          <CardHeader>
            <CardTitle>Chọn thời gian thống kê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Đơn vị thời gian
                </label>
                {/* Đảm bảo các select sử dụng class styling đã được định nghĩa trong Input/UI */}
                <select
                  className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <option value="month">Tháng</option>
                  <option value="quarter">Quý</option>
                  <option value="year">Năm</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Số lượng
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conditional Rendering of Specific Stats Components */}
      {type === "revenue" && (
        <RevenueStats timeUnit={timeUnit} timeValue={timeValue} />
      )}
      {type === "vaccine" && (
        <VaccineStats timeUnit={timeUnit} timeValue={timeValue} />
      )}
      {type === "service" && (
        <ServiceStats timeUnit={timeUnit} timeValue={timeValue} />
      )}
      {type === "customer" && <CustomerStats />}
      {type === "performance" && <PerformanceStats />}
    </>
  );
}

// ======================================================================
// 3. COMPONENT CON: RevenueStats
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function RevenueStats({ timeUnit, timeValue }) {
  const branches = [
    {
      name: "PetCare Quận 1",
      revenue: 285000000,
      address: "123 Nguyễn Huệ, Quận 1",
    },
    {
      name: "PetCare Quận 3",
      revenue: 267000000,
      address: "456 Võ Văn Tần, Quận 3",
    },
    {
      name: "PetCare Bình Thạnh",
      revenue: 245000000,
      address: "789 Xô Viết Nghệ Tĩnh",
    },
    { name: "PetCare Thủ Đức", revenue: 228000000, address: "321 Võ Văn Ngân" },
    { name: "PetCare Gò Vấp", revenue: 215000000, address: "654 Quang Trung" },
    { name: "PetCare Tân Bình", revenue: 198000000, address: "147 Cộng Hòa" },
    {
      name: "PetCare Phú Nhuận",
      revenue: 187000000,
      address: "258 Phan Xích Long",
    },
    {
      name: "PetCare Quận 7",
      revenue: 176000000,
      address: "369 Nguyễn Văn Linh",
    },
    {
      name: "PetCare Quận 10",
      revenue: 165000000,
      address: "741 Ba Tháng Hai",
    },
    {
      name: "PetCare Bình Tân",
      revenue: 154000000,
      address: "852 Lê Văn Quới",
    },
  ];

  const highestRevenue = branches[0];

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Chi nhánh doanh thu cao nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">
              {highestRevenue.revenue.toLocaleString("vi-VN")} ₫
            </div>
            <div className="text-lg font-semibold">{highestRevenue.name}</div>
            <div className="text-sm text-gray-500">
              {highestRevenue.address}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu 10 chi nhánh</CardTitle>
          <CardDescription>
            Thống kê {timeValue}{" "}
            {timeUnit === "month"
              ? "tháng"
              : timeUnit === "quarter"
              ? "quý"
              : "năm"}{" "}
            gần nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <div className="font-semibold">{branch.name}</div>
                  <div className="text-sm text-gray-500">{branch.address}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {branch.revenue.toLocaleString("vi-VN")} ₫
                  </div>
                  <div className="text-xs text-gray-500">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ======================================================================
// 4. COMPONENT CON: VaccineStats
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function VaccineStats({ timeUnit, timeValue }) {
  const branches = [
    {
      name: "PetCare Quận 1",
      mostUsed: "Nobivac DHPPi",
      count: 245,
      leastUsed: "Vaccine Lepto",
      leastCount: 12,
    },
    {
      name: "PetCare Quận 3",
      mostUsed: "Nobivac DHPPi",
      count: 228,
      leastUsed: "Vaccine Giardia",
      leastCount: 15,
    },
    {
      name: "PetCare Bình Thạnh",
      mostUsed: "Vaccine 5 bệnh",
      count: 215,
      leastUsed: "Vaccine Corona",
      leastCount: 18,
    },
    {
      name: "PetCare Thủ Đức",
      mostUsed: "Nobivac DHPPi",
      count: 198,
      leastUsed: "Vaccine Lepto",
      leastCount: 10,
    },
    {
      name: "PetCare Gò Vấp",
      mostUsed: "Vaccine 5 bệnh",
      count: 187,
      leastUsed: "Vaccine Giardia",
      leastCount: 14,
    },
    {
      name: "PetCare Tân Bình",
      mostUsed: "Nobivac DHPPi",
      count: 176,
      leastUsed: "Vaccine Corona",
      leastCount: 16,
    },
    {
      name: "PetCare Phú Nhuận",
      mostUsed: "Vaccine 5 bệnh",
      count: 165,
      leastUsed: "Vaccine Lepto",
      leastCount: 11,
    },
    {
      name: "PetCare Quận 7",
      mostUsed: "Nobivac DHPPi",
      count: 154,
      leastUsed: "Vaccine Giardia",
      leastCount: 13,
    },
    {
      name: "PetCare Quận 10",
      mostUsed: "Vaccine 5 bệnh",
      count: 142,
      leastUsed: "Vaccine Corona",
      leastCount: 17,
    },
    {
      name: "PetCare Bình Tân",
      mostUsed: "Nobivac DHPPi",
      count: 135,
      leastUsed: "Vaccine Lepto",
      leastCount: 9,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê vacxin theo chi nhánh</CardTitle>
        <CardDescription>
          Thống kê {timeValue}{" "}
          {timeUnit === "month"
            ? "tháng"
            : timeUnit === "quarter"
            ? "quý"
            : "năm"}{" "}
          gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branches.map((branch, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="font-bold text-lg">{branch.name}</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700 font-medium mb-1">
                    Được dùng nhiều nhất
                  </div>
                  <div className="font-bold text-green-900">
                    {branch.mostUsed}
                  </div>
                  <div className="text-sm text-green-600">
                    {branch.count} lượt tiêm
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-700 font-medium mb-1">
                    Được dùng ít nhất
                  </div>
                  <div className="font-bold text-orange-900">
                    {branch.leastUsed}
                  </div>
                  <div className="text-sm text-orange-600">
                    {branch.leastCount} lượt tiêm
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 5. COMPONENT CON: ServiceStats
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function ServiceStats({ timeUnit, timeValue }) {
  const branches = [
    {
      name: "PetCare Quận 1",
      mostUsed: "Khám bệnh",
      count: 485,
      leastUsed: "Spa thú cưng",
      leastCount: 32,
    },
    {
      name: "PetCare Quận 3",
      mostUsed: "Tiêm phòng",
      count: 456,
      leastUsed: "Cắt tỉa lông",
      leastCount: 28,
    },
    {
      name: "PetCare Bình Thạnh",
      mostUsed: "Khám bệnh",
      count: 432,
      leastUsed: "Spa thú cưng",
      leastCount: 35,
    },
    {
      name: "PetCare Thủ Đức",
      mostUsed: "Tiêm phòng",
      count: 398,
      leastUsed: "Cắt tỉa lông",
      leastCount: 24,
    },
    {
      name: "PetCare Gò Vấp",
      mostUsed: "Khám bệnh",
      count: 375,
      leastUsed: "Spa thú cưng",
      leastCount: 30,
    },
    {
      name: "PetCare Tân Bình",
      mostUsed: "Tiêm phòng",
      count: 352,
      leastUsed: "Cắt tỉa lông",
      leastCount: 26,
    },
    {
      name: "PetCare Phú Nhuận",
      mostUsed: "Khám bệnh",
      count: 328,
      leastUsed: "Spa thú cưng",
      leastCount: 29,
    },
    {
      name: "PetCare Quận 7",
      mostUsed: "Tiêm phòng",
      count: 305,
      leastUsed: "Cắt tỉa lông",
      leastCount: 22,
    },
    {
      name: "PetCare Quận 10",
      mostUsed: "Khám bệnh",
      count: 284,
      leastUsed: "Spa thú cưng",
      leastCount: 31,
    },
    {
      name: "PetCare Bình Tân",
      mostUsed: "Tiêm phòng",
      count: 267,
      leastUsed: "Cắt tỉa lông",
      leastCount: 25,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê dịch vụ theo chi nhánh</CardTitle>
        <CardDescription>
          Thống kê {timeValue}{" "}
          {timeUnit === "month"
            ? "tháng"
            : timeUnit === "quarter"
            ? "quý"
            : "năm"}{" "}
          gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branches.map((branch, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="font-bold text-lg">{branch.name}</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700 font-medium mb-1">
                    Được dùng nhiều nhất
                  </div>
                  <div className="font-bold text-blue-900">
                    {branch.mostUsed}
                  </div>
                  <div className="text-sm text-blue-600">
                    {branch.count} lượt sử dụng
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-700 font-medium mb-1">
                    Được dùng ít nhất
                  </div>
                  <div className="font-bold text-red-900">
                    {branch.leastUsed}
                  </div>
                  <div className="text-sm text-red-600">
                    {branch.leastCount} lượt sử dụng
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 6. COMPONENT CON: CustomerStats
// ======================================================================
function CustomerStats() {
  const branches = [
    { name: "PetCare Quận 1", old: 1245, new: 387, inactive: 156 },
    { name: "PetCare Quận 3", old: 1178, new: 342, inactive: 143 },
    { name: "PetCare Bình Thạnh", old: 1098, new: 328, inactive: 132 },
    { name: "PetCare Thủ Đức", old: 987, new: 295, inactive: 128 },
    { name: "PetCare Gò Vấp", old: 932, new: 276, inactive: 115 },
    { name: "PetCare Tân Bình", old: 876, new: 254, inactive: 108 },
    { name: "PetCare Phú Nhuận", old: 821, new: 238, inactive: 98 },
    { name: "PetCare Quận 7", old: 765, new: 221, inactive: 92 },
    { name: "PetCare Quận 10", old: 712, new: 205, inactive: 85 },
    { name: "PetCare Bình Tân", old: 658, new: 189, inactive: 78 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê khách hàng theo chi nhánh</CardTitle>
        <CardDescription>
          Phân loại khách hàng cũ, mới và lâu chưa quay lại
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branches.map((branch, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="font-bold text-lg">{branch.name}</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-sm text-green-700 font-medium mb-1">
                    Khách hàng cũ
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {branch.old}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-blue-700 font-medium mb-1">
                    Khách hàng mới
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {branch.new}
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <div className="text-sm text-orange-700 font-medium mb-1">
                    Lâu chưa quay lại
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {branch.inactive}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 7. COMPONENT CON: PerformanceStats
// ======================================================================
function PerformanceStats() {
  const employees = [
    {
      name: "BS. Nguyễn Văn A",
      role: "Bác sĩ",
      branch: "Quận 1",
      kpi: 145,
      type: "Khám/Tiêm hoàn thành",
    },
    {
      name: "NV. Trần Thị B",
      role: "Lễ tân",
      branch: "Quận 1",
      kpi: 287,
      type: "Hóa đơn lập",
    },
    {
      name: "BS. Lê Văn C",
      role: "Bác sĩ",
      branch: "Quận 3",
      kpi: 138,
      type: "Khám/Tiêm hoàn thành",
    },
    {
      name: "NV. Phạm Thị D",
      role: "Lễ tân",
      branch: "Quận 3",
      kpi: 265,
      type: "Hóa đơn lập",
    },
    {
      name: "BS. Hoàng Văn E",
      role: "Bác sĩ",
      branch: "Bình Thạnh",
      kpi: 132,
      type: "Khám/Tiêm hoàn thành",
    },
    {
      name: "NV. Vũ Thị F",
      role: "Lễ tân",
      branch: "Bình Thạnh",
      kpi: 248,
      type: "Hóa đơn lập",
    },
    {
      name: "BS. Đặng Văn G",
      role: "Bác sĩ",
      branch: "Thủ Đức",
      kpi: 125,
      type: "Khám/Tiêm hoàn thành",
    },
    {
      name: "NV. Mai Thị H",
      role: "Lễ tân",
      branch: "Thủ Đức",
      kpi: 232,
      type: "Hóa đơn lập",
    },
    {
      name: "BS. Bùi Văn I",
      role: "Bác sĩ",
      branch: "Gò Vấp",
      kpi: 118,
      type: "Khám/Tiêm hoàn thành",
    },
    {
      name: "NV. Đỗ Thị K",
      role: "Lễ tân",
      branch: "Gò Vấp",
      kpi: 215,
      type: "Hóa đơn lập",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê hiệu suất nhân viên</CardTitle>
        <CardDescription>
          KPI của tất cả nhân viên trên toàn công ty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-semibold">{employee.name}</div>
                <div className="text-sm text-gray-500">
                  {employee.role} - Chi nhánh {employee.branch}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {employee.kpi}
                </div>
                <div className="text-xs text-gray-500">{employee.type}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}