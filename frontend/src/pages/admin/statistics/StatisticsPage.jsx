import React, { useState, useEffect } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import AdminHeader from "../components/AdminHeader";
import { reportAPI } from "../../../api/services";
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
  TrendingDown,
  ArrowLeft,
  Package,
  Building2,
  AlertCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom"; // Giữ Link của React Router DOM

// ======================================================================
// 1. COMPONENT CHÍNH: StatisticsPage
// ======================================================================
export default function StatisticsPage() {
  // Loại bỏ khai báo kiểu TypeScript: useState<string | null>(null)
  const [selectedStat, setSelectedStat] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
            {selectedStat ? (
              <StatisticsDetail
                type={selectedStat}
                onBack={() => setSelectedStat(null)}
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
                    onClick={() => setSelectedStat("revenue")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Thống kê doanh thu
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Xem doanh thu theo thời gian và chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors border-blue-300"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Product Card */}
                  <Card
                    className="border-t-4 border-t-amber-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50 cursor-pointer"
                    onClick={() => setSelectedStat("product")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-amber-100 rounded-full">
                          <Package className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                        Thống kê sản phẩm
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Thống kê sản phẩm bán chạy nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-amber-100 hover:bg-amber-600 hover:text-white transition-colors border-amber-300"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Vaccine Card */}
                  <Card
                    className="border-t-4 border-t-green-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 cursor-pointer"
                    onClick={() => setSelectedStat("vaccine")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Syringe className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                        Thống kê loại vacxin
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Thống kê vacxin được sử dụng nhiều nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-green-100 hover:bg-green-600 hover:text-white transition-colors border-green-300"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Service Card */}
                  <Card
                    className="border-t-4 border-t-purple-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50 cursor-pointer"
                    onClick={() => setSelectedStat("service")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-purple-100 rounded-full">
                          <ClipboardList className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        Thống kê dịch vụ
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Thống kê dịch vụ được sử dụng nhiều nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-purple-100 hover:bg-purple-600 hover:text-white transition-colors border-purple-300"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Customer Card */}
                  <Card
                    className="border-t-4 border-t-orange-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-orange-50 cursor-pointer"
                    onClick={() => setSelectedStat("customer")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Users className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                        Thống kê khách hàng
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Thống kê khách hàng mới, cũ và lâu chưa quay lại
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-orange-100 hover:bg-orange-600 hover:text-white transition-colors border-orange-300"
                      >
                        Xem thống kê
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Performance Card */}
                  <Card
                    className="border-t-4 border-t-pink-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-pink-50 cursor-pointer"
                    onClick={() => setSelectedStat("performance")}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-pink-100 rounded-full">
                          <UserCheck className="h-6 w-6 text-pink-600" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                        Thống kê hiệu suất nhân viên
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Xem KPI và hiệu suất làm việc của nhân viên
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-pink-100 hover:bg-pink-600 hover:text-white transition-colors border-pink-300"
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        const params = { timeUnit, timeValue };

        switch (type) {
          case "revenue":
            response = await reportAPI.getRevenue(params);
            break;
          case "product":
            response = await reportAPI.getProducts(params);
            break;
          case "vaccine":
            response = await reportAPI.getVaccines(params);
            break;
          case "service":
            response = await reportAPI.getServices(params);
            break;
          case "customer":
            response = await reportAPI.getCustomers();
            break;
          case "performance":
            response = await reportAPI.getPerformance();
            break;
          default:
            break;
        }

        if (response?.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, timeUnit, timeValue]);

  const getTitleByType = () => {
    switch (type) {
      case "revenue":
        return "Thống kê doanh thu";
      case "product":
        return "Thống kê sản phẩm";
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
        <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Chọn thời gian thống kê
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Đơn vị thời gian
                </label>
                <select
                  className="w-full border-2 border-blue-200 rounded-xl px-4 py-2.5 h-11 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <option value="month">📅 Tháng</option>
                  <option value="quarter">📊 Quý</option>
                  <option value="year">📆 Năm</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Số{" "}
                  {timeUnit === "month"
                    ? "tháng"
                    : timeUnit === "quarter"
                    ? "quý"
                    : "năm"}{" "}
                  gần nhất
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border-2 border-blue-200 rounded-xl px-4 py-2.5 h-11 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  placeholder="Nhập số..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conditional Rendering of Specific Stats Components */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {type === "revenue" && (
            <RevenueStats
              timeUnit={timeUnit}
              timeValue={timeValue}
              data={data}
            />
          )}
          {type === "product" && (
            <ProductStats
              timeUnit={timeUnit}
              timeValue={timeValue}
              data={data}
            />
          )}
          {type === "vaccine" && (
            <VaccineStats
              timeUnit={timeUnit}
              timeValue={timeValue}
              data={data}
            />
          )}
          {type === "service" && (
            <ServiceStats
              timeUnit={timeUnit}
              timeValue={timeValue}
              data={data}
            />
          )}
          {type === "customer" && <CustomerStats data={data} />}
          {type === "performance" && <PerformanceStats data={data} />}
        </>
      )}
    </>
  );
}

// ======================================================================
// 3. COMPONENT CON: RevenueStats
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function RevenueStats({ timeUnit, timeValue, data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-10 text-center text-gray-500">
          Không có dữ liệu thống kê cho khoảng thời gian này
        </CardContent>
      </Card>
    );
  }

  const branches = data;
  const totalRevenue = branches.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const totalSales = branches.reduce(
    (sum, b) => sum + (b.salesRevenue || 0),
    0
  );
  const totalMedical = branches.reduce(
    (sum, b) => sum + (b.medicalRevenue || 0),
    0
  );
  const totalVaccine = branches.reduce(
    (sum, b) => sum + (b.vaccineRevenue || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* System Total Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DollarSign size={120} />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-100 text-sm font-medium uppercase tracking-wider">
            Tổng doanh thu hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-5xl font-black tracking-tight">
                {totalRevenue.toLocaleString("vi-VN")}
                <span className="text-2xl ml-2 opacity-80">₫</span>
              </div>
              <p className="text-blue-100 mt-2 opacity-80">
                Dựa trên dữ liệu từ {branches.length} chi nhánh
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-100 opacity-70 block uppercase font-bold">
                    Mua hàng
                  </span>
                  <span className="font-bold text-lg">
                    {totalSales.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <ClipboardList className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-100 opacity-70 block uppercase font-bold">
                    Khám bệnh
                  </span>
                  <span className="font-bold text-lg">
                    {totalMedical.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Syringe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] text-blue-100 opacity-70 block uppercase font-bold">
                    Tiêm phòng
                  </span>
                  <span className="font-bold text-lg">
                    {totalVaccine.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <Card
            key={index}
            className="border-2 border-blue-200 shadow-md bg-white overflow-hidden"
          >
            <CardHeader className="pt-1 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {branch.TenChiNhanh}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                      {branch.ThanhPho}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 border-none px-3 py-1"
                >
                  #{index + 1}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Doanh thu chi nhánh
                </p>
                <div className="text-3xl font-black text-blue-600">
                  {(branch.revenue || 0).toLocaleString("vi-VN")}
                  <span className="text-sm ml-1 font-normal text-gray-400">
                    ₫
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-100 p-3 rounded-lg border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase mb-0.5">
                    Mua hàng
                  </p>
                  <p className="text-sm font-black text-emerald-800">
                    {(branch.salesRevenue || 0).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-700 uppercase mb-0.5">
                    Khám bệnh
                  </p>
                  <p className="text-sm font-black text-amber-800">
                    {(branch.medicalRevenue || 0).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
                <div className="bg-rose-100 p-3 rounded-lg border border-rose-200">
                  <p className="text-[10px] font-bold text-rose-700 uppercase mb-0.5">
                    Tiêm phòng
                  </p>
                  <p className="text-sm font-black text-rose-800">
                    {(branch.vaccineRevenue || 0).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ======================================================================
// 4. COMPONENT CON: ProductStats
// ======================================================================
function ProductStats({ timeUnit, timeValue, data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-10 text-center text-gray-500">
          Không có dữ liệu thống kê cho khoảng thời gian này
        </CardContent>
      </Card>
    );
  }

  const branches = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <Card
            key={index}
            className="border-2 border-yellow-200 shadow-md bg-white overflow-hidden"
          >
            <CardHeader className="pb-1 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-600 flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {branch.TenChiNhanh}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                    {branch.ThanhPho}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-yellow-100 p-4 rounded-xl border border-yellow-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-yellow-600 flex items-center justify-center text-white">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
                      Bán chạy
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-lg truncate">
                    {branch.mostUsed || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-yellow-700 mt-1">
                    {branch.count || 0} sản phẩm
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      <TrendingDown className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Bán ít
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-lg truncate">
                    {branch.leastUsed || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-1">
                    {branch.leastCount || 0} sản phẩm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ======================================================================
// 5. COMPONENT CON: VaccineStats
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function VaccineStats({ timeUnit, timeValue, data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-10 text-center text-gray-500">
          Không có dữ liệu thống kê cho khoảng thời gian này
        </CardContent>
      </Card>
    );
  }

  const branches = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <Card
            key={index}
            className="border-2 border-green-200 shadow-md bg-white overflow-hidden"
          >
            <CardHeader className="pb-1 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {branch.TenChiNhanh}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                    {branch.ThanhPho}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                      <Syringe className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                      Dùng nhiều
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-lg truncate">
                    {branch.mostUsed || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-green-700 mt-1">
                    {branch.count || 0} lượt tiêm
                  </p>
                </div>

                <div className="bg-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                      Dùng ít
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-lg truncate">
                    {branch.leastUsed || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-orange-700 mt-1">
                    {branch.leastCount || 0} lượt tiêm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ======================================================================
// 6. COMPONENT CON: ServiceStats
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function ServiceStats({ timeUnit, timeValue, data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-10 text-center text-gray-500">
          Không có dữ liệu thống kê cho khoảng thời gian này
        </CardContent>
      </Card>
    );
  }

  const branches = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <Card
            key={index}
            className="border-2 border-purple-200 shadow-md bg-white overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {branch.TenChiNhanh}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                    {branch.ThanhPho}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                      Dùng nhiều
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-lg truncate">
                    {branch.mostUsed || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-purple-700 mt-1">
                    {branch.count || 0} lượt
                  </p>
                </div>

                <div className="bg-rose-100 p-4 rounded-xl border border-rose-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-rose-600 flex items-center justify-center text-white">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                      Dùng ít
                    </span>
                  </div>
                  <p className="font-black text-gray-900 text-lg truncate">
                    {branch.leastUsed || "N/A"}
                  </p>
                  <p className="text-sm font-bold text-rose-700 mt-1">
                    {branch.leastCount || 0} lượt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ======================================================================
// 7. COMPONENT CON: CustomerStats
// ======================================================================
function CustomerStats({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-10 text-center text-gray-500">
          Không có dữ liệu thống kê khách hàng
        </CardContent>
      </Card>
    );
  }

  const branches = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <Card
            key={index}
            className="border-2 border-orange-200 shadow-md bg-white overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-600 flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {branch.TenChiNhanh}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                    {branch.ThanhPho}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-100 p-4 rounded-xl border border-blue-200 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-blue-700 uppercase mb-1 tracking-wider">
                    Tổng khách hàng
                  </p>
                  <p className="text-3xl font-black text-blue-800">
                    {branch.TongSoKhachHang || 0}
                  </p>
                </div>
                <div className="bg-emerald-100 p-4 rounded-xl border border-emerald-200 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <UserCheck className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1 tracking-wider">
                    Khách mới
                  </p>
                  <p className="text-3xl font-black text-emerald-800">
                    {branch.TongKhachHangMoi || 0}
                  </p>
                </div>
                <div className="bg-rose-100 p-4 rounded-xl border border-rose-200 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-rose-600 flex items-center justify-center text-white">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-rose-700 uppercase mb-1 tracking-wider">
                    Lâu chưa quay lại
                  </p>
                  <p className="text-3xl font-black text-rose-800">
                    {branch.TongKhachHangLauChuaQuayLai || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ======================================================================
// 8. COMPONENT CON: PerformanceStats
// ======================================================================
function PerformanceStats({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="py-10 text-center text-gray-500">
          Không có dữ liệu thống kê hiệu suất nhân viên
        </CardContent>
      </Card>
    );
  }

  const employees = data;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-pink-600 to-purple-700 text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <UserCheck size={120} />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-pink-100 text-sm font-medium uppercase tracking-wider">
            Thống kê bác sĩ thú y
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-5xl font-black tracking-tight">
                {employees.length}
                <span className="text-2xl ml-2 opacity-80">Bác sĩ</span>
              </div>
              <p className="text-pink-100 mt-2 opacity-80">
                Tổng số bác sĩ thú y trong hệ thống
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="h-4 w-4 text-white" />
                  <span className="text-[10px] text-pink-100 opacity-70 block uppercase font-bold">
                    Tổng khám
                  </span>
                </div>
                <span className="font-bold text-xl block">
                  {employees.reduce((sum, e) => sum + (e.SoLuotKham || 0), 0)}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <Syringe className="h-4 w-4 text-white" />
                  <span className="text-[10px] text-pink-100 opacity-70 block uppercase font-bold">
                    Tổng tiêm
                  </span>
                </div>
                <span className="font-bold text-xl block">
                  {employees.reduce((sum, e) => sum + (e.SoLuotTiem || 0), 0)}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-white" />
                  <span className="text-[10px] text-pink-100 opacity-70 block uppercase font-bold">
                    Tổng công việc
                  </span>
                </div>
                <span className="font-bold text-xl block">
                  {employees.reduce(
                    (sum, e) => sum + (e.TongSoLuotLamViec || 0),
                    0
                  )}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-white" />
                  <span className="text-[10px] text-pink-100 opacity-70 block uppercase font-bold">
                    Đánh giá TB
                  </span>
                </div>
                <span className="font-bold text-xl block">
                  {employees.length > 0
                    ? (
                        employees.reduce(
                          (sum, e) => sum + (e.DiemTongTheTB || 0),
                          0
                        ) / employees.length
                      ).toFixed(2)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Danh sách bác sĩ thú y
              </CardTitle>
              <CardDescription>
                Thống kê chi tiết hiệu suất làm việc của từng bác sĩ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Số lượt khám
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Số lượt tiêm
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tổng công việc
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Đánh giá TB
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {employees.map((employee, index) => (
                  <tr
                    key={employee.MaNhanVien}
                    className="hover:bg-pink-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <div className="h-10 w-10 rounded-lg bg-pink-600 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">
                            <Star className="h-2 w-2 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {employee.HoTen?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {employee.HoTen}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {employee.MaNhanVien}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg">
                        <ClipboardList className="h-4 w-4 text-blue-600" />
                        <span className="font-bold text-blue-900">
                          {employee.SoLuotKham || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg">
                        <Syringe className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-900">
                          {employee.SoLuotTiem || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-lg">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span className="font-bold text-purple-900">
                          {employee.TongSoLuotLamViec || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                        <span className="font-bold text-yellow-900">
                          {employee.DiemTongTheTB
                            ? Number(employee.DiemTongTheTB).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
