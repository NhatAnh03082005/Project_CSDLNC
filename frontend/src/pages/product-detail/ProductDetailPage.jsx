import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Heart,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Loader2,
  Sparkles,
  Package,
  ShieldCheck,
  Truck,
  Zap,
  Star,
  Shield,
  Info,
  ArrowRight,
  Check,
} from "lucide-react";
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
      setError(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi tải thông tin sản phẩm"
      );
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
      alert(
        `Số lượng vượt quá tồn kho. Tồn kho hiện tại: ${product.soLuongTonKho}`
      );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />

      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-black text-orange-600 tracking-tight">
              PetCareX
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to={`/products-list?branch=${maChiNhanh}`}>
              <Button
                variant="ghost"
                className="rounded-xl font-bold gap-2 hover:text-orange-600 hover:bg-orange-50"
              >
                <ShoppingBag className="h-5 w-5" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        <Link
          to={`/products-list?branch=${maChiNhanh}`}
          className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold text-sm mb-10 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại danh sách sản phẩm
        </Link>

        {error ? (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-red-200 p-20 text-center shadow-sm max-w-3xl mx-auto">
            <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">{error}</h2>
            <Link to={`/products-list?branch=${maChiNhanh}`}>
              <Button className="h-14 px-12 rounded-2xl bg-slate-900 font-bold">
                Quay lại ngay
              </Button>
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <div className="h-20 w-20 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin" />
              <Package className="h-8 w-8 text-orange-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
              Đang nạp dữ liệu sản phẩm...
            </p>
          </div>
        ) : product ? (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left: Product Media */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative aspect-[4/3] rounded-[3.5rem] overflow-hidden bg-white shadow-2xl border-2 border-orange-200 group">
                <img
                  src={getProductImage(product.tenSanPham, product.loaiSanPham)}
                  alt={product.tenSanPham}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-8 left-8">
                  <Badge
                    className={`${getProductTypeColor(
                      product.loaiSanPham
                    )} border-none rounded-2xl px-5 py-2 font-black text-xs uppercase tracking-widest shadow-xl backdrop-blur-md bg-opacity-90`}
                  >
                    {getProductTypeName(product.loaiSanPham)}
                  </Badge>
                </div>
                <div className="absolute bottom-8 right-8">
                  <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-inner opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Features Table */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Chất lượng",
                    desc: "Đã kiểm duyệt",
                    color: "text-emerald-500",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: Truck,
                    title: "Giao hàng",
                    desc: "Hỏa tốc 2h",
                    color: "text-orange-500",
                    bg: "bg-orange-50",
                  },
                  {
                    icon: Star,
                    title: "Đánh giá",
                    desc: "4.9/5 điểm",
                    color: "text-amber-500",
                    bg: "bg-amber-50",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-[2rem] border-2 border-orange-200 shadow-sm flex flex-col items-center text-center space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`h-12 w-12 ${feat.bg} rounded-xl flex items-center justify-center ${feat.color}`}
                    >
                      <feat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                        {feat.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Order */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-[0.2em]">
                  <Zap className="h-4 w-4 fill-orange-600" />
                  Sản phẩm nổi bật
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                  {product.tenSanPham}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 font-bold text-sm">
                    (120+ nhận xét)
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-[3rem] bg-white border-2 border-orange-200 shadow-xl space-y-8">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      Giá bán hiện tại
                    </p>
                    <p className="text-4xl font-black text-orange-600 tracking-tight">
                      {formatPrice(product.donGia)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        product.soLuongTonKho > 0
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          product.soLuongTonKho > 0
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-red-500"
                        }`}
                      />
                      {product.soLuongTonKho > 0 ? "Còn hàng" : "Hết hàng"}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      Tồn kho: {product.soLuongTonKho}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black text-slate-900 uppercase tracking-[0.1em] pl-1">
                    Chọn số lượng
                  </Label>
                  <div className="flex items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full hover:bg-white hover:shadow-sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 text-center font-black text-2xl text-slate-800">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full hover:bg-white hover:shadow-sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.soLuongTonKho || 99)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                      Đơn giá x{quantity}
                    </span>
                    <span className="font-bold text-slate-700">
                      {formatPrice(product.donGia)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-orange-100/50">
                    <span className="text-slate-800 font-black uppercase tracking-widest text-xs">
                      Tổng thanh toán
                    </span>
                    <span className="text-2xl font-black text-orange-700">
                      {formatPrice(product.donGia * quantity)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="premium"
                  className="w-full h-16 rounded-[2rem] text-lg font-black bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all active:scale-[0.98] group border-none"
                  onClick={handleAddToCart}
                  disabled={
                    addingToCart ||
                    product.soLuongTonKho === 0 ||
                    quantity > product.soLuongTonKho
                  }
                >
                  {addingToCart ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : product.soLuongTonKho === 0 ? (
                    "Sản phẩm đang hết hàng"
                  ) : (
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-6 w-6 transition-transform group-hover:rotate-12" />
                      Thêm vào giỏ hàng
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                    </div>
                  )}
                </Button>
              </div>

              {/* Description */}
              <div className="bg-white p-8 rounded-[3rem] border-2 border-orange-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Mô tả sản phẩm
                  </h3>
                </div>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {product.moTa ||
                    "Sản phẩm chính hãng chất lượng cao, đã được kiểm duyệt an toàn cho thú cưng bởi đội ngũ chuyên gia PetCare."}
                </p>
                <div className="pt-4 border-t border-slate-50 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-emerald-500" /> Hoàn trả 7
                    ngày
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-emerald-500" /> BH chính hãng
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
