import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { orderAPI } from "../../api/services";
import { toast } from "../../lib/toast";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Loader2, Package, Clock, CheckCircle2, ArrowLeft } from "lucide-react";

export default function OrderDetailPage() {
  const { maHoaDon } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (maHoaDon) {
      fetchOrderDetails();
    }
  }, [maHoaDon]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getById(maHoaDon);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        toast.error(response.data.message || "Không tìm thấy đơn hàng");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Lỗi tải chi tiết đơn hàng:", error);
      toast.error(error.response?.data?.message || "Không thể tải chi tiết đơn hàng");
      navigate("/orders");
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

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link to="/orders">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Chi tiết đơn hàng #{order.maHoaDon}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Thông tin đơn hàng */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Mã hóa đơn:</span>
                  <p className="font-medium">{order.maHoaDon}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <div className="mt-1">{getStatusBadge(order.trangThai)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày đặt:</span>
                  <p className="font-medium">{formatDate(order.ngayDat)}</p>
                </div>
                {order.ngayXacNhan && (
                  <div>
                    <span className="text-sm text-gray-600">Ngày xác nhận:</span>
                    <p className="font-medium">{formatDate(order.ngayXacNhan)}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Chi nhánh:</span>
                  <p className="font-medium">
                    {order.chiNhanh?.tenChiNhanh || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phương thức thanh toán:</span>
                  <p className="font-medium">
                    {order.phuongThucThanhToan === "Tiền mặt"
                      ? "Tiền mặt"
                      : "Chuyển khoản"}
                  </p>
                </div>
                {order.tenNhanVienXacNhan && (
                  <div>
                    <span className="text-sm text-gray-600">Nhân viên xác nhận:</span>
                    <p className="font-medium">{order.tenNhanVienXacNhan}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chi tiết sản phẩm */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.chiTiet && order.chiTiet.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {order.chiTiet.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.tenSanPham}</p>
                            <p className="text-sm text-gray-600">
                              {item.loaiSanPham} • SL: {item.soLuong}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(item.thanhTien)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(item.donGia)} x {item.soLuong}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold">Tổng tiền:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(order.tongTien)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Không có sản phẩm nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

