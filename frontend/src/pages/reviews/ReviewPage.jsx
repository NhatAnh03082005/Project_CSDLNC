import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Heart, Star, Calendar, Clock, MapPin, Loader2, Trash2, Edit } from "lucide-react";
import { ratingAPI } from "../../api/services";

export default function ReviewsPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [diemChatLuongDV, setDiemChatLuongDV] = useState(10);
  const [diemThaiDoNV, setDiemThaiDoNV] = useState(10);
  const [diemTongThe, setDiemTongThe] = useState(10);
  const [binhLuan, setBinhLuan] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await ratingAPI.getMyRatings();
      if (response.data.success) {
        setServices(response.data.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách dịch vụ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service) => {
    setSelectedService(service);
    if (service.DaDanhGia && service.DanhGia) {
      setDiemChatLuongDV(service.DanhGia.DiemChatLuongDV || 10);
      setDiemThaiDoNV(service.DanhGia.DiemThaiDoNV || 10);
      setDiemTongThe(service.DanhGia.DiemTongThe || 10);
      setBinhLuan(service.DanhGia.BinhLuan || "");
    } else {
      setDiemChatLuongDV(10);
      setDiemThaiDoNV(10);
      setDiemTongThe(10);
      setBinhLuan("");
    }
    setDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedService) return;

    try {
      setSubmitting(true);
      const ratingData = {
        MaHoaDon: selectedService.MaHoaDon,
        STT: selectedService.STT,
        DiemChatLuongDV: diemChatLuongDV,
        DiemThaiDoNV: diemThaiDoNV,
        DiemTongThe: diemTongThe,
        BinhLuan: binhLuan || null,
      };

      let response;
      if (selectedService.DaDanhGia) {
        response = await ratingAPI.update(
          selectedService.MaHoaDon,
          selectedService.STT,
          ratingData
        );
      } else {
        response = await ratingAPI.createOrUpdate(ratingData);
      }

      if (response.data.success) {
        alert(response.data.message || "Đánh giá thành công!");
        setDialogOpen(false);
        fetchServices();
      } else {
        alert(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      setSubmitting(true);
      const response = await ratingAPI.delete(
        serviceToDelete.MaHoaDon,
        serviceToDelete.STT
      );

      if (response.data.success) {
        alert("Xóa đánh giá thành công!");
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        fetchServices();
      } else {
        alert(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const ScoreSelector = ({ value, onChange, label }) => {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    num <= value
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-lg font-semibold w-16 text-center">{value}/10</span>
        </div>
      </div>
    );
  };

  const ScoreDisplay = ({ value }) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <Star
              key={num}
              className={`h-3 w-3 ${
                num <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold">{value}/10</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Lịch sử dịch vụ và đánh giá</h1>
            <p className="text-gray-600">Xem lại lịch sử sử dụng dịch vụ và chia sẻ trải nghiệm của bạn</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="ml-2">Đang tải...</p>
            </div>
          ) : services.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử sử dụng dịch vụ</h3>
                <p className="text-gray-600">Đặt lịch khám hoặc tiêm phòng cho thú cưng của bạn ngay hôm nay</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {services.map((service) => (
                <Card key={`${service.MaHoaDon}-${service.STT}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <CardTitle className="text-xl">
                            {service.LoaiDichVuSK === "Khám bệnh" ? "Khám bệnh" : "Tiêm phòng"}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className={
                              service.LoaiDichVuSK === "Khám bệnh"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {service.LoaiDichVuSK}
                          </Badge>
                          {service.DaDanhGia && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              Đã đánh giá
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Ngày sử dụng:</strong> {formatDate(service.NgayLap)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>
                                <strong>Chi nhánh:</strong> {service.TenChiNhanh || "N/A"}
                              </span>
                            </div>
                            {service.TenThuCung && (
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                                <span>
                                  <strong>Thú cưng:</strong> {service.TenThuCung} ({service.LoaiThuCung})
                                </span>
                              </div>
                            )}
                            {service.TenBacSi && (
                              <div className="flex items-center gap-2">
                                <span>
                                  <strong>Bác sĩ:</strong> {service.TenBacSi}
                                </span>
                              </div>
                            )}
                            {service.LoaiDichVuSK === "Tiêm phòng" && service.ChiTiet?.TenVacXin && (
                              <div className="flex items-center gap-2">
                                <span>
                                  <strong>Vắc xin:</strong> {service.ChiTiet.TenVacXin}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span>
                                <strong>Thành tiền:</strong> {service.ThanhTien?.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          </div>
                          {service.DaDanhGia && service.DanhGia && (
                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                                <span className="font-semibold text-gray-900">Đánh giá của bạn</span>
                              </div>
                              <div className="grid gap-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span>Chất lượng dịch vụ:</span>
                                  <ScoreDisplay value={service.DanhGia.DiemChatLuongDV} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Thái độ nhân viên:</span>
                                  <ScoreDisplay value={service.DanhGia.DiemThaiDoNV} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Đánh giá tổng thể:</span>
                                  <ScoreDisplay value={service.DanhGia.DiemTongThe} />
                                </div>
                                {service.DanhGia.BinhLuan && (
                                  <div className="mt-2 pt-2 border-t border-yellow-200">
                                    <p className="text-gray-700 italic">"{service.DanhGia.BinhLuan}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button onClick={() => handleOpenDialog(service)}>
                          {service.DaDanhGia ? (
                            <>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Đánh giá
                            </>
                          )}
                        </Button>
                        {service.DaDanhGia && (
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700 hover:text-red-700"
                            onClick={() => handleDeleteClick(service)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa đánh giá
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedService?.DaDanhGia ? "Chỉnh sửa đánh giá" : "Đánh giá dịch vụ"}
            </DialogTitle>
            <DialogDescription>
              {selectedService?.LoaiDichVuSK} tại {selectedService?.TenChiNhanh}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <ScoreSelector
              value={diemChatLuongDV}
              onChange={setDiemChatLuongDV}
              label="Điểm chất lượng dịch vụ (0-10)"
            />
            <ScoreSelector
              value={diemThaiDoNV}
              onChange={setDiemThaiDoNV}
              label="Điểm thái độ nhân viên (0-10)"
            />
            <ScoreSelector
              value={diemTongThe}
              onChange={setDiemTongThe}
              label="Điểm tổng thể (0-10)"
            />
            <div className="grid gap-2">
              <Label htmlFor="binhLuan">Bình luận (tùy chọn)</Label>
              <Textarea
                id="binhLuan"
                placeholder="Chia sẻ cảm nhận của bạn về dịch vụ, nhân viên, cơ sở vật chất..."
                value={binhLuan}
                onChange={(e) => setBinhLuan(e.target.value)}
                rows={4}
                maxLength={100}
              />
              <p className="text-xs text-gray-500">{binhLuan.length}/100 ký tự</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button onClick={handleSubmitReview} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                selectedService?.DaDanhGia ? "Cập nhật đánh giá" : "Gửi đánh giá"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa đánh giá"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

