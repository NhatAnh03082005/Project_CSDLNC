import React, { useState, useEffect } from "react";
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
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Search,
  Pill,
  Loader2,
  AlertCircle,
  Box,
  DollarSign,
  Package,
  X,
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
      const response = await api.get("/branches/inventory/medicines");
      // nếu endpoint của bạn là /branches/inventory/medicines thì sửa lại đúng:
      // const response = await api.get("/branches/inventory/medicines");

      if (response.data.success) {
        setMedicines(response.data.data || []);
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
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (medicine.tenSanPham && medicine.tenSanPham.toLowerCase().includes(q)) ||
      (medicine.maSanPham && medicine.maSanPham.toLowerCase().includes(q))
    );
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
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600">
                Tra cứu thuốc
              </h1>
              <p className="text-gray-600 mt-1">
                Xem tồn kho thuốc tại chi nhánh
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Filter/Search Card */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
                        Danh sách thuốc ({branchName})
                      </CardTitle>
                      <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                        {filteredMedicines.length} sản phẩm thuốc
                      </CardDescription>
                    </div>
                    {/* Search input */}
                    <div className="relative w-full lg:w-[500px] group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <Input
                        value={searchTerm}
                        placeholder="Tìm theo tên hoặc mã sản phẩm..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 text-sm placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-gray-50/50 pb-5">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                  ) : filteredMedicines.length === 0 ? (
                    <div className="text-center py-12">
                      <Pill className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 text-lg">
                        Không tìm thấy thuốc
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Thử từ khóa khác hoặc kiểm tra lại mã sản phẩm
                      </p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMedicines.map((medicine) => {
                          const stockStatus = getStockStatus(medicine.soLuong);
                          return (
                            <Card
                              key={medicine.maSanPham}
                              className="border border-blue-200 rounded-2xl bg-white hover:shadow-lg transition-shadow cursor-pointer"
                            >
                              <CardContent>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                                      <Pill className="h-6 w-6 text-blue-700" />
                                    </div>

                                    <div className="min-w-0">
                                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                                        {medicine.tenSanPham}
                                      </h3>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Mã:{" "}
                                        <span className="font-medium text-gray-700">
                                          {medicine.maSanPham}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  <Badge
                                    className={`${stockStatus.color} border-none`}
                                  >
                                    {stockStatus.label}
                                  </Badge>
                                </div>

                                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/60 p-3 space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <Package className="h-3.5 w-3.5" />
                                      Loại
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                      {medicine.loaiSanPham || "Thuốc"}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <DollarSign className="h-3.5 w-3.5" />
                                      Giá bán
                                    </span>
                                    <span className="text-gray-900 font-semibold">
                                      {medicine.giaBan?.toLocaleString("vi-VN")}{" "}
                                      đ
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 flex items-center gap-1">
                                      <Box className="h-3.5 w-3.5" />
                                      Tồn kho
                                    </span>
                                    <span
                                      className={`font-bold ${
                                        medicine.soLuong === 0
                                          ? "text-red-600"
                                          : medicine.soLuong < 10
                                          ? "text-yellow-700"
                                          : "text-emerald-700"
                                      }`}
                                    >
                                      {medicine.soLuong}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
