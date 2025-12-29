// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { vaccinationAPI } from "../../../../api/services";
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
import { Plus, Edit } from "lucide-react";

export default function VaccineManagement() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const [addFormData, setAddFormData] = useState({
    TenVacXin: "",
    GiaTien: "",
  });

  const [editFormData, setEditFormData] = useState({
    TenVacXin: "",
    GiaTien: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([vaccinationAPI.getAll()]);

      const vaccinesRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;

      const vaccinesData = vaccinesRes?.data?.data ?? vaccinesRes?.data ?? [];

      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
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
      await vaccinationAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        TenVacXin: "",
        GiaTien: "",
      });
      alert("Thêm vắc-xin thành công!");
    } catch (err) {
      console.error("Error adding vaccine:", err);
      alert(err.response?.data?.message || "Không thể thêm vắc-xin");
    }
  };

  const handleEdit = (vaccine) => {
    setSelectedVaccine(vaccine);
    setEditFormData({
      TenVacXin: vaccine.TenVacXin || "",
      GiaTien: vaccine.GiaTien || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await vaccinationAPI.update(selectedVaccine.MaVacXin, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedVaccine(null);
      alert("Cập nhật vắc-xin thành công!");
    } catch (err) {
      console.error("Error updating vaccine:", err);
      alert(err.response?.data?.message || "Không thể cập nhật vắc-xin");
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
            <CardTitle className="text-pink-600 font-semibold text-xl">
              Danh sách vắc-xin
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả vắc-xin trong hệ thống
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-pink-100 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm vắc-xin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-pink-600 font-semibold">
                  Thêm vắc-xin mới
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Thêm vắc-xin mới vào danh mục
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="TenVacXin">Tên vắc-xin</Label>
                  <Input
                    id="TenVacXin"
                    placeholder="Nhập tên vắc-xin"
                    value={addFormData.TenVacXin}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        TenVacXin: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="GiaTien">Giá tiền (VNĐ)</Label>
                  <Input
                    id="GiaTien"
                    type="number"
                    placeholder="Nhập giá tiền"
                    value={addFormData.GiaTien}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        GiaTien: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="bg-pink-100 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                >
                  Thêm vắc-xin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vaccines.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có vắc-xin nào
            </div>
          ) : (
            vaccines.map((vaccine) => (
              <div
                key={vaccine.MaVacXin}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-pink-600">
                    {vaccine.MaVacXin} - {vaccine.TenVacXin}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vaccine.GiaTien} VNĐ
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(vaccine)}
                  >
                    <Edit className="h-4 w-4" />
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
              <DialogTitle className="text-pink-600 font-semibold">
                Chỉnh sửa vắc-xin
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin vắc-xin{" "}
                <strong>{selectedVaccine?.MaVacXin}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-TenVacXin">Tên vắc-xin</Label>
                <Input
                  id="edit-TenVacXin"
                  value={editFormData.TenVacXin}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TenVacXin: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-GiaTien">Giá tiền (VNĐ)</Label>
              <Input
                id="edit-GiaTien"
                type="number"
                value={editFormData.GiaTien}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    GiaTien: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button
                onClick={saveEdit}
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
