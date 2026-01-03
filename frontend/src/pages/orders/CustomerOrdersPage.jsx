import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI } from "../../api/services";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Loader2, Package, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (trangThai) => {
    switch (trangThai) {
      case "Chờ xác nhận":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Chờ xác nhận
          </Badge>
        );
      case "Đã xác nhận":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Đã xác nhận
          </Badge>
        );
      case "Đã hủy":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return <Badge>{trangThai}</Badge>;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link to="/customer">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600">Theo dõi trạng thái đơn hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              Đơn hàng của bạn sẽ xuất hiện tại đây sau khi bạn đặt mua sản phẩm.
            </p>
            <Link to="/branches?service=products">
              <Button>Mua sản phẩm ngay</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.maHoaDon} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">
                        Đơn hàng #{order.maHoaDon}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Ngày đặt:</span>{" "}
                          {formatDate(order.ngayDat)}
                        </div>
                        {order.ngayXacNhan && (
                          <div>
                            <span className="font-medium">Ngày xác nhận:</span>{" "}
                            {formatDate(order.ngayXacNhan)}
                          </div>
                        )}
                        {order.tenChiNhanh && (
                          <div>
                            <span className="font-medium">Chi nhánh:</span>{" "}
                            {order.tenChiNhanh}
                          </div>
                        )}
                        {order.tenNhanVienXacNhan && (
                          <div>
                            <span className="font-medium">Nhân viên:</span>{" "}
                            {order.tenNhanVienXacNhan}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.trangThai)}
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.tongTien)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Phương thức thanh toán:</span>{" "}
                      {order.phuongThucThanhToan === "Tiền mặt"
                        ? "Tiền mặt"
                        : "Chuyển khoản"}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/orders/${order.maHoaDon}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

