import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  ArrowLeft, 
  Loader2, 
  Receipt, 
  Package, 
  Stethoscope, 
  Syringe,
  MapPin,
  CalendarDays
} from "lucide-react";


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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-gray-500 font-medium">Đang tải chi tiết hóa đơn...</p>
      </div>
    );
  }

  if (!data) return <div className="text-center py-20">Không tìm thấy dữ liệu hóa đơn.</div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Nút quay lại */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 hover:bg-blue-50 text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại lịch sử
      </Button>

      <Card className="shadow-lg border-none">
        {/* Header hóa đơn */}
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl uppercase">Chi tiết hóa đơn</CardTitle>
                <p className="text-blue-100 text-sm mt-1">Mã số: {data.MaHoaDon}</p>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg text-sm space-y-1 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Ngày: {new Date(data.NgayLap).toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Chi nhánh: {data.TenChiNhanh}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Danh sách dịch vụ/sản phẩm */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Danh mục thanh toán</h3>
            
            {data.chiTiet.map((item, idx) => (
              <div 
                key={idx} 
                className="group border rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* Icon dựa trên loại dịch vụ */}
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                      {item.LoaiChiTiet === "MuaHang" && <Package className="h-5 w-5 text-orange-500" />}
                      {item.LoaiChiTiet === "KhamBenh" && <Stethoscope className="h-5 w-5 text-blue-500" />}
                      {item.LoaiChiTiet === "TiemPhong" && <Syringe className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.LoaiDichVu}</p>
                      <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wider">
                        STT: {item.STT}
                      </Badge>
                    </div>
                  </div>
                  <span className="font-bold text-blue-700 text-lg">
                    {item.ThanhTien.toLocaleString()}₫
                  </span>
                </div>
                
                {/* Thông tin chi tiết */}
                <div className="ml-12 pl-1 border-l-2 border-gray-100">
                  <div className="text-sm text-gray-600 space-y-1">
                    {item.LoaiChiTiet === "MuaHang" && (
                      <p className="flex justify-between">
                        <span>Sản phẩm: <strong>{item.ChiTiet.TenSanPham}</strong></span>
                        <span>Số lượng: {item.ChiTiet.SoLuong}</span>
                      </p>
                    )}
                    {item.LoaiChiTiet === "KhamBenh" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p>Triệu chứng: <span className="text-gray-900">{item.ChiTiet.TrieuChung}</span></p>
                        <p>Chẩn đoán: <span className="text-gray-900">{item.ChiTiet.ChuanDoan}</span></p>
                        <p className="md:col-span-2">Bác sĩ phụ trách: <span className="font-medium text-blue-600">{item.ChiTiet.TenBacSi}</span></p>
                      </div>
                    )}
                    {item.LoaiChiTiet === "TiemPhong" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p>Vaccine: <span className="text-gray-900 font-medium">{item.ChiTiet.TenVacXin}</span></p>
                        <p>Bác sĩ tiêm: <span className="font-medium text-blue-600">{item.ChiTiet.TenBacSi}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phần tổng cộng */}
          <div className="mt-10 pt-6 border-t-2 border-dashed border-gray-100">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4 text-gray-500">
                <span className="text-sm">Hình thức thanh toán:</span>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none uppercase">
                  {data.HinhThucThanhToan}
                </Badge>
              </div>
              <div className="flex items-baseline gap-4 mt-2">
                <span className="text-lg font-medium text-gray-700">Tổng cộng thanh toán:</span>
                <h3 className="text-3xl font-black text-blue-600">
                  {data.TongTien.toLocaleString()}₫
                </h3>
              </div>
              <p className="text-[10px] text-gray-400 italic mt-2">
                * Hóa đơn này có giá trị xác nhận thanh toán tại hệ thống PetCareX
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}