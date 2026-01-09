import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  DialogTrigger,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Receipt,
  Plus,
  Trash2,
  FileText,
  Printer,
  PackageCheck,
  Loader2,
  ShoppingCart,
  Stethoscope,
  Syringe,
  AlertCircle,
} from "lucide-react";
import { invoiceAPI, productAPI, employeeAPI } from "../../../api/services";
import { useAuthStore } from "../../../store/authStore";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";

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
  // paymentMethod state removed

  // Fetch pending invoices on mount
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
      if (data.success) {
        setInvoices(data.data || []);
      } else {
        setError(data.message || "Lỗi khi lấy danh sách hóa đơn");
      }
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
      if (data.success) {
        setInvoiceDetails(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lấy chi tiết hóa đơn");
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
      if (data.success) {
        setAvailableProducts(data.data?.products || []);
      }
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

    // Kiểm tra số lượng tồn kho
    const stockAvailable = selectedProductToAdd.soLuongTonKho || 0;
    if (parseInt(quantityToAdd) > stockAvailable) {
      alert(
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
      } else {
        alert(res.message || "Lỗi khi thêm sản phẩm");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm sản phẩm: " + err.message);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleConfirmInvoice = async () => {
    const isOnlineOrder = checkIsOnlineOrder();
    const confirmMsg = isOnlineOrder
      ? "Bạn có chắc chắn muốn xác nhận đơn hàng này?"
      : "Bạn có chắc chắn muốn xuất hóa đơn này?";

    if (!confirm(confirmMsg)) return;

    try {
      setConfirming(true);
      // Defaulting to "Chuyển khoản" since user mentioned payment is done by customer (likely online/transfer)
      // or "Tiền mặt" if offline. But since UI is removed, we pick a safe default.
      // Backend defaults to "Tiền mặt" if void. Let's pass "Chuyển khoản" if it's online, else "Tiền mặt" or just "Chuyển khoản" for all?
      // User said "already done".
      // I'll use "Chuyển khoản" as it implies external handling effectively.
      const paymentMethod = "Chuyển khoản";
      const response = await invoiceAPI.confirm(selectedInvoice.maHoaDon, {
        hinhThucThanhToan: paymentMethod,
      });
      const res = response.data;
      if (res.success) {
        alert(
          isOnlineOrder
            ? "Xác nhận đơn hàng thành công!"
            : "Xuất hóa đơn thành công!"
        );
        setShowInvoiceDialog(false);
        setSelectedInvoice(null);
        setInvoiceDetails(null);
        fetchPendingInvoices();
      } else {
        alert(res.message || "Lỗi khi xác nhận");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống");
    } finally {
      setConfirming(false);
    }
  };

  // Check if invoice is from online order (only "Mua hàng" items)
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
      return <ShoppingCart className="h-4 w-4 text-green-600" />;
    if (loaiDichVu?.includes("Tiêm"))
      return <Syringe className="h-4 w-4 text-purple-600" />;
    return <Stethoscope className="h-4 w-4 text-blue-600" />;
  };

  const getServiceBadge = (loaiDichVu) => {
    if (loaiDichVu === "Mua hàng")
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Mua hàng
        </Badge>
      );
    if (loaiDichVu?.includes("Tiêm"))
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          Tiêm phòng
        </Badge>
      );
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
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
            <div className="mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Receipt className="h-6 w-6 text-blue-600" />
                  Lập hóa đơn
                </h1>
                <p className="text-gray-500 text-sm">
                  Xác nhận hóa đơn trong ngày tại chi nhánh
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Lỗi: {error}</p>
              </div>
            )}

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Danh sách hóa đơn chờ xác nhận (Hôm nay)
                    </CardTitle>
                    <CardDescription>
                      Click vào hóa đơn để xem chi tiết và xác nhận
                    </CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Tìm kiếm hóa đơn..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Không có hóa đơn nào cần xác nhận hôm nay</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredInvoices.map((inv) => (
                      <div
                        key={inv.maHoaDon}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 cursor-pointer transition-colors hover:border-blue-200"
                        onClick={() => handleSelectInvoice(inv)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {inv.tenKhachHang?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {inv.tenKhachHang}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className="font-medium text-blue-600">
                                {inv.maHoaDon}
                              </span>{" "}
                              • SĐT: {inv.sdt}
                            </div>
                            <div className="text-xs text-gray-400">
                              {inv.ngayLap}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-600">
                            {inv.tongTien?.toLocaleString("vi-VN")} ₫
                          </div>
                          <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-200 bg-orange-50"
                          >
                            {inv.trangThai}
                          </Badge>
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
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Chi tiết hóa đơn {selectedInvoice?.maHoaDon}
                  </DialogTitle>
                  <DialogDescription>
                    {checkIsOnlineOrder()
                      ? "Đơn hàng online - Khách hàng đặt qua website"
                      : "Kiểm tra thông tin và xác nhận hóa đơn"}
                  </DialogDescription>
                </DialogHeader>

                {loadingDetails ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : invoiceDetails ? (
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <Label className="text-gray-500 text-xs uppercase">
                          Khách hàng
                        </Label>
                        <div className="font-semibold">
                          {invoiceDetails.tenKhachHang}
                        </div>
                        <div className="text-sm text-gray-500">
                          SĐT: {invoiceDetails.sdt}
                        </div>
                        <Badge className="mt-1" variant="outline">
                          {invoiceDetails.capHoiVien}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Label className="text-gray-500 text-xs uppercase">
                          Chi nhánh
                        </Label>
                        <div className="font-semibold">
                          {invoiceDetails.chiNhanh?.tenChiNhanh}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoiceDetails.ngayLap}
                        </div>
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">
                          Chi tiết dịch vụ & sản phẩm
                        </h3>
                        {!checkIsOnlineOrder() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleOpenAddProduct}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Thêm sản phẩm
                          </Button>
                        )}
                      </div>

                      <div className="border rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">
                                STT
                              </th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">
                                Mô tả
                              </th>
                              <th className="py-3 px-4 text-left font-medium text-gray-600">
                                Loại
                              </th>
                              <th className="py-3 px-4 text-right font-medium text-gray-600">
                                SL
                              </th>
                              <th className="py-3 px-4 text-right font-medium text-gray-600">
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
                                    <span className="font-medium">
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
                                <td className="py-3 px-4 text-right">
                                  {item.LoaiChiTiet === "MuaHang"
                                    ? item.ChiTiet?.soLuong
                                    : 1}
                                </td>
                                <td className="py-3 px-4 text-right font-semibold">
                                  {item.ThanhTien?.toLocaleString("vi-VN")} ₫
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {invoiceDetails.tongTien?.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      {invoiceDetails.maKhuyenMai && (
                        <div className="text-sm text-green-600 mt-1">
                          Áp dụng khuyến mãi: {invoiceDetails.maKhuyenMai}
                        </div>
                      )}
                    </div>

                    {/* Payment Method Selection Removed as per requirement */}

                    {/* Warning message if services are incomplete */}
                    {invoiceDetails.totalServices > 0 &&
                      invoiceDetails.completedServices <
                        invoiceDetails.totalServices && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-amber-800">
                                Chưa thể xuất hóa đơn
                              </p>
                              <p className="text-xs text-amber-700 mt-1">
                                Còn{" "}
                                {invoiceDetails.totalServices -
                                  invoiceDetails.completedServices}{" "}
                                dịch vụ chưa được cập nhật đầy đủ thông tin (
                                {invoiceDetails.completedServices}/
                                {invoiceDetails.totalServices} dịch vụ đã hoàn
                                thành). Vui lòng cập nhật thông tin cho tất cả
                                dịch vụ trước khi xuất hóa đơn.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowInvoiceDialog(false)}
                      >
                        Đóng
                      </Button>
                      <Button
                        onClick={handleConfirmInvoice}
                        disabled={
                          confirming ||
                          (invoiceDetails.totalServices > 0 &&
                            !invoiceDetails.canConfirm)
                        }
                        className={
                          checkIsOnlineOrder()
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }
                      >
                        {confirming ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : checkIsOnlineOrder() ? (
                          <PackageCheck className="h-4 w-4 mr-2" />
                        ) : (
                          <Printer className="h-4 w-4 mr-2" />
                        )}
                        {checkIsOnlineOrder()
                          ? "Xác nhận đặt hàng"
                          : "Xuất hóa đơn"}
                      </Button>
                    </DialogFooter>
                  </div>
                ) : null}
              </DialogContent>
            </Dialog>

            {/* Add Product Dialog */}
            <Dialog
              open={showAddProductDialog}
              onOpenChange={setShowAddProductDialog}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm sản phẩm</DialogTitle>
                  <DialogDescription>
                    Chọn sản phẩm từ kho của chi nhánh
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Tìm sản phẩm..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                  />

                  <div className="h-[200px] overflow-y-auto border rounded-lg p-2 space-y-2">
                    {loadingProducts ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center text-sm text-gray-500 p-4">
                        Không tìm thấy sản phẩm
                      </div>
                    ) : (
                      filteredProducts.map((p) => (
                        <div
                          key={p.maSanPham}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedProductToAdd?.maSanPham === p.maSanPham
                              ? "bg-blue-50 border-blue-400"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedProductToAdd(p)}
                        >
                          <div className="font-medium">{p.tenSanPham}</div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Kho: {p.soLuongTonKho || 0}</span>
                            <span className="font-semibold text-blue-600">
                              {p.donGia?.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Label>Số lượng:</Label>
                    <Input
                      type="number"
                      min="1"
                      max={selectedProductToAdd?.SoLuongTon || 1}
                      value={quantityToAdd}
                      onChange={(e) => setQuantityToAdd(e.target.value)}
                      className="w-24"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddProductDialog(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    disabled={!selectedProductToAdd || addingProduct}
                  >
                    {addingProduct && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Thêm vào hóa đơn
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
