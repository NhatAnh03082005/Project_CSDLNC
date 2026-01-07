import React, { useEffect, useState } from "react";

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
import { Crown, TrendingUp, Award, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { customerAPI } from "../../api/services";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const [formData, setFormData] = useState({
    HoTen: "",
    SDT: "",
    CCCD: "",
    NgaySinh: "",
    GioiTinh: "Nam",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getProfile();
        if (response && response.data && response.data.success) {
          const data = response.data.data;
          setProfileData(data);
          setFormData({
            HoTen: data.HoTen || "",
            SDT: data.SDT || "",
            CCCD: data.CCCD || "",
            NgaySinh: data.NgaySinh ? data.NgaySinh.split("T")[0] : "",
            GioiTinh: data.GioiTinh || "Nam",
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profileData) {
      setFormData({
        HoTen: profileData.HoTen || "",
        SDT: profileData.SDT || "",
        CCCD: profileData.CCCD || "",
        NgaySinh: profileData.NgaySinh
          ? profileData.NgaySinh.split("T")[0]
          : "",
        GioiTinh: profileData.GioiTinh || "Nam",
      });
    }
  }, [profileData]);

  if (loading || !profileData) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50/50">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="ml-2 font-medium text-slate-600">Đang tải hồ sơ...</p>
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

    if (!formData.SDT || formData.SDT.length !== 10) {
      newErrors.SDT = "Số điện thoại phải có đúng 10 chữ số";
    }

    if (!formData.CCCD || formData.CCCD.length !== 12) {
      newErrors.CCCD = "Căn cước công dân phải có đúng 12 chữ số";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await customerAPI.updateProfile(formData);

      if (response.data.success) {
        alert("Cập nhật thông tin thành công");
        setIsEditing(false);
        setErrors({});
        const updatedResponse = await customerAPI.getProfile();
        if (
          updatedResponse &&
          updatedResponse.data &&
          updatedResponse.data.success
        ) {
          const updatedData = updatedResponse.data.data;
          setProfileData(updatedData);
          setUser(updatedData);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu profile:", error);

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

  const currentSpending = profileData?.TongChiTieu || 0;
  const maintainSpending = profileData?.ChiTieuGiuHang || 0;
  const basicTierMin = 0;
  const loyalTierMin = 5000000;
  const vipTierMin = 15000000;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Hồ sơ tài khoản
          </h1>
          <p className="text-slate-600 font-medium">
            Quản lý thông tin cá nhân và theo dõi đặc quyền hội viên của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-[2.5rem] border-none shadow-2xl shadow-blue-200 overflow-hidden relative group transition-all hover:-translate-y-2">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Crown className="h-24 w-24" />
              </div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white">
                    Hội viên
                  </CardTitle>
                  <Crown className="h-7 w-7 animate-bounce-slow" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                <div>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-4 rounded-full mb-4">
                    {profileData.CapHoiVien}
                  </Badge>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">
                      {profileData.DiemLoyalty || 0}
                    </span>
                    <span className="text-blue-100 font-bold tracking-widest uppercase text-xs">
                      Điểm
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20 space-y-3">
                  <div className="flex items-center justify-between text-blue-50">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Tổng chi tiêu:
                      </span>
                    </div>
                    <span className="font-bold">
                      {currentSpending.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-blue-50">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Chi tiêu giữ hạng:
                      </span>
                    </div>
                    <span className="font-bold">
                      {maintainSpending.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border border-blue-200 shadow-xl shadow-blue-900/5 bg-white overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-blue-600 text-xl font-bold">
                  Bản đồ thăng hạng
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <TierItem
                  label="Cơ bản"
                  min={basicTierMin}
                  color="bg-slate-400"
                />
                <TierItem
                  label="Thân thiết"
                  min={loyalTierMin}
                  color="bg-blue-500"
                />
                <TierItem
                  label="VIP"
                  min={vipTierMin}
                  color="bg-amber-500"
                  isLast
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-900/5 bg-white h-full transition-all hover:shadow-2xl">
              <CardHeader className="p-8 border-b border-blue-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-blue-600 text-3xl font-black">
                      Thông tin cá nhân
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium mt-1">
                      Cập nhật thông tin định danh và liên hệ
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="premium"
                      className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-blue-100"
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa profile
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="rounded-2xl h-12 px-8 text-red-600 font-bold hover:bg-red-600 hover:text-white shadow-lg border-red-600"
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({});

                          setFormData({
                            HoTen: profileData?.HoTen || "",
                            SDT: profileData?.SDT || "",
                            CCCD: profileData?.CCCD || "",
                            NgaySinh: profileData?.NgaySinh
                              ? profileData.NgaySinh.split("T")[0]
                              : "",
                            GioiTinh: profileData?.GioiTinh || "Nam",
                          });
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        className="rounded-2xl h-12 px-8 bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
                        onClick={handleSave}
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">
                      Họ và tên
                    </Label>
                    <Input
                      name="HoTen"
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:opacity-100 disabled:bg-slate-50/50"
                      value={formData.HoTen}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">
                      Số điện thoại
                    </Label>
                    <Input
                      name="SDT"
                      className={`h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:opacity-100 disabled:bg-slate-50/50 ${
                        errors.SDT ? "border-amber-400 bg-amber-50/30" : ""
                      }`}
                      value={formData.SDT}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {errors.SDT && (
                      <p className="text-xs text-amber-600 font-bold ml-1">
                        {errors.SDT}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">
                      Địa chỉ Email
                    </Label>
                    <Input
                      className="h-12 rounded-xl bg-slate-100/50 border-slate-200 text-slate-700 italic"
                      value={profileData.Email || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">
                      Giới tính
                    </Label>

                    <Select
                      value={formData.GioiTinh}
                      onValueChange={handleSelectChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger
                        className="!h-12 !min-h-[48px] w-full !rounded-xl !bg-slate-50 !border-slate-200
                 px-4 py-0 text-[15px] leading-none
                 focus:bg-white transition-all
                 disabled:opacity-100 disabled:!bg-slate-50/50"
                      >
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>

                      <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">
                      Số CCCD
                    </Label>
                    <Input
                      name="CCCD"
                      className={`h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:opacity-100 disabled:bg-slate-50/50 ${
                        errors.CCCD ? "border-amber-400 bg-amber-50/30" : ""
                      }`}
                      value={formData.CCCD}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {errors.CCCD && (
                      <p className="text-xs text-amber-600 font-bold ml-1">
                        {errors.CCCD}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold ml-1">
                      Ngày sinh
                    </Label>
                    <Input
                      name="NgaySinh"
                      type="date"
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:opacity-100 disabled:bg-slate-50/50"
                      value={formData.NgaySinh}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="bg-blue-50/40 rounded-[2rem] p-6 border border-blue-100/50 space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="h-16 w-16" />
                  </div>
                  <div className="flex items-center gap-2 text-blue-800 font-black text-sm uppercase tracking-wide">
                    <ShieldCheck className="h-5 w-5" />
                    Bảo mật dữ liệu định danh
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Thông tin CCCD và ngày sinh được sử dụng để xác thực quyền
                    chủ tài khoản và đồng bộ hồ sơ y khoa. PetCareX cam kết
                    tuyệt đối không chia sẻ dữ liệu này cho bên thứ ba.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function TierItem({ label, min, color, isLast }) {
  return (
    <div
      className={`flex items-center justify-between ${!isLast ? "pb-4" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full ${color} shadow-sm`} />
        <span className="font-bold text-slate-700">{label}</span>
      </div>
      <span className="font-black text-blue-600">
        {min.toLocaleString("vi-VN")}đ
      </span>
    </div>
  );
}
