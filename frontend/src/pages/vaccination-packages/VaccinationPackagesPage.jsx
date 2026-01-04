import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Plus, Calendar, Gift, Clock, Loader2 } from "lucide-react";
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
      alert(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Gói tiêm phòng của tôi</h1>
              <p className="text-gray-600">Quản lý các gói tiêm phòng đã đăng ký cho thú cưng của bạn</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Đăng ký gói mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Đăng ký gói tiêm phòng</DialogTitle>
                  <DialogDescription>Chọn gói tiêm phòng phù hợp cho thú cưng của bạn</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {availablePackages.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Không có gói tiêm phòng nào</p>
                  ) : (
                    availablePackages.map((pkg, index) => (
                      <Card key={pkg.LoaiGoi || index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{pkg.displayName || pkg.LoaiGoi}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Thời hạn: {pkg.duration}</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{pkg.benefits}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRegister(pkg)}
                            disabled={isPackageRegistered(pkg.LoaiGoi) || registering === pkg.LoaiGoi}
                          >
                            {registering === pkg.LoaiGoi
                              ? "Đang xử lý..."
                              : isPackageRegistered(pkg.LoaiGoi)
                              ? "Đã đăng ký"
                              : "Đăng ký"}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {subscriptions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có gói tiêm phòng nào</h3>
                <p className="text-gray-600 mb-6">
                  Đăng ký gói tiêm phòng để nhận ưu đãi và chăm sóc tốt hơn cho thú cưng
                </p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Đăng ký gói mới</Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {subscriptions.map((pkg) => (
                <Card key={pkg.MaGoiDK} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{pkg.displayName || pkg.LoaiGoi}</CardTitle>
                          <Badge
                            variant="secondary"
                            className={
                              pkg.TrangThai === "Đang hoạt động"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {pkg.TrangThai}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Thời hạn:</strong> {pkg.duration}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Ưu đãi:</strong> {pkg.benefits}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Thời gian:</strong> {pkg.startDate} - {pkg.endDate}
                              </span>
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
