import React, { useEffect, useState } from "react";

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Crown, TrendingUp, Award, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { customerAPI } from "../../api/services";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth(); // user có thể là null nếu API lỗi hoặc đang load
  const [errors, setErrors] = useState({});
  // SỬA TẠI ĐÂY: Sử dụng dấu ? và giá trị mặc định
  const [formData, setFormData] = useState({
    HoTen: user?.HoTen || "",
    SDT: user?.SDT || "",
    CCCD: user?.CCCD || "",
    NgaySinh: user?.NgaySinh ? user.NgaySinh.split("T")[0] : "",
    GioiTinh: user?.GioiTinh || "Nam",
  });

  // Đảm bảo formData cập nhật khi user load xong
  useEffect(() => {
    if (user) {
      setFormData({
        HoTen: user.HoTen || "",
        SDT: user.SDT || "",
        CCCD: user.CCCD || "",
        NgaySinh: user.NgaySinh ? user.NgaySinh.split("T")[0] : "",
        GioiTinh: user.GioiTinh || "Nam",
      });
    }
  }, [user]);

  // THÊM KIỂM TRA: Nếu chưa có user, hiển thị màn hình chờ thay vì render form
  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="ml-2">Đang tải hồ sơ...</p>
      </div>
    );
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      GioiTinh: value,
    }));
  };
  const handleSave = async () => {
    const newErrors = {};

    // 1. Kiểm tra Số điện thoại (10 số)
    if (!formData.SDT || formData.SDT.length !== 10) {
      newErrors.SDT = "Số điện thoại phải có đúng 10 chữ số";
    }

    // 2. Kiểm tra CCCD (12 số)
    if (!formData.CCCD || formData.CCCD.length !== 12) {
      newErrors.CCCD = "Căn cước công dân phải có đúng 12 chữ số";
    }

    // Nếu có lỗi ở frontend thì cập nhật state errors và dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await customerAPI.updateProfile(formData);

      // Kiểm tra data.success dựa trên cấu trúc trả về từ customer.service.js của bạn
      if (response.data.success) {
        alert("Cập nhật thông tin thành công");
        setIsEditing(false);
        setErrors({});
      }
    } catch (error) {
      console.error("Lỗi khi lưu profile:", error);

      // 3. Bắt lỗi trùng lặp từ Backend (Mã 409 hoặc 400 kèm message)
      const serverMessage = error.response?.data?.message;
      if (
        serverMessage?.includes("đã tồn tại") ||
        serverMessage?.includes("đã được sử dụng")
      ) {
        setErrors({
          CCCD: "Số CCCD hoặc SĐT này đã tồn tại trong hệ thống",
        });
      } else {
        alert(serverMessage || "Có lỗi xảy ra khi cập nhật");
      }
    }
  };

  const currentSpending = 8500000;
  const basicTierMin = 0;
  const loyalTierMin = 5000000;
  const vipTierMin = 15000000;
  const maintainSpending = 3000000;
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Quản lý hồ sơ
          </h1>
          <p className="text-gray-600">
            Xem và cập nhật thông tin cá nhân của bạn
          </p>
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
                  <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    {user.CapHoiVien}
                  </Badge>
                  <p className="text-2xl font-bold">{user.DiemLoyalty} </p>
                  <p className="text-sm text-blue-100">Điểm loyalty</p>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Chi tiêu hiện tại:</span>
                    <span className="font-semibold ml-auto">
                      {currentSpending.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Chi tiêu giữ hạng:</span>
                    <span className="font-semibold ml-auto">
                      {maintainSpending.toLocaleString("vi-VN")}đ
                    </span>
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
                  <span className="text-sm text-gray-600">
                    {basicTierMin.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Thân thiết</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {loyalTierMin.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm">VIP</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {vipTierMin.toLocaleString("vi-VN")}đ
                  </span>
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
                    <CardDescription>
                      Quản lý thông tin tài khoản của bạn
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({}); // Xóa sạch thông báo lỗi

                          // HOÀN TÁC DỮ LIỆU: Đưa formData về giá trị của user hiện tại
                          setFormData({
                            HoTen: user?.HoTen || "",
                            SDT: user?.SDT || "",
                            CCCD: user?.CCCD || "",
                            NgaySinh: user?.NgaySinh
                              ? user.NgaySinh.split("T")[0]
                              : "",
                            GioiTinh: user?.GioiTinh || "Nam",
                          });
                        }}
                      >
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
                    <Label htmlFor="HoTen">Họ tên</Label>
                    <Input
                      name="HoTen"
                      id="HoTen"
                      value={formData.HoTen}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="SDT">Số điện thoại</Label>
                    <Input
                      name="SDT"
                      id="SDT"
                      className={errors.SDT ? "border-red-500" : ""}
                      value={formData.SDT}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {errors.SDT && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.SDT}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Email">Email</Label>
                  <Input
                    name="Email"
                    id="Email"
                    type="email"
                    value={user.Email}
                    disabled={true}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="CCCD">CCCD</Label>
                    <Input
                      name="CCCD"
                      id="CCCD"
                      className={errors.CCCD ? "border-red-500" : ""}
                      value={formData.CCCD}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {errors.CCCD && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.CCCD}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="NgaySinh">Ngày sinh</Label>
                    <Input
                      name="NgaySinh"
                      id="NgaySinh"
                      type="date"
                      value={formData.NgaySinh}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="GioiTinh">Giới tính</Label>
                  <Select
                    id="GioiTinh"
                    value={formData.GioiTinh}
                    onValueChange={handleSelectChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="GioiTinh">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nam">Nam</SelectItem>
                      <SelectItem value="Nữ">Nữ</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Lưu ý: Cấp hội viên và mức chi tiêu không thể chỉnh sửa
                      thủ công
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
