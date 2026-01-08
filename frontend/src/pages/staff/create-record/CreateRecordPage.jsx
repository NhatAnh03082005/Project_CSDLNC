import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import api from "../../../api/axios";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft, Save, Search, FilePlus, PawPrint, User, Phone, CreditCard, X, AlertCircle, Loader2 } from "lucide-react";

export default function CreateRecordPage() {
  const [step, setStep] = useState("customer-list");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedServices, setSelectedServices] = useState(["Khám bệnh"]); // Array để chọn nhiều dịch vụ
  
  // State cho tìm kiếm và loading
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    phone: "",
    cccd: "",
  });
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [petsLoading, setPetsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Load tất cả khách hàng khi mở trang
  useEffect(() => {
    loadAllCustomers();
  }, []);

  // Gọi API lấy tất cả khách hàng
  const loadAllCustomers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      setIsSearchMode(false);
      
      const response = await api.get('/employees/customers', {
        params: { page, limit: 20 }
      });
      
      if (response.data.success) {
        setCustomers(response.data.data.customers || []);
        setPagination({
          page: response.data.data.pagination.page,
          totalPages: response.data.data.pagination.totalPages,
          total: response.data.data.pagination.total
        });
      } else {
        setError(response.data.message || 'Không thể tải danh sách khách hàng');
        setCustomers([]);
      }
    } catch (err) {
      console.error('Error loading customers:', err);
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách khách hàng');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API tìm kiếm khách hàng
  const handleSearch = async () => {
    // Nếu không có filter nào, load lại tất cả
    if (!searchQuery.name.trim() && !searchQuery.phone.trim() && !searchQuery.cccd.trim()) {
      loadAllCustomers();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsSearchMode(true);
      
      const params = {};
      if (searchQuery.name.trim()) params.name = searchQuery.name.trim();
      if (searchQuery.phone.trim()) params.phone = searchQuery.phone.trim();
      if (searchQuery.cccd.trim()) params.cccd = searchQuery.cccd.trim();
      
      const response = await api.get('/employees/customers/search', { params });
      
      if (response.data.success) {
        setCustomers(response.data.data || []);
        setPagination({ page: 1, totalPages: 1, total: response.data.count || 0 });
      } else {
        setError(response.data.message || 'Không thể tìm kiếm khách hàng');
        setCustomers([]);
      }
    } catch (err) {
      console.error('Error searching customers:', err);
      setError(err.response?.data?.message || 'Lỗi khi tìm kiếm khách hàng');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn khách hàng
  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setStep("pet-list");
    
    // Gọi API lấy danh sách thú cưng
    try {
      setPetsLoading(true);
      setError(null);
      
      const response = await api.get(`/employees/customers/${customer.maKhachHang}/pets`);
      
      if (response.data.success) {
        setPets(response.data.data.pets || []);
      } else {
        setError(response.data.message || 'Không thể lấy danh sách thú cưng');
        setPets([]);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.response?.data?.message || 'Lỗi khi lấy danh sách thú cưng');
      setPets([]);
    } finally {
      setPetsLoading(false);
    }
  };

  const handleSelectPet = (petId) => {
    setSelectedPet(petId);
  };

  const handleClearSearch = () => {
    setSearchQuery({ name: "", phone: "", cccd: "" });
    setError(null);
    loadAllCustomers();
  };

  // Toggle service selection (checkboxes)
  const toggleService = (service) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        // Không cho phép bỏ chọn nếu chỉ còn 1 dịch vụ
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedPet || selectedServices.length === 0) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Gọi API tạo hồ sơ đa dịch vụ - backend tự lấy chi nhánh từ token
      const recordData = {
        MaKhachHang: selectedCustomer.maKhachHang,
        MaThuCung: selectedPet,
        services: selectedServices
      };
      
      const response = await api.post('/employees/records', recordData);
      
      if (response.data.success) {
        const selectedPetData = pets.find((p) => p.maThuCung === selectedPet);
        const servicesText = selectedServices.join(' + ');
        alert(
          `✅ Hồ sơ đã được tạo thành công!\n\n` +
          `Khách hàng: ${selectedCustomer.hoTen}\n` +
          `Thú cưng: ${selectedPetData?.tenThuCung}\n` +
          `Dịch vụ: ${servicesText}\n` +
          `Mã hóa đơn: ${response.data.data?.maHoaDon || 'N/A'}`
        );
        
        // Reset về trạng thái ban đầu
        setStep("customer-list");
        setSelectedCustomer(null);
        setSelectedPet(null);
        setSelectedServices(["Khám bệnh"]);
        setSearchQuery({ name: "", phone: "", cccd: "" });
        setPets([]);
        loadAllCustomers();
      } else {
        setError(response.data.message || 'Không thể tạo hồ sơ');
      }
    } catch (err) {
      console.error('Error creating record:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || 'Lỗi khi tạo hồ sơ. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý Enter key trong form tìm kiếm
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
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
            <FilePlus className="h-8 w-8 text-blue-600" />
            Tạo hồ sơ
          </h1>
          <p className="text-gray-500 mt-1">
            {step === "customer-list" ? "Tra cứu khách hàng và tạo hồ sơ" : "Chọn thú cưng để tạo hồ sơ"}
          </p>
        </div>

        {/* Step 1: Customer List with Search */}
        {step === "customer-list" && (
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardContent className="space-y-6 pt-6">
              
              {/* Vùng màu xanh chứa form tìm kiếm */}
              <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-blue-700">Tìm kiếm khách hàng theo bộ lọc</h2>
                    <p className="text-sm text-blue-500 mt-1">Nhập ít nhất một thông tin và nhấn "Tìm kiếm"</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>

                {/* Các ô nhập liệu */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="search-name" className="text-blue-900 font-medium ml-1">Tên khách hàng</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <Input
                        id="search-name"
                        className="pl-10 bg-white border-blue-200 focus:ring-blue-500 rounded-lg placeholder:text-gray-300"
                        placeholder="Họ tên khách hàng..."
                        value={searchQuery.name}
                        onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search-phone" className="text-blue-900 font-medium ml-1">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <Input
                        id="search-phone"
                        className="pl-10 bg-white border-blue-200 focus:ring-blue-500 rounded-lg placeholder:text-gray-300"
                        placeholder="0xxx xxx xxx"
                        value={searchQuery.phone}
                        onChange={(e) => setSearchQuery({ ...searchQuery, phone: e.target.value })}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search-cccd" className="text-blue-900 font-medium ml-1">Số CCCD</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <Input
                        id="search-cccd"
                        className="pl-10 bg-white border-blue-200 focus:ring-blue-500 rounded-lg placeholder:text-gray-300"
                        placeholder="Số CCCD khách hàng..."
                        value={searchQuery.cccd}
                        onChange={(e) => setSearchQuery({ ...searchQuery, cccd: e.target.value })}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>

                {/* Nút tìm kiếm */}
                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                  </Button>
                </div>
              </div>

              {/* Hiển thị lỗi */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Kết quả tìm kiếm */}
              <div className="space-y-4 px-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="font-semibold text-gray-700">
                      {isSearchMode ? 'Kết quả tìm kiếm:' : 'Danh sách khách hàng:'}{' '}
                      <span className="text-blue-600">{isSearchMode ? customers.length : pagination.total}</span> khách hàng
                    </span>
                  </div>
                  {isSearchMode && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Đang lọc
                    </Badge>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 mx-auto mb-3 text-blue-500 animate-spin" />
                    <p className="text-gray-500">{isSearchMode ? 'Đang tìm kiếm...' : 'Đang tải danh sách...'}</p>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>{isSearchMode ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào trong hệ thống'}</p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-[500px] overflow-y-auto">
                    {customers.map((customer) => (
                      <Card
                        key={customer.maKhachHang}
                        className="cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-lg">{customer.hoTen}</h4>
                              <div className="text-sm text-gray-600 space-y-0.5">
                                <div>
                                  <span className="font-medium">Mã KH:</span> {customer.maKhachHang}
                                </div>
                                <div>
                                  <span className="font-medium">SĐT:</span> {customer.sdt || 'Chưa cập nhật'}
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span> {customer.email || 'Chưa cập nhật'}
                                </div>
                                <div>
                                  <span className="font-medium">CCCD:</span> {customer.cccd || 'Chưa cập nhật'}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {customer.soLuongThuCung || 0} thú cưng
                              </Badge>
                              <Badge variant="outline" className={`
                                ${customer.capHoiVien === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                  customer.capHoiVien === 'Thân thiết' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-gray-50 text-gray-600 border-gray-200'}
                              `}>
                                {customer.capHoiVien || 'Cơ bản'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Phân trang (chỉ hiển thị khi không ở chế độ tìm kiếm) */}
                {!isSearchMode && !loading && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => loadAllCustomers(pagination.page - 1)}
                    >
                      Trang trước
                    </Button>
                    <span className="text-sm text-gray-600">
                      Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadAllCustomers(pagination.page + 1)}
                    >
                      Trang sau
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pet List */}
        {step === "pet-list" && selectedCustomer && (
          <Card>
            <CardHeader>
              <CardTitle>Chọn thú cưng</CardTitle>
              <CardDescription>Danh sách thú cưng của khách hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold">Khách hàng:</span> {selectedCustomer.hoTen}
                    </div>
                    <div>
                      <span className="font-semibold">Mã KH:</span> {selectedCustomer.maKhachHang}
                    </div>
                    <div>
                      <span className="font-semibold">Số điện thoại:</span> {selectedCustomer.sdt || 'Chưa cập nhật'}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {selectedCustomer.email || 'Chưa cập nhật'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Selection */}
              <div className="space-y-3">
                <Label>Chọn thú cưng *</Label>
                
                {petsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 mx-auto mb-3 text-blue-500 animate-spin" />
                    <p className="text-gray-500">Đang tải danh sách thú cưng...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <PawPrint className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Khách hàng này chưa có thú cưng nào</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {pets.map((pet) => (
                      <Card
                        key={`${pet.maKhachHang}-${pet.maThuCung}`}
                        className={`cursor-pointer transition-all ${
                          selectedPet === pet.maThuCung ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                        }`}
                        onClick={() => handleSelectPet(pet.maThuCung)}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              selectedPet === pet.maThuCung ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <PawPrint className={`h-6 w-6 ${selectedPet === pet.maThuCung ? "text-white" : "text-gray-500"}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{pet.tenThuCung}</h4>
                            <div className="text-sm text-gray-600">
                              {pet.loai || 'N/A'} - {pet.giong || 'N/A'} - {pet.gioiTinh || 'N/A'}
                              {pet.ngaySinh && ` - Sinh: ${new Date(pet.ngaySinh).toLocaleDateString('vi-VN')}`}
                            </div>
                            {pet.tinhTrangSucKhoe && (
                              <div className="text-xs text-gray-400 mt-1">
                                Tình trạng: {pet.tinhTrangSucKhoe}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Selection - Checkboxes */}
              <div className="space-y-3 mb-6">
                <Label className="text-blue-900 font-semibold">Chọn dịch vụ thực hiện * (có thể chọn nhiều)</Label>
                <div className="flex gap-4">
                  <div 
                    onClick={() => toggleService("Khám bệnh")}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      selectedServices.includes("Khám bệnh") 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${selectedServices.includes("Khám bệnh") ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                      {selectedServices.includes("Khám bệnh") && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm font-medium">Khám bệnh</span>
                  </div>

                  <div 
                    onClick={() => toggleService("Tiêm phòng")}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      selectedServices.includes("Tiêm phòng") 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${selectedServices.includes("Tiêm phòng") ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                      {selectedServices.includes("Tiêm phòng") && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm font-medium">Tiêm phòng</span>
                  </div>
                </div>
                {selectedServices.length === 2 && (
                  <p className="text-xs text-green-600 mt-1">✓ Đã chọn cả 2 dịch vụ - sẽ tạo 1 hóa đơn với 2 chi tiết</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-6">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:bg-gray-100 px-6"
                  onClick={() => {
                    setStep("customer-list");
                    setSelectedCustomer(null);
                    setSelectedPet(null);
                    setSelectedServices(["Khám bệnh"]);
                    setPets([]);
                    setError(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại bước trước
                </Button>

                <Button 
                  onClick={handleSubmit} 
                  disabled={!selectedPet || submitting} 
                  className={`gap-2 px-4 py-2 text-xs font-semibold transition-all ${
                    !selectedPet || submitting
                      ? "bg-gray-200 text-gray-400" 
                      : "bg-blue-700 hover:bg-blue-700 text-white hover:shadow-blue-200"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      ĐANG TẠO...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      TẠO HỒ SƠ
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}