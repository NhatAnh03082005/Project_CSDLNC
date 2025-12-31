import React from "react";
// 1. Thay thế Link của 'next/link' bằng Link của 'react-router-dom'
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Heart, ArrowLeft, CreditCard, Banknote, Tag, Calendar } from "lucide-react";

export default function CheckoutPage() {
  const promotions = [
    {
      id: 1,
      code: "PETCARE2024",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      discountPercent: 10,
    },
    {
      id: 2,
      code: "NEWYEAR2025",
      startDate: "2024-12-25",
      endDate: "2025-01-15",
      discountPercent: 15,
    },
    {
      id: 3,
      code: "WINTER50",
      startDate: "2024-11-01",
      endDate: "2025-02-28",
      discountPercent: 5,
    },
  ];

  // Loại bỏ khai báo kiểu TypeScript: (startDate: string, endDate: string)
  const isPromotionValid = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Tính toán ngày kết thúc là cuối ngày (23:59:59)
    end.setHours(23, 59, 59, 999); 
    
    return now >= start && now <= end;
  };

  // Áp dụng bộ lọc
  const applicablePromotions = promotions.filter((promo) =>
    isPromotionValid(promo.startDate, promo.endDate),
  );

  const totalDiscountPercent = applicablePromotions.reduce(
    (sum, promo) => sum + promo.discountPercent,
    0,
  );

  const cartItems = [
    {
      id: 1,
      name: "Royal Canin Mini Adult",
      type: "Thức ăn",
      price: 450000,
      quantity: 2,
    },
    {
      id: 2,
      name: "Nexgard Spectra",
      type: "Thuốc",
      price: 165000,
      quantity: 1,
    },
    {
      id: 3,
      name: "Vòng cổ chống bọ chét",
      type: "Phụ kiện",
      price: 120000,
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 30000;

  const discountAmount = Math.floor((subtotal * totalDiscountPercent) / 100);
  const total = subtotal + shippingFee - discountAmount;

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
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCareX</span>
          </div>
        </div>
      </header>

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
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.type}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)}/sp
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
                  {applicablePromotions.length > 0
                    ? "Các khuyến mãi sau được tự động áp dụng cho đơn hàng của bạn"
                    : "Hiện không có khuyến mãi nào được áp dụng"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicablePromotions.length > 0 ? (
                  <div className="space-y-4">
                    {applicablePromotions.map((promo) => (
                      <div
                        key={promo.id}
                        className="p-4 border rounded-lg bg-green-50 border-green-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-green-600 text-white"
                            >
                              {promo.code}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-green-700 border-green-600"
                            >
                              Giảm {promo.discountPercent}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Từ: {formatDate(promo.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Đến: {formatDate(promo.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                <RadioGroup defaultValue="cod" className="space-y-4">
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
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá ({totalDiscountPercent}%):</span>
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

                <Button className="w-full" size="lg">
                  Xác nhận đặt hàng
                </Button>

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