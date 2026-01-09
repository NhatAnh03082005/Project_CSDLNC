import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import {
  Heart,
  ArrowLeft,
  CreditCard,
  Banknote,
  Badge,
  ShoppingBag,
  Tag,
  Receipt,
  Calendar,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { orderAPI, promotionAPI } from "../../api/services";
import { toast } from "../../lib/toast";
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

  const maChiNhanh =
    cartItems.length > 0 && cartItems[0]?.maChiNhanh
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
    0
  );

  // Tính discount dựa trên active promotion (giống logic trigger)
  const discountPercent = activePromotion ? activePromotion.TiLeGiamGia : 0;
  const discountAmount = Math.floor((subtotal * discountPercent) / 100);

  // Tổng tiền = subtotal - discount (không có phí vận chuyển, trigger sẽ tự tính)
  const total = subtotal - discountAmount;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Giỏ hàng trống!");
      return;
    }

    if (!paymentMethod) {
      toast.warning("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      setSubmitting(true);

      const orderData = {
        items: cartItems.map((item) => ({
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

        // Hiển thị toast để xác nhận thành công
        toast.success("Đặt hàng thành công! Đơn hàng đang chờ nhân viên xác nhận.");
      } else {
        console.error("Order creation failed:", response.data);
        const errorMsg =
          response?.data?.message || response?.message || "Đặt hàng thất bại!";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Đặt hàng thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        <Link to="/customer">
          <Button
            variant="ghost"
            className="gap-2 mb-8 rounded-xl font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Quay lại trang cá nhân
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <CreditCard className="h-3 w-3" />
              Thanh toán an toàn
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Hoàn tất{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Đơn hàng
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-md font-medium">
              Vui lòng kiểm tra lại thông tin và xác nhận đặt hàng
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[2.5rem] border-2 border-orange-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-orange-50/50 border-b border-orange-50 p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-orange-600">
                  <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-orange-600" />
                  </div>
                  Chi tiết đơn hàng
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pt-1">
                  Danh sách sản phẩm bạn đã chọn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.maSanPham || index}
                      className="flex items-center justify-between py-2 group"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
                          <Heart className="h-6 w-6 text-orange-200 fill-orange-50" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                            {item.tenSanPham || item.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                              {item.loaiSanPham || item.type}
                            </span>
                            <span className="h-1 w-1 bg-slate-300 rounded-full" />
                            <span className="text-xs font-black text-orange-600">
                              x{item.soLuong || item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">
                          {formatPrice(
                            (item.donGia || item.price || 0) *
                              (item.soLuong || item.quantity)
                          )}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {formatPrice(item.donGia || item.price || 0)}/sp
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-2 border-emerald-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 p-5">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-emerald-600">
                  <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Tag className="h-5 w-5 text-emerald-600" />
                  </div>
                  Ưu đãi đặc biệt
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pt-1">
                  {activePromotion
                    ? "Tự động áp dụng khuyến mãi tốt nhất"
                    : "Hiện không có khuyến mãi khả dụng"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                {loadingPromotion ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Đang kiểm tra ưu đãi...
                    </p>
                  </div>
                ) : activePromotion ? (
                  <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 space-y-4 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 h-24 w-24 bg-emerald-100/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex items-start justify-between relative z-10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-600 text-white border-none px-3 py-1 rounded-lg font-black text-xs uppercase">
                            {activePromotion.MaKhuyenMai}
                          </Badge>
                          <Badge className="bg-white/80 text-emerald-700 border-emerald-200 px-3 py-1 rounded-lg font-black text-xs">
                            -{activePromotion.TiLeGiamGia}%
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-600 mt-2">
                          Đã được cộng vào đơn hàng
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 bg-emerald-100 inline-block px-2 py-1 rounded-md uppercase tracking-tight">
                          Active Promo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-emerald-100/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Từ: {formatDate(activePromotion.NgayBatDau)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Đến: {formatDate(activePromotion.NgayKetThuc)}
                        </span>
                      </div>
                    </div>

                    {discountAmount > 0 && (
                      <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-emerald-100/50 backdrop-blur-sm">
                        <p className="text-sm font-black text-emerald-700 flex items-center justify-between">
                          Tiết kiệm thêm:{" "}
                          <span className="text-lg">
                            {formatPrice(discountAmount)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-slate-300 opacity-50" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Không tìm thấy mã ưu đãi
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-2 border-blue-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-blue-50/50 border-b border-blue-50 p-5">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-blue-600">
                  <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-blue-600" />
                  </div>
                  Phương thức thanh toán
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest pt-1">
                  Chọn cách thức thanh toán phù hợp
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div
                    className={`flex items-start space-x-4 p-5 border-2 rounded-[1.5rem] transition-all cursor-pointer ${
                      paymentMethod === "online"
                        ? "border-blue-500 bg-blue-50/30"
                        : "border-slate-100 hover:border-blue-200 bg-white"
                    }`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <RadioGroupItem
                      value="online"
                      id="online"
                      className="mt-1 sr-only"
                    />
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        paymentMethod === "online"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-slate-800 text-base">
                          Chuyển khoản / Ví điện tử
                        </span>
                        {paymentMethod === "online" && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        Thanh toán nhanh qua QR-Pay, Momo, ZaloPay hoặc thẻ ngân
                        hàng
                      </p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-start space-x-4 p-5 border-2 rounded-[1.5rem] transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50/30"
                        : "border-slate-100 hover:border-blue-200 bg-white"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <RadioGroupItem
                      value="cod"
                      id="cod"
                      className="mt-1 sr-only"
                    />
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        paymentMethod === "cod"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <Banknote className="h-6 w-6" />
                    </div>
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-slate-800 text-base">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                        {paymentMethod === "cod" && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        Bạn sẽ thanh toán bằng tiền mặt trực tiếp cho nhân viên
                        giao hàng
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 rounded-[3rem] border-2 border-orange-200 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black text-orange-600">
                  Tổng kết
                </CardTitle>
                <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                  Hóa đơn đơn hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    Thành tiền
                  </span>
                  <span className="font-bold text-slate-700">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && activePromotion && (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100/50">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
                      <Tag className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase">
                        -{activePromotion.TiLeGiamGia}% Ưu đãi
                      </span>
                    </div>
                    <span className="font-black text-emerald-600">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <span className="text-slate-900 font-black uppercase tracking-widest text-sm">
                    Tổng thanh toán
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-orange-600 block leading-none break-words">
                      {formatPrice(total)}
                    </span>
                    {discountAmount > 0 && (
                      <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tight mt-1 inline-block">
                        Tiết kiệm {formatPrice(discountAmount)}
                      </span>
                    )}
                  </div>
                </div>

                {orderSuccess ? (
                  <div className="w-full p-8 rounded-[2.5rem] bg-emerald-50 border-2 border-dashed border-emerald-200 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-emerald-800 font-black text-xl uppercase tracking-tight">
                        Thành công!
                      </p>
                      <p className="text-emerald-600 text-xs font-bold leading-relaxed uppercase tracking-widest px-4">
                        Đơn hàng đang chờ xác nhận từ PetCare
                      </p>
                    </div>
                    <div className="w-full pt-4 space-y-3">
                      <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out]" />
                      </div>
                      <p className="text-[9px] font-black text-emerald-400 uppercase text-center tracking-[0.2em]">
                        Redirecting shortly...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      variant="premium"
                      className="w-full h-20 rounded-[2rem] text-xl font-black bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-[0.98] group border-none"
                      onClick={handlePlaceOrder}
                      disabled={submitting || cartItems.length === 0}
                    >
                      {submitting ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-6 w-6 transition-transform group-hover:scale-110" />
                          Xác nhận đặt hàng
                        </div>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                        An toàn & Bảo mật 100%
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest leading-loose">
                  Bằng việc đặt hàng, bạn đồng ý với{" "}
                  <Link to="/terms" className="text-orange-600 hover:underline">
                    điều khoản dịch vụ
                  </Link>{" "}
                  của <span className="text-slate-900">PetCare</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
