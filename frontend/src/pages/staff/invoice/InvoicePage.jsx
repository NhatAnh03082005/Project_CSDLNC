import React, { useState, useEffect, useRef } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 
import { useReactToPrint } from "react-to-print"; // Import thư viện in
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
  DialogFooter,
} from "../../../components/ui/dialog";
import { ArrowLeft, Search, Receipt, Plus, Trash2, FileText, Printer, Stethoscope, Syringe, Package } from "lucide-react";
// Import các services
import { invoiceAPI, customerAPI, productAPI, 
        petAPI, vaccinationAPI, employeeAPI , authAPI} from "../../../api/services";

// Xóa bỏ "use client"

// --- COMPONENT CON: NỘI DUNG HÓA ĐƠN (Để tái sử dụng cho việc In và Xem trước) ---
const InvoiceTemplate = React.forwardRef(({ customer, items, total, date }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-gray-900 border rounded-lg" style={{ minHeight: '600px' }}>
      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold uppercase">Hóa Đơn Thanh Toán</h1>
        <p className="text-sm text-gray-500">PetCareX System</p>
        <p className="text-sm mt-1">Ngày: {date}</p>
      </div>

      <div className="mb-6 grid grid-cols-2">
        <div>
          <h3 className="font-bold text-gray-700">Khách hàng:</h3>
          <p>{customer?.HoTen}</p>
          <p>{customer?.SDT}</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-gray-700">Nhân viên lập:</h3>
          <p>Admin/Staff</p>
        </div>
      </div>

      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="border-b-2 border-gray-800">
            <th className="text-left py-2">STT</th>
            <th className="text-left py-2">Diễn giải</th>
            <th className="text-center py-2">SL</th>
            <th className="text-right py-2">Đơn giá</th>
            <th className="text-right py-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-2">{idx + 1}</td>
              <td className="py-2">
                {item.type === 'PRODUCT' ? item.data.TenSanPham : 
                 item.type === 'EXAM' ? `Khám bệnh: ${item.data.TenThuCung}` : 
                 `Tiêm phòng: ${item.data.TenVacXin}`}
              </td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">{item.price.toLocaleString()}</td>
              <td className="text-right py-2">{(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-sm text-gray-500">Tổng cộng</div>
          <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()} VNĐ</div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-400 italic">
        Cảm ơn quý khách đã sử dụng dịch vụ tại PetCareX!
      </div>
    </div>
  );
});


export default function InvoicePage() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  // Loại bỏ khai báo kiểu TypeScript: <any>
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null); // Thú cưng được chọn để khám/tiêm
  
  // Giỏ hàng (Invoice Items)
  const [invoiceItems, setInvoiceItems] = useState([]); 
  // Structure item: { type: 'PRODUCT' | 'EXAM' | 'VACCINE', data: {...}, price: number, quantity: 1 }

  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

// State cho dữ liệu từ API
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
 const [products, setProducts] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [customerPackages, setCustomerPackages] = useState([]); // Gói tiêm của khách

  // Form State cho các modal
  const [examForm, setExamForm] = 
    useState({ TrieuChung: "", ChanDoan: "", ToaThuoc: "", NgayTaiKham: "", BacSi: "", price: 0 });

  const [vaccineForm, setVaccineForm] = 
    useState({ MaVacXin: "", MaGoiDK: "", BacSi: "" });

  // Dialog States
  const [isProductDialogOpen, setProductDialogOpen] = useState(false);
  const [isExamDialogOpen, setExamDialogOpen] = useState(false);
  const [isVaccineDialogOpen, setVaccineDialogOpen] = useState(false);

  // Ref cho in ấn
 // Ref này sẽ gắn vào component bị ẩn (nhưng luôn tồn tại trong DOM)
  const invoiceRef = useRef(null);

 const handlePrint = useReactToPrint({
    contentRef: invoiceRef, // Dùng contentRef cho phiên bản mới (nếu thư viện yêu cầu)
    content: () => invoiceRef.current, // Fallback cho phiên bản cũ
    documentTitle: `HoaDon_${selectedCustomer?.MaKhachHang || 'Guest'}_${new Date().getTime()}`,
  });

 // --- 1. FETCH DỮ LIỆU BAN ĐẦU ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Lấy thông tin người dùng hiện tại để biết Chi Nhánh
        const userRes = await authAPI.getCurrentUser();
        const currentUser = userRes.data?.success ? userRes.data.data : null;
        const currentBranchId = (currentUser?.MaChiNhanh || currentUser?.maChiNhanh) ?? "CN02";

        console.log("NV đang lập đơn thuộc chi nhánh:", currentBranchId);

        const [prodRes, vacRes, docRes] = await Promise.all([
          productAPI.getAll(),
          vaccinationAPI.getAll(), // Lấy danh sách VacXin
          employeeAPI.getDoctors({ MaChiNhanh: currentBranchId })
        ]);

        if (prodRes.data?.success) setProducts(prodRes.data.data);
        if (vacRes.data?.success) setVaccines(vacRes.data.data);
        if (docRes.data?.success) setDoctors(docRes.data.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu ban đầu:", error);
      }
    };
    fetchInitialData();
  }, []);


  // --- 2. TÌM KIẾM KHÁCH HÀNG ---
    useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
        if (searchTerm.trim()) {
          try {
            const res = await customerAPI.getAll({ search: searchTerm });
            
            // LOG ĐỂ DEBUG
            console.log("🔍 Response tìm kiếm khách hàng:", res);

            // ✅ SỬA LẠI LOGIC BÓC TÁCH DỮ LIỆU
            if (res.data?.success && res.data?.data) {
              // TRƯỜNG HỢP 1: Cấu trúc { data: { customers: [...] } } (Như bạn cung cấp)
              if (res.data.data.customers) {
                setCustomers(res.data.data.customers);
              } 
              // TRƯỜNG HỢP 2: Cấu trúc { data: [...] } (Dự phòng nếu API đổi)
              else if (Array.isArray(res.data.data)) {
                setCustomers(res.data.data);
              }
              else {
                setCustomers([]);
              }
            } 
            // Các trường hợp dự phòng khác
            else if (Array.isArray(res.data)) {
              setCustomers(res.data);
            } else {
              setCustomers([]);
            }
          } catch (error) {
            console.error("❌ Lỗi tìm kiếm khách hàng:", error);
            setCustomers([]);
          }
        } else {
          setCustomers([]);
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

// --- 3. KHI CHỌN KHÁCH HÀNG -> LẤY PET & GÓI TIÊM ---
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setSelectedPet(null);
    setInvoiceItems([]); // Reset giỏ hàng
    setSearchTerm("");
    
    try {
      // Lấy danh sách thú cưng
      const petRes = await petAPI.getByCustomer(customer.MaKhachHang);
      if (petRes.data?.success) setPets(petRes.data.data);

      // Lấy các gói tiêm đang active (nếu có API này)
       const pkgRes = await vaccinationAPI.getActivePackages(customer.MaKhachHang);
       if (pkgRes.data?.success){ 
         setCustomerPackages(pkgRes.data.data);
       } else {
          setCustomerPackages([]);
      }
    } catch (error) {
      console.error("Lỗi tải thông tin chi tiết khách hàng:", error);
    }
  };
// --- 4. CÁC HÀM THÊM ITEM VÀO HÓA ĐƠN ---

  // Thêm Sản phẩm
  const addProductItem = (product) => {
    const existing = invoiceItems.findIndex(i => i.type === 'PRODUCT' && i.data.MaSanPham === product.MaSanPham);
    if (existing >= 0) {
      const newItems = [...invoiceItems];
      newItems[existing].quantity += 1;
      setInvoiceItems(newItems);
    } else {
      setInvoiceItems([...invoiceItems, {
        type: 'PRODUCT',
        data: product, // Chứa MaSanPham, TenSanPham...
        price: product.DonGia,
        quantity: 1
      }]);
    }
    // Không đóng dialog để chọn tiếp
  }

  // Thêm Dịch vụ Khám bệnh
  const addExamItem = () => {
    if (!selectedPet) return alert("Vui lòng chọn thú cưng trước!");
    if (!examForm.BacSi || !examForm.price) return alert("Vui lòng chọn bác sĩ và nhập giá khám!");

    setInvoiceItems([...invoiceItems, {
      type: 'EXAM',
      data: { ...examForm, MaThuCung: selectedPet.MaThuCung, TenThuCung: selectedPet.TenThuCung },
      price: Number(examForm.price),
      quantity: 1
    }]);
    setExamDialogOpen(false);
    // Reset form
    setExamForm({ TrieuChung: "", ChanDoan: "", ToaThuoc: "", NgayTaiKham: "", BacSi: "", price: 0 });
  };

  // Thêm Dịch vụ Tiêm phòng
  const addVaccineItem = () => {
    if (!selectedPet) return alert("Vui lòng chọn thú cưng trước!");
    if (!vaccineForm.MaVacXin || !vaccineForm.BacSi) return alert("Vui lòng chọn vắc-xin và bác sĩ!");

    const selectedVac = vaccines.find(v => v.MaVacXin === vaccineForm.MaVacXin);
    // Nếu có MaGoiDK thì giá = 0, ngược lại lấy giá vắc xin
    const price = vaccineForm.MaGoiDK ? 0 : (selectedVac?.GiaTien || 0);

    setInvoiceItems([...invoiceItems, {
      type: 'VACCINE',
      data: { 
        ...vaccineForm, 
        TenVacXin: selectedVac?.TenVacXin,
        MaThuCung: selectedPet.MaThuCung, 
        TenThuCung: selectedPet.TenThuCung 
      },
      price: price,
      quantity: 1
    }]);
    setVaccineDialogOpen(false);
    setVaccineForm({ MaVacXin: "", MaGoiDK: "", BacSi: "" });
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  /// --- 5. TẠO HÓA ĐƠN (SUBMIT) ---
  const handleCreateInvoice = async () => {
    if (!selectedCustomer) return;
    if (invoiceItems.length === 0) return alert("Hóa đơn trống!");

    // BƯỚC 1: Map dữ liệu từ giỏ hàng (Frontend) sang chuẩn của Backend
    // Backend cần 1 mảng 'details' chung, phân biệt bằng 'LoaiDichVu'
    const details = invoiceItems.map(item => {
      // Trường hợp 1: Mua hàng
      if (item.type === 'PRODUCT') {
        return {
          LoaiDichVu: 'Mua hàng', // Khớp với CHECK constraint trong DB SQL
          MaSanPham: item.data.MaSanPham,
          SoLuong: item.quantity
        };
      } 
      
      // Trường hợp 2: Khám bệnh
      else if (item.type === 'EXAM') {
        return {
          LoaiDichVu: 'Khám bệnh',
          MaThuCung: item.data.MaThuCung,
          BacSi: item.data.BacSi,
          TrieuChung: item.data.TrieuChung,
          ChanDoan: item.data.ChanDoan,
          ToaThuoc: item.data.ToaThuoc,
          NgayTaiKham: item.data.NgayTaiKham,
          // Lưu ý: Giá tiền thường do Trigger DB tính hoặc Backend xử lý. 
          // Nếu Backend cho phép override giá thì mới gửi trường này.
        };
      } 
      
      // Trường hợp 3: Tiêm phòng
      else if (item.type === 'VACCINE') {
        return {
          LoaiDichVu: 'Tiêm phòng',
          MaThuCung: item.data.MaThuCung,
          BacSi: item.data.BacSi,
          MaVacXin: item.data.MaVacXin,
          MaGoiDK: item.data.MaGoiDK || null
        };
      }
      return null;
    }).filter(item => item !== null); // Lọc bỏ các item lỗi (nếu có)

    // BƯỚC 2: Tạo payload cuối cùng
    const payload = {
      MaKhachHang: selectedCustomer.MaKhachHang,
      // NhanVienLap: "NV...", -> KHÔNG CẦN GỬI, Backend controller đã tự lấy từ req.user
      HinhThucThanhToan: "Tiền mặt", // Bạn có thể lấy từ state nếu có select box
      details: details // <--- QUAN TRỌNG: Backend đang check biến này
    };

    try {
      console.log("Payload gửi đi:", payload); // Log để kiểm tra trước khi gửi
      const res = await invoiceAPI.create(payload);
      
      if (res.data?.success) {
        alert("Lập hóa đơn thành công!");
        // Có thể reset form hoặc chuyển trang tại đây
        // setInvoiceItems([]); 
        // setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Lỗi lập hóa đơn:", error);
      // Hiển thị message lỗi chi tiết từ Backend trả về
      alert(error.response?.data?.message || "Lỗi hệ thống khi tạo hóa đơn");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link to="/staff/demo">
            <Button variant="ghost" className="gap-2 text-slate-500 hover:bg-white">
              <ArrowLeft className="h-4 w-4" /> Quay lại Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-800">
            <Receipt className="h-6 w-6" /> LẬP HÓA ĐƠN DỊCH VỤ & BÁN HÀNG
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* CỘT TRÁI: KHÁCH HÀNG & THÚ CƯNG (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card Tìm khách hàng */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700">1. Thông tin Khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Tìm SĐT, Tên, Mã KH..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* Dropdown kết quả tìm kiếm */}
                  {Array.isArray(customers) && customers.length > 0 && (
                    <div className="absolute z-10 w-full bg-white mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {customers.map(cus => (
                        <div 
                          key={cus.MaKhachHang}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                          onClick={() => handleSelectCustomer(cus)}
                        >
                          <div className="font-bold text-sm">{cus.HoTen}</div>
                          <div className="text-xs text-gray-500">{cus.SDT} - {cus.MaKhachHang}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thông tin khách đã chọn */}
                {selectedCustomer ? (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="font-bold text-lg text-blue-900">{selectedCustomer.HoTen}</div>
                    <div className="text-sm text-gray-600">Mã: {selectedCustomer.MaKhachHang}</div>
                    <div className="text-sm text-gray-600">SĐT: {selectedCustomer.SDT}</div>
                    <div className="text-sm text-gray-600">Điểm TL: {selectedCustomer.DiemLoyalty}</div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                    Chưa chọn khách hàng
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card Chọn Thú Cưng (Chỉ hiện khi đã chọn khách) */}
            {selectedCustomer && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">2. Chọn Thú Cưng</CardTitle>
                  <CardDescription className="text-xs">Chọn thú cưng để áp dụng dịch vụ</CardDescription>
                </CardHeader>
                <CardContent>
                  {pets.length === 0 ? (
                    <div className="text-sm text-gray-500">Khách hàng chưa đăng ký thú cưng nào.</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {pets.map(pet => (
                        <div 
                          key={pet.MaThuCung}
                          onClick={() => setSelectedPet(pet)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedPet?.MaThuCung === pet.MaThuCung 
                            ? "bg-green-100 border-green-500 ring-1 ring-green-500" 
                            : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-bold text-sm">{pet.TenThuCung}</div>
                          <div className="text-xs text-gray-500">{pet.Giong} - {pet.Loai}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* CỘT PHẢI: XÂY DỰNG HÓA ĐƠN (8 cols) */}
          <div className="lg:col-span-8">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b bg-gray-50/50 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-gray-800">Chi tiết hóa đơn</CardTitle>
                  <div className="flex gap-2">
                    {/* BUTTONS THÊM DỊCH VỤ / SẢN PHẨM */}
                    
                    {/* 1. Thêm Sản phẩm */}
                    <Dialog open={isProductDialogOpen} onOpenChange={setProductDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Package className="h-4 w-4" /> Thêm Sản phẩm
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Chọn sản phẩm</DialogTitle></DialogHeader>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {products.map(p => (
                            <div key={p.MaSanPham} className="flex justify-between p-3 border rounded hover:bg-gray-50 items-center">
                              <div>
                                <div className="font-bold">{p.TenSanPham}</div>
                                <div className="text-xs text-gray-500">{p.MaSanPham} - Tồn: {p.SoLuongTon}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-bold text-blue-600">{p.DonGia?.toLocaleString()}đ</span>
                                <Button size="sm" onClick={() => addProductItem(p)}>Thêm</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 2. Thêm Khám Bệnh (Cần chọn Pet trước) */}
                    <Dialog open={isExamDialogOpen} onOpenChange={setExamDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                          disabled={!selectedPet}
                        >
                          <Stethoscope className="h-4 w-4" /> Khám bệnh
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Phiếu Khám Bệnh: {selectedPet?.TenThuCung}</DialogTitle></DialogHeader>
                        <div className="space-y-3 py-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Bác sĩ phụ trách (*)</Label>
                              <select 
                                className="w-full border rounded p-2 text-sm"
                                value={examForm.BacSi}
                                onChange={e => setExamForm({...examForm, BacSi: e.target.value})}
                              >
                                <option value="">-- Chọn bác sĩ --</option>
                                {doctors.map(d => <option key={d.MaNhanVien} value={d.MaNhanVien}>{d.HoTen}</option>)}
                              </select>
                            </div>
                            <div>
                              <Label>Chi phí khám (*)</Label>
                              <Input 
                                type="number" 
                                placeholder="VNĐ"
                                value={examForm.price}
                                onChange={e => setExamForm({...examForm, price: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Triệu chứng</Label>
                            <Input value={examForm.TrieuChung} onChange={e => setExamForm({...examForm, TrieuChung: e.target.value})} />
                          </div>
                          <div>
                            <Label>Chẩn đoán</Label>
                            <Input value={examForm.ChanDoan} onChange={e => setExamForm({...examForm, ChanDoan: e.target.value})} />
                          </div>
                          <div>
                            <Label>Toa thuốc (Ghi chú)</Label>
                            <Input value={examForm.ToaThuoc} onChange={e => setExamForm({...examForm, ToaThuoc: e.target.value})} />
                          </div>
                          <div>
                            <Label>Ngày tái khám</Label>
                            <Input type="date" value={examForm.NgayTaiKham} onChange={e => setExamForm({...examForm, NgayTaiKham: e.target.value})} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={addExamItem} className="bg-orange-600 text-white">Lưu phiếu khám</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* 3. Thêm Tiêm Phòng (Cần chọn Pet trước) */}
                    <Dialog open={isVaccineDialogOpen} onOpenChange={setVaccineDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                          disabled={!selectedPet}
                        >
                          <Syringe className="h-4 w-4" /> Tiêm phòng
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Tiêm Phòng: {selectedPet?.TenThuCung}</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                          <div>
                            <Label>Bác sĩ thực hiện (*)</Label>
                            <select 
                              className="w-full border rounded p-2 text-sm"
                              value={vaccineForm.BacSi}
                              onChange={e => setVaccineForm({...vaccineForm, BacSi: e.target.value})}
                            >
                              <option value="">-- Chọn bác sĩ --</option>
                              {doctors.map(d => <option key={d.MaNhanVien} value={d.MaNhanVien}>{d.HoTen}</option>)}
                            </select>
                          </div>
                          <div>
                            <Label>Chọn Vắc-xin (*)</Label>
                            <select 
                              className="w-full border rounded p-2 text-sm"
                              value={vaccineForm.MaVacXin}
                              onChange={e => { 
                                const selectedMaVacXin = e.target.value;
                                  // LOGIC MỚI: Tự động tìm xem khách có gói nào chứa vắc-xin này không
                                  // Giả sử API subscriptions trả về mảng: [{ MaGoiDK: 'GD01', MaVacXin: 'VX01', SoLuongCon: 2 }, ...]
                                  const activePackage = customerPackages.find(
                                      pkg => pkg.MaVacXin === selectedMaVacXin && pkg.SoLuongCon > 0
                                  );
                                setVaccineForm({
                                  ...vaccineForm, 
                                  MaVacXin: e.target.value,
                                // Nếu tìm thấy gói -> tự điền MaGoiDK, ngược lại để rỗng
                                  MaGoiDK: activePackage ? activePackage.MaGoiDK : ""
                                });
                              }}
                            >
                              <option value="">-- Loại Vắc-xin --</option>
                              {vaccines.map(v => (
                                <option key={v.MaVacXin} value={v.MaVacXin}>
                                  {v.TenVacXin} - {v.GiaTien?.toLocaleString()}đ
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label>Mã Gói Đăng Ký (Nếu có)</Label>
                            <Input 
                              placeholder="Nhập mã gói (VD: DG001) để miễn phí"
                              value={vaccineForm.MaGoiDK}
                              onChange={e => setVaccineForm({...vaccineForm, MaGoiDK: e.target.value})}
                            />
                            <p className="text-xs text-gray-500 mt-1">* Nhập mã gói hợp lệ, giá tiền sẽ tự động về 0đ</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={addVaccineItem} className="bg-green-600 text-white">Thêm mũi tiêm</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                  </div>
                </div>
              </CardHeader>

              {/* TABLE ITEMS */}
              <CardContent className="flex-1 overflow-y-auto pt-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="p-3">Loại</th>
                      <th className="p-3">Tên / Nội dung</th>
                      <th className="p-3 text-center">SL</th>
                      <th className="p-3 text-right">Đơn giá</th>
                      <th className="p-3 text-right">Thành tiền</th>
                      <th className="p-3 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-400">
                          Chưa có mục nào. Hãy thêm sản phẩm hoặc dịch vụ.
                        </td>
                      </tr>
                    ) : (
                      invoiceItems.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            {item.type === 'PRODUCT' && <Badge variant="outline">Sản phẩm</Badge>}
                            {item.type === 'EXAM' && <Badge className="bg-orange-100 text-orange-700">Khám bệnh</Badge>}
                            {item.type === 'VACCINE' && <Badge className="bg-green-100 text-green-700">Tiêm phòng</Badge>}
                          </td>
                          <td className="p-3">
                            {item.type === 'PRODUCT' && <span className="font-semibold">{item.data.TenSanPham}</span>}
                            {item.type === 'EXAM' && (
                              <div>
                                <div className="font-bold text-gray-700">Khám: {item.data.TenThuCung}</div>
                                <div className="text-xs text-gray-500">{item.data.ChanDoan || "Chưa chẩn đoán"}</div>
                              </div>
                            )}
                            {item.type === 'VACCINE' && (
                              <div>
                                <div className="font-bold text-gray-700">Tiêm: {item.data.TenVacXin}</div>
                                <div className="text-xs text-gray-500">Pet: {item.data.TenThuCung} {item.data.MaGoiDK ? `(Gói: ${item.data.MaGoiDK})` : ""}</div>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right">{item.price.toLocaleString()}đ</td>
                          <td className="p-3 text-right font-bold">{(item.price * item.quantity).toLocaleString()}đ</td>
                          <td className="p-3 text-center">
                            <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>

              {/* FOOTER TOTAL & ACTIONS */}
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-700">Tổng thanh toán:</span>
                  <span className="text-3xl font-bold text-blue-700">
                    {calculateTotal().toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-12 bg-gray-900 hover:bg-black text-white rounded-lg shadow-lg"
                    onClick={() => setShowInvoice(true)}
                    disabled={!selectedCustomer || invoiceItems.length === 0}
                  >
                    <FileText className="h-5 w-5 mr-2" /> XEM & IN HÓA ĐƠN
                  </Button>
                  <Button 
                    className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
                    onClick={handleCreateInvoice}
                    disabled={!selectedCustomer || invoiceItems.length === 0}
                  >
                    <Receipt className="h-5 w-5 mr-2" /> LƯU HÓA ĐƠN
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* DIALOG XEM TRƯỚC HÓA ĐƠN ĐỂ IN */}
        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Xem trước hóa đơn</DialogTitle>
            </DialogHeader>
            
            {/* Vùng in ấn */}
            <InvoiceTemplate 
                customer={selectedCustomer} 
                items={invoiceItems} 
                total={calculateTotal()} 
                date={new Date().toLocaleDateString("vi-VN")}
            />

            <DialogFooter>
              <Button onClick={handlePrint} className="bg-blue-600 text-white gap-2">
                <Printer className="h-4 w-4" /> In Hóa Đơn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 2. Component ẨN (Luôn tồn tại trong DOM) - DÙNG REF Ở ĐÂY */}
        <div style={{ display: "none" }}>
            <InvoiceTemplate 
                ref={invoiceRef} 
                customer={selectedCustomer} 
                items={invoiceItems} 
                total={calculateTotal()} 
                date={new Date().toLocaleDateString("vi-VN")}
            />
        </div>

      </div>
    </div>
  );
}