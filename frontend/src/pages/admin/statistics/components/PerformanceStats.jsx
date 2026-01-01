import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  UserCheck,
  Activity,
  Syringe,
  ClipboardList,
  Star,
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { reportAPI } from "../../../../api/services";

export default function PerformanceStats() {
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
        const response = await reportAPI.getPerformance();

        if (response?.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching performance statistics:", error);
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
  if (!data || data.length === 0) {
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
                    Thống kê hiệu suất nhân viên
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Xem hiệu suất làm việc của nhân viên
                  </p>
                </div>
              </div>
            </div>
            <Card className="border-none shadow-sm">
              <CardContent className="py-10 text-center text-gray-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : "Không có dữ liệu thống kê hiệu suất nhân viên"}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const employees = data;

  // Tính tổng số liệu
  const totalExams = employees.reduce((sum, e) => sum + (e.SoLuotKham || 0), 0);
  const totalVaccinations = employees.reduce(
    (sum, e) => sum + (e.SoLuotTiem || 0),
    0
  );
  const totalWork = employees.reduce(
    (sum, e) => sum + (e.TongSoLuotLamViec || 0),
    0
  );
  const avgRating =
    employees.length > 0
      ? (
          employees.reduce((sum, e) => sum + (e.DiemTongTheTB || 0), 0) /
          employees.length
        ).toFixed(2)
      : 0;

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
                  Thống kê hiệu suất nhân viên
                </h1>
                <p className="text-gray-600 mt-1">
                  Xem hiệu suất làm việc của nhân viên
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
                  <UserCheck size={120} />
                </div>

                <CardHeader className="pt-3 pb-3">
                  <CardTitle className="text-3xl font-bold text-white">
                    Tổng số bác sĩ thú y trong hệ thống
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                      <div className="text-5xl font-black tracking-tight">
                        {employees.length}
                      </div>
                      <p className="text-white mt-2 opacity-80">
                        Dựa trên dữ liệu từ 10 chi nhánh
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Tổng khám
                          </span>
                          <span className="font-bold text-lg truncate block">
                            {totalExams.toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <Syringe className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Tổng tiêm
                          </span>
                          <span className="font-bold text-lg truncate block">
                            {totalVaccinations.toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <ClipboardList className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Tổng công việc
                          </span>
                          <span className="font-bold text-lg truncate block">
                            {totalWork.toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Điểm đánh giá
                          </span>
                          <span className="font-bold text-lg truncate block">
                            {avgRating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Employee Performance Table */}
          <Card className="border-gray-200 shadow-md bg-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-sky-600">
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
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Xếp hạng
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
                        Điểm đánh giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {employees.map((employee, index) => (
                      <tr
                        key={employee.MaNhanVien}
                        className="hover:bg-sky-100 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative inline-block">
                            <div
                              className={`h-10 w-10 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold shadow-md`}
                            >
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
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                              {employee.HoTen?.charAt(0) || "?"}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">
                                {employee.HoTen}
                              </div>
                              <div className="text-xs text-gray-600">
                                {employee.MaNhanVien} • {employee.TenChiNhanh}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-lg">
                            <Activity className="h-4 w-4 text-blue-600" />
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
                            <ClipboardList className="h-4 w-4 text-purple-600" />
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
      </main>
    </div>
  );
}
