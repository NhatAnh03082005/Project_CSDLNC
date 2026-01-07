import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Heart,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  Sparkles,
  Package,
  ArrowUpRight,
  Check,
  Search,
  Filter,
  Gift,
} from "lucide-react";
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
      setError(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tải danh sách sản phẩm"
      );
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
      ThucAn: "bg-green-100 text-green-800",
      Thuoc: "bg-blue-100 text-blue-800",
      PhuKien: "bg-orange-100 text-orange-800",
    };
    return typeMap[type] || "bg-gray-100 text-gray-800";
  };

  const getProductTypeName = (type) => {
    const typeMap = {
      ThucAn: "Thức ăn",
      Thuoc: "Thuốc",
      PhuKien: "Phụ kiện",
    };
    return typeMap[type] || type;
  };

  const getProductImage = (name, type) => {
    const n = name?.toLowerCase() || "";

    // Vệ sinh & Làm đẹp chi tiết
    if (n.includes("sữa tắm"))
      return "https://www.phukienthucungdep.com/upload/images/sua-tam-cho-meo/sua-tam-cho-cho-long-trang1.jpg";
    if (n.includes("lược") || n.includes("bàn chải"))
      return "https://product.hstatic.net/200000264739/product/luoc_chai_long_co_nut_bam_cleanpet_s_cho_cho_meo_1_1e1f60bbbc7e43be891c1549a8808aea_master.jpg";
    if (n.includes("khăn lau"))
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m2i9xs63va9ec4.webp";
    if (n.includes("kìm bấm móng"))
      return "https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=800";

    // Thức ăn khô & Hạt
    if (n.includes("royal canin") || n.includes("hạt") || n.includes("cơm")) {
      if (n.includes("mèo"))
        return "https://images.unsplash.com/photo-1589924691106-073b19f55363?auto=format&fit=crop&q=80&w=800";
      return "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=800";
    }

    // Pate & Thức ăn ướt
    if (n.includes("pate") || n.includes("whiskas")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvfsfcebq5jh7c.webp";
    }

    // Bánh thưởng & Xương gặm
    if (
      n.includes("bánh thưởng") ||
      n.includes("xương gặm") ||
      n.includes("training")
    ) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mf59t6g5b95800.webp";
    }
    if (n.includes("cát vệ sinh")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1csp7bl2wbged@resize_w900_nl.webp";
    }

    // Đồ dùng vệ sinh
    if (n.includes("xịt khử mùi")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-li1b3i1uly1198.webp";
    }

    // Phụ kiện đeo & Dắt
    if (
      n.includes("vòng cổ") ||
      n.includes("dây dắt") ||
      n.includes("phản quang")
    ) {
      return "https://down-vn.img.susercontent.com/file/sg-11134253-825an-mg4nsozphcsqa7.webp";
    }

    // Chuồng, Nhà, Nệm
    if (n.includes("chuồng") || n.includes("nhà") || n.includes("nệm")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mev8mv59do1u59.webp";
    }
    //Áo thú cưng
    if (n.includes("áo thú cưng")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3zxikpnje00b6.webp";
    }
    //Bình nước
    if (n.includes("bình nước")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz4lgkyx4j353c.webp";
    }
    // Dụng cụ ăn uống
    if (n.includes("bát ăn")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4iotxe3m8snca.webp";
    }

    // Vệ sinh & Làm đẹp
    if (
      n.includes("sữa tắm") ||
      n.includes("lược") ||
      n.includes("kìm bấm móng") ||
      n.includes("khăn lau")
    ) {
      return "https://images.unsplash.com/photo-1516733968668-dbdce39c46ef?auto=format&fit=crop&q=80&w=800";
    }
    //Khay vệ sinh
    if (n.includes("khay vệ sinh")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m9jjkg0be83m48.webp";
    }
    // Đồ chơi
    if (n.includes("đồ chơi") || n.includes("cao su") || n.includes("bóng")) {
      return "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lu6asjatxyqn22.webp";
    }

    // Mặc định theo loại
    if (type === "ThucAn")
      return "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=800";
    if (type === "Thuoc")
      return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800";
    if (type === "PhuKien")
      return "https://images.unsplash.com/photo-1541591047357-9191ff29f9e6?auto=format&fit=crop&q=80&w=800";

    return "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800";
  };

  const handleProductClick = (product) => {
    navigate(
      `/product-detail?maSanPham=${product.maSanPham}&branch=${maChiNhanh}`
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-4 py-12 relative z-10 max-w-6xl">
          <div className="flex flex-col gap-6">
            <Link
              to="/branches?service=products"
              className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors group w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Chọn chi nhánh khác
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="h-3 w-3" />
                  Cửa hàng thú cưng
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  Danh sách{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                    Sản phẩm
                  </span>
                </h1>
                <p className="text-slate-500 text-lg max-w-md font-medium">
                  {chiNhanh?.tenChiNhanh || "Đang tải chi nhánh..."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tổng cộng
                    </p>
                    <p className="text-lg font-black text-slate-800 leading-none">
                      {products.length} sản phẩm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {error ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-red-200 p-16 text-center shadow-sm">
            <div className="max-w-md mx-auto space-y-6">
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-10 w-10 text-red-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Oops! Có lỗi xảy ra
                </h3>
                <p className="text-slate-500 leading-relaxed">{error}</p>
              </div>
              <Button
                onClick={fetchProducts}
                className="h-12 px-8 rounded-xl font-bold gap-2"
              >
                Thử lại ngay
              </Button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin" />
              <ShoppingBag className="h-6 w-6 text-orange-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">
              Đang chuẩn bị sản phẩm...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const typeColor = getProductTypeColor(product.loaiSanPham);
              const typeName = getProductTypeName(product.loaiSanPham);

              // Dynamic themes based on type
              const isFood = product.loaiSanPham === "ThucAn";
              const isMedicine = product.loaiSanPham === "Thuoc";

              const theme = isFood
                ? "from-green-500/10 to-transparent"
                : isMedicine
                ? "from-blue-500/10 to-transparent"
                : "from-orange-500/10 to-transparent";

              return (
                <div
                  key={product.maSanPham}
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-white rounded-[2.5rem] border-2 border-orange-200 shadow-sm hover:shadow-2xl hover:shadow-orange-100/30 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* Card Header with Product Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={getProductImage(
                        product.tenSanPham,
                        product.loaiSanPham
                      )}
                      alt={product.tenSanPham}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${theme} opacity-60`}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                    <Sparkles className="absolute top-4 right-4 h-6 w-6 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-8 pt-10 flex-1 flex flex-col relative">
                    <div className="absolute top-0 left-8 -translate-y-1/2">
                      <Badge
                        className={`${typeColor} border-none rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-sm`}
                      >
                        {typeName}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {product.tenSanPham}
                    </h3>

                    <div className="flex items-center gap-2 mb-6">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          product.soLuongTonKho > 0
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                        {product.soLuongTonKho > 0
                          ? `Còn ${product.soLuongTonKho} sản phẩm`
                          : "Hết hàng"}
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-6 border-t border-slate-50">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Giá bán
                        </span>
                        <p className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                          {formatPrice(product.donGia)}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-lg shadow-slate-200">
                        <ArrowUpRight className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center shadow-sm max-w-4xl mx-auto overflow-hidden relative">
            <div className="max-w-md mx-auto space-y-8 relative z-10">
              <div className="h-28 w-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 rotate-3 shadow-inner">
                <Package className="h-14 w-14 text-slate-300" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  Trống trải quá!
                </h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Hiện chưa có sản phẩm nào được bày bán tại chi nhánh này. Bạn
                  vui lòng quay lại sau hoặc chọn chi nhánh khác nhé.
                </p>
              </div>
              <Link to="/branches?service=products">
                <Button className="h-14 px-12 rounded-2xl shadow-xl shadow-slate-200 font-black bg-slate-900 hover:bg-slate-800 border-none transition-all hover:scale-105 active:scale-95">
                  Chọn chi nhánh khác
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsListContent;
