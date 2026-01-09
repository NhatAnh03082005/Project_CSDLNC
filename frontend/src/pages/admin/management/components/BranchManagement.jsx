import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { employeeAPI, branchAPI } from "../../../../api/services";
import { toast } from "../../../../lib/toast";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";
// Import time format utilities
import { formatTimeFromSQL, inputHHMMToServerTime } from "../utils/timeFormat";
// Import Icons
import { Plus, Edit, MapPin, Phone, Clock, User, Edit2 } from "lucide-react";
// Import AdminHeader
import AdminHeader from "../../components/AdminHeader";

export default function BranchManagement() {
  const navigate = useNavigate();
  const onBack = () => {
    navigate("/admin/management");
  };
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [addFormData, setAddFormData] = useState({
    TenChiNhanh: "",
    SoNha: "",
    TenDuong: "",
    Phuong: "",
    ThanhPho: "",
    SDT: "",
    TGMoCua: "",
    TGDongCua: "",
  });

  const [editFormData, setEditFormData] = useState({
    TenChiNhanh: "",
    SoNha: "",
    TenDuong: "",
    Phuong: "",
    ThanhPho: "",
    SDT: "",
    TGMoCua: "",
    TGDongCua: "",
    QuanLy: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        branchAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      const branchesRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;
      const employeesRes =
        results[1]?.status === "fulfilled" ? results[1].value : null;

      const branchesData = branchesRes?.data?.data ?? branchesRes?.data ?? [];
      const employeesData =
        employeesRes?.data?.data ?? employeesRes?.data ?? [];

      setBranches(Array.isArray(branchesData) ? branchesData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      // Format time trước khi gửi lên server
      const formattedData = {
        ...addFormData,
        TGMoCua: inputHHMMToServerTime(addFormData.TGMoCua),
        TGDongCua: inputHHMMToServerTime(addFormData.TGDongCua),
      };

      console.log("Data gửi lên server:", formattedData);
      await branchAPI.create(formattedData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        TenChiNhanh: "",
        SoNha: "",
        TenDuong: "",
        Phuong: "",
        ThanhPho: "",
        SDT: "",
        TGMoCua: "",
        TGDongCua: "",
      });
      toast.success("Thêm chi nhánh thành công!");
    } catch (err) {
      console.error("Error adding branch:", err);
      toast.error(err.response?.data?.message || "Không thể thêm chi nhánh");
    }
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setEditFormData({
      TenChiNhanh: branch.TenChiNhanh || "",
      SoNha: branch.SoNha || "",
      TenDuong: branch.TenDuong || "",
      Phuong: branch.Phuong || "",
      ThanhPho: branch.ThanhPho || "",
      SDT: branch.SDT || "",
      TGMoCua: formatTimeFromSQL(branch.TGMoCua),
      TGDongCua: formatTimeFromSQL(branch.TGDongCua),
      QuanLy: branch.QuanLy ?? "", // null -> ""
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      // Format time trước khi gửi lên server
      const formattedData = {
        ...editFormData,
        TGMoCua: inputHHMMToServerTime(editFormData.TGMoCua),
        TGDongCua: inputHHMMToServerTime(editFormData.TGDongCua),
      };

      await branchAPI.update(selectedBranch.MaChiNhanh, formattedData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedBranch(null);
      toast.success("Cập nhật chi nhánh thành công!");
    } catch (err) {
      console.error("Error updating branch:", err);
      toast.error(err.response?.data?.message || "Không thể cập nhật chi nhánh");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchData} className="mt-4 mx-auto block">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Quản lý chi nhánh
                </h1>
                <p className="text-gray-600 mt-1">
                  Quản lý tất cả chi nhánh trên hệ thống
                </p>
              </div>
            </div>

            {/* ADD DIALOG */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                  <Plus className="h-4 w-4" />
                  Thêm chi nhánh
                </Button>
              </DialogTrigger>

              {/* 1. Mở rộng chiều ngang Modal */}
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  {/* 2. Đổi màu tiêu đề sang Blue */}
                  <DialogTitle className="text-2xl font-bold text-blue-600">
                    Thêm chi nhánh mới
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 mt-2">
                    Điền đầy đủ thông tin để tạo một chi nhánh mới vào hệ thống.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Hàng 1: Tên chi nhánh & SĐT */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="TenChiNhanh">Tên chi nhánh</Label>
                      <Input
                        id="TenChiNhanh"
                        placeholder="Nhập tên chi nhánh"
                        value={addFormData.TenChiNhanh}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            TenChiNhanh: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="SDT">SĐT</Label>
                      <Input
                        id="SDT"
                        placeholder="Nhập số điện thoại"
                        value={addFormData.SDT}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            SDT: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Hàng 2: Số nhà & Tên đường */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="SoNha">Số nhà</Label>
                      <Input
                        id="SoNha"
                        type="number"
                        placeholder="Nhập số nhà"
                        value={addFormData.SoNha}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            SoNha: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="TenDuong">Tên đường</Label>
                      <Input
                        id="TenDuong"
                        placeholder="Nhập tên đường"
                        value={addFormData.TenDuong}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            TenDuong: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Hàng 3: Xã/Phường & Tỉnh/Thành */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="Phuong">Xã/Phường</Label>
                      <Input
                        id="Phuong"
                        placeholder="Nhập tên phường"
                        value={addFormData.Phuong}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            Phuong: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ThanhPho">Tỉnh/Thành phố</Label>
                      <Input
                        id="ThanhPho"
                        placeholder="Nhập tỉnh/thành phố"
                        value={addFormData.ThanhPho}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            ThanhPho: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Hàng 4: Giờ mở cửa & Giờ đóng cửa */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="TGMoCua">Giờ mở cửa</Label>
                      <Input
                        id="TGMoCua"
                        type="time"
                        value={addFormData.TGMoCua}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            TGMoCua: e.target.value,
                          })
                        }
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="TGDongCua">Giờ đóng cửa</Label>
                      <Input
                        id="TGDongCua"
                        type="time"
                        value={addFormData.TGDongCua}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            TGDongCua: e.target.value,
                          })
                        }
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  {/* Nút Lưu màu Xanh Dương */}
                  <Button
                    onClick={handleAdd}
                    className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Thêm chi nhánh
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Grid Layout - Branch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {branches.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                Không có chi nhánh nào
              </div>
            ) : (
              branches.map((branch) => (
                <Card
                  key={branch.MaChiNhanh}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  {/* Edit Button - Top Right Corner */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                    onClick={() => handleEdit(branch)}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>

                  <CardContent className="py-4 pr-4 pl-4">
                    {/* Header */}
                    <div className="mb-7 pr-8">
                      <h3 className="text-lg font-bold text-sky-600 mb-2">
                        {branch.TenChiNhanh}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {branch.MaChiNhanh}
                      </span>
                    </div>

                    {/* Body - Information with Icons */}
                    <div className="space-y-3 mb-3 mt-3">
                      {/* Address */}
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>
                          {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                          {branch.ThanhPho}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{branch.SDT}</span>
                      </div>

                      {/* Working Hours */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {formatTimeFromSQL(branch.TGMoCua)} -{" "}
                          {formatTimeFromSQL(branch.TGDongCua)}
                        </span>
                      </div>

                      {/* Manager */}
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span>
                          {branch.QuanLy === null ? (
                            <span className="text-gray-400 italic">
                              Chưa có quản lý
                            </span>
                          ) : (
                            <>
                              {employees.find(
                                (emp) => emp.MaNhanVien === branch.QuanLy
                              )?.HoTen || "Không tìm thấy thông tin"}
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* EDIT DIALOG */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            {/* THAY ĐỔI Ở ĐÂY: Thêm className để tăng độ rộng lên 700px */}
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">
                  Chỉnh sửa chi nhánh
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Cập nhật thông tin chi tiết cho chi nhánh{" "}
                  <strong className="text-blue-600">
                    {selectedBranch?.MaChiNhanh}
                  </strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Hàng 1: Tên chi nhánh & SĐT */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-TenChiNhanh">Tên chi nhánh</Label>
                    <Input
                      id="edit-TenChiNhanh"
                      value={editFormData.TenChiNhanh}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          TenChiNhanh: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-SDT">Số điện thoại</Label>
                    <Input
                      id="edit-SDT"
                      value={editFormData.SDT}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          SDT: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Hàng 2: Số nhà & Tên đường */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-SoNha">Số nhà</Label>
                    <Input
                      id="edit-SoNha"
                      type="number"
                      value={editFormData.SoNha}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          SoNha: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-TenDuong">Tên đường</Label>
                    <Input
                      id="edit-TenDuong"
                      value={editFormData.TenDuong}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          TenDuong: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Hàng 3: Xã/Phường & Tỉnh/Thành */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-Phuong">Xã/Phường</Label>
                    <Input
                      id="edit-Phuong"
                      value={editFormData.Phuong}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          Phuong: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-ThanhPho">Tỉnh/Thành phố</Label>
                    <Input
                      id="edit-ThanhPho"
                      value={editFormData.ThanhPho}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          ThanhPho: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Hàng 4: Giờ mở cửa & Giờ đóng cửa */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-TGMoCua">Giờ mở cửa</Label>
                    <Input
                      id="edit-TGMoCua"
                      type="time"
                      value={editFormData.TGMoCua}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          TGMoCua: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-TGDongCua">Giờ đóng cửa</Label>
                    <Input
                      id="edit-TGDongCua"
                      type="time"
                      value={editFormData.TGDongCua}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          TGDongCua: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Hàng 5: Quản lý */}
                <div className="space-y-2">
                  <Label htmlFor="edit-QuanLy">Quản lý</Label>
                  <select
                    id="edit-QuanLy"
                    value={editFormData.QuanLy}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        QuanLy: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Chọn quản lý</option>
                    {employees
                      .filter(
                        (emp) =>
                          emp.ViTri === "Quản lý chi nhánh" &&
                          emp.TenChiNhanh === selectedBranch?.TenChiNhanh
                      )
                      .map((emp) => (
                        <option key={emp.MaNhanVien} value={emp.MaNhanVien}>
                          {emp.MaNhanVien} - {emp.HoTen}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  onClick={saveEdit}
                  className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
