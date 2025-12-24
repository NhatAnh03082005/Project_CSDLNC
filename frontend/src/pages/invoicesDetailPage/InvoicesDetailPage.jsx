import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="border-b pb-4 mb-4 flex justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase">Chi tiết hóa đơn</h2>
            <p className="text-sm text-gray-500">Mã: {data.MaHoaDon}</p>
          </div>
          <div className="text-right text-sm">
            <p>Ngày: {new Date(data.NgayLap).toLocaleString("vi-VN")}</p>
            <p>Chi nhánh: {data.TenChiNhanh}</p>
          </div>
        </div>

        <div className="space-y-6">
          {data.chiTiet.map((item, idx) => (
            <div key={idx} className="border-b pb-4 last:border-0">
              <div className="flex justify-between font-medium">
                <span>{item.LoaiDichVu}</span>
                <span>{item.ThanhTien.toLocaleString()}₫</span>
              </div>
              
              {/* Hiển thị dựa trên Loại Chi Tiết */}
              <div className="text-sm text-gray-600 mt-1 ml-4 italic">
                {item.LoaiChiTiet === "MuaHang" && (
                  <p>- {item.ChiTiet.TenSanPham} (SL: {item.ChiTiet.SoLuong})</p>
                )}
                {item.LoaiChiTiet === "KhamBenh" && (
                  <>
                    <p>- Triệu chứng: {item.ChiTiet.TrieuChung}</p>
                    <p>- Chẩn đoán: {item.ChiTiet.ChuanDoan}</p>
                    <p>- Bác sĩ: {item.ChiTiet.TenBacSi}</p>
                  </>
                )}
                {item.LoaiChiTiet === "TiemPhong" && (
                  <>
                    <p>- Vaccine: {item.ChiTiet.TenVacXin}</p>
                    <p>- Bác sĩ tiêm: {item.ChiTiet.TenBacSi}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t text-right">
          <p className="text-gray-500">Hình thức: {data.HinhThucThanhToan}</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-2">
            Tổng: {data.TongTien.toLocaleString()}₫
          </h3>
        </div>
      </div>
    </div>
  );
}