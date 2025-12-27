import React, { useState, useEffect } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { employeeAPI, branchAPI } from "../../../../api/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
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
// Import Icons
import { Plus, Edit, Trash2 } from "lucide-react";

export default function EmployeeManagement() {
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
    "Nhân viên lễ tân",
    "Quản lý chi nhánh",
  ];

  // Fetch employees and branches on mount
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

      // Support response shapes: { data: [...] } or { data: { data: [...] } }
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

  const handleAdd = async () => {
    try {
      await employeeAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        HoTen: "",
        GioiTinh: "",
        NgaySinh: "",
        NgayVaoLam: "",
        ViTri: "",
        LuongCoBan: "",
        TenChiNhanh: "",
      });
      alert("Thêm nhân viên thành công!");
    } catch (err) {
      console.error("Error adding employee:", err);
      alert(err.response?.data?.message || "Không thể thêm nhân viên");
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
      LuongCoBan: employee.LuongCoBan || "",
      TenChiNhanh: employee.TenChiNhanh || "",
    });
    setIsEditDialogOpen(true);
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-700 font-semibold text-xl">
              Danh sách nhân viên
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý nhân viên trên toàn công ty (10 chi nhánh)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-blue-100 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Thêm nhân viên
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-blue-600 font-semibold">
                    Thêm nhân viên mới
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-gray-600 mt-1">
                      {" "}
                      Điền thông tin nhân viên mới vào form bên dưới
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-name">Họ tên</Label>
                      <Input
                        id="add-name"
                        placeholder="Nhập họ và tên"
                        value={addFormData.HoTen}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            HoTen: e.target.value,
                          })
                        }
                        className="text-black placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-gender">Giới tính</Label>
                      <select
                        id="add-gender"
                        value={addFormData.GioiTinh}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            GioiTinh: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-birthdate">Ngày sinh</Label>
                      <Input
                        id="add-birthdate"
                        type="date"
                        value={addFormData.NgaySinh}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            NgaySinh: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-startdate">Ngày vào làm</Label>
                      <Input
                        id="add-startdate"
                        type="date"
                        value={addFormData.NgayVaoLam}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            NgayVaoLam: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-position">Vị trí</Label>
                      <select
                        id="add-position"
                        value={addFormData.ViTri}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            ViTri: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      <Label htmlFor="add-salary">Lương cơ bản</Label>
                      <Input
                        id="add-salary"
                        type="number"
                        placeholder="Nhập lương cơ bản"
                        value={addFormData.LuongCoBan}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            LuongCoBan: e.target.value,
                          })
                        }
                        className="text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-branch">Chi nhánh</Label>
                    <select
                      id="add-branch"
                      value={addFormData.TenChiNhanh}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          TenChiNhanh: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <DialogFooter>
                  <Button
                    onClick={handleAdd}
                    variant="outline"
                    className="bg-blue-100 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Thêm nhân viên
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {employees.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có nhân viên nào
            </div>
          ) : (
            employees.map((employee) => (
              <div
                key={employee.MaNhanVien}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-blue-600">
                    {employee.MaNhanVien} - {employee.HoTen}
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.TenChiNhanh} - {employee.ViTri}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => handleDelete(employee)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-600 font-semibold">
                {" "}
                Chỉnh sửa thông tin nhân viên
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin nhân viên{" "}
                <strong>{selectedEmployee?.HoTen}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Họ tên</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.HoTen}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        HoTen: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Giới tính</Label>
                  <select
                    id="edit-gender"
                    value={editFormData.GioiTinh}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        GioiTinh: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-birthdate">Ngày sinh</Label>
                  <Input
                    id="edit-birthdate"
                    type="date"
                    value={editFormData.NgaySinh}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        NgaySinh: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startdate">Ngày vào làm</Label>
                  <Input
                    id="edit-startdate"
                    type="date"
                    value={editFormData.NgayVaoLam}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        NgayVaoLam: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Vị trí</Label>
                  <select
                    id="edit-position"
                    value={editFormData.ViTri}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        ViTri: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <Label htmlFor="edit-salary">Lương cơ bản</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={editFormData.LuongCoBan}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        LuongCoBan: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-branch">Chi nhánh</Label>
                <select
                  id="edit-branch"
                  value={editFormData.TenChiNhanh}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TenChiNhanh: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <DialogFooter>
              <Button
                onClick={saveEdit}
                variant="outline"
                className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="gap-0">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-red-600 font-semibold">
                Xác nhận xóa nhân viên
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa nhân viên{" "}
                <strong>{selectedEmployee?.HoTen}</strong> khỏi hệ thống?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-3">
              <Button
                onClick={confirmDelete}
                variant="outline"
                className="bg-red-100 text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
