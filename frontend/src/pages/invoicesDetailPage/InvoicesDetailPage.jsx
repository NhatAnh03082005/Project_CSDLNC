import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowLeft,
  Loader2,
  Receipt,
  Package,
  Stethoscope,
  Syringe,
  MapPin,
  CalendarDays,
  CheckCircle,
  Clock,
  Download,
  ChevronRight,
} from "lucide-react";

// --- Helper: status config giống vibe list ---
const paymentStatusConfig = {
  paid: {
    text: "Thành công",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: CheckCircle,
  },
  pending: {
    text: "Chờ thanh toán",
    color: "text-orange-600",
    bg: "bg-orange-50",
    icon: Clock,
  },
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await customerAPI.getInvoiceDetails(id);
        setData(res.data.data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const computed = useMemo(() => {
    if (!data) return null;

    // map trạng thái nếu backend có (tùy field bạn có)
    const rawStatus =
      data.TrangThaiThanhToan ||
      data.TrangThai ||
      (data.HinhThucThanhToan ? "paid" : "paid");

    const status = rawStatus?.toLowerCase?.().includes("pending")
      ? "pending"
      : "paid";

    const statusMeta = paymentStatusConfig[status] || paymentStatusConfig.paid;

    // tính tổng trước giảm (nếu có KM)
    const tongTienTruocGiam =
      (data.chiTiet || []).reduce((sum, item) => {
        if (item.LoaiChiTiet === "MuaHang") {
          return (
            sum + (item.ChiTiet?.DonGia || 0) * (item.ChiTiet?.SoLuong || 0)
          );
        }
        return sum + (item.ThanhTien || 0);
      }, 0) || 0;

    const tongTienSauGiam = data.TongTien || 0;
    const tongTienGiam = Math.max(0, tongTienTruocGiam - tongTienSauGiam);

    return {
      status,
      statusMeta,
      tongTienTruocGiam,
      tongTienSauGiam,
      tongTienGiam,
    };
  }, [data]);

  const handleDownload = async () => {
    // Hook sẵn: tuỳ backend có endpoint tải PDF/hoá đơn
    // Ví dụ: await customerAPI.downloadInvoice(id)
    console.log("Download invoice:", id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
        <p className="text-blue-700 font-bold animate-pulse">
          Đang tải chi tiết hóa đơn...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-blue-200 p-10 text-center max-w-lg w-full">
          <p className="text-slate-700 font-black text-xl">
            Không tìm thấy dữ liệu hóa đơn.
          </p>
          <p className="text-slate-500 mt-2">
            Vui lòng quay lại và thử mở lại hóa đơn.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = computed?.statusMeta?.icon || CheckCircle;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      {/* HEADER */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-8 pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-white/50 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* BODY */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-20">
        <Card className="bg-white rounded-[2rem] border-2 border-blue-100 shadow-sm overflow-hidden">
          <CardHeader className="px-6 md:px-8 pt-8 pb-6">
            <CardTitle className="text-3xl font-black text-blue-600">
              Danh mục thanh toán
            </CardTitle>
            <p className="text-slate-500 mt-1">
              Chi tiết các dịch vụ/sản phẩm trong hóa đơn
            </p>
          </CardHeader>

          <CardContent className="px-6 md:px-8 pb-8">
            <div className="space-y-3">
              {(data.chiTiet || []).map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-4 md:p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                        {item.LoaiChiTiet === "MuaHang" && (
                          <Package className="h-5 w-5 text-orange-500" />
                        )}
                        {item.LoaiChiTiet === "KhamBenh" && (
                          <Stethoscope className="h-5 w-5 text-blue-500" />
                        )}
                        {item.LoaiChiTiet === "TiemPhong" && (
                          <Syringe className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-black text-slate-900 truncate">
                            {item.LoaiDichVu}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase tracking-wider"
                          >
                            STT: {item.STT}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Loại:{" "}
                          <span className="font-semibold text-slate-700">
                            {item.LoaiChiTiet}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Thành tiền
                      </p>
                      <p className="font-black text-blue-700 text-xl">
                        {item.ThanhTien?.toLocaleString()}₫
                      </p>
                    </div>
                  </div>

                  {/* Detail content */}
                  <div className="mt-4 pl-4 md:pl-6 border-l-2 border-slate-100">
                    <div className="text-sm text-slate-600 space-y-2">
                      {item.LoaiChiTiet === "MuaHang" && (
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="min-w-0">
                              Sản phẩm:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.TenSanPham}
                              </span>
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="min-w-0">
                              Đơn giá:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.DonGia?.toLocaleString()}đ
                              </span>{" "}
                              - Số lượng:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.SoLuong}
                              </span>
                            </p>
                          </div>

                          {(() => {
                            const giaGoc =
                              (item.ChiTiet?.DonGia || 0) *
                              (item.ChiTiet?.SoLuong || 0);
                            const giaSauGiam = item.ThanhTien || 0;
                            const tienGiam = giaGoc - giaSauGiam;
                            const tiLeGiam = data.TiLeGiamGia || 0;

                            if (tiLeGiam > 0 && tienGiam > 0) {
                              return (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 space-y-1 text-xs">
                                  <div className="flex justify-between text-slate-700">
                                    <span>Giá gốc:</span>
                                    <span className="line-through text-slate-500">
                                      {giaGoc.toLocaleString()}₫
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-emerald-700 font-semibold">
                                    <span>Giảm giá ({tiLeGiam}%):</span>
                                    <span>-{tienGiam.toLocaleString()}₫</span>
                                  </div>
                                  <div className="flex justify-between text-blue-700 font-black border-t border-emerald-200 pt-2 mt-2">
                                    <span>Thành tiền:</span>
                                    <span>{giaSauGiam.toLocaleString()}₫</span>
                                  </div>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      )}

                      {item.LoaiChiTiet === "KhamBenh" && (
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="min-w-0">
                              Bác sĩ phụ trách:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.TenBacSi || "Không sử dụng"}
                              </span>
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="min-w-0">
                              Triệu chứng:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.TrieuChung || "Không sử dụng"}
                              </span>{" "}
                              - Chẩn đoán:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.ChuanDoan || "Không sử dụng"}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}

                      {item.LoaiChiTiet === "TiemPhong" && (
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="min-w-0">
                              Bác sĩ tiêm:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.TenBacSi || "Không sử dụng"}
                              </span>
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="min-w-0">
                              Vaccine:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.TenVacXin || "Không sử dụng"}
                              </span>{" "}
                              - Gói tiêm:{" "}
                              <span className="font-semibold text-slate-900">
                                {item.ChiTiet?.LoaiGoi || "Không sử dụng"}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-200">
              <div className="flex flex-col items-end gap-3">
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <span className="text-sm text-slate-500 font-semibold">
                    Hình thức thanh toán:
                  </span>
                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none uppercase rounded-xl">
                    {data.HinhThucThanhToan}
                  </Badge>
                </div>

                {data.TiLeGiamGia > 0 &&
                  data.MaKhuyenMai &&
                  computed &&
                  computed.tongTienGiam > 0 && (
                    <div className="w-full max-w-md bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between text-sm text-slate-700">
                        <span>Tạm tính:</span>
                        <span className="line-through text-slate-500">
                          {computed.tongTienTruocGiam.toLocaleString()}₫
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-emerald-700 font-semibold">
                        <span>Khuyến mãi ({data.TiLeGiamGia}%):</span>
                        <span>-{computed.tongTienGiam.toLocaleString()}₫</span>
                      </div>
                      <div className="border-t border-emerald-200 pt-2" />
                      <div className="flex justify-between text-sm font-black text-blue-700">
                        <span>Thành tiền:</span>
                        <span>
                          {computed.tongTienSauGiam.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  )}

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 text-right">
                  <span className="text-lg font-semibold text-slate-700">
                    Tổng cộng thanh toán:
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-blue-600">
                    {data.TongTien.toLocaleString()}₫
                  </h3>
                </div>

                <p className="text-[10px] text-slate-400 italic mt-2 text-right">
                  * Hóa đơn này có giá trị xác nhận thanh toán tại hệ thống
                  PetCareX
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
