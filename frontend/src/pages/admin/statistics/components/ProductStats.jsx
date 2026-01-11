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
import { Activity, TrendingUp, TrendingDown, ShoppingBag } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { reportAPI } from "../../../../api/services";

export default function ProductStats() {
  const navigate = useNavigate();
  const [timeUnit, setTimeUnit] = useState("month");
  const [timeValue, setTimeValue] = useState("1");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const onBack = () => {
    navigate("/admin/statistics");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { timeUnit, timeValue };
        const response = await reportAPI.getProducts(params);

        if (response?.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeUnit, timeValue]);

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
                    Thống kê sản phẩm
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Thống kê sản phẩm bán chạy nhất và ít nhất
                  </p>
                </div>
              </div>
            </div>
            <Card className="border-none shadow-sm">
              <CardContent className="py-10 text-center text-gray-500">
                {loading
                  ? "Đang tải dữ liệu..."
                  : "Không có dữ liệu thống kê cho khoảng thời gian này"}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const branches = data;

  const systemTop = branches.reduce(
    (best, b) => {
      const c = Number(b.count || 0);
      if (c > Number(best.count || 0))
        return { mostUsed: b.mostUsed, count: c };
      return best;
    },
    {
      mostUsed: branches?.[0]?.mostUsed,
      count: Number(branches?.[0]?.count || 0),
    }
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
                  Thống kê sản phẩm
                </h1>
                <p className="text-gray-600 mt-1">
                  Thống kê sản phẩm được sử dụng nhiều nhất và ít nhất
                </p>
              </div>
            </div>
          </div>
          {/* ✅ FILTER + BANNER cùng 1 hàng */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: FILTER (col-span-4) */}
            <div className="lg:col-span-4">
              <Card className="bg-white p-0 rounded-xl shadow-sm border border-blue-600">
                <CardHeader className="pt-5 pb-5 px-5">
                  <CardTitle className="text-xl flex items-center text-blue-600">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Bộ lọc thời gian
                  </CardTitle>
                  <div className="pt-2 grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block text-gray-700">
                        Đơn vị thời gian
                      </label>
                      <select
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 h-10 bg-white text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                      >
                        <option value="month">📅 Tháng</option>
                        <option value="quarter">📊 Quý</option>
                        <option value="year">📆 Năm</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-1 block text-gray-700">
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
                        className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 h-10 bg-white text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                        placeholder="Nhập số..."
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* RIGHT: HIGHLIGHT TOP 1 */}
            <div className="lg:col-span-8">
              <Card className="bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white border-none shadow-xl overflow-hidden relative h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingUp size={120} />
                </div>

                <CardHeader className="pt-3 pb-3">
                  <CardTitle className="text-3xl font-bold text-white">
                    Sản phẩm được bán chạy nhất
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="min-w-0">
                      <div className="text-5xl font-black tracking-tight">
                        {systemTop?.mostUsed?.replace(/^Phụ kiện - /, "") ||
                          systemTop?.mostUsed ||
                          "N/A"}
                      </div>
                      <p className="text-white mt-2 opacity-80">
                        Dựa trên dữ liệu từ {branches.length} chi nhánh
                      </p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-white block uppercase font-bold">
                          Số lượng đã bán
                        </span>
                        <span className="font-bold text-base truncate block">
                          {Number(systemTop?.count || 0).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Branch Statistics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {branches.map((branch) => (
              <Card
                key={branch.MaChiNhanh}
                className="relative border border-sky-600 shadow-md bg-white overflow-hidden rounded-xl"
              >
                <CardHeader>
                  <div className="pr-8">
                    <h3 className="text-lg font-bold text-sky-600">
                      {branch.TenChiNhanh[0]}
                    </h3>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {branch.MaChiNhanh}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* ✅ List sạch sẽ (3 dòng) */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600 uppercase">
                          Bán chạy nhất
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0 pb-3">
                      <div className="font-bold truncate block text-gray-600">
                        {branch.mostUsed?.replace(/^Phụ kiện - /, "") ||
                          branch.mostUsed ||
                          "N/A"}{" "}
                        : {Number(branch.count || 0).toLocaleString("vi-VN")} sp
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <TrendingDown className="h-6 w-6 text-rose-500" />
                        <span className="text-xs font-bold text-rose-500 uppercase">
                          Bán chậm nhất
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0 pb-2">
                      <div className="font-bold truncate block text-gray-600">
                        {branch.leastUsed?.replace(/^Phụ kiện - /, "") ||
                          branch.leastUsed ||
                          "N/A"}{" "}
                        :{" "}
                        {Number(branch.leastCount || 0).toLocaleString("vi-VN")}{" "}
                        sp
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
