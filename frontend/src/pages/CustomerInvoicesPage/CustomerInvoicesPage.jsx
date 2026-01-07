// CustomerInvoicesPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../../api/services";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Loader2,
  ReceiptText,
  ChevronRight,
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  Wallet,
  CreditCard,
} from "lucide-react";

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      inv.MaHoaDon?.toLowerCase().includes(searchLower) ||
      inv.TenChiNhanh?.toLowerCase().includes(searchLower) ||
      new Date(inv.NgayLap).toLocaleDateString("vi-VN").includes(searchTerm)
    );
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-blue-600 font-bold animate-pulse">
          Đang tải lịch sử hóa đơn...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        {/* HEADER SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-md p-8 border border-blue-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors h-10 w-10 rounded-xl"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Lịch sử hóa đơn
                </h1>
                <p className="text-gray-600 mt-1">
                  Quản lý và tra cứu các giao dịch đã thực hiện
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ReceiptText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-900">
                  {invoices.length} hóa đơn
                </div>
                <div className="text-[10px] text-blue-500 uppercase font-extrabold">
                  Tổng lịch sử
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã hóa đơn, chi nhánh hoặc ngày lập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-2xl text-lg transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-blue-200 space-y-6">
            <div className="p-6 bg-blue-50 rounded-full">
              <ReceiptText className="h-12 w-12 text-blue-300" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">
                Chưa có hóa đơn nào
              </h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Lịch sử giao dịch của bạn sẽ xuất hiện tại đây sau khi bạn sử
                dụng dịch vụ tại hệ thống.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvoices.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-medium bg-white/30 rounded-3xl border border-dashed border-slate-200">
                Không tìm thấy hóa đơn nào phù hợp với tìm kiếm của bạn
              </div>
            ) : (
              filteredInvoices.map((inv) => (
                <Link key={inv.MaHoaDon} to={`/invoices/${inv.MaHoaDon}`}>
                  <Card className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-blue-100 overflow-hidden cursor-pointer">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 via-sky-500 to-teal-500 flex items-center justify-center shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform duration-500">
                            <CreditCard className="h-9 w-9 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              #{inv.MaHoaDon}
                            </h3>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              Hóa đơn điện tử
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-blue-600">
                            {inv.TongTien?.toLocaleString()}₫
                          </p>
                          <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 rounded-lg mt-2 font-bold flex items-center gap-1.5 shadow-sm">
                            Thành công
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all group-hover:shadow-md">
                          <div className="p-2 bg-blue-50 rounded-xl">
                            <Calendar className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">
                              Ngày lập
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {new Date(inv.NgayLap).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all group-hover:shadow-md">
                          <div className="p-2 bg-blue-50 rounded-xl">
                            <MapPin className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">
                              Chi nhánh
                            </span>
                            <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                              {inv.TenChiNhanh || "Z-PetCare"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between group/link">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                          Xem chi tiết hóa đơn
                        </span>
                        <div className="h-10 w-10 rounded-full bg-slate-50 group-hover:bg-blue-600 transition-all flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-200">
                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
