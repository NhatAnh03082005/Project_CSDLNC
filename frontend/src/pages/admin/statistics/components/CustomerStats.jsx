import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Users, UserCheck, AlertCircle } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { reportAPI } from "../../../../api/services";

export default function CustomerStats() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const onBack = () => {
    navigate("/admin/statistics");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await reportAPI.getCustomers();

        if (response?.data?.success) {
          // Backend should return: { branches: [...], totalCustomers, totalNewCustomers, totalInactiveCustomers }
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching customer statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    (data.branches && data.branches.length === 0)
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <AdminHeader />
        <main className="w-full">
          <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
            <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                  onClick={onBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Thống kê khách hàng
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Thống kê tổng số khách hàng, khách hàng mới và lâu chưa quay
                    lại
                  </p>
                </div>
              </div>
            </div>
            <Card className="border-none shadow-sm">
              <CardContent className="py-10 text-center text-gray-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : "Không có dữ liệu thống kê khách hàng"}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Support both old format (array) and new format (object with branches + totals)
  const branches = Array.isArray(data) ? data : data.branches || [];

  // Use totals from backend if available (unique customer count), otherwise fallback to sum
  // NOTE: Summing branch totals is incorrect as customers can have invoices at multiple branches
  const totalCustomers =
    data.totalCustomers !== undefined
      ? data.totalCustomers
      : branches.reduce((sum, b) => sum + (b.TongSoKhachHang || 0), 0);

  const totalNewCustomers =
    data.totalNewCustomers !== undefined
      ? data.totalNewCustomers
      : branches.reduce((sum, b) => sum + (b.TongKhachHangMoi || 0), 0);

  const totalInactiveCustomers =
    data.totalInactiveCustomers !== undefined
      ? data.totalInactiveCustomers
      : branches.reduce(
          (sum, b) => sum + (b.TongKhachHangLauChuaQuayLai || 0),
          0
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminHeader />
      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Thống kê khách hàng
                </h1>
                <p className="text-gray-600 mt-1">
                  Thống kê tổng số khách hàng, khách hàng mới và lâu chưa quay
                  lại
                </p>
              </div>
            </div>
          </div>

          {/* Summary Banner Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Banner tổng hợp */}
            <div className="lg:col-span-12">
              <Card className="bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white border-none shadow-xl overflow-hidden relative h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Users size={120} />
                </div>

                <CardHeader className="pt-3 pb-3">
                  <CardTitle className="text-3xl font-bold text-white">
                    Tổng số khách hàng trên hệ thống
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                      <div className="text-5xl font-black tracking-tight">
                        {totalCustomers.toLocaleString("vi-VN")}
                      </div>
                      <p className="text-white mt-2 opacity-80">
                        Dựa trên dữ liệu từ {branches.length} chi nhánh
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Khách hàng mới
                          </span>
                          <span className="font-bold text-lg truncate block">
                            {totalNewCustomers.toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Lâu chưa quay lại
                          </span>
                          <span className="font-bold text-lg truncate block">
                            {totalInactiveCustomers.toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Branch Statistics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {branches.map((branch, idx) => {
              const total = branch.TongSoKhachHang || 0;
              const newCustomers = branch.TongKhachHangMoi || 0;
              const inactive = branch.TongKhachHangLauChuaQuayLai || 0;
              const percent =
                totalCustomers > 0 ? (total / totalCustomers) * 100 : 0;

              return (
                <Card
                  key={branch.MaChiNhanh || idx}
                  className="relative border border-sky-600 shadow-md bg-white overflow-hidden rounded-xl"
                >
                  <CardHeader>
                    <div className="pr-8">
                      <h3 className="text-lg font-bold text-sky-600">
                        {branch.TenChiNhanh}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {branch.MaChiNhanh}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Tổng khách hàng
                      </p>
                      <div className="text-2xl font-black text-blue-600">
                        {total.toLocaleString("vi-VN")}
                        <span className="text-sm ml-1 font-black text-blue-600">
                          người
                        </span>
                      </div>
                    </div>

                    {/* Danh sách số liệu */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <UserCheck className="h-4 w-4 text-emerald-600" />
                          <span>Khách mới</span>
                        </div>
                        <span className="font-bold text-gray-800">
                          {newCustomers.toLocaleString("vi-VN")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <AlertCircle className="h-4 w-4 text-rose-500" />
                          <span>Lâu chưa quay lại</span>
                        </div>
                        <span className="font-bold text-gray-800">
                          {inactive.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar đóng góp */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                        <span>Đóng góp</span>
                        <span className="font-semibold text-gray-700">
                          {percent.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(0, percent))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
