import React, { useState, useEffect } from "react"; // Thêm useEffect

import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../../...)
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
// Giữ Select và Textarea như các component UI
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
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
import { Heart, ArrowLeft, Plus, Edit, Trash2, User, FolderOpen, ClipboardPlus, Star, PawPrint, Loader2, Info, Calendar, Activity, Dog, Type } from "lucide-react";
import { petAPI } from "../../api/services";
// 3. Loại bỏ interface Pet (vì đây là JSX thuần)
// interface Pet { ... }

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null); 
  const [dateError, setDateError] = useState(""); // Thêm state này
  const [formData, setFormData] = useState({
    TenThuCung:"", 
    GioiTinh:"",
    Loai:"", 
    Giong:"", 
    NgaySinh:"", 
    TinhTrangSucKhoe:"" 
  });

const EMPTY_FORM = {
  TenThuCung: "",
  GioiTinh: "",
  Loai: "",
  Giong: "",
  NgaySinh: "",
  TinhTrangSucKhoe: ""
};

  // 1. Lấy danh sách thú cưng từ Server
  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petAPI.getAll();
      setPets(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thú cưng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };


  // 4. Xóa thú cưng qua API
  const handleDeletePet = async () => {
    if (selectedPet) {
      try {
        await petAPI.delete(selectedPet.MaThuCung);
        setIsDeleteDialogOpen(false);
        setSelectedPet(null);
        fetchPets(); // Refresh danh sách
      } catch (error) {
        console.error("Lỗi khi xóa thú cưng:", error);
      }
    }
  };

  const openEditDialog = (pet) => {
  setDateError(""); // Thêm dòng này
  setSelectedPet(pet);
  setFormData({
    TenThuCung: pet.TenThuCung || "",
    GioiTinh: pet.GioiTinh || "",
    Loai: pet.Loai || "",
    Giong: pet.Giong || "",
    NgaySinh: pet.NgaySinh
      ? pet.NgaySinh.split("T")[0]
      : "",
    TinhTrangSucKhoe: pet.TinhTrangSucKhoe || ""
  });
  setIsEditDialogOpen(true);
};


  const openDeleteDialog = (pet) => {
    setSelectedPet(pet);
    setIsDeleteDialogOpen(true);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 0 ? 0 : age;
  };
  // Hàm kiểm tra ngày sinh (Helper)
const validateDateOfBirth = (dateString) => {
  if (!dateString) return true;
  const selectedDate = new Date(dateString);
  const today = new Date();
  // Đặt về 0h để chỉ so sánh ngày
  today.setHours(0, 0, 0, 0); 
  
  if (selectedDate > today) {
    setDateError("Ngày sinh không được lớn hơn ngày hiện tại");
    return false;
  }
  setDateError("");
  return true;
};

// Cập nhật hàm xử lý Thêm
const handleAddPet = async () => {
  if (!validateDateOfBirth(formData.NgaySinh)) return;

  try {
    await petAPI.create(formData);
    setIsAddDialogOpen(false);
    setFormData(EMPTY_FORM);
    fetchPets();
  } catch (error) {
    console.error("Lỗi khi thêm thú cưng:", error);
  }
};

// Cập nhật hàm xử lý Sửa
const handleEditPet = async () => {
  if (!selectedPet) return;
  if (!validateDateOfBirth(formData.NgaySinh)) return;

  try {
    await petAPI.update(selectedPet.MaThuCung, formData);
    setIsEditDialogOpen(false);
    setSelectedPet(null);
    setFormData(EMPTY_FORM);
    fetchPets();
  } catch (error) {
    console.error("Lỗi khi cập nhật thú cưng:", error);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Hồ sơ thú cưng</h1>
            <p className="text-gray-600">Quản lý thông tin thú cưng của bạn</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if(!open) setFormData(EMPTY_FORM);
            setDateError(""); // Thêm dòng này
; // Reset form khi đóng
          }}>
            <DialogTrigger asChild>
              <Button variant="premium" className="gap-2 rounded-xl px-6 py-5 shadow-lg hover:shadow-blue-200 transition-all font-semibold">
                <Plus className="h-5 w-5" />
                Thêm thú cưng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-8 py-10 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <PawPrint className="h-32 w-32 rotate-12" />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-inner">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-bold tracking-tight">Thêm thú cưng</DialogTitle>
                    <DialogDescription className="text-blue-100/90 text-lg mt-1">
                      Hãy tạo hồ sơ cho người bạn nhỏ của bạn
                    </DialogDescription>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tên thú cưng */}
                  <div className="space-y-2.5">
                    <Label htmlFor="add-name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Type className="h-4 w-4 text-blue-500" /> Tên thú cưng
                    </Label>
                    <Input
                      id="add-name"
                      className="h-11 rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 w-full placeholder:text-gray-400/50"
                      value={formData.TenThuCung || ""}
                      onChange={(e) => handleInputChange("TenThuCung", e.target.value)}
                      placeholder="Ví dụ: Milo"
                    />
                  </div>

                  {/* Giới tính */}
                  <div className="space-y-2.5">
                    <Label htmlFor="add-gender" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                       <Info className="h-4 w-4 text-blue-500" /> Giới tính
                    </Label>
                    <Select 
                      value={formData.GioiTinh || ""} 
                      onValueChange={(value) => handleInputChange("GioiTinh", value)}
                    >
                      <SelectTrigger id="add-gender" className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 w-full ${!formData.GioiTinh ? "text-gray-400/60" : ""}`}>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đực">Đực</SelectItem>
                        <SelectItem value="Cái">Cái</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loài */}
                  <div className="space-y-2.5">
                    <Label htmlFor="add-species" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Dog className="h-4 w-4 text-blue-500" /> Loài
                    </Label>
                    <Select 
                      value={formData.Loai || ""} 
                      onValueChange={(value) => handleInputChange("Loai", value)}
                    >
                      <SelectTrigger id="add-species" className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 w-full ${!formData.Loai ? "text-gray-400/60" : ""}`}>
                        <SelectValue placeholder="Chọn loài" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chó">Chó</SelectItem>
                        <SelectItem value="Mèo">Mèo</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Giống */}
                  <div className="space-y-2.5">
                    <Label htmlFor="add-breed" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-blue-500" /> Giống
                    </Label>
                    <Input
                      id="add-breed"
                      className="h-11 rounded-xl border-gray-200 bg-gray-50/50 w-full placeholder:text-gray-400/50"
                      value={formData.Giong || ""}
                      onChange={(e) => handleInputChange("Giong", e.target.value)}
                      placeholder="Ví dụ: Poodle, Golden..."
                    />
                  </div>
                </div>

                {/* Ngày sinh */}
                <div className="space-y-2.5">
                  <Label htmlFor="add-dob" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" /> Ngày sinh
                  </Label>
                  <Input
                    id="add-dob"
                    type="date"
                    className={`rounded-xl border-gray-200 bg-gray-50/50 ${dateError ? "border-red-500 ring-1 ring-red-500" : ""}`}
                    value={formData.NgaySinh || ""}
                    onChange={(e) => {
                      handleInputChange("NgaySinh", e.target.value);
                      setDateError("");
                    }}
                  />
                  {dateError && <p className="text-xs font-medium text-red-500 mt-1 ml-1">{dateError}</p>}
                </div>

                {/* Tình trạng sức khỏe */}
                <div className="space-y-2.5">
                  <Label htmlFor="add-health" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" /> Tình trạng sức khỏe
                  </Label>
                  <Textarea
                    id="add-health"
                    className="rounded-xl border-gray-200 bg-gray-50/50 resize-none placeholder:text-gray-400/50"
                    value={formData.TinhTrangSucKhoe || ""}
                    onChange={(e) => handleInputChange("TinhTrangSucKhoe", e.target.value)}
                    placeholder="Mô tả tình trạng sức khỏe hiện tại..."
                    rows={3}
                  />
                </div>

                <DialogFooter className="pt-4 flex gap-3">
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-xl h-12 font-semibold text-gray-600 hover:bg-gray-100" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    variant="premium" 
                    className="flex-1 rounded-xl h-12 font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    onClick={handleAddPet}
                  >
                    Lưu thông tin
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : pets.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <PawPrint className="h-16 w-16 mx-auto text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Chưa có thú cưng nào</h3>
                  <p className="text-gray-600 mb-4">Thêm thú cưng của bạn để bắt đầu sử dụng dịch vụ</p>
                  <Button variant="premium" onClick={() => setIsAddDialogOpen(true)} className="gap-2 rounded-xl px-6 py-5 font-semibold">
                    <Plus className="h-5 w-5" />
                    Thêm thú cưng đầu tiên
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.MaThuCung} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <PawPrint className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{pet.TenThuCung}</CardTitle>
                        <CardDescription>{pet.Loai}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
  <div className="space-y-2">
    {/* Hiển thị Loài */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Loài:</span>
      <Badge variant="secondary">{pet.Loai}</Badge>
    </div>
    
    {/* Hiển thị Giới tính */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Giới tính:</span>
      <span className="font-medium">{pet.GioiTinh}</span>
    </div>

    {/* Hiển thị Giống */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Giống:</span>
      <span className="font-medium">{pet.Giong || "Chưa cập nhật"}</span>
    </div>

    {/* BỔ SUNG: Hiển thị Ngày sinh */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Ngày sinh:</span>
      <span className="font-medium">
        {pet.NgaySinh ? new Date(pet.NgaySinh).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
      </span>
    </div>

    {/* CẬP NHẬT: Tính tuổi dựa trên NgaySinh */}
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">Tuổi:</span>
      <span className="font-medium">
        {pet.NgaySinh ? `${calculateAge(pet.NgaySinh)} tuổi` : "---"}
      </span>
    </div>
  </div>

  <div className="pt-2 border-t">
    <p className="text-sm text-gray-600 mb-1">Tình trạng sức khỏe:</p>
    <p className="text-sm line-clamp-2">{pet.TinhTrangSucKhoe}</p>
  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                      onClick={() => openEditDialog(pet)}
                    >
                      <Edit className="h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 rounded-lg text-red-600 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all"
                      onClick={() => openDeleteDialog(pet)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-8 py-10 text-white relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Edit className="h-32 w-32 rotate-12" />
      </div>
      <div className="flex items-center gap-6 relative z-10">
        <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-inner">
          <Edit className="h-8 w-8 text-white" />
        </div>
        <div>
          <DialogTitle className="text-3xl font-bold tracking-tight">Cập nhật thú cưng</DialogTitle>
          <DialogDescription className="text-orange-50/90 text-lg mt-1">
            Chỉnh sửa thông tin cho <strong>{formData.TenThuCung}</strong>
          </DialogDescription>
        </div>
      </div>
    </div>

    <div className="p-8 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tên thú cưng */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Type className="h-4 w-4 text-orange-500" /> Tên thú cưng
          </Label>
          <Input
            className="h-11 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500 bg-gray-50/50 w-full placeholder:text-gray-400/50"
            value={formData.TenThuCung || ""}
            onChange={(e) => handleInputChange("TenThuCung", e.target.value)}
            placeholder="Tên thú cưng"
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Info className="h-4 w-4 text-orange-500" /> Giới tính
          </Label>
          <Select
            value={formData.GioiTinh || ""}
            onValueChange={(value) => handleInputChange("GioiTinh", value)}
          >
            <SelectTrigger className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 w-full ${!formData.GioiTinh ? "text-gray-400/60" : ""}`}>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Đực">Đực</SelectItem>
              <SelectItem value="Cái">Cái</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loài */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
             <Dog className="h-4 w-4 text-orange-500" /> Loài
          </Label>
          <Select
            value={formData.Loai || ""}
            onValueChange={(value) => handleInputChange("Loai", value)}
          >
            <SelectTrigger className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 w-full ${!formData.Loai ? "text-gray-400/60" : ""}`}>
              <SelectValue placeholder="Chọn loài" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chó">Chó</SelectItem>
              <SelectItem value="Mèo">Mèo</SelectItem>
              <SelectItem value="Khác">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Giống */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-orange-500" /> Giống
          </Label>
          <Input
            className="h-11 rounded-xl border-gray-200 bg-gray-50/50 w-full placeholder:text-gray-400/50"
            value={formData.Giong || ""}
            onChange={(e) => handleInputChange("Giong", e.target.value)}
            placeholder="Ví dụ: Poodle"
          />
        </div>
      </div>

      {/* Ngày sinh */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
           <Calendar className="h-4 w-4 text-orange-500" /> Ngày sinh
        </Label>
        <Input
          type="date"
          className={`rounded-xl border-gray-200 bg-gray-50/50 ${dateError ? "border-red-500 ring-1 ring-red-500" : ""}`}
          value={formData.NgaySinh || ""}
          onChange={(e) => {
            handleInputChange("NgaySinh", e.target.value);
            setDateError("");
          }}
        />
        {dateError && <p className="text-xs font-medium text-red-500 mt-1 ml-1">{dateError}</p>}
      </div>

      {/* Tình trạng sức khỏe */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Activity className="h-4 w-4 text-orange-500" /> Tình trạng sức khỏe
        </Label>
        <Textarea
          className="rounded-xl border-gray-200 bg-gray-50/50 resize-none placeholder:text-gray-400/50"
          rows={3}
          value={formData.TinhTrangSucKhoe || ""}
          onChange={(e) => handleInputChange("TinhTrangSucKhoe", e.target.value)}
          placeholder="Mô tả tình trạng sức khỏe..."
        />
      </div>

      <DialogFooter className="pt-4 flex gap-3">
        <Button
          variant="ghost"
          className="flex-1 rounded-xl h-12 font-semibold text-gray-600 hover:bg-gray-100"
          onClick={() => setIsEditDialogOpen(false)}
        >
          Hủy bỏ
        </Button>
        <Button 
          variant="premium" 
          className="flex-1 rounded-xl h-12 font-semibold shadow-lg shadow-orange-200 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-none transition-all hover:scale-[1.02] active:scale-[0.98]" 
          onClick={handleEditPet}
        >
          Lưu thay đổi
        </Button>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 px-6 py-8 text-white relative">
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Xác nhận xóa</DialogTitle>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa thú cưng <strong>{selectedPet?.TenThuCung}</strong>? 
                Hành động này không thể hoàn tác và tất cả dữ liệu liên quan sẽ bị mất.
              </p>
              <DialogFooter className="mt-8 flex gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-xl h-11 font-semibold text-gray-600 hover:bg-gray-100" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 rounded-xl h-11 font-semibold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all hover:scale-[1.02]" 
                  onClick={handleDeletePet}
                >
                  Xác nhận xóa
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}