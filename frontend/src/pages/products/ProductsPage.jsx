import React from "react";
// 1. Thay thế Link của 'next/link' bằng Link của 'react-router-dom'
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  Heart,
  User,
  FolderOpen,
  ClipboardPlus,
  Star,
  ShoppingBag,
  Award,
  Shield,
  Sparkles,
} from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Sản phẩm chất lượng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cung cấp đầy đủ các sản phẩm chăm sóc thú cưng từ thức ăn, thuốc men
            đến phụ kiện
          </p>
        </div>

        <div className="space-y-8">
          {/* Food Products */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8 text-orange-600" />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl mb-3">
                    Thức ăn dinh dưỡng
                  </CardTitle>
                  <CardDescription className="text-base">
                    Thức ăn cao cấp từ các thương hiệu hàng đầu thế giới
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thương hiệu uy tín:
                        </span>{" "}
                        Royal Canin, Hill's, Pedigree, Whiskas và nhiều thương
                        hiệu nổi tiếng khác
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">100% chính hãng:</span>{" "}
                        Nguồn gốc xuất xứ rõ ràng, đầy đủ giấy tờ chứng nhận
                        chất lượng
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Dinh dưỡng cân bằng:
                        </span>{" "}
                        Công thức đặc biệt cho từng loại thú cưng và độ tuổi
                        khác nhau
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                <img
                  src="/premium-pet-food-bags-and-bowls-colorful-display.png"
                  alt="Thức ăn thú cưng"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>

          {/* Medicine Products */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-full min-h-[300px] lg:min-h-[400px] order-2 lg:order-1">
                <img
                  src="/veterinary-medicine-bottles-and-supplements-for-pe.png"
                  alt="Thuốc thú y"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-8 flex flex-col justify-center order-1 lg:order-2">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl mb-3">
                    Thuốc và thực phẩm chức năng
                  </CardTitle>
                  <CardDescription className="text-base">
                    Đa dạng các loại thuốc điều trị và vitamin cho thú cưng
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thuốc chuyên dụng:
                        </span>{" "}
                        Thuốc điều trị ký sinh trùng, kháng sinh, thuốc da liễu
                        được nhập khẩu chính hãng
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thực phẩm chức năng:
                        </span>{" "}
                        Vitamin, khoáng chất, canxi, omega-3 giúp tăng cường sức
                        khỏe
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Tư vấn chuyên nghiệp:
                        </span>{" "}
                        Bác sĩ tư vấn miễn phí về cách sử dụng thuốc đúng cách
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Accessories Products */}
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl mb-3">
                    Phụ kiện thú cưng
                  </CardTitle>
                  <CardDescription className="text-base">
                    Đồ chơi, vòng cổ, quần áo và các phụ kiện đáng yêu
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">Phụ kiện đa dạng:</span>{" "}
                        Vòng cổ, dây dắt, quần áo, giày dép, nệm nằm và nhiều
                        sản phẩm khác
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Chất liệu an toàn:
                        </span>{" "}
                        Sản phẩm thân thiện môi trường, không gây hại cho sức
                        khỏe thú cưng
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p>
                        <span className="font-semibold">
                          Thiết kế thời trang:
                        </span>{" "}
                        Nhiều mẫu mã đẹp mắt, phong cách để thú cưng luôn nổi
                        bật
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                <img
                  src="/cute-pet-accessories-toys-collars-and-clothing-dis.png"
                  alt="Phụ kiện thú cưng"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          {/* Sửa Link href -> to */}
          <Link to="/branches?service=products">
            <Button size="lg" className="w-full sm:w-auto gap-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold border border-blue-700 rounded">
              <ShoppingBag className="h-5 w-5" />
              Mua sản phẩm ngay
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}