import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Heart, ArrowLeft, ShoppingBag, Plus, Minus, Loader2 } from "lucide-react";
import { productAPI } from "../../api/services";
import { useCartStore } from "../../store/cartStore";

export default function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const maSanPham = searchParams.get("maSanPham");
  const maChiNhanh = searchParams.get("branch");
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!maSanPham || !maChiNhanh) {
      setError("Thiếu thông tin sản phẩm hoặc chi nhánh");
      setLoading(false);
      return;
    }

    fetchProductDetail();
  }, [maSanPham, maChiNhanh]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getProductDetail(maSanPham, maChiNhanh);

      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        setError(response.data.message || "Không thể tải thông tin sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin sản phẩm:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.soLuongTonKho || 99)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (quantity > product.soLuongTonKho) {
      alert(`Số lượng vượt quá tồn kho. Tồn kho hiện tại: ${product.soLuongTonKho}`);
      return;
    }

    try {
      setAddingToCart(true);
      
      addItem({
        maSanPham: product.maSanPham,
        tenSanPham: product.tenSanPham,
        donGia: product.donGia,
        loaiSanPham: product.loaiSanPham,
        soLuong: quantity,
        maChiNhanh: product.chiNhanh?.maChiNhanh || maChiNhanh,
      });

      alert("Đã thêm sản phẩm vào giỏ hàng!");
      navigate(`/products-list?branch=${maChiNhanh}`);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getProductTypeColor = (type) => {
    const typeMap = {
      "ThucAn": "bg-green-100 text-green-800",
      "Thuoc": "bg-blue-100 text-blue-800",
      "PhuKien": "bg-orange-100 text-orange-800",
    };
    return typeMap[type] || "bg-gray-100 text-gray-800";
  };

  const getProductTypeName = (type) => {
    const typeMap = {
      "ThucAn": "Thức ăn",
      "Thuoc": "Thuốc",
      "PhuKien": "Phụ kiện",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-blue-900">PetCare</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Link to={`/products-list?branch=${maChiNhanh}`}>
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        {error ? (
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Link to={`/products-list?branch=${maChiNhanh}`}>
              <Button>Quay lại danh sách</Button>
            </Link>
          </Card>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : product ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{product.tenSanPham}</CardTitle>
                  <Badge className={getProductTypeColor(product.loaiSanPham)}>
                    {getProductTypeName(product.loaiSanPham)}
                  </Badge>
                </div>
                <CardDescription>
                  {product.chiNhanh?.tenChiNhanh || "Chi nhánh"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-900 mb-2">
                      {formatPrice(product.donGia)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tồn kho: <span className="font-semibold">{product.soLuongTonKho}</span> sản phẩm
                    </p>
                  </div>

                  {product.moTa && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                      <p className="text-gray-600">{product.moTa}</p>
                    </div>
                  )}

                  {!product.moTa && (
                    <div className="pt-4 border-t">
                      <p className="text-gray-500 italic">Chưa có mô tả cho sản phẩm này</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-4 block">Số lượng</Label>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-20 text-center">
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const maxQty = product.soLuongTonKho || 99;
                          if (val >= 1 && val <= maxQty) {
                            setQuantity(val);
                          }
                        }}
                        min={1}
                        max={product.soLuongTonKho || 99}
                        className="text-center text-2xl font-bold"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.soLuongTonKho || 99)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đơn giá:</span>
                    <span className="font-semibold">{formatPrice(product.donGia)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số lượng:</span>
                    <span className="font-semibold">{quantity}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(product.donGia * quantity)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.soLuongTonKho === 0 || quantity > product.soLuongTonKho}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang thêm...
                    </>
                  ) : product.soLuongTonKho === 0 ? (
                    "Hết hàng"
                  ) : (
                    "Thêm vào giỏ hàng"
                  )}
                </Button>

                {product.soLuongTonKho > 0 && quantity > product.soLuongTonKho && (
                  <p className="text-sm text-red-600 text-center">
                    Số lượng vượt quá tồn kho
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

