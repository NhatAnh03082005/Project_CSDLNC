import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Users,
  Building2,
  ShoppingBag,
  Stethoscope,
  ShoppingCart,
  Headset,
  Package,
  Syringe,
} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import api from "../../api/axios";

export default function AdminDemo() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalBranches: 0,
    totalReceptionists: 0,
    totalSalesStaff: 0,
    totalDoctors: 0,
    totalProducts: 0,
    totalVaccines: 0,
  });

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [branchesRes, employeesRes, productsRes, vaccinesRes] =
        await Promise.all([
          api.get("/branches"),
          api.get("/employees"),
          api.get("/products"),
          api.get("/vaccinations"),
        ]);

      const branchesData = branchesRes.data?.data || [];
      const employeesData = employeesRes.data?.data || [];
      const productsData = productsRes.data?.data || [];
      const vaccinesData = vaccinesRes.data?.data || [];

      // Count by position
      const doctors = employeesData.filter(
        (emp) => emp.ViTri && emp.ViTri.includes("Bác sĩ thú y")
      );
      const receptionists = employeesData.filter(
        (emp) => emp.ViTri && emp.ViTri.includes("Nhân viên tiếp tân")
      );
      const salesStaff = employeesData.filter(
        (emp) => emp.ViTri && emp.ViTri.includes("Nhân viên bán hàng")
      );

      setDashboardData({
        totalBranches: branchesData.length || 0,
        totalReceptionists: receptionists.length || 0,
        totalSalesStaff: salesStaff.length || 0,
        totalDoctors: doctors.length || 0,
        totalProducts: productsData.length || 0,
        totalVaccines: vaccinesData.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminHeader />

      {/* Main Content */}
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
                  Dashboard Quản trị
                </h1>
                <p className="text-gray-600 mt-1">
                  Tổng quan hệ thống và quản lý toàn bộ chi nhánh
                </p>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {[...Array(3)].map((_, colIndex) => (
                    <Card key={colIndex} className="animate-pulse">
                      <CardHeader className="pb-3">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-32 mt-2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Row 1: Chi nhánh, Sản phẩm, Vaccine */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Chi nhánh
                      </span>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                    </CardDescription>
                    <CardTitle className="text-4xl font-bold text-blue-600">
                      {dashboardData.totalBranches}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">Tổng số chi nhánh</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-sky-600">
                        Sản phẩm
                      </span>
                      <div className="p-3 bg-sky-100 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-sky-600" />
                      </div>
                    </CardDescription>
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                      {dashboardData.totalProducts.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">
                        Số lượng sản phẩm khác nhau
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-600">
                        Vaccine
                      </span>
                      <div className="p-3 bg-cyan-100 rounded-full">
                        <Syringe className="h-6 w-6 text-cyan-600" />
                      </div>
                    </CardDescription>
                    <CardTitle className="text-4xl font-bold text-cyan-600">
                      {dashboardData.totalVaccines.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">
                        Số lượng vaccine khác nhau
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Row 2: 3 loại nhân viên */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-t-4 border-t-blue-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        Tiếp tân
                      </span>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Headset className="h-6 w-6 text-blue-600" />
                      </div>
                    </CardDescription>
                    <CardTitle className="text-4xl font-bold text-blue-600">
                      {dashboardData.totalReceptionists.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">
                        Tổng số nhân viên tiếp tân
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-sky-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-sky-50">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-sky-600">
                        Bán hàng
                      </span>
                      <div className="p-3 bg-sky-100 rounded-full">
                        <ShoppingCart className="h-6 w-6 text-sky-600" />
                      </div>
                    </CardDescription>
                    <CardTitle className="text-4xl font-bold text-sky-600">
                      {dashboardData.totalSalesStaff.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">
                        Tổng số nhân viên bán hàng
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-cyan-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-gradient-to-br from-white to-cyan-50">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-600">
                        Bác sĩ
                      </span>
                      <div className="p-3 bg-cyan-100 rounded-full">
                        <Stethoscope className="h-6 w-6 text-cyan-600" />
                      </div>
                    </CardDescription>
                    <CardTitle className="text-4xl font-bold text-cyan-600">
                      {dashboardData.totalDoctors.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">Tổng số bác sĩ</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
