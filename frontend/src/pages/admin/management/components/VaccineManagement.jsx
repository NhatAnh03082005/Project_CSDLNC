import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Syringe, Wallet, Search } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import AdminHeader from "../../components/AdminHeader";
import { vaccinationAPI } from "../../../../api/services";
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

export default function VaccineManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin/management");

  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      const payload = {
        ...addFormData,
        GiaTien: addFormData.GiaTien === "" ? "" : Number(addFormData.GiaTien),
      };

      await vaccinationAPI.create(payload);
      await fetchData();

      setIsAddDialogOpen(false);
      setAddFormData({ TenVacXin: "", GiaTien: "" });

      toast.success("Thêm vắc-xin thành công!");
    } catch (err) {
      console.error("Error adding vaccine:", err);
      toast.error(err.response?.data?.message || "Không thể thêm vắc-xin");
    }
  };

  const handleEdit = (vaccine) => {
    setSelectedVaccine(vaccine);
    setEditFormData({
      TenVacXin: vaccine.TenVacXin || "",
      GiaTien: vaccine.GiaTien ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      const payload = {
        ...editFormData,
        GiaTien:
          editFormData.GiaTien === "" ? "" : Number(editFormData.GiaTien),
      };

      await vaccinationAPI.update(selectedVaccine.MaVacXin, payload);
      await fetchData();

      setIsEditDialogOpen(false);
      setSelectedVaccine(null);

      toast.success("Cập nhật vắc-xin thành công!");
    } catch (err) {
      console.error("Error updating vaccine:", err);
      toast.error(err.response?.data?.message || "Không thể cập nhật vắc-xin");
    }
  };

  // Filter vaccines based on search term
  const filteredVaccines = vaccines.filter((vaccine) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchName = vaccine.TenVacXin?.toLowerCase().includes(searchLower);
    const matchPrice = vaccine.GiaTien?.toString().includes(searchTerm);

    return matchName || matchPrice;
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
          {/* Page Header */}
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
                    Quản lý vắc-xin
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý tất cả vắc-xin trong hệ thống
                  </p>
                </div>
              </div>

              {/* ADD DIALOG */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                    <Plus className="h-4 w-4" />
                    Thêm vắc-xin
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      Thêm vắc-xin mới
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                      Điền đầy đủ thông tin để tạo một vắc-xin mới vào hệ thống.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
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
                          className="h-10 text-black placeholder:text-gray-600"
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
                          className="h-10 text-black placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      onClick={handleAdd}
                      className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Thêm vắc-xin
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
                placeholder="Tìm kiếm theo tên hoặc giá tiền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Grid Layout - Vaccine Cards (5 / row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredVaccines.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                {searchTerm.trim()
                  ? "Không tìm thấy vắc-xin nào phù hợp"
                  : "Không có vắc-xin nào"}
              </div>
            ) : (
              filteredVaccines.map((vaccine) => (
                <Card
                  key={vaccine.MaVacXin}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  {/* Edit Button - Top Right */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                    onClick={() => handleEdit(vaccine)}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>

                  <CardContent className="pr-4 pl-4">
                    {/* Header */}
                    <div className="mb-6 pr-8">
                      <h3 className="text-lg font-bold text-sky-600 mb-2 line-clamp-2">
                        {vaccine.TenVacXin}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {vaccine.MaVacXin}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>Vắc-xin</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>
                          {Number(vaccine.GiaTien || 0).toLocaleString()} VNĐ
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
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Chỉnh sửa vắc-xin
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Cập nhật thông tin cho vắc-xin{" "}
                  <strong className="text-blue-600">
                    {selectedVaccine?.MaVacXin}
                  </strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-6">
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
                      className="h-10"
                    />
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
                      className="h-10"
                    />
                  </div>
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
