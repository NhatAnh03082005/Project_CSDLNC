// CustomerInvoicesPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, ReceiptText, ChevronRight } from "lucide-react";

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await customerAPI.getInvoices();
        // Sắp xếp theo ngày lập mới nhất dựa trên trường NgayLap từ API
        const sorted = (res.data.data || []).sort(
          (a, b) => new Date(b.NgayLap) - new Date(a.NgayLap)
        );
        setInvoices(sorted);
      } catch (error) {
        console.error("Lỗi tải hóa đơn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ReceiptText className="text-blue-600" /> Lịch sử hóa đơn
      </h1>
      
      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-gray-50">
          <ReceiptText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Chưa có hóa đơn nào</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Lịch sử giao dịch của bạn sẽ xuất hiện tại đây sau khi bạn sử dụng dịch vụ.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* PHẦN QUAN TRỌNG: Vòng lặp hiển thị dữ liệu từ API */}
          {invoices.map((inv) => (
  // Chuyển hướng đến /invoices/HD000001 chẳng hạn
  <Link key={inv.MaHoaDon} to={`/invoices/${inv.MaHoaDon}`}>
    <Card className="hover:border-blue-500 transition-all cursor-pointer group">
      <CardContent className="p-5 flex justify-between items-center">
        <div>
          <span className="font-bold text-blue-700">#{inv.MaHoaDon}</span>
          <p className="text-sm text-gray-600">
            Ngày lập: {new Date(inv.NgayLap).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{inv.TongTien?.toLocaleString()}₫</p>
          <p className="text-xs text-blue-500">Xem chi tiết</p>
        </div>
      </CardContent>
    </Card>
  </Link>
))}
        </div>
      )}
    </div>
  );
}