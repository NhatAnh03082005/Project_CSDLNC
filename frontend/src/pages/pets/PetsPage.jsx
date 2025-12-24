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
import { Heart, ArrowLeft, Plus, Edit, Trash2, User, FolderOpen, ClipboardPlus, Star, PawPrint, Loader2 } from "lucide-react";
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
              <Button className="gap-2 bg-black hover:bg-blue-500 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                <Plus className="h-4 w-4" />
                Thêm thú cưng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm thú cưng mới</DialogTitle>
                <DialogDescription>Nhập thông tin thú cưng của bạn</DialogDescription>
              </DialogHeader>
              {/* Form Fields - Giữ nguyên logic handleInputChange */}
              {/* Form Fields trong Add Pet Dialog */}
<div className="space-y-4 py-4">
  <div className="grid md:grid-cols-2 gap-4">
    {/* Tên thú cưng */}
    <div className="space-y-2">
      <Label htmlFor="add-name">Tên thú cưng</Label>
      <Input
        id="add-name"
        value={formData.TenThuCung || ""}
        onChange={(e) => handleInputChange("TenThuCung", e.target.value)}
        placeholder="Ví dụ: Milo"
      />
    </div>

    {/* GIỚI TÍNH - MỤC MỚI THÊM */}
    <div className="space-y-2">
      <Label htmlFor="add-gender">Giới tính</Label>
      <Select 
        value={formData.GioiTinh || ""} 
        onValueChange={(value) => handleInputChange("GioiTinh", value)}
      >
        <SelectTrigger id="add-gender">
          <SelectValue placeholder="Chọn giới tính" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Đực">Đực</SelectItem>
          <SelectItem value="Cái">Cái</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    {/* Loài */}
    <div className="space-y-2">
      <Label htmlFor="add-species">Loài</Label>
      <Select 
        value={formData.Loai || ""} 
        onValueChange={(value) => handleInputChange("Loai", value)}
      >
        <SelectTrigger id="add-species">
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
    <div className="space-y-2">
      <Label htmlFor="add-breed">Giống</Label>
      <Input
        id="add-breed"
        value={formData.Giong || ""}
        onChange={(e) => handleInputChange("Giong", e.target.value)}
        placeholder="Ví dụ: Poodle, Golden..."
      />
    </div>
  </div>

  {/* Ngày sinh */}
<div className="space-y-2">
  <Label htmlFor="add-dob">Ngày sinh</Label>
  <Input
    id="add-dob"
    type="date"
    className={dateError ? "border-red-500" : ""} // Thêm màu viền đỏ khi có lỗi
    value={formData.NgaySinh || ""}
    onChange={(e) => {
      handleInputChange("NgaySinh", e.target.value);
      setDateError(""); // Xóa lỗi khi người dùng nhập lại
    }}
  />
  {dateError && <p className="text-sm font-medium text-red-500">{dateError}</p>}
</div>

  {/* Tình trạng sức khỏe */}
  <div className="space-y-2">
    <Label htmlFor="add-health">Tình trạng sức khỏe</Label>
    <Textarea
      id="add-health"
      value={formData.TinhTrangSucKhoe || ""}
      onChange={(e) => handleInputChange("TinhTrangSucKhoe", e.target.value)}
      placeholder="Mô tả tình trạng sức khỏe hiện tại..."
      rows={3}
    />
  </div>
</div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddPet}>Thêm thú cưng</Button>
              </DialogFooter>
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
                  <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
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
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => openEditDialog(pet)}
                    >
                      <Edit className="h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-red-600 hover:text-red-700 bg-transparent"
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
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Chỉnh sửa thú cưng</DialogTitle>
      <DialogDescription>
        Cập nhật thông tin thú cưng của bạn
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Tên thú cưng */}
        <div className="space-y-2">
          <Label>Tên thú cưng</Label>
          <Input
            value={formData.TenThuCung || ""}
            onChange={(e) =>
              handleInputChange("TenThuCung", e.target.value)
            }
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-2">
          <Label>Giới tính</Label>
          <Select
            value={formData.GioiTinh || ""}
            onValueChange={(value) =>
              handleInputChange("GioiTinh", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Đực">Đực</SelectItem>
              <SelectItem value="Cái">Cái</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Loài */}
        <div className="space-y-2">
          <Label>Loài</Label>
          <Select
            value={formData.Loai || ""}
            onValueChange={(value) =>
              handleInputChange("Loai", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loài" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chó">Chó</SelectItem>
              <SelectItem value="Mèo">Mèo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Giống */}
        <div className="space-y-2">
          <Label>Giống</Label>
          <Input
            value={formData.Giong || ""}
            onChange={(e) =>
              handleInputChange("Giong", e.target.value)
            }
            placeholder="Ví dụ: Poodle"
          />
        </div>
      </div>

      {/* Ngày sinh */}
<div className="space-y-2">
  <Label>Ngày sinh</Label>
  <Input
    type="date"
    className={dateError ? "border-red-500" : ""}
    value={formData.NgaySinh || ""}
    onChange={(e) => {
      handleInputChange("NgaySinh", e.target.value);
      setDateError("");
    }}
  />
  {dateError && <p className="text-sm font-medium text-red-500">{dateError}</p>}
</div>

      {/* Tình trạng sức khỏe */}
      <div className="space-y-2">
        <Label>Tình trạng sức khỏe</Label>
        <Textarea
          rows={3}
          value={formData.TinhTrangSucKhoe || ""}
          onChange={(e) =>
            handleInputChange("TinhTrangSucKhoe", e.target.value)
          }
        />
      </div>
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setIsEditDialogOpen(false)}
      >
        Hủy
      </Button>
      <Button onClick={handleEditPet}>
        Lưu thay đổi
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thú cưng <strong>{selectedPet?.TenThuCung}</strong>? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
              <Button variant="outline" onClick={handleDeletePet}>Xóa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}