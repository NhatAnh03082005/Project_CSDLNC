import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Heart, Star, Calendar, Clock, MapPin, Loader2, Trash2, Edit, Briefcase, ChevronRight } from "lucide-react";
import { ratingAPI } from "../../api/services";

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
      <div className="flex flex-col gap-3 bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:shadow-orange-100/30">
        <div className="flex items-center justify-between px-1">
          <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest shrink-0">{label}</Label>
          <div className="h-7 w-9 bg-white rounded-lg shadow-inner border border-slate-100 flex items-center justify-center font-bold text-xs text-orange-600">
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
                className={`h-5 w-5 transition-colors ${
                  num <= value
                    ? "fill-orange-500 text-orange-500"
                    : "text-slate-200 group-hover/star:text-orange-200"
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
      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <Star
              key={num}
              className={`h-3 w-3 ${
                num <= value ? "fill-orange-500 text-orange-500" : "text-slate-100"
              }`}
            />
          ))}
        </div>
        <div className="text-[10px] font-black text-slate-800 tracking-tighter w-8 text-center bg-slate-50 rounded-md py-0.5 border border-slate-100">
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
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60" />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="h-14 w-14 bg-white rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center border border-slate-50">
                <Star className="h-7 w-7 text-orange-600 fill-orange-600" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  Lịch sử <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Đánh giá</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">
                  Xem lại lịch sử sử dụng dịch vụ và chia sẻ trải nghiệm của bạn
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-6">
               <div className="text-center">
                  <div className="text-2xl font-black text-orange-600">{services.length}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dịch vụ</div>
               </div>
               <div className="w-px h-8 bg-slate-100" />
               <div className="text-center">
                  <div className="text-2xl font-black text-emerald-600">
                    {services.filter(s => s.DaDanhGia).length}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã đánh giá</div>
               </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin" />
                <Star className="h-6 w-6 text-orange-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-orange-600" />
              </div>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Đang tải dữ liệu...</p>
            </div>
          ) : services.length === 0 ? (
            <Card className="rounded-[3rem] border-slate-100 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 p-20 text-center border-2">
              <CardContent className="space-y-6">
                <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-12 w-12 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Chưa có lịch sử dịch vụ</h3>
                  <p className="text-slate-500 font-medium">Đặt lịch khám hoặc tiêm phòng để trải nghiệm dịch vụ của chúng tôi</p>
                </div>
                <Button 
                  variant="premium" 
                  className="h-12 px-8 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg shadow-orange-200"
                  onClick={() => navigate("/customer")}
                >
                   Đặt lịch ngay
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {services.map((service) => (
                <Card key={`${service.MaHoaDon}-${service.STT}`} className={`rounded-[2.5rem] border-slate-100 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/40 transition-all duration-500 border-2 overflow-hidden group ${service.LoaiDichVuSK === "Khám bệnh" ? "hover:shadow-blue-100" : "hover:shadow-emerald-100"}`}>
                  <div className={`h-2 w-full ${service.LoaiDichVuSK === "Khám bệnh" ? "bg-blue-600" : "bg-emerald-500"}`} />
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6 flex-wrap">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${service.LoaiDichVuSK === "Khám bệnh" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}>
                             {service.LoaiDichVuSK === "Khám bệnh" ? <Edit className="h-6 w-6" /> : <Star className="h-6 w-6" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              {service.LoaiDichVuSK === "Khám bệnh" ? "Khám bệnh tổng quát" : "Tiêm phòng định kỳ"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                               <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded-lg px-2 py-0.5">
                                 #{service.MaHoaDon}-{service.STT}
                               </Badge>
                               {service.DaDanhGia ? (
                                 <Badge className="bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-wider rounded-lg px-2 py-0.5 border-none">
                                   Đã hoàn tất đánh giá
                                 </Badge>
                               ) : (
                                 <Badge className="bg-amber-100 text-amber-700 font-black text-[10px] uppercase tracking-wider rounded-lg px-2 py-0.5 border-none animate-pulse">
                                   Chưa đánh giá
                                 </Badge>
                               )}
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                           <div className="flex items-center gap-3 group/item">
                              <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-orange-600 transition-colors">
                                 <Calendar className="h-4 w-4" />
                              </div>
                              <div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày sử dụng</div>
                                 <div className="text-sm font-black text-slate-700">{formatDate(service.NgayLap)}</div>
                              </div>
                           </div>

                           <div className="flex items-center gap-3 group/item">
                              <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-orange-600 transition-colors">
                                 <MapPin className="h-4 w-4" />
                              </div>
                              <div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chi nhánh</div>
                                 <div className="text-sm font-black text-slate-700">{service.TenChiNhanh || "Chi nhánh PetCare"}</div>
                              </div>
                           </div>

                           {service.TenThuCung && (
                             <div className="flex items-center gap-3 group/item">
                                <div className="h-8 w-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-400 group-hover/item:bg-pink-100 transition-all">
                                   <Heart className="h-4 w-4 fill-current" />
                                </div>
                                <div>
                                   <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Thú cưng</div>
                                   <div className="text-sm font-black text-slate-700">{service.TenThuCung} <span className="text-slate-400 font-medium font-sans">({service.LoaiThuCung})</span></div>
                                </div>
                             </div>
                           )}

                           <div className="flex items-center gap-3 group/item">
                              <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-orange-600 transition-colors">
                                 <Briefcase className="h-4 w-4" />
                              </div>
                              <div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chi phí dịch vụ</div>
                                 <div className="text-sm font-black text-orange-600">{service.ThanhTien?.toLocaleString("vi-VN")} <span className="text-xs uppercase ml-0.5">vnđ</span></div>
                              </div>
                           </div>
                        </div>

                        {service.DaDanhGia && service.DanhGia && (
                          <div className="mt-8 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 backdrop-blur-sm relative overflow-hidden group/review hover:bg-white transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4">
                               <Star className="h-12 w-12 text-orange-100 opacity-50 -mr-4 -mt-4 transition-transform group-hover/review:scale-125" />
                            </div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                                <Star className="h-4 w-4 fill-current" />
                              </div>
                              <span className="font-black text-slate-800 uppercase text-xs tracking-widest">Đánh giá của bạn</span>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chất lượng dịch vụ</span>
                                <ScoreDisplay value={service.DanhGia.DiemChatLuongDV} />
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thái độ nhân viên</span>
                                <ScoreDisplay value={service.DanhGia.DiemThaiDoNV} />
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá tổng thể</span>
                                <ScoreDisplay value={service.DanhGia.DiemTongThe} />
                              </div>
                              
                              {service.DanhGia.BinhLuan && (
                                <div className="mt-4 p-4 bg-white rounded-2xl border-l-4 border-orange-500 shadow-sm italic text-slate-600 text-sm leading-relaxed">
                                  "{service.DanhGia.BinhLuan}"
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[180px]">
                        <Button 
                           variant="premium"
                           className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] ${service.DaDanhGia ? 'bg-white text-slate-900 border border-slate-100 hover:bg-slate-50 shadow-slate-200' : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-orange-200 hover:shadow-orange-400 border-none'}`}
                           onClick={() => handleOpenDialog(service)}
                        >
                          {service.DaDanhGia ? (
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Sửa cảm nghĩ
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-current" />
                              Tạo đánh giá
                            </div>
                          )}
                        </Button>
                        
                        {service.DaDanhGia && (
                          <Button
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl border-2 border-red-50 font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98]"
                            onClick={() => handleDeleteClick(service)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa bỏ
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
          <DialogHeader className="p-8 pb-0">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                  <Star className="h-6 w-6 fill-current" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                    {selectedService?.DaDanhGia ? "Cập nhật đánh giá" : "Gửi đánh giá dịch vụ"}
                  </DialogTitle>
                  <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {selectedService?.LoaiDichVuSK} • {selectedService?.TenChiNhanh}
                  </DialogDescription>
               </div>
            </div>
          </DialogHeader>
          <div className="p-8 pt-2 space-y-4">
            <div className="grid gap-3">
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
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="binhLuan" className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Bình luận chi tiết</Label>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-md border border-slate-100">
                    {binhLuan.length}/100 ký tự
                  </div>
                </div>
                <Textarea
                  id="binhLuan"
                  placeholder="Chia sẻ cảm nhận của bạn về chất lượng phục vụ..."
                  className="h-24 rounded-xl border-none bg-white shadow-inner transition-all focus:ring-2 focus:ring-orange-500/20 p-4 text-sm font-medium resize-none placeholder:text-slate-400/50"
                  value={binhLuan}
                  onChange={(e) => setBinhLuan(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 flex gap-3">
            <Button variant="outline" className="h-14 rounded-2xl flex-1 font-black uppercase text-xs tracking-widest border-2 border-slate-100 text-slate-500" onClick={() => setDialogOpen(false)} disabled={submitting}>
              Để sau
            </Button>
            <Button 
               variant="premium" 
               className="h-14 rounded-2xl flex-[2] font-black uppercase text-xs tracking-widest bg-gradient-to-r from-orange-600 to-amber-600 border-none shadow-xl shadow-orange-200" 
               onClick={handleSubmitReview} 
               disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang ghi nhận...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <span>{selectedService?.DaDanhGia ? "Lưu thay đổi" : "Xác nhận gửi"}</span>
                   <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white">
          <div className="h-2 bg-red-500" />
          <div className="p-8 text-center space-y-6">
            <div className="h-20 w-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto transition-transform hover:scale-110 duration-500">
               <Trash2 className="h-10 w-10 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                Xác nhận xóa
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium text-slate-500 px-4">
                Hành động này sẽ xóa vĩnh viễn đánh giá của bạn. Bạn có chắc chắn muốn tiếp tục?
              </AlertDialogDescription>
            </div>

            <div className="flex gap-3 pt-2">
              <AlertDialogCancel 
                className="flex-1 h-14 rounded-2xl border-2 border-slate-100 font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                disabled={submitting}
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="flex-[1.5] h-14 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 hover:shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </div>
                ) : (
                  "Xác nhận xóa"
                )}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
