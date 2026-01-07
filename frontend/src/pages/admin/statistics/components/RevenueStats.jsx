import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Activity,
  DollarSign,
  ShoppingBag,
  Stethoscope,
  Syringe,
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { reportAPI } from "../../../../api/services";

// Tooltip component for displaying full numbers
const NumberTooltip = ({ children, fullValue }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      console.log("Tooltip triggered:", { fullValue, rect });
      setPosition({
        top: rect.top - 3,
        left: rect.left + rect.width / 2,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {isVisible &&
        ReactDOM.createPortal(
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-blue-50 text-blue-600 border border-blue-400 px-2 py-1 rounded-lg shadow-2xl text-sm font-bold whitespace-nowrap">
              {fullValue}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// Helper function to format numbers in compact form
const formatCompactNumber = (value) => {
  if (!value || value === 0) return "0";

  const absValue = Math.abs(value);

  if (absValue >= 1000000000) {
    // Tỷ
    return `${(value / 1000000000).toFixed(1)} tỷ`;
  } else if (absValue >= 1000000) {
    // Triệu
    return `${(value / 1000000).toFixed(1)} tr`;
  } else {
    return value.toLocaleString("vi-VN") + " đ";
  }
};

// Helper function to format full number with separators
const formatFullNumber = (value) => {
  if (!value || value === 0) return "0 đ";
  return `${value.toLocaleString("vi-VN")} đ`;
};

export default function RevenueStats() {
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
        const response = await reportAPI.getRevenue(params);

        if (response?.data?.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching revenue statistics:", error);
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
                    Thống kê doanh thu
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Xem doanh thu theo thời gian của tất cả chi nhánh
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
                  Thống kê doanh thu
                </h1>
                <p className="text-gray-600 mt-1">
                  Xem doanh thu theo thời gian của tất cả chi nhánh
                </p>
              </div>
            </div>
          </div>

          {/* Filter and Banner Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

            <div className="lg:col-span-8">
              <Card className="bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white border-none shadow-xl relative h-full rounded-xl">
                {/* watermark */}
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none z-0 overflow-hidden">
                  <DollarSign size={120} />
                </div>

                <CardHeader className="pt-3 pb-3 relative z-10">
                  <CardTitle className="text-3xl font-bold text-white">
                    Tổng doanh thu hệ thống
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                      <NumberTooltip fullValue={formatFullNumber(totalRevenue)}>
                        <div className="text-5xl font-black tracking-tight cursor-pointer">
                          {formatCompactNumber(totalRevenue)}
                        </div>
                      </NumberTooltip>
                      <p className="text-white mt-2 opacity-80">
                        Dựa trên dữ liệu từ {branches.length} chi nhánh
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Mua hàng
                          </span>
                          <NumberTooltip
                            fullValue={formatFullNumber(totalSales)}
                          >
                            <span className="font-bold text-lg block cursor-pointer">
                              {formatCompactNumber(totalSales)}
                            </span>
                          </NumberTooltip>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <Stethoscope className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Khám bệnh
                          </span>
                          <NumberTooltip
                            fullValue={formatFullNumber(totalMedical)}
                          >
                            <span className="font-bold text-lg block cursor-pointer">
                              {formatCompactNumber(totalMedical)}
                            </span>
                          </NumberTooltip>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center">
                          <Syringe className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white block uppercase font-bold">
                            Tiêm phòng
                          </span>
                          <NumberTooltip
                            fullValue={formatFullNumber(totalVaccine)}
                          >
                            <span className="font-bold text-lg block cursor-pointer">
                              {formatCompactNumber(totalVaccine)}
                            </span>
                          </NumberTooltip>
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
            {branches.map((branch, index) => {
              const revenue = branch.revenue || 0;
              const percent =
                totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

              return (
                <Card
                  key={index}
                  className="relative border border-sky-600 shadow-md bg-white overflow-hidden rounded-xl"
                >
                  <div className="absolute top-3 right-3">
                    <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-black shadow-md">
                      #{index + 1}
                    </div>
                  </div>

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
                        Doanh thu chi nhánh
                      </p>
                      <NumberTooltip fullValue={formatFullNumber(revenue)}>
                        <div className="text-2xl font-black text-blue-600 cursor-pointer">
                          {formatCompactNumber(revenue)}
                        </div>
                      </NumberTooltip>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <ShoppingBag className="h-4 w-4 text-emerald-600" />
                          <span>Mua hàng</span>
                        </div>
                        <NumberTooltip
                          fullValue={formatFullNumber(branch.salesRevenue || 0)}
                        >
                          <span className="font-bold text-gray-800 cursor-pointer">
                            {formatCompactNumber(branch.salesRevenue || 0)}
                          </span>
                        </NumberTooltip>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Stethoscope className="h-4 w-4 text-amber-500" />
                          <span>Khám bệnh</span>
                        </div>
                        <NumberTooltip
                          fullValue={formatFullNumber(
                            branch.medicalRevenue || 0
                          )}
                        >
                          <span className="font-bold text-gray-800 cursor-pointer">
                            {formatCompactNumber(branch.medicalRevenue || 0)}
                          </span>
                        </NumberTooltip>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Syringe className="h-4 w-4 text-rose-500" />
                          <span>Tiêm phòng</span>
                        </div>
                        <NumberTooltip
                          fullValue={formatFullNumber(
                            branch.vaccineRevenue || 0
                          )}
                        >
                          <span className="font-bold text-gray-800 cursor-pointer">
                            {formatCompactNumber(branch.vaccineRevenue || 0)}
                          </span>
                        </NumberTooltip>
                      </div>
                    </div>

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
