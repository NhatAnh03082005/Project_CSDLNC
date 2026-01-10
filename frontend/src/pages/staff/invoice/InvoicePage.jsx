import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  Search,
  Receipt,
  Plus,
  Printer,
  ShoppingBag,
  Loader2,
  ShoppingCart,
  Stethoscope,
  Syringe,
  AlertCircle,
  X,
  FileText,
  User,
  Phone,
} from "lucide-react";
import { invoiceAPI, productAPI, employeeAPI } from "../../../api/services";
import { useAuthStore } from "../../../store/authStore";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";
import { toast } from "../../../lib/toast";

export default function InvoicePage() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Selected Invoice State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  // Add Product State
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProductToAdd, setSelectedProductToAdd] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [addingProduct, setAddingProduct] = useState(false);

  // Confirm State
  const [confirming, setConfirming] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchPendingInvoices();
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

  const fetchPendingInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceAPI.getPending();
      const data = response.data;
      if (data.success) setInvoices(data.data || []);
      else setError(data.message || "Lỗi khi lấy danh sách hóa đơn");
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const response = await invoiceAPI.getById(id);
      const data = response.data;
      if (data.success) setInvoiceDetails(data.data);
      else toast.error(data.message || "Không thể lấy chi tiết hóa đơn");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy chi tiết hóa đơn");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    fetchInvoiceDetails(invoice.maHoaDon);
    setShowInvoiceDialog(true);
  };

  const fetchProducts = async () => {
    if (!user?.MaChiNhanh) return;
    try {
      setLoadingProducts(true);
      const response = await productAPI.getByBranch(user.MaChiNhanh);
      const data = response.data;
      if (data.success) setAvailableProducts(data.data?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleOpenAddProduct = () => {
    fetchProducts();
    setShowAddProductDialog(true);
    setQuantityToAdd(1);
    setSelectedProductToAdd(null);
    setProductSearchTerm("");
  };

  const handleAddProduct = async () => {
    if (!selectedProductToAdd || !quantityToAdd || quantityToAdd < 1) return;

    const stockAvailable = selectedProductToAdd.soLuongTonKho || 0;
    if (parseInt(quantityToAdd) > stockAvailable) {
      toast.warning(
        `Số lượng tồn kho không đủ! Chỉ còn ${stockAvailable} sản phẩm trong kho.`
      );
      return;
    }

    try {
      setAddingProduct(true);
      const productsToAdd = [
        {
          MaSanPham: selectedProductToAdd.maSanPham,
          SoLuong: parseInt(quantityToAdd),
        },
      ];

      const response = await invoiceAPI.addProducts(
        selectedInvoice.maHoaDon,
        productsToAdd
      );
      const res = response.data;

      if (res.success) {
        await fetchInvoiceDetails(selectedInvoice.maHoaDon);
        setShowAddProductDialog(false);
        fetchPendingInvoices();
        toast.success("Thêm sản phẩm vào hóa đơn thành công!");
      } else {
        toast.error(res.message || "Lỗi khi thêm sản phẩm");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm sản phẩm: " + (err.message || "Lỗi hệ thống"));
    } finally {
      setAddingProduct(false);
    }
  };

  const handleConfirmInvoice = async () => setShowConfirmDialog(true);

  const handleConfirmInvoiceAction = async () => {
    const isOnlineOrder = checkIsOnlineOrder();
    try {
      setConfirming(true);
      const paymentMethod = "Chuyển khoản";
      const response = await invoiceAPI.confirm(selectedInvoice.maHoaDon, {
        hinhThucThanhToan: paymentMethod,
      });
      const res = response.data;

      if (res.success) {
        toast.success(
          isOnlineOrder
            ? "Xác nhận đơn hàng thành công!"
            : "Xuất hóa đơn thành công!"
        );
        setShowConfirmDialog(false);
        setShowInvoiceDialog(false);
        setSelectedInvoice(null);
        setInvoiceDetails(null);
        fetchPendingInvoices();
      } else {
        toast.error(res.message || "Lỗi khi xác nhận");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Lỗi hệ thống";
      toast.error(errorMessage);
    } finally {
      setConfirming(false);
    }
  };

  const checkIsOnlineOrder = () => {
    if (!invoiceDetails?.chiTiet || invoiceDetails.chiTiet.length === 0)
      return false;
    return invoiceDetails.chiTiet.every(
      (item) => item.LoaiDichVu === "Mua hàng"
    );
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.tenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.sdt?.includes(searchTerm) ||
      inv.maHoaDon?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = availableProducts.filter(
    (p) =>
      p.tenSanPham?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.maSanPham?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const getServiceIcon = (loaiDichVu) => {
    if (loaiDichVu === "Mua hàng")
      return <ShoppingCart className="h-4 w-4 text-orange-600" />;
    if (loaiDichVu?.includes("Tiêm"))
      return <Syringe className="h-4 w-4 text-green-600" />;
    return <Stethoscope className="h-4 w-4 text-blue-600" />;
  };

  const getServiceBadge = (loaiDichVu) => {
    if (loaiDichVu === "Mua hàng")
      return (
        <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
          Mua hàng
        </Badge>
      );
    if (loaiDichVu?.includes("Tiêm"))
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-200">
          Tiêm phòng
        </Badge>
      );
    return (
      <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
        Khám bệnh
      </Badge>
    );
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Title */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
                <Receipt className="h-8 w-8 text-blue-600" />
                Lập hóa đơn
              </h1>
              <p className="text-gray-600 mt-1">
                Xác nhận hóa đơn trong ngày tại chi nhánh
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Main Card */}
            <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
              <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                      <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
                      Danh sách hóa đơn chờ xác nhận
                    </CardTitle>
                    <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                      {filteredInvoices.length} hóa đơn
                    </CardDescription>
                  </div>

                  {/* Search */}
                  <div className="relative w-full lg:w-[420px] group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <Input
                      placeholder="Tìm theo khách hàng / SĐT / mã hóa đơn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 text-sm placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 bg-gray-50/50">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-gray-600">
                      Đang tải danh sách hóa đơn...
                    </p>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold">
                      Không có hóa đơn cần xác nhận
                    </p>
                    <p className="text-sm mt-1">
                      Hãy thử từ khóa khác hoặc xóa tìm kiếm
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4 max-h-[520px] overflow-y-auto">
                    {filteredInvoices.map((inv) => (
                      <div
                        key={inv.maHoaDon}
                        onClick={() => handleSelectInvoice(inv)}
                        className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Left */}
                          <div className="md:col-span-7 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-blue-700" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 truncate">
                                {inv.tenKhachHang}
                              </p>
                              <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1">
                                  <FileText className="h-3 w-3" />{" "}
                                  {inv.maHoaDon}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <Phone className="h-3 w-3" />{" "}
                                  {inv.sdt || "N/A"}
                                </span>
                                <span>•</span>
                                <span>{inv.ngayLap}</span>
                              </div>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="md:col-span-3 md:text-right">
                            <p className="text-lg font-black text-blue-700">
                              {inv.tongTien?.toLocaleString("vi-VN")} ₫
                            </p>
                          </div>

                          {/* Status */}
                          <div className="md:col-span-2 flex md:justify-end">
                            <Badge className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold">
                              {inv.trangThai}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoice Detail Dialog */}
            <Dialog
              open={showInvoiceDialog}
              onOpenChange={setShowInvoiceDialog}
            >
              <DialogContent className="max-w-3xl w-full max-h-[90vh] rounded-3xl bg-white shadow-2xl border-0 p-0 overflow-hidden flex flex-col [&>button]:hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-4 text-white relative overflow-hidden flex-shrink-0">
                  <div className="absolute right-3 top-3 opacity-[0.07]">
                    <Receipt className="h-20 w-20 transform rotate-12" />
                  </div>

                  <button
                    onClick={() => setShowInvoiceDialog(false)}
                    className="absolute right-3 top-3 h-9 w-9 rounded-full flex items-center justify-center text-white/90 hover:bg-white/15 hover:text-white transition z-20"
                    disabled={confirming}
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <DialogTitle className="text-lg font-bold flex items-center gap-2 relative z-10">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    Chi tiết hóa đơn {selectedInvoice?.maHoaDon}
                  </DialogTitle>

                  <DialogDescription className="text-blue-100 mt-1 relative z-10 font-medium opacity-90 text-sm">
                    {checkIsOnlineOrder()
                      ? "Đơn hàng online - Khách hàng đặt qua website"
                      : "Kiểm tra thông tin và xác nhận hóa đơn"}
                  </DialogDescription>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4">
                  {loadingDetails ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      <p className="text-gray-600">
                        Đang tải chi tiết hóa đơn...
                      </p>
                    </div>
                  ) : invoiceDetails ? (
                    <>
                      {/* Quick info card */}
                      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                              Khách hàng
                            </p>
                            <p className="font-bold text-gray-900 mt-1">
                              {invoiceDetails.tenKhachHang}
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              SĐT:{" "}
                              <span className="font-semibold">
                                {invoiceDetails.sdt}
                              </span>
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-2 bg-white border-blue-200 text-blue-700 font-bold"
                            >
                              {invoiceDetails.capHoiVien || "Cơ bản"}
                            </Badge>
                          </div>

                          <div className="md:text-right">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                              Chi nhánh
                            </p>
                            <p className="font-bold text-gray-900 mt-1">
                              {invoiceDetails.chiNhanh?.tenChiNhanh}
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              Ngày lập:{" "}
                              <span className="font-semibold">
                                {invoiceDetails.ngayLap}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items header */}
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-black text-gray-900">
                          Chi tiết dịch vụ & sản phẩm
                        </h3>

                        {!checkIsOnlineOrder() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleOpenAddProduct}
                            className="rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" /> Thêm sản phẩm
                          </Button>
                        )}
                      </div>

                      {/* Items table */}
                      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr className="text-gray-600">
                              <th className="py-3 px-4 text-left font-bold">
                                STT
                              </th>
                              <th className="py-3 px-4 text-left font-bold">
                                Mô tả
                              </th>
                              <th className="py-3 px-4 text-left font-bold">
                                Loại
                              </th>
                              <th className="py-3 px-4 text-right font-bold">
                                SL
                              </th>
                              <th className="py-3 px-4 text-right font-bold">
                                Thành tiền
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {invoiceDetails.chiTiet?.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-500">
                                  {idx + 1}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {getServiceIcon(item.LoaiDichVu)}
                                    <span className="font-semibold text-gray-900">
                                      {item.LoaiChiTiet === "MuaHang"
                                        ? item.ChiTiet?.tenSanPham
                                        : item.LoaiChiTiet === "KhamBenh"
                                        ? `Khám bệnh${
                                            item.ChiTiet?.tenBacSi
                                              ? ` - BS. ${item.ChiTiet.tenBacSi}`
                                              : ""
                                          }`
                                        : item.ChiTiet?.tenVacXin
                                        ? `Tiêm: ${item.ChiTiet.tenVacXin}`
                                        : item.LoaiDichVu}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {getServiceBadge(item.LoaiDichVu)}
                                </td>
                                <td className="py-3 px-4 text-right font-semibold">
                                  {item.LoaiChiTiet === "MuaHang"
                                    ? item.ChiTiet?.soLuong
                                    : 1}
                                </td>
                                <td className="py-3 px-4 text-right font-black text-gray-900">
                                  {item.ThanhTien?.toLocaleString("vi-VN")} ₫
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Total */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-black text-gray-800">
                            Tổng cộng:
                          </span>
                          <span className="text-2xl font-black text-blue-700">
                            {invoiceDetails.tongTien?.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        {invoiceDetails.maKhuyenMai && (
                          <div className="text-sm text-emerald-700 mt-1 font-semibold">
                            Áp dụng khuyến mãi: {invoiceDetails.maKhuyenMai}
                          </div>
                        )}
                      </div>

                      {/* Warning if incomplete */}
                      {invoiceDetails.totalServices > 0 &&
                        invoiceDetails.completedServices <
                          invoiceDetails.totalServices && (
                          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-black text-amber-800">
                                  Chưa thể xuất hóa đơn
                                </p>
                                <p className="text-xs text-amber-700 mt-1">
                                  Còn{" "}
                                  {invoiceDetails.totalServices -
                                    invoiceDetails.completedServices}{" "}
                                  dịch vụ chưa hoàn thành (
                                  {invoiceDetails.completedServices}/
                                  {invoiceDetails.totalServices}). Vui lòng cập
                                  nhật đầy đủ trước khi xuất.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          onClick={() => setShowInvoiceDialog(false)}
                          disabled={confirming}
                          className="h-11 rounded-xl"
                        >
                          Hủy
                        </Button>

                        <Button
                          onClick={handleConfirmInvoice}
                          disabled={
                            confirming ||
                            (invoiceDetails.totalServices > 0 &&
                              !invoiceDetails.canConfirm)
                          }
                          className={`px-6 h-11 text-white font-black rounded-xl shadow-md gap-2 transition-all active:scale-95 ${
                            checkIsOnlineOrder()
                              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                              : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                          }`}
                        >
                          {confirming ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : checkIsOnlineOrder() ? (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              Xác nhận đặt hàng
                            </>
                          ) : (
                            <>
                              <Printer className="h-4 w-4" />
                              Xuất hóa đơn
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Product Dialog - Simplified */}
            <Dialog
              open={showAddProductDialog}
              onOpenChange={setShowAddProductDialog}
            >
              <DialogContent className="max-w-3xl w-full max-h-[90vh] rounded-3xl bg-white shadow-2xl border-0 p-0 overflow-hidden flex flex-col [&>button]:hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white relative overflow-hidden flex-shrink-0">
                  <div className="absolute right-3 top-3 opacity-[0.08] pointer-events-none">
                    <ShoppingCart className="h-20 w-20 rotate-12" />
                  </div>

                  <button
                    onClick={() => setShowAddProductDialog(false)}
                    className="absolute right-3 top-3 h-9 w-9 rounded-full flex items-center justify-center text-white/90 hover:bg-white/15 hover:text-white transition z-20"
                    disabled={addingProduct}
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <DialogTitle className="text-lg font-bold flex items-center gap-2 relative z-10">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                      <Plus className="h-4 w-4 text-white" />
                    </div>
                    Thêm sản phẩm vào hóa đơn
                  </DialogTitle>

                  <DialogDescription className="text-white/90 mt-1 relative z-10 font-medium text-sm">
                    Chọn sản phẩm từ kho và nhập số lượng
                  </DialogDescription>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5 space-y-4">
                  {/* Search */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-500 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <Input
                      placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="pl-10 h-11 rounded-2xl border-gray-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Product list */}
                  <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">
                        Danh sách sản phẩm
                      </p>
                      <Badge variant="outline" className="bg-white">
                        {filteredProducts?.length || 0} sản phẩm
                      </Badge>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto p-3 space-y-2">
                      {loadingProducts ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                          <p className="text-sm text-gray-600">
                            Đang tải sản phẩm...
                          </p>
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 py-12">
                          <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                          <p>Không tìm thấy sản phẩm</p>
                        </div>
                      ) : (
                        filteredProducts.map((p) => {
                          const active =
                            selectedProductToAdd?.maSanPham === p.maSanPham;

                          return (
                            <div
                              key={p.maSanPham}
                              onClick={() => {
                                setSelectedProductToAdd(p);
                                setQuantityToAdd(1);
                              }}
                              className={`rounded-xl p-3 border cursor-pointer transition-all ${
                                active
                                  ? "bg-emerald-50 border-emerald-300 shadow-sm"
                                  : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div
                                    className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      active
                                        ? "bg-white border border-emerald-200"
                                        : "bg-slate-50"
                                    }`}
                                  >
                                    <ShoppingBag className="h-5 w-5 text-emerald-600" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-gray-900 truncate">
                                      {p.tenSanPham}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      <span className="font-semibold">
                                        {p.maSanPham}
                                      </span>{" "}
                                      • Kho: <b>{p.soLuongTonKho || 0}</b>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <div className="text-base font-black text-emerald-700">
                                    {p.donGia?.toLocaleString("vi-VN")} ₫
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Selected product info + Quantity */}
                  {selectedProductToAdd && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                            Sản phẩm đã chọn
                          </p>
                          <p className="font-bold text-gray-900">
                            {selectedProductToAdd.tenSanPham}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Đơn giá:{" "}
                            <span className="font-bold text-emerald-700">
                              {selectedProductToAdd.donGia?.toLocaleString(
                                "vi-VN"
                              )}{" "}
                              ₫
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">Tồn kho</p>
                          <p className="text-2xl font-black text-gray-900">
                            {selectedProductToAdd.soLuongTonKho || 0}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-emerald-200">
                        <Label className="text-xs font-bold text-gray-700 uppercase mb-2 block">
                          Số lượng
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max={selectedProductToAdd.soLuongTonKho || 1}
                          value={quantityToAdd}
                          onChange={(e) => setQuantityToAdd(e.target.value)}
                          className="h-12 rounded-xl border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-200 text-center text-lg font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddProductDialog(false)}
                      disabled={addingProduct}
                      className="h-11 rounded-xl"
                    >
                      Hủy
                    </Button>

                    <Button
                      onClick={handleAddProduct}
                      disabled={!selectedProductToAdd || addingProduct}
                      className="px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md shadow-emerald-100 gap-2 transition-all active:scale-95"
                    >
                      {addingProduct ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang thêm...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Thêm vào hóa đơn
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Confirm dialog */}
            <AlertDialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                  <AlertDialogDescription>
                    {checkIsOnlineOrder()
                      ? "Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                      : "Bạn có chắc chắn muốn xuất hóa đơn này?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={confirming}>
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmInvoiceAction}
                    disabled={confirming}
                    className={
                      checkIsOnlineOrder()
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  >
                    {confirming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    </div>
  );
}
