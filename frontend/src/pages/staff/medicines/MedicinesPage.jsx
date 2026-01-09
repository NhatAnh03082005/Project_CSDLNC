import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { employeeAPI } from "../../../api/services";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Pill,
  Loader2,
  AlertCircle,
  Box,
  DollarSign,
  Package,
} from "lucide-react";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch medicines on mount
  useEffect(() => {
    fetchMedicines();
    fetchBranch();
  }, []);

  const fetchBranch = async () => {
    try {
      const response = await employeeAPI.getBranch();
      const data = response.data;
      if (data.success) setBranchName(data.data?.tenChiNhanh || "");
    } catch (err) {
      console.error("Error fetching branch:", err);
    }
  };

  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get medicines from branch inventory (products with type = 'Thuốc')
      const response = await api.get("/branches/inventory/medicines");
      if (response.data.success) {
        const medicinesList = response.data.data || [];
        setMedicines(medicinesList);
      } else {
        setError(response.data.message || "Không thể lấy danh sách thuốc");
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setError(err.response?.data?.message || "Lỗi khi lấy danh sách thuốc");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetail(true);
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchSearch =
      (medicine.tenSanPham &&
        medicine.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (medicine.maSanPham &&
        medicine.maSanPham.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchSearch;
  });

  const getStockStatus = (soLuong) => {
    if (soLuong === 0)
      return { label: "Hết hàng", color: "bg-red-100 text-red-800" };
    if (soLuong < 10)
      return { label: "Sắp hết", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Còn hàng", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans selection:bg-blue-100">
      <StaffHeader
        branchName={branchName}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />

      <div className="flex max-w-[1920px] mx-auto">
        <StaffSidebar />

        <main className="flex-1 p-8 min-w-0 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Tra cứu thuốc
              </h1>
              <p className="text-gray-600 mt-1">
                Xem tồn kho thuốc tại chi nhánh
              </p>
            </div>

            {/* Filter Bar */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Bộ lọc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tìm kiếm
                    </label>
                    <Input
                      placeholder="Tìm theo tên thuốc, mã..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                      icon={<Search className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error State */}
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6 flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading ? (
              <Card>
                <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </CardContent>
              </Card>
            ) : filteredMedicines.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Pill className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-lg">
                    Không tìm thấy thuốc nào
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMedicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine.soLuong);
                  return (
                    <Card
                      key={medicine.maSanPham}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewDetail(medicine)}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {medicine.tenSanPham}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Mã: {medicine.maSanPham}
                              </p>
                            </div>
                            <Badge className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </div>

                          <div className="space-y-2 border-t pt-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Loại</span>
                              <span className="text-gray-900 font-medium">
                                {medicine.loaiSanPham}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                Giá bán
                              </span>
                              <span className="text-gray-900 font-medium">
                                {medicine.giaBan?.toLocaleString("vi-VN")} đ
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <Box className="h-3 w-3" />
                                Tồn kho
                              </span>
                              <span
                                className={`font-medium ${
                                  medicine.soLuong === 0
                                    ? "text-red-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {medicine.soLuong}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Detail Dialog */}
            <Dialog open={showDetail} onOpenChange={setShowDetail}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Chi tiết thuốc</DialogTitle>
                </DialogHeader>
                {selectedMedicine && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên thuốc
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedMedicine.tenSanPham}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã
                        </label>
                        <p className="text-gray-900">
                          {selectedMedicine.maSanPham}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại
                        </label>
                        <p className="text-gray-900">
                          {selectedMedicine.loaiSanPham}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giá bán
                        </label>
                        <p className="text-gray-900 font-medium">
                          {selectedMedicine.giaBan?.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tồn kho
                        </label>
                        <Badge
                          className={
                            getStockStatus(selectedMedicine.soLuong).color
                          }
                        >
                          {selectedMedicine.soLuong}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
