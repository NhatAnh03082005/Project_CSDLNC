import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
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
import { Heart, ArrowLeft, Plus, Edit, Trash2, User, FolderOpen, ClipboardPlus, Star, PawPrint } from "lucide-react";

// 3. Loại bỏ interface Pet (vì đây là JSX thuần)
// interface Pet { ... }

export default function PetsPage() {
  // Loại bỏ khai báo kiểu TypeScript: Pet[]
  const [pets, setPets] = useState([
    {
      id: "1",
      name: "Milo",
      species: "Chó",
      breed: "Golden Retriever",
      gender: "Đực",
      dateOfBirth: "2020-05-15",
      healthStatus: "Khỏe mạnh, đã tiêm phòng đầy đủ",
    },
    {
      id: "2",
      name: "Luna",
      species: "Mèo",
      breed: "Mèo Ba Tư",
      gender: "Cái",
      dateOfBirth: "2021-08-20",
      healthStatus: "Khỏe mạnh, cần tiêm nhắc lại",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Loại bỏ khai báo kiểu TypeScript: Pet | null
  const [selectedPet, setSelectedPet] = useState(null); 
  // Loại bỏ khai báo kiểu TypeScript: Partial<Pet>
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    dateOfBirth: "",
    healthStatus: "",
  });

  // Loại bỏ khai báo kiểu TypeScript: (field: keyof Pet, value: string)
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddPet = () => {
    // Loại bỏ khai báo kiểu TypeScript: Pet
    const newPet = {
      id: Date.now().toString(),
      name: formData.name || "",
      species: formData.species || "",
      breed: formData.breed || "",
      gender: formData.gender || "",
      dateOfBirth: formData.dateOfBirth || "",
      healthStatus: formData.healthStatus || "",
    };
    setPets([...pets, newPet]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEditPet = () => {
    if (selectedPet) {
      setPets(
        pets.map((pet) =>
          pet.id === selectedPet.id
            ? {
                ...pet,
                name: formData.name || pet.name,
                species: formData.species || pet.species,
                breed: formData.breed || pet.breed,
                gender: formData.gender || pet.gender,
                dateOfBirth: formData.dateOfBirth || pet.dateOfBirth,
                healthStatus: formData.healthStatus || pet.healthStatus,
              }
            : pet,
        ),
      );
      setIsEditDialogOpen(false);
      setSelectedPet(null);
      setFormData({});
    }
  };

  const handleDeletePet = () => {
    if (selectedPet) {
      setPets(pets.filter((pet) => pet.id !== selectedPet.id));
      setIsDeleteDialogOpen(false);
      setSelectedPet(null);
    }
  };

  // Loại bỏ khai báo kiểu TypeScript: (pet: Pet)
  const openEditDialog = (pet) => {
    setSelectedPet(pet);
    setFormData(pet);
    setIsEditDialogOpen(true);
  };

  // Loại bỏ khai báo kiểu TypeScript: (pet: Pet)
  const openDeleteDialog = (pet) => {
    setSelectedPet(pet);
    setIsDeleteDialogOpen(true);
  };

  // Loại bỏ khai báo kiểu TypeScript: (dateOfBirth: string)
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Hồ sơ thú cưng</h1>
            <p className="text-gray-600">Quản lý thông tin thú cưng của bạn</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm thú cưng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm thú cưng mới</DialogTitle>
                <DialogDescription>Nhập thông tin thú cưng của bạn</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Tên thú cưng</Label>
                    <Input
                      id="add-name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ví dụ: Milo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-species">Loài</Label>
                    {/* Giữ Select và logic onValueChange */}
                    <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                      <SelectTrigger id="add-species">
                        <SelectValue placeholder="Chọn loài" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chó">Chó</SelectItem>
                        <SelectItem value="Mèo">Mèo</SelectItem>
                        <SelectItem value="Chim">Chim</SelectItem>
                        <SelectItem value="Thỏ">Thỏ</SelectItem>
                        <SelectItem value="Hamster">Hamster</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-breed">Giống</Label>
                    <Input
                      id="add-breed"
                      value={formData.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                      placeholder="Ví dụ: Golden Retriever"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-gender">Giới tính</Label>
                    {/* Giữ Select và logic onValueChange */}
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                <div className="space-y-2">
                  <Label htmlFor="add-dob">Ngày sinh</Label>
                  <Input
                    id="add-dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-health">Tình trạng sức khỏe</Label>
                  <Textarea
                    id="add-health"
                    value={formData.healthStatus}
                    onChange={(e) => handleInputChange("healthStatus", e.target.value)}
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

        {pets.length === 0 ? (
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
              <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <PawPrint className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{pet.name}</CardTitle>
                        <CardDescription>{pet.breed}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Loài:</span>
                      <Badge variant="secondary">{pet.species}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Giới tính:</span>
                      <span className="font-medium">{pet.gender}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tuổi:</span>
                      <span className="font-medium">{calculateAge(pet.dateOfBirth)} tuổi</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-1">Tình trạng sức khỏe:</p>
                    <p className="text-sm">{pet.healthStatus}</p>
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
              <DialogTitle>Chỉnh sửa thông tin thú cưng</DialogTitle>
              <DialogDescription>Cập nhật thông tin thú cưng của bạn</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tên thú cưng</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-species">Loài</Label>
                  <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                    <SelectTrigger id="edit-species">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chó">Chó</SelectItem>
                      <SelectItem value="Mèo">Mèo</SelectItem>
                      <SelectItem value="Chim">Chim</SelectItem>
                      <SelectItem value="Thỏ">Thỏ</SelectItem>
                      <SelectItem value="Hamster">Hamster</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-breed">Giống</Label>
                  <Input
                    id="edit-breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Giới tính</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger id="edit-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đực">Đực</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dob">Ngày sinh</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-health">Tình trạng sức khỏe</Label>
                <Textarea
                  id="edit-health"
                  value={formData.healthStatus}
                  onChange={(e) => handleInputChange("healthStatus", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditPet}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thú cưng <strong>{selectedPet?.name}</strong>? Hành động này không thể hoàn
                tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeletePet}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}