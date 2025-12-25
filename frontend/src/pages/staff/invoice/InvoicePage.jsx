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
import { ArrowLeft, Search, Receipt, Plus, Trash2, FileText, Printer, Mail } from "lucide-react";

// Xóa bỏ "use client"

export default function InvoicePage() {
  // Loại bỏ khai báo kiểu TypeScript: <any>
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // Loại bỏ khai báo kiểu TypeScript: <any[]>
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.phone.includes(search) ||
      customer.id.toLowerCase().includes(search)
    );
  });

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
        <Link to="/staff/demo">
          <Button variant="ghost" className="gap-2 text-slate-500 hover:bg-white hover:shadow-sm transition-all">
            <ArrowLeft className="h-4 w-4" /> Quay lại
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
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-white pb-3 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-blue-800 mb-2">Danh sách khách hàng</CardTitle>
                  <CardDescription className="text-xs"> Chọn khách hàng để lập hóa đơn</CardDescription>
                </div>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none">
                    Tìm thấy {filteredCustomers.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Ô tìm kiếm */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  placeholder="Tìm tên, SĐT hoặc mã khách hàng..." 
                  className="pl-10 bg-gray-50 border-gray-100 focus:bg-white focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-4 w-4 rotate-45" /> {/* Dùng icon Plus xoay 45 độ làm dấu X */}
                  </button>
                )}
              </div>

              {/* Danh sách khách hàng sau khi lọc */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-10">
                    <Search className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Không tìm thấy khách hàng nào</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`group border rounded-xl p-4 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                        selectedCustomer?.id === customer.id 
                          ? "bg-blue-50 border-blue-400 shadow-sm" 
                          : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
                      }`}
                      onClick={() => {
                          setSelectedCustomer(customer);
                          setSelectedProducts([]);
                      }}
                    >
                      {/* Dải màu trang trí khi được chọn */}
                      {selectedCustomer?.id === customer.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                            selectedCustomer?.id === customer.id ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                          }`}>
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{customer.name}</div>
                            <div className="text-xs font-medium text-blue-500 mb-1">{customer.id}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <span className="opacity-70">SĐT:</span> {customer.phone}
                            </div>
                          </div>
                        </div>
                        {selectedCustomer?.id === customer.id ? (
                          <Badge className="bg-blue-600 hover:bg-blue-600 shadow-none px-3">Đã chọn</Badge>
                        ) : (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="outline" className="text-blue-500 border-blue-200 bg-white">Chọn</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-white pb-2"> 
              <CardTitle className="text-lg text-blue-800">Chi tiết hóa đơn</CardTitle>
              <CardDescription className="text-xs">Dịch vụ đã sử dụng và sản phẩm mua thêm</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {!selectedCustomer ? (
                <div className="text-center py-20 text-gray-400 text-sm">
                  <Receipt className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  Vui lòng chọn khách hàng
                </div>
              ) : (
                <>
                  {/* Services Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-3 rounded-full bg-blue-500"></div>
                      <Label className="text-sm font-bold text-gray-700">Dịch vụ đã sử dụng</Label>
                    </div>
                    <div className="space-y-2">
                      {selectedCustomer.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                          <div className="flex-1">
                            <div className="text-sm font-bold text-gray-800">{service.type}</div>
                            <div className="text-xs text-gray-500 italic">{service.pet}</div>
                          </div>
                          <div className="font-bold text-blue-600 text-sm">{service.price.toLocaleString("vi-VN")} ₫</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products Section */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-3 rounded-full bg-green-500"></div>
                        <Label className="text-sm font-bold text-gray-700">Sản phẩm mua thêm</Label>
                      </div>

                      {/* Dialog thêm sản phẩm */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 text-[11px] gap-1 border-dashed">
                            <Plus className="h-3 w-3" /> Thêm sản phẩm
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Kho sản phẩm</DialogTitle>
                            <DialogDescription>Chọn sản phẩm để thêm vào hóa đơn</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto">
                            {availableProducts.map((product) => (
                              <div key={product.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-blue-50/50 transition-colors">
                                <div>
                                  <div className="font-bold text-sm text-gray-800">{product.name}</div>
                                  <div className="text-xs text-gray-500">{product.type}</div>
                                  <div className="text-sm font-bold text-blue-600">{product.price.toLocaleString("vi-VN")} ₫</div>
                                </div>
                                <Button size="sm" className="h-8 bg-blue-600" onClick={() => addProduct(product)}>
                                  Thêm
                                </Button>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Hiển thị danh sách sản phẩm đã chọn */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {selectedProducts.length === 0 ? (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-50 rounded-2xl text-gray-400 text-xs text-center px-4">
                          Nhấn "Thêm sản phẩm" để bán thêm phụ kiện, thức ăn...
                        </div>
                      ) : (
                        selectedProducts.map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl border border-green-100">
                            <div className="flex-1">
                              <div className="text-sm font-bold text-green-800">{product.name}</div>
                              <div className="text-[10px] text-green-600">Số lượng: {product.quantity}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="font-bold text-green-700 text-sm">
                                {(product.price * product.quantity).toLocaleString("vi-VN")} ₫
                              </div>
                              <button 
                                type="button"
                                onClick={() => removeProduct(index)} 
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="mt-auto pt-4 border-t border-gray-50 space-y-4">
                    <div className="flex justify-between items-center p-5 bg-[#f0f7ff] rounded-2xl border border-blue-50">
                      <span className="text-xl font-bold text-gray-900">Tổng cộng:</span>
                      <span className="text-blue-600 font-bold text-2xl">
                        {calculateTotal().toLocaleString("vi-VN")} <span className="underline">đ</span>
                      </span>
                    </div>
                  </div>

                  <Button className="w-full h-11 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-sm" onClick={() => setShowInvoice(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    XUẤT HÓA ĐƠN
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

                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100">
                  {/* Nút chính: In hóa đơn */}
                  <Button 
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-100 gap-2 transition-all active:scale-95"
                  >
                    <Printer className="h-4 w-4" />
                    In hóa đơn
                  </Button>

                  {/* Nút phụ: Gửi email */}
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold rounded-xl gap-2 transition-all active:scale-95 bg-transparent"
                  >
                    <Mail className="h-4 w-4" />
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