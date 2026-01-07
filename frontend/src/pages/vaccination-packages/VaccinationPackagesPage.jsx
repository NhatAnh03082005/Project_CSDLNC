import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Calendar,
  Gift,
  Clock,
  Loader2,
  Sparkles,
  Syringe,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { vaccinationAPI } from "../../api/services";

// Helper function để format tên gói đẹp hơn
const formatPackageName = (loaiGoi) => {
  if (!loaiGoi) return loaiGoi;
  // Nếu là format "06Thang", "03Thang" -> "Gói 6 tháng", "Gói 3 tháng"
  const match = loaiGoi.match(/^(\d+)(Thang|thang)$/i);
  if (match) {
    const months = parseInt(match[1]);
    return `Gói ${months} tháng`;
  }
  // Nếu không match, trả về nguyên bản
  return loaiGoi;
};

export default function VaccinationPackagesPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registering, setRegistering] = useState(null); // Lưu LoaiGoi đang được xử lý

  // Fetch danh sách gói đã đăng ký
  const fetchSubscriptions = async () => {
    try {
      const response = await vaccinationAPI.getSubscriptions();
      if (response.data.success) {
        // Map dữ liệu từ backend sang frontend format
        const mapped = (response.data.data || []).map((sub) => ({
          MaGoiDK: sub.MaGoiDK,
          LoaiGoi: sub.LoaiGoi,
          displayName: formatPackageName(sub.LoaiGoi),
          duration: `${sub.ThoiHan} tháng`,
          benefits: `Giảm ${sub.UuDai}% chi phí tiêm phòng`,
          startDate: new Date(sub.ThoiGianBatDau).toLocaleDateString("vi-VN"),
          endDate: new Date(sub.ThoiGianKetThuc).toLocaleDateString("vi-VN"),
          TrangThai: sub.TrangThai,
        }));
        setSubscriptions(mapped);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách gói đã đăng ký:", error);
    }
  };

  // Fetch danh sách gói tiêm có sẵn
  const fetchAvailablePackages = async () => {
    try {
      const response = await vaccinationAPI.getPackages();
      if (response.data.success) {
        // Map dữ liệu từ backend sang frontend format
        const mapped = (response.data.data || []).map((pkg) => ({
          LoaiGoi: pkg.LoaiGoi,
          displayName: formatPackageName(pkg.LoaiGoi),
          duration: `${pkg.ThoiHan} tháng`,
          benefits: `Giảm ${pkg.UuDai}% chi phí tiêm phòng`,
        }));
        setAvailablePackages(mapped);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách gói tiêm:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscriptions(), fetchAvailablePackages()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRegister = async (pkg) => {
    try {
      setRegistering(pkg.LoaiGoi); // Chỉ set LoaiGoi đang được xử lý
      const response = await vaccinationAPI.subscribe({ LoaiGoi: pkg.LoaiGoi });

      if (response.data.success) {
        // Refresh danh sách gói đã đăng ký
        await fetchSubscriptions();
        setDialogOpen(false);
        alert("Đăng ký gói tiêm phòng thành công!");
      } else {
        alert(response.data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký gói:", error);
      alert(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!"
      );
    } finally {
      setRegistering(null); // Reset về null khi xong
    }
  };

  // Kiểm tra xem gói đã được đăng ký và đang hoạt động chưa
  // Chỉ disable nếu gói đang hoạt động, nếu hết hạn thì cho phép đăng ký lại
  const isPackageRegistered = (loaiGoi) => {
    return subscriptions.some(
      (sub) => sub.LoaiGoi === loaiGoi && sub.TrangThai === "Đang hoạt động"
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Dynamic Hero Section */}
      <div className="bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 py-16 relative z-10 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" />
                Dịch vụ tiêm chủng
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Gói{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  Tiêm phòng
                </span>
              </h1>
              <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
                Bảo vệ sức khỏe thú cưng của bạn một cách toàn diện với các gói
                ưu đãi tiêm chủng đặc biệt.
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="premium"
                  className="h-14 px-8 rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-emerald-300 transition-all active:scale-[0.98] flex gap-3 text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-500 border-none"
                >
                  <div className="p-1 bg-white/20 rounded-lg">
                    <Plus className="h-5 w-5" />
                  </div>
                  Đăng ký gói mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 px-8 py-12 text-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Syringe className="h-40 w-40 rotate-12" />
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-white/20 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-inner">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-3xl font-black tracking-tight">
                        Chọn gói Tiêm phòng
                      </DialogTitle>
                      <DialogDescription className="text-emerald-50/90 text-lg mt-1 font-medium">
                        Ưu đãi tiết kiệm đến 30% chi phí cho bạn
                      </DialogDescription>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
                  {availablePackages.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <AlertCircle className="h-12 w-12 text-slate-300 mx-auto" />
                      <p className="text-slate-500 font-medium">
                        Hiện không có gói tiêm phòng nào khả dụng
                      </p>
                    </div>
                  ) : (
                    availablePackages.map((pkg, index) => (
                      <div
                        key={pkg.LoaiGoi || index}
                        className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                            {pkg.displayName || pkg.LoaiGoi}
                          </h4>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                              <div className="p-1 px-1 bg-slate-100 rounded-md">
                                <Clock className="h-3.5 w-3.5" />
                              </div>
                              {pkg.duration}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                              <div className="p-1 bg-emerald-50 rounded-md">
                                <Zap className="h-3.5 w-3.5" />
                              </div>
                              {pkg.benefits}
                            </div>
                          </div>
                        </div>
                        <Button
                          className={`h-12 px-6 rounded-xl font-bold transition-all ${
                            isPackageRegistered(pkg.LoaiGoi)
                              ? "bg-slate-100 text-slate-400 border-none hover:bg-slate-100"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100"
                          }`}
                          onClick={() => handleRegister(pkg)}
                          disabled={
                            isPackageRegistered(pkg.LoaiGoi) ||
                            registering === pkg.LoaiGoi
                          }
                        >
                          {registering === pkg.LoaiGoi ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : isPackageRegistered(pkg.LoaiGoi) ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            "Đăng ký ngay"
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-8 pt-0 bg-slate-50/50">
                  <p className="text-center text-xs text-slate-400 font-medium">
                    * Các gói tiêm phòng được áp dụng ngay sau khi đăng ký thành
                    công.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center shadow-sm max-w-5xl mx-auto overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50" />
            <div className="max-w-md mx-auto space-y-8 relative z-10">
              <div className="h-28 w-28 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 rotate-3 shadow-inner">
                <Syringe className="h-14 w-14 text-emerald-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  Chưa có gói tiêm phòng
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Đăng ký gói tiêm phòng để nhận ưu đãi giảm giá chi phí và giúp
                  thú cưng của bạn luôn khỏe mạnh.
                </p>
              </div>
              <Button
                variant="premium"
                onClick={() => setDialogOpen(true)}
                className="h-14 px-12 rounded-2xl shadow-2xl shadow-emerald-100 font-black gap-3 bg-emerald-600 hover:bg-emerald-700 border-none"
              >
                <Plus className="h-5 w-5" />
                Khám phá các gói ngay
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {subscriptions.map((pkg) => {
              const isActive = pkg.TrangThai === "Đang hoạt động";
              return (
                <div
                  key={pkg.MaGoiDK}
                  className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/30 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Card Status Decoration */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 rounded-full blur-2xl opacity-40 transition-colors duration-500 ${
                      isActive ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />

                  <div className="p-8 relative z-10 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight transition-colors group-hover:text-emerald-700 capitalize">
                            {pkg.displayName || pkg.LoaiGoi}
                          </h3>
                          <Badge
                            className={`rounded-xl px-4 py-1.5 border-none font-black text-[10px] uppercase tracking-wider shadow-sm ${
                              isActive
                                ? "bg-emerald-100 text-emerald-700 shadow-emerald-100"
                                : "bg-slate-100 text-slate-600 shadow-slate-100"
                            }`}
                          >
                            {pkg.TrangThai}
                          </Badge>
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest pl-0.5">
                          Mã: {pkg.MaGoiDK}
                        </p>
                      </div>
                      <div
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 rotate-3 ${
                          isActive
                            ? "bg-emerald-600 shadow-emerald-200"
                            : "bg-slate-400 shadow-slate-200"
                        }`}
                      >
                        <Sparkles className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2 group-hover:bg-white transition-colors">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Thời hạn
                        </span>
                        <p className="text-slate-700 font-extrabold text-lg">
                          {pkg.duration}
                        </p>
                      </div>
                      <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-100 space-y-2 group-hover:bg-white transition-colors">
                        <span className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest flex items-center gap-1.5">
                          <Zap className="h-3 w-3" /> Ưu đãi
                        </span>
                        <p className="text-emerald-700 font-extrabold text-lg">
                          {pkg.benefits.split(" ")[1]}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl shadow-slate-200 group-hover:translate-y-[-4px] transition-transform duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Thời gian sử dụng
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] font-bold uppercase">
                            Bắt dầu
                          </p>
                          <p className="font-bold text-sm tracking-tight">
                            {pkg.startDate}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-600" />
                        <div className="space-y-1 text-right">
                          <p className="text-slate-400 text-[10px] font-bold uppercase">
                            Kết thúc
                          </p>
                          <p className="font-bold text-sm tracking-tight">
                            {pkg.endDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
