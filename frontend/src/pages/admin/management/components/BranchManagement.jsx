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
// Import time format utilities
import { formatTimeFromSQL, inputHHMMToServerTime } from "../utils/timeFormat";
// Import Icons
import { Plus, Edit } from "lucide-react";

export default function BranchManagement() {
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
      alert("Thêm chi nhánh thành công!");
    } catch (err) {
      console.error("Error adding branch:", err);
      alert(err.response?.data?.message || "Không thể thêm chi nhánh");
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
      alert("Cập nhật chi nhánh thành công!");
    } catch (err) {
      console.error("Error updating branch:", err);
      alert(err.response?.data?.message || "Không thể cập nhật chi nhánh");
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
            <CardTitle className="text-indigo-600 font-semibold text-xl">
              Danh sách chi nhánh
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả chi nhánh trên hệ thống
            </CardDescription>
          </div>

          {/* ADD DIALOG */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-indigo-100 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm chi nhánh
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-indigo-600 font-semibold">
                  Thêm chi nhánh mới
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Thêm chi nhánh mới vào hệ thống
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
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
                    className="text-black placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      className="text-black placeholder:text-gray-600"
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
                      className="text-black placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Phuong">Xã/Phường</Label>
                    <Input
                      id="Phuong"
                      placeholder="Nhập phường"
                      value={addFormData.Phuong}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          Phuong: e.target.value,
                        })
                      }
                      className="text-black placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ThanhPho">Tỉnh/Thành phố</Label>
                    <Input
                      id="ThanhPho"
                      placeholder="Nhập thành phố"
                      value={addFormData.ThanhPho}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          ThanhPho: e.target.value,
                        })
                      }
                      className="text-black placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="SDT">SĐT</Label>
                  <Input
                    id="SDT"
                    placeholder="Nhập số điện thoại"
                    value={addFormData.SDT}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, SDT: e.target.value })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      className="text-black placeholder:text-gray-600"
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
                      className="text-black placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="bg-indigo-100 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  Thêm chi nhánh
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      {/* LIST */}
      <CardContent>
        <div className="space-y-3">
          {branches.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có chi nhánh nào
            </div>
          ) : (
            branches.map((branch) => (
              <div
                key={branch.MaChiNhanh}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-indigo-600">
                    {branch.MaChiNhanh} - {branch.TenChiNhanh}
                  </div>
                  <div className="text-sm text-gray-500">
                    {branch.SoNha} {branch.TenDuong}, {branch.Phuong},{" "}
                    {branch.ThanhPho} • SĐT: {branch.SDT}
                  </div>
                  <div className="text-sm text-gray-500">
                    Giờ mở cửa: {formatTimeFromSQL(branch.TGMoCua)} - Giờ đóng
                    cửa: {formatTimeFromSQL(branch.TGDongCua)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Quản lý:{" "}
                    {branch.QuanLy === null ? (
                      "Chi nhánh chưa có quản lý"
                    ) : (
                      <>
                        {branch.QuanLy} -{" "}
                        {employees.find(
                          (emp) => emp.MaNhanVien === branch.QuanLy
                        )?.HoTen || "Không tìm thấy thông tin"}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(branch)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EDIT DIALOG */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-600 font-semibold">
                Chỉnh sửa chi nhánh
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin chi nhánh{" "}
                <strong>{selectedBranch?.MaChiNhanh}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-STD">SĐT</Label>
                <Input
                  id="edit-SDT"
                  value={editFormData.SDT}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, SDT: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-QuanLy">Quản lý</Label>
                <select
                  id="edit-QuanLy"
                  value={editFormData.QuanLy}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, QuanLy: e.target.value })
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
      </CardContent>
    </Card>
  );
}
