import React from "react";
// 1. Thay thế Link của 'next/link' bằng Link của 'react-router-dom'
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../components/ui/button";
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
  Calendar,
  Syringe,
  ShoppingBag,
  Heart,
  Clock,
  MapPin,
  User,
  FolderOpen,
  ClipboardPlus,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/header";

export default function CustomerHome() {

  const {user} = useAuth();
  console.log(user);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-balance text-blue-900">
              PetCareX - Đồng hành cùng thú cưng của bạn
            </h1>
            <p className="text-lg text-gray-600 text-pretty leading-relaxed">
              Với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe thú
              cưng, PetCare tự hào là một trong những hệ thống phòng khám thú y
              uy tín và chuyên nghiệp hàng đầu tại Việt Nam. Chúng tôi cam kết
              mang đến dịch vụ chăm sóc toàn diện, tận tâm và chất lượng cao
              nhất cho những người bạn bốn chân của bạn.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Mở cửa: 8:00 - 20:00</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>10+ chi nhánh</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Ảnh minh họa Hero */}
            <img
              src="/happy-veterinarian-with-cute-dog-and-cat-in-modern.png"
              alt="Bác sĩ thú y chăm sóc thú cưng"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe cho thú cưng
            của bạn
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Đặt lịch khám bệnh</CardTitle>
              <CardDescription>
                Đặt lịch hẹn khám sức khỏe định kỳ hoặc khi có vấn đề
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/branches?service=exam">
                <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Đặt lịch ngay</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Syringe className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Tiêm phòng</CardTitle>
              <CardDescription>
                Tiêm phòng đầy đủ các loại vaccine cho thú cưng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/branches?service=vaccination">
                <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Đặt lịch tiêm</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Mua sản phẩm</CardTitle>
              <CardDescription>
                Thức ăn, phụ kiện và các sản phẩm chăm sóc thú cưng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/branches?service=products">
                <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Xem sản phẩm</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
</div>

);
}