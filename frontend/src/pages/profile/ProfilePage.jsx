import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Heart, ArrowLeft, User, FolderOpen, ClipboardPlus, Star, Crown, TrendingUp, Award } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  // Loại bỏ khai báo kiểu TypeScript cho state profile
  const [profile, setProfile] = useState({
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "khachhang@email.com",
    idCard: "001234567890",
    dateOfBirth: "1990-01-15",
    gender: "male",
    loyaltyPoints: 850,
    membershipTier: "Thân thiết",
    currentSpending: 8500000,
    basicTierMin: 0,
    loyalTierMin: 5000000,
    vipTierMin: 15000000,
    maintainSpending: 3000000,
  });

  // Loại bỏ khai báo kiểu TypeScript: (field: string, value: string)
  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save profile data to backend
  };

  const progressToNextTier =
    profile.membershipTier === "Cơ bản"
      ? (profile.currentSpending / profile.loyalTierMin) * 100
      : profile.membershipTier === "Thân thiết"
      ? (profile.currentSpending / profile.vipTierMin) * 100
      : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Sửa Link href -> to */}
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600 fill-blue-600" />
              <span className="text-xl font-bold text-blue-900">PetCare</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                    <AvatarFallback>KH</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Khách hàng</p>
                    <p className="text-xs leading-none text-muted-foreground">khachhang@email.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/profile" className="flex items-center w-full">
                    Quản lý hồ sơ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/pets" className="flex items-center w-full">
                    Thêm/xóa/cập nhật hồ sơ thú cưng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ClipboardPlus className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/vaccination-packages" className="flex items-center w-full">
                    Đăng ký gói tiêm phòng
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  {/* Sửa Link href -> to */}
                  <Link to="/reviews" className="flex items-center w-full">
                    Đánh giá
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Quản lý hồ sơ</h1>
          <p className="text-gray-600">Xem và cập nhật thông tin cá nhân của bạn</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Membership Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Hội viên</CardTitle>
                  <Crown className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">{profile.membershipTier}</Badge>
                  <p className="text-2xl font-bold">{profile.loyaltyPoints} điểm</p>
                  <p className="text-sm text-blue-100">Điểm loyalty</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tiến độ lên hạng</span>
                    <span>{Math.round(progressToNextTier)}%</span>
                  </div>
                  <Progress value={progressToNextTier} className="h-2 bg-white/20" />
                </div>

                <div className="pt-4 border-t border-white/20 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Chi tiêu hiện tại:</span>
                    <span className="font-semibold ml-auto">{profile.currentSpending.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Chi tiêu giữ hạng:</span>
                    <span className="font-semibold ml-auto">{profile.maintainSpending.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membership Tiers Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Các cấp hội viên</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                    <span className="text-sm">Cơ bản</span>
                  </div>
                  <span className="text-sm text-gray-600">{profile.basicTierMin.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Thân thiết</span>
                  </div>
                  <span className="text-sm text-gray-600">{profile.loyalTierMin.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm">VIP</span>
                  </div>
                  <span className="text-sm text-gray-600">{profile.vipTierMin.toLocaleString("vi-VN")}đ</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Hủy
                      </Button>
                      <Button onClick={handleSave}>Lưu</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ tên</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idCard">CCCD</Label>
                    <Input
                      id="idCard"
                      value={profile.idCard}
                      onChange={(e) => handleInputChange("idCard", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Lưu ý: Cấp hội viên và mức chi tiêu không thể chỉnh sửa thủ công
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}