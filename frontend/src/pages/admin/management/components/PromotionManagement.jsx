import React, { useState, useEffect } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { promotionAPI } from "../../../../api/services";
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

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const [addFormData, setAddFormData] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    TiLeGiamGia: "",
  });

  const [editFormData, setEditFormData] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    TiLeGiamGia: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([promotionAPI.getAll()]);

      const promotionsRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;

      const promotionsData =
        promotionsRes?.data?.data ?? promotionsRes?.data ?? [];

      setPromotions(Array.isArray(promotionsData) ? promotionsData : []);
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
      await promotionAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        NgayBatDau: "",
        NgayKetThuc: "",
        TiLeGiamGia: "",
      });
      alert("Thêm khuyến mãi thành công!");
    } catch (err) {
      console.error("Error adding promotion:", err);
      alert(err.response?.data?.message || "Không thể thêm khuyến mãi");
    }
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setEditFormData({
      NgayBatDau: promotion.NgayBatDau?.split("T")[0] || "",
      NgayKetThuc: promotion.NgayKetThuc?.split("T")[0] || "",
      TiLeGiamGia: promotion.TiLeGiamGia || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await promotionAPI.update(selectedPromotion.MaKhuyenMai, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedPromotion(null);
      alert("Cập nhật khuyến mãi thành công!");
    } catch (err) {
      console.error("Error updating promotion:", err);
      alert(err.response?.data?.message || "Không thể cập nhật khuyến mãi");
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
            <CardTitle className="text-green-600 font-semibold text-xl">
              Danh sách khuyến mãi
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý các chương trình khuyến mãi trên hệ thống
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm khuyến mãi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-green-600 font-semibold">
                  Thêm khuyến mãi mới
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Tạo chương trình khuyến mãi mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="NgayBatDau">Ngày bắt đầu</Label>
                  <Input
                    id="NgayBatDau"
                    type="date"
                    placeholder="Nhập ngày bắt đầu"
                    value={addFormData.NgayBatDau}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        NgayBatDau: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="NgayKetThuc">Ngày kết thúc</Label>
                  <Input
                    id="NgayKetThuc"
                    type="date"
                    placeholder="Nhập ngày kết thúc"
                    value={addFormData.NgayKetThuc}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        NgayKetThuc: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="TiLeGiamGia">Tỉ lệ giảm giá (%)</Label>
                  <Input
                    id="TiLeGiamGia"
                    type="number"
                    placeholder="Nhập tỉ lệ giảm giá"
                    value={addFormData.TiLeGiamGia}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        TiLeGiamGia: e.target.value,
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
                  className="bg-green-100 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                >
                  Thêm khuyến mãi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {promotions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có khuyến mãi nào
            </div>
          ) : (
            promotions.map((promotion) => (
              <div
                key={promotion.MaKhuyenMai}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-green-600">
                    {promotion.MaKhuyenMai} - Giảm {promotion.TiLeGiamGia}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {promotion.NgayBatDau
                      ? new Date(promotion.NgayBatDau).toLocaleDateString(
                          "vi-VN"
                        )
                      : ""}{" "}
                    đến{" "}
                    {promotion.NgayKetThuc
                      ? new Date(promotion.NgayKetThuc).toLocaleDateString(
                          "vi-VN"
                        )
                      : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(promotion)}
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
              <DialogTitle className="text-green-600 font-semibold">
                Chỉnh sửa khuyến mãi
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin khuyến mãi{" "}
                <strong>{selectedPromotion?.MaKhuyenMai}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editFormData.NgayBatDau}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      NgayBatDau: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editFormData.NgayKetThuc}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      NgayKetThuc: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Tỉ lệ giảm giá (%)</Label>
                <Input
                  id="edit-discount"
                  type="number"
                  value={editFormData.TiLeGiamGia}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TiLeGiamGia: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={saveEdit}
                variant="outline"
                className="bg-green-100 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
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
