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
  ArrowRightLeft, // Icon cho nút điều chuyển nhân viên
} from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { employeeAPI, branchAPI } from "../../../../api/services";

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

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // [Thêm mới] State cho dialog điều chuyển
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferBranchId, setTransferBranchId] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [addFormData, setAddFormData] = useState({
    HoTen: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoLam: "",
    ViTri: "",
    LuongCoBan: "",
    MaChiNhanh: "",
  });

  const [editFormData, setEditFormData] = useState({
    HoTen: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoLam: "",
    ViTri: "",
    LuongCoBan: "",
    MaChiNhanh: "",
  // TenChiNhanh: "",  -- ko cần Tên Chi nhánh hay mã chi nhánh ở đây vì edit chỉ chỉnh sửa thông tin cá nhân
  });

  const GENDER_OPTIONS = ["Nam", "Nữ"];
  const POSITION_OPTIONS = [
    "Bác sĩ thú y",
    "Nhân viên bán hàng",
    "Nhân viên lễ tân",
    "Quản lý chi nhánh",
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // const results = await Promise.allSettled([
      //   employeeAPI.getAll(),
      //   branchAPI.getAll(),
      // ]);
      // Gọi song song cả API lấy NV và API lấy Chi nhánh
      const [empRes, branchRes] = await Promise.all([
        employeeAPI.getAll(),
        branchAPI.getAll()
      ]);

      // Kiểm tra và set dữ liệu vào State
      if (empRes.data.success) {
        setEmployees(empRes.data.data);
      }
      if (branchRes.data.success) { // Giả sử branchAPI trả về cấu trúc tương tự
        setBranches(branchRes.data.data || []);
      }

      // const employeesRes =
      //   results[0]?.status === "fulfilled" ? results[0].value : null;
      // const branchesRes =
      //   results[1]?.status === "fulfilled" ? results[1].value : null;

      // const employeesData =
      //   employeesRes?.data?.data ?? employeesRes?.data ?? [];
      // const branchesData = branchesRes?.data?.data ?? branchesRes?.data ?? [];

      // setEmployees(Array.isArray(employeesData) ? employeesData : []);
      // setBranches(Array.isArray(branchesData) ? branchesData : []);
      // setError(null);
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
      //TenChiNhanh: "",
      MaChiNhanh: "",
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();// Chặn reload trang
    try {
      // Validate cơ bản
      if (!addFormData.MaChiNhanh) {
        alert("Vui lòng chọn chi nhánh!");
        return;
      }

      const res = await employeeAPI.create(addFormData);
     if (res.data.success)
      { 
        await fetchData();
        setIsAddDialogOpen(false);
        resetAddForm();
        alert("Thêm nhân viên thành công!");
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      alert(err.response?.data?.message ?? "Không thể thêm nhân viên");
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
      MaChiNhanh: employee.MaChiNhanh || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await employeeAPI.update(selectedEmployee.MaNhanVien, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      alert("Cập nhật nhân viên thành công!");
    } catch (err) {
      console.error("Error updating employee:", err);
      alert(err.response?.data?.message || "Không thể cập nhật nhân viên");
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
      alert("Xóa nhân viên thành công!");
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert(err.response?.data?.message || "Không thể xóa nhân viên");
    }
  };

  // [Thêm mới] Hàm mở dialog điều chuyển
  const handleTransferClick = (employee) => {
    setSelectedEmployee(employee);
    setTransferBranchId(employee.MaChiNhanh || ""); // Set giá trị mặc định là chi nhánh hiện tại
    setIsTransferDialogOpen(true);
  };

  // [Thêm mới] Hàm thực hiện điều chuyển
  const handleTransferSubmit = async () => {
    try {
      if (!transferBranchId) {
        alert("Vui lòng chọn chi nhánh mới");
        return;
      }
      if (transferBranchId === selectedEmployee.MaChiNhanh) {
         alert("Vui lòng chọn chi nhánh khác chi nhánh hiện tại");
         return;
      }

      // Gọi API transfer (API mới)
      // data gửi đi: { targetBranchId: "CN02" }
      await employeeAPI.transfer(selectedEmployee.MaNhanVien, { targetBranchId: transferBranchId });
      
      await fetchData(); // Refresh lại list
      setIsTransferDialogOpen(false);
      setSelectedEmployee(null);
      alert(`Điều chuyển nhân viên sang chi nhánh mới thành công!`);
    } catch (err) {
      console.error("Error transferring employee:", err);
      // Hiển thị lỗi từ Backend (VD: Đang là Quản lý chi nhánh nên không được chuyển)
      alert(err.response?.data?.message || "Lỗi khi điều chuyển nhân viên");
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
          {/* HEADER giống BranchManagement */}
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
                    Điền đầy đủ thông tin để tạo một nhân viên mới vào hệ thống.
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

                  {/* Row 4: Chi nhánh - thay MaChiNhanh cho TenChiNhanh */}
                  <div className="space-y-2">
                    <Label htmlFor="add-MaChiNhanh">Chi nhánh</Label>
                    <select
                      id="add-MaChiNhanh"
                      value={addFormData.MaChiNhanh}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          MaChiNhanh: e.target.value,
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

          {/* LIST: 4 nhân viên / 1 dòng (lg:grid-cols-4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                Không có nhân viên nào
              </div>
            ) : (
              employees.map((emp) => (
                <Card
                  key={emp.MaNhanVien}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  {/* ACTIONS góc phải trên giống Branch */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* [Thêm mới] Nút Điều Chuyển */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                      onClick={() => handleTransferClick(emp)}
                      title="Điều chuyển công tác"
                    >
                      <ArrowRightLeft className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                      onClick={() => handleEdit(emp)}
                      title="Sửa"
                    >
                      <Edit2 className="h-5 w-5" />
                    </Button>

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
                          {/* Logic hiển thị tên chi nhánh: Tìm trong branches state nếu API nhân viên chỉ trả về mã */}
                          {branches.find(b => b.MaChiNhanh === emp.MaChiNhanh)?.TenChiNhanh || emp.MaChiNhanh || "Chưa có chi nhánh"}
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
          
          {/* [Thêm mới] TRANSFER DIALOG */}
          <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-orange-600">
                  Điều chuyển công tác
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Điều chuyển nhân viên <strong className="text-gray-900">{selectedEmployee?.HoTen}</strong> sang chi nhánh mới.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                 <div className="space-y-2">
                    <Label>Chi nhánh hiện tại</Label>
                    <div className="p-3 bg-gray-100 rounded-md text-gray-700">
                       {branches.find(b => b.MaChiNhanh === selectedEmployee?.MaChiNhanh)?.TenChiNhanh || "Không xác định"}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="transfer-branch">Chuyển đến chi nhánh</Label>
                    <select
                      id="transfer-branch"
                      value={transferBranchId}
                      onChange={(e) => setTransferBranchId(e.target.value)}
                      className="w-full border rounded-lg px-3 h-10 border-input bg-background text-sm focus:ring-2 focus:ring-orange-500"
                    >
                       <option value="">-- Chọn chi nhánh đích --</option>
                       {branches
                         .filter(b => b.MaChiNhanh !== selectedEmployee?.MaChiNhanh) // Ẩn chi nhánh hiện tại
                         .map((b) => (
                           <option key={b.MaChiNhanh} value={b.MaChiNhanh}>
                             {b.TenChiNhanh}
                           </option>
                       ))}
                    </select>
                 </div>
              </div>

              <DialogFooter>
                <Button 
                   onClick={handleTransferSubmit} 
                   className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                   Xác nhận điều chuyển
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
