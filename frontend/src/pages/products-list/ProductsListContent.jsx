import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Heart, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { productAPI } from "../../api/services";

function ProductsListContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const maChiNhanh = searchParams.get("branch");

  const [products, setProducts] = useState([]);
  const [chiNhanh, setChiNhanh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!maChiNhanh) {
      setError("Vui lòng chọn chi nhánh");
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [maChiNhanh]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getByBranch(maChiNhanh);

      if (response.data.success) {
        setProducts(response.data.data.products || []);
        setChiNhanh(response.data.data.chiNhanh);
      } else {
        setError(response.data.message || "Không thể tải danh sách sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
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

  const handleProductClick = (product) => {
    navigate(`/product-detail?maSanPham=${product.maSanPham}&branch=${maChiNhanh}`);
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
        <div className="mb-8">
          <Link to="/branches?service=products">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Danh sách sản phẩm</h1>
              <p className="text-gray-600 mt-1">{chiNhanh?.tenChiNhanh || "Đang tải..."}</p>
            </div>
          </div>
        </div>

        {error ? (
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Link to="/branches?service=products">
              <Button>Chọn chi nhánh khác</Button>
            </Link>
          </Card>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.maSanPham}
                className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <CardHeader>
                  <CardTitle className="text-balance">{product.tenSanPham}</CardTitle>
                  <CardDescription>
                    <Badge className={getProductTypeColor(product.loaiSanPham)}>
                      {getProductTypeName(product.loaiSanPham)}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-900">{formatPrice(product.donGia)}</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Tồn kho: {product.soLuongTonKho} sản phẩm
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg">Không có sản phẩm nào tại chi nhánh này.</p>
            <Link to="/branches?service=products">
              <Button className="mt-4">Chọn chi nhánh khác</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ProductsListContent;
