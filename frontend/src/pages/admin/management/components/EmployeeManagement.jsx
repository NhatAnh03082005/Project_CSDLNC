import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  User,
  Building2,
  Briefcase,
  Wallet,
  Calendar,
  Cake,
  Search,
} from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { employeeAPI, branchAPI } from "../../../../api/services";
import { toast } from "../../../../lib/toast";

import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { formatDate } from "../../management/utils/timeFormat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin/management");

  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [addFormData, setAddFormData] = useState({
    HoTen: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoLam: "",
    ViTri: "",
    LuongCoBan: "",
    TenChiNhanh: "",
  });

  const [editFormData, setEditFormData] = useState({
    HoTen: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoLam: "",
    ViTri: "",
    LuongCoBan: "",
    TenChiNhanh: "",
  });

  const GENDER_OPTIONS = ["Nam", "Nữ"];
  const POSITION_OPTIONS = [
    "Bác sĩ thú y",
    "Nhân viên bán hàng",
    "Nhân viên tiếp tân",
    "Quản lý chi nhánh",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        employeeAPI.getAll(),
        branchAPI.getAll(),
      ]);

      const employeesRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;
      const branchesRes =
        results[1]?.status === "fulfilled" ? results[1].value : null;

      const employeesData =
        employeesRes?.data?.data ?? employeesRes?.data ?? [];
      const branchesData = branchesRes?.data?.data ?? branchesRes?.data ?? [];

      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setBranches(Array.isArray(branchesData) ? branchesData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const resetAddForm = () => {
    setAddFormData({
      HoTen: "",
      GioiTinh: "",
      NgaySinh: "",
      NgayVaoLam: "",
      ViTri: "",
      LuongCoBan: "",
      TenChiNhanh: "",
    });
  };

  const handleAdd = async () => {
    try {
      await employeeAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      resetAddForm();
      toast.success("Thêm nhân viên thành công!");
    } catch (err) {
      console.error("Error adding employee:", err);
      toast.error(err.response?.data?.message || "Không thể thêm nhân viên");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      HoTen: employee.HoTen || "",
      GioiTinh: employee.GioiTinh || "",
      NgaySinh: employee.NgaySinh?.split("T")[0] || "",
      NgayVaoLam: employee.NgayVaoLam?.split("T")[0] || "",
      ViTri: employee.ViTri?.trim() || "",
      LuongCoBan: employee.LuongCoBan ?? "",
      TenChiNhanh: employee.TenChiNhanh || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await employeeAPI.update(selectedEmployee.MaNhanVien, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      toast.success("Cập nhật nhân viên thành công!");
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error(err.response?.data?.message || "Không thể cập nhật nhân viên");
    }
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await employeeAPI.delete(selectedEmployee.MaNhanVien);
      await fetchData();
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      toast.success("Xóa nhân viên thành công!");
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error(err.response?.data?.message || "Không thể xóa nhân viên");
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((emp) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchName = emp.HoTen?.toLowerCase().includes(searchLower);
    const matchBranch = emp.TenChiNhanh?.toLowerCase().includes(searchLower);
    const matchPosition = emp.ViTri?.toLowerCase().includes(searchLower);

    return matchName || matchBranch || matchPosition;
  });

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
          {/* HEADER */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 space-y-4">
            <div className="flex items-center justify-between">
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
                    Quản lý nhân viên
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý tất cả nhân viên trên hệ thống
                  </p>
                </div>
              </div>

              {/* ADD DIALOG */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                    <Plus className="h-4 w-4" />
                    Thêm nhân viên
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-600">
                      Thêm nhân viên mới
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                      Điền đầy đủ thông tin để tạo một nhân viên mới vào hệ
                      thống.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Row 1: Họ tên & Giới tính */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="add-HoTen">Họ tên</Label>
                        <Input
                          id="add-HoTen"
                          placeholder="Nhập họ và tên"
                          value={addFormData.HoTen}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              HoTen: e.target.value,
                            })
                          }
                          className="h-10 text-black placeholder:text-gray-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-GioiTinh">Giới tính</Label>
                        <select
                          id="add-GioiTinh"
                          value={addFormData.GioiTinh}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              GioiTinh: e.target.value,
                            })
                          }
                          className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Chọn giới tính</option>
                          {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Ngày sinh & Ngày vào làm */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="add-NgaySinh">Ngày sinh</Label>
                        <Input
                          id="add-NgaySinh"
                          type="date"
                          value={addFormData.NgaySinh}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              NgaySinh: e.target.value,
                            })
                          }
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-NgayVaoLam">Ngày vào làm</Label>
                        <Input
                          id="add-NgayVaoLam"
                          type="date"
                          value={addFormData.NgayVaoLam}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              NgayVaoLam: e.target.value,
                            })
                          }
                          className="h-10"
                        />
                      </div>
                    </div>

                    {/* Row 3: Vị trí & Lương */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="add-ViTri">Vị trí</Label>
                        <select
                          id="add-ViTri"
                          value={addFormData.ViTri}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              ViTri: e.target.value,
                            })
                          }
                          className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Chọn vị trí</option>
                          {POSITION_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-LuongCoBan">Lương cơ bản</Label>
                        <Input
                          id="add-LuongCoBan"
                          type="number"
                          placeholder="Nhập lương cơ bản"
                          value={addFormData.LuongCoBan}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              LuongCoBan: e.target.value,
                            })
                          }
                          className="h-10 text-black placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Row 4: Chi nhánh */}
                    <div className="space-y-2">
                      <Label htmlFor="add-TenChiNhanh">Chi nhánh</Label>
                      <select
                        id="add-TenChiNhanh"
                        value={addFormData.TenChiNhanh}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            TenChiNhanh: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Chọn chi nhánh</option>
                        {branches.map((b) => (
                          <option key={b.MaChiNhanh} value={b.TenChiNhanh}>
                            {b.TenChiNhanh}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      onClick={handleAdd}
                      className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Thêm nhân viên
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, chi nhánh hoặc vị trí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* LIST: 4 nhân viên / 1 dòng (xl:grid-cols-4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {filteredEmployees.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                {searchTerm.trim()
                  ? "Không tìm thấy nhân viên nào phù hợp"
                  : "Không có nhân viên nào"}
              </div>
            ) : (
              filteredEmployees.map((emp) => (
                <Card
                  key={emp.MaNhanVien}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  {/* ACTIONS góc phải trên giống Branch */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                      onClick={() => handleEdit(emp)}
                      title="Sửa"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                      onClick={() => handleDelete(emp)}
                      title="Xóa"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <CardContent className="pr-5 pl-5">
                    {/* Header */}
                    <div className="mb-7 pr-8">
                      <h3 className="text-lg font-bold text-sky-600 mb-2 line-clamp-1">
                        {emp.HoTen}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {emp.MaNhanVien}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-3 text-sm mb-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="line-clamp-1">
                          {emp.TenChiNhanh || "Chưa có chi nhánh"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="line-clamp-1">
                          {emp.ViTri || "Chưa có vị trí"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(emp.NgayVaoLam)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Wallet className="h-4 w-4 text-gray-400" />
                        <span>
                          {(emp.LuongCoBan ?? 0).toLocaleString()} VNĐ
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{emp.GioiTinh || "—"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Cake className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(emp.NgaySinh)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* EDIT DIALOG - giống Add */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-blue-600">
                  Chỉnh sửa nhân viên
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Cập nhật thông tin cho nhân viên{" "}
                  <strong className="text-blue-600">
                    {selectedEmployee?.MaNhanVien}
                  </strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-HoTen">Họ tên</Label>
                    <Input
                      id="edit-HoTen"
                      value={editFormData.HoTen}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          HoTen: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-GioiTinh">Giới tính</Label>
                    <select
                      id="edit-GioiTinh"
                      value={editFormData.GioiTinh}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          GioiTinh: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Chọn giới tính</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-NgaySinh">Ngày sinh</Label>
                    <Input
                      id="edit-NgaySinh"
                      type="date"
                      value={editFormData.NgaySinh}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          NgaySinh: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-NgayVaoLam">Ngày vào làm</Label>
                    <Input
                      id="edit-NgayVaoLam"
                      type="date"
                      value={editFormData.NgayVaoLam}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          NgayVaoLam: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-ViTri">Vị trí</Label>
                    <select
                      id="edit-ViTri"
                      value={editFormData.ViTri}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          ViTri: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Chọn vị trí</option>
                      {POSITION_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-LuongCoBan">Lương cơ bản</Label>
                    <Input
                      id="edit-LuongCoBan"
                      type="number"
                      value={editFormData.LuongCoBan}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          LuongCoBan: e.target.value,
                        })
                      }
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-TenChiNhanh">Chi nhánh</Label>
                  <select
                    id="edit-TenChiNhanh"
                    value={editFormData.TenChiNhanh}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        TenChiNhanh: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Chọn chi nhánh</option>
                    {branches.map((b) => (
                      <option key={b.MaChiNhanh} value={b.TenChiNhanh}>
                        {b.TenChiNhanh}
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

          {/* DELETE DIALOG */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="gap-0">
              <DialogHeader className="pb-3">
                <DialogTitle className="text-2xl font-bold text-red-600">
                  Xác nhận xóa nhân viên
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Bạn có chắc chắn muốn xóa nhân viên{" "}
                  <strong className="text-red-600">
                    {selectedEmployee?.HoTen}
                  </strong>{" "}
                  khỏi hệ thống?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button
                  onClick={confirmDelete}
                  className="h-10 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Xác nhận
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
