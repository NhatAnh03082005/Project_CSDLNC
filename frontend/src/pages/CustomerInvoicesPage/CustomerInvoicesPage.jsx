import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card"; // Import từ file card.jsx
import { Button } from "../../components/ui/button";
import { Loader2, ReceiptText } from "lucide-react";

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await customerAPI.getInvoices();
        // Sắp xếp theo ngày lập mới nhất
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
  <div className="container mx-auto py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">Lịch sử hóa đơn</h1>
    
    {invoices.length === 0 ? (
      /* Căn giữa nội dung trống để tăng tính thẩm mỹ */
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
           <ReceiptText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Chưa có hóa đơn nào</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          Lịch sử giao dịch của bạn sẽ xuất hiện tại đây sau khi bạn sử dụng dịch vụ hoặc mua sắm.
        </p>
      </div>
    ) : (
      <div className="grid gap-4">
        {/* Render danh sách hóa đơn ở đây */}
      </div>
    )}
  </div>
);
}