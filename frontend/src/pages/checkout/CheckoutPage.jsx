import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Heart, ArrowLeft, CreditCard, Banknote, Tag, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { orderAPI, promotionAPI } from "../../api/services";
import Header from "../../components/layout/header";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activePromotion, setActivePromotion] = useState(null);
  const [loadingPromotion, setLoadingPromotion] = useState(true);
  
  const maChiNhanh = cartItems.length > 0 && cartItems[0]?.maChiNhanh 
    ? cartItems[0].maChiNhanh 
    : searchParams.get("branch") || "0001";

  // Fetch active promotion từ API
  useEffect(() => {
    const fetchActivePromotion = async () => {
      try {
        setLoadingPromotion(true);
        const response = await promotionAPI.getActive();
        if (response.data.success && response.data.data) {
          setActivePromotion(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching active promotion:", error);
        setActivePromotion(null);
      } finally {
        setLoadingPromotion(false);
      }
    };
    fetchActivePromotion();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate("/branches?service=products");
    }
  }, [cartItems, orderSuccess, navigate]);

  // Debug: Log khi orderSuccess thay đổi
  useEffect(() => {
    console.log("orderSuccess state changed:", orderSuccess);
  }, [orderSuccess]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.donGia || item.price || 0) * item.soLuong,
    0,
  );

  // Tính discount dựa trên active promotion (giống logic trigger)
  const discountPercent = activePromotion ? activePromotion.TiLeGiamGia : 0;
  const discountAmount = Math.floor((subtotal * discountPercent) / 100);
  
  // Tổng tiền = subtotal - discount (không có phí vận chuyển, trigger sẽ tự tính)
  const total = subtotal - discountAmount;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      setSubmitting(true);
      
      const orderData = {
        items: cartItems.map(item => ({
          maSanPham: item.maSanPham,
          soLuong: item.soLuong,
        })),
        paymentMethod: paymentMethod === "cod" ? "TienMat" : "ChuyenKhoan",
        maChiNhanh: maChiNhanh,
      };

      const response = await orderAPI.create(orderData);
      
      console.log("Order creation response:", response);
      console.log("Response data:", response.data);
      console.log("Response success:", response.data?.success);

      // Kiểm tra response đơn giản như code ban đầu đã thành công
      if (response.data && response.data.success) {
        console.log("Order created successfully, setting orderSuccess to true");
        console.log("Response message:", response?.data?.message);
        
        // Set state và clear cart
        setOrderSuccess(true);
        clearCart();
        
        // Hiển thị alert để xác nhận thành công
        alert("Đặt hàng thành công! Đơn hàng đang chờ nhân viên xác nhận.");
        
        // Hiển thị thông báo trong UI
        // Tự động chuyển trang sau 3 giây để người dùng có thời gian thấy thông báo
        setTimeout(() => {
          console.log("Navigating to /customer");
          navigate("/customer");
        }, 3000);
      } else {
        console.error("Order creation failed:", response.data);
        const errorMsg = response?.data?.message || response?.message || "Đặt hàng thất bại!";
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Đặt hàng thất bại. Vui lòng thử lại!";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Loại bỏ khai báo kiểu TypeScript: (price: number)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Loại bỏ khai báo kiểu TypeScript: (dateString: string)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Sửa Link href -> to */}
        <Link to="/customer">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          Thanh toán đơn hàng
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết đơn hàng</CardTitle>
                <CardDescription>Danh sách sản phẩm trong giỏ hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.maSanPham || index}
                      className="flex items-start justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.tenSanPham || item.name}</p>
                        <p className="text-sm text-gray-600">{item.loaiSanPham || item.type}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Số lượng: {item.soLuong || item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice((item.donGia || item.price || 0) * (item.soLuong || item.quantity))}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.donGia || item.price || 0)}/sp
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-green-600" />
                  Khuyến mãi đang áp dụng
                </CardTitle>
                <CardDescription>
                  {activePromotion
                    ? "Khuyến mãi được tự động áp dụng cho đơn hàng của bạn"
                    : "Hiện không có khuyến mãi nào được áp dụng"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPromotion ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 mx-auto animate-spin text-blue-600" />
                    <p className="mt-2 text-gray-500">Đang tải khuyến mãi...</p>
                  </div>
                ) : activePromotion ? (
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-600 text-white"
                        >
                          {activePromotion.MaKhuyenMai}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-600"
                        >
                          Giảm {activePromotion.TiLeGiamGia}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Từ: {formatDate(activePromotion.NgayBatDau)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Đến: {formatDate(activePromotion.NgayKetThuc)}</span>
                      </div>
                    </div>
                    {discountAmount > 0 && (
                      <div className="pt-2 border-t border-green-200">
                        <p className="text-sm font-medium text-green-700">
                          Bạn được giảm: {formatPrice(discountAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Không có khuyến mãi khả dụng</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>Chọn cách thức thanh toán phù hợp</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="online" id="online" className="mt-1" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Thanh toán online</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Thanh toán qua ví điện tử, thẻ ngân hàng hoặc chuyển khoản
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" className="mt-1" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Banknote className="h-5 w-5 text-green-600" />
                        <span className="font-medium">
                          Thanh toán khi nhận hàng
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Thanh toán bằng tiền mặt khi nhận được sản phẩm
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && activePromotion && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá ({discountPercent}%):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {formatPrice(total)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <p className="text-xs text-green-600 text-center">
                      Bạn đã tiết kiệm được {formatPrice(discountAmount)}!
                    </p>
                  )}
                </div>

                {orderSuccess ? (
                  <div className="w-full p-6 bg-green-50 border-2 border-green-400 rounded-lg flex flex-col items-center gap-3 shadow-lg">
                    <CheckCircle2 className="h-10 w-10 text-green-600 animate-pulse" />
                    <div className="text-center">
                      <p className="text-green-700 font-bold text-xl mb-2">Đặt hàng thành công!</p>
                      <p className="text-green-600 text-base">Đơn hàng đang chờ nhân viên xác nhận.</p>
                      <p className="text-green-500 text-sm mt-2">Bạn sẽ được chuyển về trang chủ sau vài giây...</p>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    disabled={submitting || cartItems.length === 0}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận đặt hàng"
                    )}
                  </Button>
                )}

                <div className="text-xs text-gray-600 text-center pt-2">
                  Bằng việc đặt hàng, bạn đồng ý với{" "}
                  {/* Sửa Link href -> to */}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    điều khoản dịch vụ
                  </Link>{" "}
                  của PetCare
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}