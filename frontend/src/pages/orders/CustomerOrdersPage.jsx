import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI } from "../../api/services";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  User,
  Wallet,
  ReceiptText,
  ChevronRight,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      alert("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.maHoaDon?.toLowerCase().includes(searchLower) ||
      order.tenChiNhanh?.toLowerCase().includes(searchLower) ||
      order.trangThai?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (trangThai) => {
    switch (trangThai) {
      case "Chờ xác nhận":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-none px-3 py-1 rounded-lg font-bold">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Chờ xác nhận
          </Badge>
        );
      case "Đã xác nhận":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 rounded-lg font-bold">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Đã xác nhận
          </Badge>
        );
      case "Đã hủy":
        return (
          <Badge className="bg-rose-100 text-rose-700 border-none px-3 py-1 rounded-lg font-bold">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 rounded-lg font-bold">
            {trangThai}
          </Badge>
        );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        {/* HEADER SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-md p-8 border border-blue-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/customer">
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
                  Đơn hàng của tôi
                </h1>
                <p className="text-gray-600 mt-1">
                  Theo dõi trạng thái và lịch sử đặt hàng của bạn
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-900">
                    {orders.length} đơn hàng
                  </div>
                  <div className="text-[10px] text-blue-500 uppercase font-extrabold">
                    Tổng số giao dịch
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, chi nhánh hoặc trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-2xl text-lg transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* CONTENT */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-blue-200 space-y-6">
            <div className="p-6 bg-blue-50 rounded-full">
              <Package className="h-12 w-12 text-blue-300" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm tuyệt
                vời của chúng tôi để bắt đầu mua sắm!
              </p>
            </div>
            <Link to="/branches?service=products">
              <Button
                variant="premium"
                className="gap-2 rounded-2xl px-10 py-7 text-lg font-bold shadow-xl shadow-blue-100 transition-all hover:scale-105"
              >
                Mua sắm ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-medium bg-white/30 rounded-3xl border border-dashed border-slate-200">
                Không tìm thấy đơn hàng nào phù hợp với tìm kiếm
              </div>
            ) : (
              filteredOrders.map((order) => (
                <Card
                  key={order.maHoaDon}
                  className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-blue-100 overflow-hidden"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 via-sky-500 to-teal-500 flex items-center justify-center shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform duration-500">
                          <ReceiptText className="h-9 w-9 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            #{order.maHoaDon}
                          </h3>
                          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            Mã đơn hàng
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(order.trangThai)}
                        <span className="text-2xl font-black text-blue-600 mt-1">
                          {formatPrice(order.tongTien)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all group-hover:shadow-md">
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                            Ngày đặt
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {formatDate(order.ngayDat)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all group-hover:shadow-md">
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <MapPin className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                            Chi nhánh
                          </span>
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                            {order.tenChiNhanh || "Z-PetCare"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all group-hover:shadow-md">
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <Wallet className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                            Thanh toán
                          </span>
                          <span className="text-sm font-bold text-slate-700">
                            {order.phuongThucThanhToan || "Tiền mặt"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all group-hover:shadow-md">
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <User className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
                            Nhân viên
                          </span>
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                            {order.tenNhanVienXacNhan || "Đang xử lý"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/orders/${order.maHoaDon}`)}
                      className="w-full h-14 bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white border border-slate-100 hover:border-blue-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                    >
                      Xem chi tiết đơn hàng
                      <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
