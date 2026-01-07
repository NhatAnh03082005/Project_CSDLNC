import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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
import { Badge } from "../../components/ui/badge";

import {
  ArrowLeft,
  Plus,
  Edit,
  Edit2,
  Trash2,
  FolderOpen,
  PawPrint,
  Info,
  Calendar,
  Activity,
  Dog,
  Type,
} from "lucide-react";

import { petAPI } from "../../api/services";

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedPet, setSelectedPet] = useState(null);
  const [dateError, setDateError] = useState("");

  const EMPTY_FORM = {
    TenThuCung: "",
    GioiTinh: "",
    Loai: "",
    Giong: "",
    NgaySinh: "",
    TinhTrangSucKhoe: "",
  };

  const [formData, setFormData] = useState(EMPTY_FORM);

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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age < 0 ? 0 : age;
  };

  const validateDateOfBirth = (dateString) => {
    if (!dateString) return true;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      chi;
      setDateError("Ngày sinh không được lớn hơn ngày hiện tại");
      return false;
    }
    setDateError("");
    return true;
  };

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

  const openEditDialog = (pet) => {
    setDateError("");
    setSelectedPet(pet);
    setFormData({
      TenThuCung: pet.TenThuCung || "",
      GioiTinh: pet.GioiTinh || "",
      Loai: pet.Loai || "",
      Giong: pet.Giong || "",
      NgaySinh: pet.NgaySinh ? pet.NgaySinh.split("T")[0] : "",
      TinhTrangSucKhoe: pet.TinhTrangSucKhoe || "",
    });
    setIsEditDialogOpen(true);
  };

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

  const openDeleteDialog = (pet) => {
    setSelectedPet(pet);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePet = async () => {
    if (!selectedPet) return;
    try {
      await petAPI.delete(selectedPet.MaThuCung);
      setIsDeleteDialogOpen(false);
      setSelectedPet(null);
      fetchPets();
    } catch (error) {
      console.error("Lỗi khi xóa thú cưng:", error);
    }
  };

  // =========================
  // UI helpers (đồng bộ size)
  // =========================
  const fieldBase =
    "w-full !h-11 rounded-xl border border-gray-200 bg-gray-50/60 " +
    "!px-4 !py-0 text-sm font-medium text-slate-700 leading-none " +
    "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-400";

  const selectTriggerBase = fieldBase + " flex items-center justify-between";

  const labelBase =
    "text-sm font-semibold text-gray-700 flex items-center gap-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-[2.5rem] shadow-md p-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/customer">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors h-10 w-10 rounded-xl"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Hồ sơ thú cưng
                </h1>
                <p className="text-gray-600 mt-1">
                  Quản lý và theo dõi thông tin chi tiết về các thú cưng của bạn
                </p>
              </div>
            </div>

            {/* ADD DIALOG */}
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) setFormData(EMPTY_FORM);
                setDateError("");
              }}
            >
              <DialogTrigger asChild>
                <Button className="h-11 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 rounded-xl px-6">
                  <Plus className="h-5 w-5" />
                  Thêm thú cưng
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl rounded-[1.75rem]">
                {/* Header gọn */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 px-6 py-6 text-white relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <PawPrint className="h-20 w-20 rotate-12" />
                  </div>
                  <DialogHeader className="space-y-1 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/25 shadow-inner">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                          Thêm thú cưng
                        </DialogTitle>
                        <DialogDescription className="text-blue-100/90 text-sm mt-1">
                          Tạo hồ sơ cho người bạn nhỏ của bạn
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                {/* Body gọn */}
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-name" className={labelBase}>
                        <Type className="h-4 w-4 text-blue-500" /> Tên thú cưng
                      </Label>
                      <Input
                        id="add-name"
                        className={`${fieldBase} placeholder:text-gray-400/60`}
                        value={formData.TenThuCung || ""}
                        onChange={(e) =>
                          handleInputChange("TenThuCung", e.target.value)
                        }
                        placeholder="Nhập tên thú cưng"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-gender" className={labelBase}>
                        <Info className="h-4 w-4 text-blue-500" /> Giới tính
                      </Label>
                      <Select
                        value={formData.GioiTinh || ""}
                        onValueChange={(value) =>
                          handleInputChange("GioiTinh", value)
                        }
                      >
                        <SelectTrigger
                          id="add-gender"
                          className={`${selectTriggerBase} ${
                            !formData.GioiTinh ? "text-gray-600" : ""
                          }`}
                        >
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Đực">Đực</SelectItem>
                          <SelectItem value="Cái">Cái</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-species" className={labelBase}>
                        <Dog className="h-4 w-4 text-blue-500" /> Loài
                      </Label>
                      <Select
                        value={formData.Loai || ""}
                        onValueChange={(value) =>
                          handleInputChange("Loai", value)
                        }
                      >
                        <SelectTrigger
                          id="add-species"
                          className={`${selectTriggerBase} ${
                            !formData.Loai ? "text-gray-600" : ""
                          }`}
                        >
                          <SelectValue placeholder="Chọn loài" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chó">Chó</SelectItem>
                          <SelectItem value="Mèo">Mèo</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-breed" className={labelBase}>
                        <FolderOpen className="h-4 w-4 text-blue-500" /> Giống
                      </Label>
                      <Input
                        id="add-breed"
                        className={`${fieldBase} placeholder:text-gray-400/60`}
                        value={formData.Giong || ""}
                        onChange={(e) =>
                          handleInputChange("Giong", e.target.value)
                        }
                        placeholder="Ví dụ: Poodle"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-dob" className={labelBase}>
                      <Calendar className="h-4 w-4 text-blue-500" /> Ngày sinh
                    </Label>
                    <Input
                      id="add-dob"
                      type="date"
                      className={`${fieldBase} appearance-none ${
                        dateError ? "!border-red-500" : ""
                      }`}
                      value={formData.NgaySinh || ""}
                      onChange={(e) => {
                        handleInputChange("NgaySinh", e.target.value);
                        setDateError("");
                      }}
                    />
                    {dateError && (
                      <p className="text-xs font-medium text-red-500 ml-1">
                        {dateError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-health" className={labelBase}>
                      <Activity className="h-4 w-4 text-blue-500" /> Tình trạng
                      sức khỏe
                    </Label>
                    <Textarea
                      id="add-health"
                      className="rounded-xl border border-gray-200 bg-gray-50/60 !px-4 !py-3 text-sm font-medium text-slate-700 leading-relaxed resize-none focus-visible:ring-0 focus-visible:border-blue-400 placeholder:text-gray-400/60"
                      value={formData.TinhTrangSucKhoe || ""}
                      onChange={(e) =>
                        handleInputChange("TinhTrangSucKhoe", e.target.value)
                      }
                      placeholder="Mô tả tình trạng sức khỏe hiện tại..."
                      rows={3}
                    />
                  </div>

                  <DialogFooter className="pt-2 flex gap-3">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-xl h-11 font-semibold text-gray-600 hover:bg-gray-100"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="premium"
                      className="flex-1 rounded-xl h-11 font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      onClick={handleAddPet}
                    >
                      Thêm
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" />
            </div>
            <p className="text-blue-600 font-medium animate-pulse text-lg">
              Đang tải hồ sơ thú cưng...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pets.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-blue-200 space-y-6">
                <div className="p-6 bg-blue-50 rounded-full">
                  <PawPrint className="h-12 w-12 text-blue-300" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Chưa có thú cưng nào
                  </h3>
                  <p className="text-slate-500 mt-2 max-w-sm">
                    Hãy thêm thú cưng đầu tiên để bắt đầu quản lý hồ sơ.
                  </p>
                </div>
                <Button
                  variant="premium"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="gap-2 rounded-2xl px-8 py-6 text-lg font-bold shadow-xl shadow-blue-100 transition-all hover:scale-105"
                >
                  <Plus className="h-6 w-6" />
                  Thêm thú cưng
                </Button>
              </div>
            ) : (
              pets.map((pet) => (
                <Card
                  key={pet.MaThuCung}
                  className="relative group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100 overflow-hidden"
                >
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-blue-50/90 backdrop-blur-sm text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-2xl shadow-lg transition-all"
                      onClick={() => openEditDialog(pet)}
                    >
                      <Edit2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-red-50/90 backdrop-blur-sm text-red-600 border border-red-100 hover:bg-red-600 hover:text-white rounded-2xl shadow-lg transition-all"
                      onClick={() => openDeleteDialog(pet)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <CardContent className="p-8">
                    <div className="mb-8 flex items-center gap-5">
                      <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-blue-500 via-sky-500 to-teal-500 flex items-center justify-center shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform duration-500">
                        <PawPrint className="h-9 w-9 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {pet.TenThuCung}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-600 border-none px-3 py-1 mt-1 rounded-lg font-bold"
                        >
                          {pet.MaThuCung}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                            Loài
                          </span>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Dog className="h-4 w-4 text-blue-500" />
                            <span className="text-[13px] font-bold">
                              {pet.Loai}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all">
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                            Giới tính
                          </span>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Info className="h-4 w-4 text-blue-500" />
                            <span className="text-[13px] font-bold">
                              {pet.GioiTinh}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5 px-1">
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="p-2 bg-blue-50 rounded-xl">
                            <FolderOpen className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-sm font-semibold truncate">
                            {pet.Giong || "Chưa cập nhật giống"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="p-2 bg-blue-50 rounded-xl">
                            <Calendar className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                              {pet.NgaySinh
                                ? new Date(pet.NgaySinh).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : "---"}
                            </span>
                            <span className="text-[11px] text-slate-400 font-bold">
                              {pet.NgaySinh
                                ? `(${calculateAge(pet.NgaySinh)} tuổi)`
                                : "Chưa có tuổi"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-100">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Activity className="h-4 w-4 text-teal-500" />
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                            {pet.TinhTrangSucKhoe ||
                              "Tình trạng sức khỏe ổn định, không có dấu hiệu bất thường."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* EDIT DIALOG (đã thu nhỏ + đồng bộ input/select) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-none shadow-2xl rounded-[1.75rem]">
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-6 py-6 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Edit className="h-20 w-20 rotate-12" />
              </div>
              <DialogHeader className="space-y-1 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/15 backdrop-blur-lg rounded-2xl border border-white/25 shadow-inner">
                    <Edit className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                      Cập nhật thú cưng
                    </DialogTitle>
                    <DialogDescription className="text-orange-50/90 text-sm mt-1">
                      Chỉnh sửa thông tin cho{" "}
                      <strong>{formData.TenThuCung}</strong>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={labelBase}>
                    <Type className="h-4 w-4 text-orange-500" /> Tên thú cưng
                  </Label>
                  <Input
                    className={`${fieldBase} placeholder:text-gray-400/60`}
                    value={formData.TenThuCung || ""}
                    onChange={(e) =>
                      handleInputChange("TenThuCung", e.target.value)
                    }
                    placeholder="Tên thú cưng"
                  />
                </div>

                <div className="space-y-2">
                  <Label className={labelBase}>
                    <Info className="h-4 w-4 text-orange-500" /> Giới tính
                  </Label>
                  <Select
                    value={formData.GioiTinh || ""}
                    onValueChange={(value) =>
                      handleInputChange("GioiTinh", value)
                    }
                  >
                    <SelectTrigger
                      className={`${selectTriggerBase} ${
                        !formData.GioiTinh ? "text-gray-600" : ""
                      }`}
                    >
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đực">Đực</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={labelBase}>
                    <Dog className="h-4 w-4 text-orange-500" /> Loài
                  </Label>
                  <Select
                    value={formData.Loai || ""}
                    onValueChange={(value) => handleInputChange("Loai", value)}
                  >
                    <SelectTrigger
                      className={`${selectTriggerBase} ${
                        !formData.Loai ? "text-gray-600" : ""
                      }`}
                    >
                      <SelectValue placeholder="Chọn loài" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chó">Chó</SelectItem>
                      <SelectItem value="Mèo">Mèo</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className={labelBase}>
                    <FolderOpen className="h-4 w-4 text-orange-500" /> Giống
                  </Label>
                  <Input
                    className={`${fieldBase} placeholder:text-gray-400/60`}
                    value={formData.Giong || ""}
                    onChange={(e) => handleInputChange("Giong", e.target.value)}
                    placeholder="Ví dụ: Poodle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelBase}>
                  <Calendar className="h-4 w-4 text-orange-500" /> Ngày sinh
                </Label>
                <Input
                  type="date"
                  className={`${fieldBase} appearance-none ${
                    dateError ? "!border-red-500" : ""
                  }`}
                  value={formData.NgaySinh || ""}
                  onChange={(e) => {
                    handleInputChange("NgaySinh", e.target.value);
                    setDateError("");
                  }}
                />
                {dateError && (
                  <p className="text-xs font-medium text-red-500 ml-1">
                    {dateError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={labelBase}>
                  <Activity className="h-4 w-4 text-orange-500" /> Tình trạng
                  sức khỏe
                </Label>
                <Textarea
                  className="rounded-xl border border-gray-200 bg-gray-50/60 !px-4 !py-3 text-sm font-medium text-slate-700 leading-relaxed resize-none focus-visible:ring-0 focus-visible:border-blue-400 placeholder:text-gray-400/60"
                  rows={3}
                  value={formData.TinhTrangSucKhoe || ""}
                  onChange={(e) =>
                    handleInputChange("TinhTrangSucKhoe", e.target.value)
                  }
                  placeholder="Mô tả tình trạng sức khỏe..."
                />
              </div>

              <DialogFooter className="pt-2 flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 rounded-xl h-11 font-semibold text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="premium"
                  className="flex-1 rounded-xl h-11 font-semibold shadow-lg shadow-orange-200 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 border-none transition-all hover:scale-[1.01] active:scale-[0.99]"
                  onClick={handleEditPet}
                >
                  Lưu
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* DELETE DIALOG */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 px-6 py-6 text-white">
              <DialogTitle className="text-xl font-bold">
                Xác nhận xóa
              </DialogTitle>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa thú cưng{" "}
                <strong>{selectedPet?.TenThuCung}</strong>? Hành động này không
                thể hoàn tác.
              </p>
              <DialogFooter className="mt-6 flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 rounded-xl h-11 font-semibold text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 rounded-xl h-11 font-semibold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all hover:scale-[1.01]"
                  onClick={handleDeletePet}
                >
                  Xóa
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
