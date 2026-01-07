import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Calendar,
  Percent,
  BadgeCheck,
  Search,
} from "lucide-react";

import { Button } from "../../../../components/ui/button";
import AdminHeader from "../../components/AdminHeader";
import { promotionAPI } from "../../../../api/services";
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

export default function PromotionManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate("/admin/management");

  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const toISODate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : "");
  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "");

  const getStatusBadge = (start, end) => {
    const now = new Date();
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;

    if (!s || !e) return { label: "Chưa đủ ngày", cls: "text-gray-600" };
    if (now < s) return { label: "Sắp tới", cls: "text-amber-600" };
    if (now > e) return { label: "Hết hạn", cls: "text-red-600" };
    return { label: "Đang chạy", cls: "text-emerald-600" };
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...addFormData,
        TiLeGiamGia:
          addFormData.TiLeGiamGia === "" ? "" : Number(addFormData.TiLeGiamGia),
      };

      await promotionAPI.create(payload);
      await fetchData();

      setIsAddDialogOpen(false);
      setAddFormData({ NgayBatDau: "", NgayKetThuc: "", TiLeGiamGia: "" });
      alert("Thêm khuyến mãi thành công!");
    } catch (err) {
      console.error("Error adding promotion:", err);
      alert(err.response?.data?.message || "Không thể thêm khuyến mãi");
    }
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setEditFormData({
      NgayBatDau: toISODate(promotion.NgayBatDau),
      NgayKetThuc: toISODate(promotion.NgayKetThuc),
      TiLeGiamGia: promotion.TiLeGiamGia ?? "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      const payload = {
        ...editFormData,
        TiLeGiamGia:
          editFormData.TiLeGiamGia === ""
            ? ""
            : Number(editFormData.TiLeGiamGia),
      };

      await promotionAPI.update(selectedPromotion.MaKhuyenMai, payload);
      await fetchData();

      setIsEditDialogOpen(false);
      setSelectedPromotion(null);
      alert("Cập nhật khuyến mãi thành công!");
    } catch (err) {
      console.error("Error updating promotion:", err);
      alert(err.response?.data?.message || "Không thể cập nhật khuyến mãi");
    }
  };

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter((promotion) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchDiscount =
      promotion.TiLeGiamGia?.toString().includes(searchTerm);
    const status = getStatusBadge(promotion.NgayBatDau, promotion.NgayKetThuc);
    const matchStatus = status.label.toLowerCase().includes(searchLower);

    return matchDiscount || matchStatus;
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
                    Quản lý khuyến mãi
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý các chương trình khuyến mãi trên hệ thống
                  </p>
                </div>
              </div>

              {/* ADD DIALOG */}
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md">
                    <Plus className="h-4 w-4" />
                    Thêm khuyến mãi
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      Thêm khuyến mãi mới
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 mt-2">
                      Điền đầy đủ thông tin để tạo chương trình khuyến mãi mới.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="NgayBatDau">Ngày bắt đầu</Label>
                        <Input
                          id="NgayBatDau"
                          type="date"
                          value={addFormData.NgayBatDau}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              NgayBatDau: e.target.value,
                            })
                          }
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="NgayKetThuc">Ngày kết thúc</Label>
                        <Input
                          id="NgayKetThuc"
                          type="date"
                          value={addFormData.NgayKetThuc}
                          onChange={(e) =>
                            setAddFormData({
                              ...addFormData,
                              NgayKetThuc: e.target.value,
                            })
                          }
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="TiLeGiamGia">Tỉ lệ giảm giá (%)</Label>
                      <Input
                        id="TiLeGiamGia"
                        type="number"
                        placeholder="VD: 10"
                        value={addFormData.TiLeGiamGia}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            TiLeGiamGia: e.target.value,
                          })
                        }
                        className="h-10 text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      onClick={handleAdd}
                      className="h-10 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Thêm khuyến mãi
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
                placeholder="Tìm kiếm theo tỉ lệ giảm giá hoặc trạng thái..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Grid Layout - Promotion Cards (5 / row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredPromotions.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-xl">
                {searchTerm.trim()
                  ? "Không tìm thấy khuyến mãi nào phù hợp"
                  : "Không có khuyến mãi nào"}
              </div>
            ) : (
              filteredPromotions.map((promotion) => {
                const status = getStatusBadge(
                  promotion.NgayBatDau,
                  promotion.NgayKetThuc
                );

                return (
                  <Card
                    key={promotion.MaKhuyenMai}
                    className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                  >
                    {/* Edit Button - Top Right */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 h-9 w-9 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md rounded-lg transition-all"
                      onClick={() => handleEdit(promotion)}
                    >
                      <Edit2 className="h-5 w-5" />
                    </Button>

                    <CardContent className="pr-4 pl-4">
                      {/* Header */}
                      <div className="mb-6 pr-8">
                        <h3 className="text-lg font-bold text-sky-600 mb-2">
                          Giảm {Number(promotion.TiLeGiamGia || 0)}%
                        </h3>

                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {promotion.MaKhuyenMai}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>
                            {fmtDate(promotion.NgayBatDau)} →{" "}
                            {fmtDate(promotion.NgayKetThuc)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <BadgeCheck className={`h-4 w-4 ${status.cls}`} />
                          <span className={`${status.cls}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* EDIT DIALOG */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Chỉnh sửa khuyến mãi
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-2">
                  Cập nhật thông tin khuyến mãi{" "}
                  <strong className="text-blue-600">
                    {selectedPromotion?.MaKhuyenMai}
                  </strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-6">
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
                      className="h-10"
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
                      className="h-10"
                    />
                  </div>
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
                        TiLeGiamGia: e.target.value,
                      })
                    }
                    className="h-10"
                  />
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
