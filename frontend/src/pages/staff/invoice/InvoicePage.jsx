import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
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
} from "../../../components/ui/dialog";
import { ArrowLeft, Search, Receipt, Plus, Trash2, FileText } from "lucide-react";

// Xóa bỏ "use client"

export default function InvoicePage() {
  // Loại bỏ khai báo kiểu TypeScript: <any>
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // Loại bỏ khai báo kiểu TypeScript: <any[]>
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);

  const customers = [
    {
      id: "KH001",
      name: "Nguyễn Văn A",
      phone: "0912345678",
      services: [
        { type: "Khám bệnh", date: "10/12/2025", price: 200000, pet: "Chó Golden - Lucky" },
        { type: "Tiêm phòng", date: "10/12/2025", price: 350000, pet: "Chó Golden - Lucky" },
      ],
    },
    {
      id: "KH002",
      name: "Trần Thị B",
      phone: "0987654321",
      services: [{ type: "Khám bệnh", date: "12/12/2025", price: 200000, pet: "Mèo Anh Lông Ngắn - Miu" }],
    },
  ];

  const availableProducts = [
    { id: "SP001", name: "Royal Canin Mini Adult", type: "Thức ăn", price: 450000 },
    { id: "SP002", name: "Nexgard Spectra", type: "Thuốc", price: 165000 },
    { id: "SP003", name: "Vòng cổ chống bọ chét", type: "Phụ kiện", price: 120000 },
    { id: "SP004", name: "Pate Whiskas", type: "Thức ăn", price: 85000 },
  ];

  // Loại bỏ khai báo kiểu TypeScript: (product: any)
  const addProduct = (product) => {
    // Tăng số lượng nếu sản phẩm đã có, hoặc thêm mới
    const existingProductIndex = selectedProducts.findIndex(p => p.id === product.id);

    if (existingProductIndex >= 0) {
      const newProducts = [...selectedProducts];
      newProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(newProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  // Loại bỏ khai báo kiểu TypeScript: (index: number)
  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    // Loại bỏ khai báo kiểu TypeScript: (sum: number, s: any)
    const servicesTotal = selectedCustomer?.services.reduce((sum, s) => sum + s.price, 0) || 0;
    const productsTotal = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
    return servicesTotal + productsTotal;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Sửa Link href -> to */}
        <Link to="/staff/demo">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            Lập hóa đơn
          </h1>
          <p className="text-gray-500 mt-1">Chọn khách hàng và tạo hóa đơn thanh toán</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách khách hàng</CardTitle>
              <CardDescription>Chọn khách hàng để lập hóa đơn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Tìm kiếm khách hàng..." />
                <Button size="icon" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCustomer?.id === customer.id ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                        setSelectedCustomer(customer);
                        setSelectedProducts([]); // Reset products when customer changes
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{customer.name}</div>
                        <div className="text-sm text-gray-600">Mã KH: {customer.id}</div>
                        <div className="text-sm text-gray-600">SĐT: {customer.phone}</div>
                      </div>
                      {selectedCustomer?.id === customer.id && <Badge className="bg-blue-600">Đã chọn</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết hóa đơn</CardTitle>
              <CardDescription>Dịch vụ đã sử dụng và sản phẩm mua thêm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedCustomer ? (
                <div className="text-center py-8 text-gray-500">Vui lòng chọn khách hàng</div>
              ) : (
                <>
                  {/* Services */}
                  <div>
                    <Label className="text-base font-semibold">Dịch vụ đã sử dụng</Label>
                    <div className="mt-2 space-y-2">
                      {/* Loại bỏ khai báo kiểu TypeScript: service: any, index: number */}
                      {selectedCustomer.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{service.type}</div>
                            <div className="text-sm text-gray-600">{service.pet}</div>
                            <div className="text-xs text-gray-500">{service.date}</div>
                          </div>
                          <div className="font-semibold text-blue-600">{service.price.toLocaleString("vi-VN")} ₫</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-semibold">Sản phẩm mua thêm</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                            <Plus className="h-4 w-4" />
                            Thêm sản phẩm
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chọn sản phẩm</DialogTitle>
                            <DialogDescription>Chọn sản phẩm có tại chi nhánh để thêm vào hóa đơn</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {availableProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-600">{product.type}</div>
                                  <div className="text-sm font-semibold text-blue-600">
                                    {product.price.toLocaleString("vi-VN")} ₫
                                  </div>
                                </div>
                                <Button size="sm" onClick={() => addProduct(product)}>
                                  Thêm
                                </Button>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {selectedProducts.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg">
                        Chưa có sản phẩm nào
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedProducts.map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600">
                                {product.type} - SL: {product.quantity}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-green-600">
                                {(product.price * product.quantity).toLocaleString("vi-VN")} ₫
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => removeProduct(index)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600 text-2xl">{calculateTotal().toLocaleString("vi-VN")} ₫</span>
                    </div>
                  </div>

                  <Button className="w-full gap-2" size="lg" onClick={() => setShowInvoice(true)}>
                    <FileText className="h-5 w-5" />
                    Xuất hóa đơn
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice Dialog */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Hóa đơn thanh toán</DialogTitle>
              <DialogDescription>Chi tiết hóa đơn dịch vụ và sản phẩm</DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">Thông tin khách hàng</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>Họ tên: {selectedCustomer.name}</div>
                    <div>Mã KH: {selectedCustomer.id}</div>
                    <div>SĐT: {selectedCustomer.phone}</div>
                    <div>Ngày lập: {new Date().toLocaleDateString("vi-VN")}</div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg mb-2">Dịch vụ</h3>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Dịch vụ</th>
                        <th className="text-left p-2">Thú cưng</th>
                        <th className="text-right p-2">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Loại bỏ khai báo kiểu TypeScript: service: any, index: number */}
                      {selectedCustomer.services.map((service, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{service.type}</td>
                          <td className="p-2">{service.pet}</td>
                          <td className="text-right p-2">{service.price.toLocaleString("vi-VN")} ₫</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-2">Sản phẩm</h3>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-left p-2">Sản phẩm</th>
                          <th className="text-center p-2">SL</th>
                          <th className="text-right p-2">Đơn giá</th>
                          <th className="text-right p-2">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts.map((product, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{product.name}</td>
                            <td className="text-center p-2">{product.quantity}</td>
                            <td className="text-right p-2">{product.price.toLocaleString("vi-VN")} ₫</td>
                            <td className="text-right p-2">
                              {(product.price * product.quantity).toLocaleString("vi-VN")} ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600 text-2xl">{calculateTotal().toLocaleString("vi-VN")} ₫</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">In hóa đơn</Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Gửi email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}