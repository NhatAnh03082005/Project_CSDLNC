// ReviewsPage.jsx ✅ Concept: "The Long Receipt" (1 khung trắng, chia section bằng dashed)
// - Giữ nguyên toàn bộ logic fetch / create-update / delete
// - Chỉ thay layout + UI theo receipt style (gọn, 1 khung, ngăn dashed)
// - Vẫn giữ palette xanh (blue/cyan) như bạn đang dùng

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
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
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Star,
  Calendar,
  MapPin,
  Loader2,
  Trash2,
  Edit,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Receipt,
} from "lucide-react";
import { ratingAPI } from "../../api/services";
import { toast } from "../../lib/toast";

export default function ReviewsPage() {
  const navigate = useNavigate();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        toast.success(response.data.message || "Đánh giá thành công!");
        setDialogOpen(false);
        fetchServices();
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
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
        toast.success("Xóa đánh giá thành công!");
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        fetchServices();
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  const ScoreSelector = ({ value, onChange, label }) => {
    return (
      <div className="flex flex-col gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-1">
          <Label className="text-[9px] font-black uppercase text-slate-500 tracking-widest shrink-0">
            {label}
          </Label>
          <div className="h-6 w-8 bg-white rounded-md shadow-inner border border-slate-200 flex items-center justify-center font-black text-[10px] text-amber-600">
            {value}
          </div>
        </div>

        <div className="flex items-center justify-between w-full px-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className="focus:outline-none transition-all hover:scale-125 active:scale-95 group/star"
            >
              <Star
                className={`h-3.5 w-3.5 transition-colors ${
                  num <= value
                    ? "fill-amber-500 text-amber-500"
                    : "text-slate-200 group-hover/star:text-amber-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const ScoreDisplay = ({ value }) => {
    return (
      <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <Star
              key={num}
              className={`h-2.5 w-2.5 ${
                num <= value
                  ? "fill-amber-500 text-amber-500"
                  : "text-slate-100"
              }`}
            />
          ))}
        </div>
        <div className="text-[10px] font-black text-slate-800 tracking-tighter w-10 text-center bg-slate-50 rounded-md py-0.5 border border-slate-200">
          {value}/10
        </div>
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

  const serviceTitle = (s) => {
    // bạn đang dùng LoaiDichVuSK để phân loại
    if (s.LoaiDichVuSK === "Khám bệnh") return "Khám bệnh tổng quát";
    return "Tiêm phòng định kỳ";
  };

  const totalReviewed = services.filter((s) => s.DaDanhGia).length;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      {/* NAV + ACTION */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-all hover:translate-x-[-4px]"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="flex items-center gap-3">
          <Badge className="bg-white text-slate-700 border border-slate-200 rounded-full px-3 py-1 shadow-sm">
            {services.length} dịch vụ
          </Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 shadow-sm">
            {totalReviewed} đã đánh giá
          </Badge>
        </div>
      </div>

      {/* MAIN RECEIPT */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600" />

        {/* HEADER */}
        <div className="p-8 pb-6 text-center border-b border-dashed border-slate-200">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-wide">
            Lịch sử đánh giá
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Xem lại dịch vụ đã sử dụng và chia sẻ trải nghiệm của bạn
          </p>

          <div className="mt-6 flex justify-center gap-6 text-sm text-slate-600">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Tổng dịch vụ
              </span>
              <span className="font-black text-slate-800 text-lg">
                {services.length}
              </span>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Đã đánh giá
              </span>
              <span className="font-black text-emerald-600 text-lg">
                {totalReviewed}
              </span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-lg border border-slate-200 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
              <p className="text-slate-600 font-semibold">
                Đang tải dữ liệu đánh giá...
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">
                Chưa có lịch sử dịch vụ
              </h3>
              <p className="mt-2 text-slate-500 font-medium">
                Đặt lịch khám hoặc tiêm phòng để trải nghiệm dịch vụ của chúng
                tôi.
              </p>
              <Button
                className="mt-6 h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black border-none shadow-lg shadow-blue-200"
                onClick={() => navigate("/customer")}
              >
                Đặt lịch ngay
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Danh sách dịch vụ
              </div>

              {/* LIST: mỗi item là 1 dòng, ngăn dashed */}
              <div className="divide-y divide-dashed divide-blue-200 rounded-2xl border border-blue-200 overflow-hidden">
                {services.map((service, idx) => {
                  const key = `${service.MaHoaDon}-${service.STT}`;
                  const reviewed = !!service.DaDanhGia;

                  return (
                    <div
                      key={key}
                      className="group bg-white hover:bg-blue-50/30 transition-all duration-300 hover:shadow-md cursor-pointer"
                    >
                      <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* LEFT: idx + title + tags */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                            {idx + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-slate-900 font-black truncate">
                                {serviceTitle(service)}
                              </p>

                              <Badge className="bg-slate-100 text-slate-700 border-none text-[10px] uppercase tracking-wider rounded-full">
                                #{service.MaHoaDon}-{service.STT}
                              </Badge>

                              {reviewed ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase tracking-wider rounded-full">
                                  Đã đánh giá
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] uppercase tracking-wider rounded-full">
                                  Chưa đánh giá
                                </Badge>
                              )}
                            </div>

                            {/* meta row */}
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                              <div className="flex items-center gap-2 text-slate-600 min-w-0 group-hover:text-blue-600 transition-colors">
                                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="font-semibold truncate">
                                  {formatDate(service.NgayLap)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-slate-600 min-w-0 group-hover:text-blue-600 transition-colors">
                                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="font-semibold truncate">
                                  {service.TenChiNhanh || "Chi nhánh PetCare"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-slate-600 min-w-0 group-hover:text-blue-600 transition-colors">
                                <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                <span className="font-black text-blue-600 truncate">
                                  {service.ThanhTien?.toLocaleString("vi-VN")} đ
                                </span>
                              </div>
                            </div>

                            {/* quick score preview (nếu đã đánh giá) */}
                            {reviewed && service.DanhGia ? (
                              <div className="mt-3 flex flex-wrap gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    Tổng thể
                                  </span>
                                  <ScoreDisplay
                                    value={service.DanhGia.DiemTongThe || 10}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* RIGHT: actions */}
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            className={`h-11 rounded-2xl font-black text-xs uppercase tracking-widest px-4 shadow-sm transition-all active:scale-[0.98] ${
                              reviewed
                                ? "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-blue-300"
                                : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none shadow-blue-200 hover:shadow-blue-300 hover:scale-105"
                            }`}
                            onClick={() => handleOpenDialog(service)}
                          >
                            {reviewed ? (
                              <span className="flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Sửa
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-current" />
                                Đánh giá
                              </span>
                            )}
                          </Button>

                          {reviewed ? (
                            <Button
                              variant="outline"
                              className="h-11 rounded-2xl border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:scale-105 font-black text-xs uppercase tracking-widest px-3 transition-all"
                              onClick={() => handleDeleteClick(service)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== DIALOG: CREATE/UPDATE ====== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl rounded-[1.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600" />

          <DialogHeader className="p-5 pb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
                <Star className="h-4 w-4 fill-current group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
                  {selectedService?.DaDanhGia
                    ? "Cập nhật đánh giá"
                    : "Gửi đánh giá dịch vụ"}
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  #{selectedService?.MaHoaDon}-{selectedService?.STT} •{" "}
                  {selectedService?.TenChiNhanh}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 pt-2 space-y-3">
            <ScoreSelector
              value={diemChatLuongDV}
              onChange={setDiemChatLuongDV}
              label="Chất lượng dịch vụ"
            />
            <ScoreSelector
              value={diemThaiDoNV}
              onChange={setDiemThaiDoNV}
              label="Thái độ nhân viên"
            />
            <ScoreSelector
              value={diemTongThe}
              onChange={setDiemTongThe}
              label="Đánh giá tổng thể"
            />

            <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-1">
                <Label
                  htmlFor="binhLuan"
                  className="text-[9px] font-black uppercase text-slate-500 tracking-widest"
                >
                  Bình luận chi tiết
                </Label>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {binhLuan.length}/100
                </div>
              </div>
              <Textarea
                id="binhLuan"
                placeholder="Chia sẻ cảm nhận của bạn..."
                className="h-20 rounded-lg border border-slate-200 bg-white shadow-inner focus:ring-2 focus:ring-blue-500/20 p-3 text-xs font-medium resize-none placeholder:text-slate-400/70"
                value={binhLuan}
                onChange={(e) => setBinhLuan(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          <DialogFooter className="p-5 pt-0 flex gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl flex-1 font-black uppercase text-[10px] tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Để sau
            </Button>
            <Button
              className="h-10 rounded-xl flex-[2] font-black uppercase text-[10px] tracking-widest bg-gradient-to-r from-blue-600 to-cyan-600 border-none shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 transition-all"
              onClick={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Đang ghi nhận...
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-white">
                  {selectedService?.DaDanhGia ? "Lưu thay đổi" : "Xác nhận gửi"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====== ALERT: DELETE ====== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[420px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="h-2 bg-red-500" />
          <div className="p-8 text-center space-y-6">
            <div className="h-20 w-20 bg-red-50 rounded-[1.75rem] border border-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="h-10 w-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                Xác nhận xóa
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium text-slate-500 px-3">
                Hành động này sẽ xóa vĩnh viễn đánh giá của bạn. Bạn có chắc
                chắn muốn tiếp tục?
              </AlertDialogDescription>
            </div>

            <div className="flex gap-3 pt-2">
              <AlertDialogCancel
                className="flex-1 h-12 rounded-2xl border border-slate-200 font-black uppercase text-xs tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:scale-105 transition-all"
                disabled={submitting}
              >
                Hủy
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="flex-[1.5] h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-red-100 hover:shadow-red-200 hover:scale-105 transition-all border-none"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xóa...
                  </span>
                ) : (
                  "Xóa đánh giá"
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
