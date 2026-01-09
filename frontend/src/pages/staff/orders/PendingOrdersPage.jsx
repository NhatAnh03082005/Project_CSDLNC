import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderAPI } from "../../../api/services";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { toast } from "../../../lib/toast";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle2,
  ArrowLeft,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

export default function PendingOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchPendingOrders();
    // Refresh mỗi 30 giây để cập nhật đơn mới
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getPending();
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng chờ xác nhận:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClick = (order) => {
    setConfirmingOrder(order);
    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = async () => {
    if (!confirmingOrder) return;

    try {
      const response = await orderAPI.confirm(confirmingOrder.maHoaDon);
      if (response.data.success) {
        toast.success("Xác nhận đơn hàng thành công!");
        setShowConfirmDialog(false);
        setConfirmingOrder(null);
        fetchPendingOrders();
      } else {
        toast.error(response.data.message || "Xác nhận đơn hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi xác nhận đơn hàng:", error);
      toast.error(
        error.response?.data?.message ||
          "Xác nhận đơn hàng thất bại. Vui lòng thử lại!"
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/staff/demo">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="h-8 w-8 text-yellow-600" />
            Đơn hàng chờ xác nhận
          </h1>
          <p className="text-gray-600">
            Có {orders.length} đơn hàng đang chờ xác nhận
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng chờ xác nhận
            </h3>
            <p className="text-gray-500">
              Tất cả đơn hàng đã được xử lý hoặc chưa có đơn hàng mới.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.maHoaDon} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-3">
                        Hóa đơn #{order.maHoaDon}
                      </CardTitle>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Khách hàng:</span>
                          <span className="font-medium">{order.tenKhachHang}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">SĐT:</span>
                          <span className="font-medium">{order.sdt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Chi nhánh:</span>
                          <span className="font-medium">{order.tenChiNhanh}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ngày đặt:</span>
                          <span className="font-medium ml-2">
                            {formatDate(order.ngayDat)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Thanh toán:</span>
                          <span className="font-medium ml-2">
                            {order.phuongThucThanhToan === "Tiền mặt"
                              ? "Tiền mặt"
                              : "Chuyển khoản"}
                          </span>
                        </div>
                      </div>
                      {order.ghiChu && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                          <span className="font-medium">Ghi chú:</span> {order.ghiChu}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mb-3">
                        <Clock className="h-3 w-3 mr-1" />
                        Chờ xác nhận
                      </Badge>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.tongTien)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/staff/orders/${order.maHoaDon}`)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      onClick={() => handleConfirmClick(order)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Xác nhận đơn hàng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog xác nhận */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận đơn hàng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xác nhận hóa đơn{" "}
                {confirmingOrder?.maHoaDon}? Sau khi xác nhận, hệ thống sẽ:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Tạo hóa đơn cho khách hàng</li>
                  <li>Cập nhật tồn kho sản phẩm</li>
                  <li>Cộng điểm loyalty cho khách hàng</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmOrder}>
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

