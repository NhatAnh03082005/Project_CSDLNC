import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
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
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      code: "SUMMER2024",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      discount: 15,
    },
    {
      id: 2,
      code: "NEWCUSTOMER",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      discount: 20,
    },
    {
      id: 3,
      code: "VACCINE50",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      discount: 10,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [editFormData, setEditFormData] = useState({
    code: "",
    startDate: "",
    endDate: "",
    discount: 0,
  });

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setEditFormData({
      code: promotion.code,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      discount: promotion.discount,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setPromotions(
      promotions.filter((promo) => promo.id !== selectedPromotion.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedPromotion(null);
  };

  const saveEdit = () => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === selectedPromotion.id
          ? { ...promo, ...editFormData }
          : promo
      )
    );
    setIsEditDialogOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách khuyến mãi</CardTitle>
            <CardDescription>
              Quản lý các chương trình khuyến mãi trên hệ thống
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Plus className="h-4 w-4" />
                Thêm khuyến mãi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khuyến mãi mới</DialogTitle>
                <DialogDescription>
                  Tạo chương trình khuyến mãi mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã khuyến mãi</Label>
                  <Input id="code" placeholder="SUMMER2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input id="endDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Tỉ lệ giảm giá (%)</Label>
                  <Input id="discount" type="number" placeholder="15" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-blue-100 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
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
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="font-semibold text-lg">{promotion.code}</div>
                <div className="text-sm text-gray-500">
                  {promotion.startDate} đến {promotion.endDate}
                </div>
                <div className="text-sm font-medium text-green-600">
                  Giảm {promotion.discount}%
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
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  onClick={() => handleDelete(promotion)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin khuyến mãi {selectedPromotion?.code}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã khuyến mãi</Label>
                <Input
                  id="edit-code"
                  value={editFormData.code}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editFormData.startDate}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editFormData.endDate}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Tỉ lệ giảm giá (%)</Label>
                <Input
                  id="edit-discount"
                  type="number"
                  value={editFormData.discount}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      discount: parseInt(e.target.value),
                    })
                  }
                />
              </div>
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="gap-0">
            <DialogHeader className="pb-4">
              <DialogTitle>Xác nhận xóa khuyến mãi</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa khuyến mãi{" "}
                <strong>{selectedPromotion?.code}</strong> khỏi hệ thống?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
              <Button
                onClick={confirmDelete}
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
