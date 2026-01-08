// CustomerInvoicesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Loader2,
  ReceiptText,
  ArrowLeft,
  CreditCard,
  Zap,
  AlertCircle,
  Search,
  Receipt,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";

// --- Row Item theo layout bạn đưa ---
const InvoiceRowItem = ({
  id,
  date,
  branch,
  amount,
  status = "paid",
  to,
  onDownload,
}) => {
  const statusConfig = {
    paid: {
      text: "Xem chi tiết hóa đơn",
      color: "text-blue-600 group-hover:text-white",
      bg: "bg-blue-50 group-hover:bg-blue-600",
      icon: ChevronRight,
    },
    pending: {
      text: "Chờ thanh toán",
      color: "text-orange-600 group-hover:text-white",
      bg: "bg-orange-50 group-hover:bg-orange-600",
      icon: Clock,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.paid;
  const StatusIcon = currentStatus.icon;

  return (
    <Link to={to} className="block">
      <Card className="group bg-white rounded-2xl border-2 border-blue-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-out">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* 1) Icon & ID */}
            <div className="flex items-center gap-4 min-w-0 lg:min-w-[240px]">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <Receipt className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  Mã hóa đơn
                </p>
                <p className="text-base font-black text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                  {id}
                </p>
              </div>
            </div>

            {/* 2) Details: Date & Branch */}
            <div className="flex-1 min-w-0 lg:px-6 lg:mx-2 lg:border-l lg:border-r lg:border-dashed lg:border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold uppercase">
                      Ngày lập
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{date}</p>
                </div>

                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold uppercase">
                      Chi nhánh
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {branch}
                  </p>
                </div>
              </div>
            </div>

            {/* 3) Amount + CTA Button */}
            <div className="flex items-center justify-between lg:justify-end gap-6 lg:gap-10 min-w-0 lg:min-w-[350px]">
              <div className="text-left lg:text-right">
                <p className="text-2xl font-black text-blue-600 group-hover:scale-105 transition-transform duration-300">
                  {amount}
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase transition-all duration-300 shadow-sm group-hover:shadow-lg ${currentStatus.bg} ${currentStatus.color}`}
              >
                {currentStatus.text}
                <StatusIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await customerAPI.getInvoices();
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

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        inv.MaHoaDon?.toLowerCase().includes(searchLower) ||
        inv.TenChiNhanh?.toLowerCase().includes(searchLower) ||
        new Date(inv.NgayLap).toLocaleDateString("vi-VN").includes(searchTerm)
      );
    });
  }, [invoices, searchTerm]);

  const handleDownloadInvoice = async (maHoaDon) => {
    // Hook sẵn: tuỳ backend bạn có endpoint download PDF thì gọi ở đây.
    // Ví dụ: await customerAPI.downloadInvoice(maHoaDon)
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-white shadow-lg border border-blue-100 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
        <p className="text-blue-700 font-bold animate-pulse">
          Đang tải lịch sử hóa đơn...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* HERO / HEADER */}
      <div className="bg-transparent border-b border-blue-100/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40" />

        <div className="max-w-[1600px] mx-auto px-6 py-14 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">
                <ReceiptText className="h-3 w-3" />
                Giao dịch
              </div>

              <div className="flex items-center gap-4">
                <Link to="/customer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/70 backdrop-blur text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors h-11 w-11 rounded-2xl shadow-sm"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>

                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                      Lịch sử hóa đơn
                    </span>
                  </h1>
                  <p className="text-slate-500 text-lg mt-1 max-w-xl leading-relaxed">
                    Quản lý và tra cứu các giao dịch đã thực hiện trong hệ
                    thống.
                  </p>
                </div>
              </div>
            </div>

            {/* SUMMARY CARD */}
            <div className="w-full lg:w-auto">
              <div className="bg-blue-50 backdrop-blur rounded-[2.5rem] border border-blue-100 shadow-md p-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-200 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-blue-900">
                      {invoices.length} hóa đơn
                    </div>
                    <div className="text-[10px] text-blue-500 uppercase font-extrabold tracking-widest">
                      Tổng lịch sử
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-blue-50 border border-blue-100">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                    Sắp xếp mới nhất
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Tìm theo mã hóa đơn, chi nhánh hoặc ngày lập (dd/mm/yyyy)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 bg-white/70 backdrop-blur border-blue-100 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-[2rem] text-base transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-[1600px] mx-auto px-6 pb-10">
        {invoices.length === 0 ? (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-blue-200 p-20 text-center shadow-sm max-w-5xl mx-auto overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
            <div className="max-w-md mx-auto space-y-8 relative z-10">
              <div className="h-28 w-28 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto rotate-3 shadow-inner border border-blue-100">
                <ReceiptText className="h-14 w-14 text-blue-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  Chưa có hóa đơn nào
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  Lịch sử giao dịch của bạn sẽ xuất hiện tại đây sau khi sử dụng
                  dịch vụ tại hệ thống.
                </p>
              </div>
              <Link to="/services">
                <Button className="h-14 px-12 rounded-2xl shadow-2xl shadow-blue-100 font-black gap-3 bg-blue-600 hover:bg-blue-700 border-none">
                  <CreditCard className="h-5 w-5" />
                  Khám phá dịch vụ
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-14 bg-white/70 backdrop-blur rounded-[2.5rem] border border-dashed border-blue-200">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-blue-400" />
            </div>
            <p className="mt-4 text-slate-500 font-bold">
              Không tìm thấy hóa đơn phù hợp với tìm kiếm của bạn
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Thử nhập mã hóa đơn, chi nhánh hoặc ngày lập (vd: 07/01/2026).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((inv) => (
              <InvoiceRowItem
                key={inv.MaHoaDon}
                id={`#${inv.MaHoaDon}`}
                date={new Date(inv.NgayLap).toLocaleDateString("vi-VN")}
                branch={inv.TenChiNhanh || "Z-PetCare"}
                amount={`${inv.TongTien?.toLocaleString()}₫`}
                // nếu backend có trạng thái thì map vào đây, chưa có thì mặc định "paid"
                status={inv.TrangThaiThanhToan || "paid"}
                to={`/invoices/${inv.MaHoaDon}`}
                onDownload={handleDownloadInvoice}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
