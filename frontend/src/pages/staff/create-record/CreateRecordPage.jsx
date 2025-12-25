import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft, Save, Search, FilePlus, PawPrint, User, Phone, CreditCard, X } from "lucide-react";

// Xóa bỏ "use client"

export default function CreateRecordPage() {
  // Loại bỏ khai báo kiểu TypeScript: <"customer-list" | "pet-list">
  const [step, setStep] = useState("customer-list");
  // Loại bỏ khai báo kiểu TypeScript: <any> và <string | null>
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [serviceType, setServiceType] = useState("Khám bệnh"); // Mặc định là Khám bệnh
  
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    phone: "",
    cccd: "",
  });

  const mockCustomers = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      phone: "0912345678",
      email: "nguyenvana@example.com",
      cccd: "001234567890",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    {
      id: "2",
      name: "Trần Thị B",
      phone: "0987654321",
      email: "tranthib@example.com",
      cccd: "009876543210",
      address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    },
    {
      id: "3",
      name: "Lê Văn C",
      phone: "0901234567",
      email: "levanc@example.com",
      cccd: "001122334455",
      address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      phone: "0976543210",
      email: "phamthid@example.com",
      cccd: "005544332211",
      address: "321 Võ Văn Ngân, Thủ Đức, TP.HCM",
    },
  ];

  // Loại bỏ khai báo kiểu TypeScript: { [key: string]: any }
  const mockPets = {
    "1": [
      { id: "1", name: "Mèo Miu", species: "Mèo", breed: "Ba Tư", gender: "Cái", age: "2 tuổi" },
      { id: "2", name: "Chó Lucky", species: "Chó", breed: "Golden Retriever", gender: "Đực", age: "3 tuổi" },
    ],
    "2": [{ id: "3", name: "Chó Lulu", species: "Chó", breed: "Poodle", gender: "Cái", age: "1 tuổi" }],
    "3": [
      { id: "4", name: "Mèo Kitty", species: "Mèo", breed: "Anh lông ngắn", gender: "Cái", age: "4 tuổi" },
      { id: "5", name: "Chó Max", species: "Chó", breed: "Husky", gender: "Đực", age: "2 tuổi" },
      { id: "6", name: "Mèo Tom", species: "Mèo", breed: "Munchkin", gender: "Đực", age: "1 tuổi" },
    ],
    "4": [{ id: "7", name: "Chó Golden", species: "Chó", breed: "Golden Retriever", gender: "Đực", age: "5 tuổi" }],
  };

  const filteredCustomers = mockCustomers.filter((customer) => {
    const nameMatch = customer.name.toLowerCase().includes(searchQuery.name.toLowerCase());
    const phoneMatch = customer.phone.includes(searchQuery.phone);
    const cccdMatch = customer.cccd.includes(searchQuery.cccd);
    return nameMatch && phoneMatch && cccdMatch;
  });

  // Loại bỏ khai báo kiểu TypeScript: (customer: any)
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setStep("pet-list");
  };

  // Loại bỏ khai báo kiểu TypeScript: (petId: string)
  const handleSelectPet = (petId) => {
    setSelectedPet(petId);
  };

  const handleSubmit = () => {
  if (selectedCustomer && selectedPet) {
    const customerPets = mockPets[selectedCustomer.id];
    const selectedPetData = customerPets?.find((p) => p.id === selectedPet);

    // Hiển thị thêm ServiceType trong thông báo
    alert(
      `Hồ sơ ${serviceType.toLowerCase()} đã được tạo thành công!\n` +
      `Khách hàng: ${selectedCustomer.name}\n` +
      `Thú cưng: ${selectedPetData?.name}`
    );
    
    // Reset về trạng thái ban đầu
    setStep("customer-list");
    setSelectedCustomer(null);
    setSelectedPet(null);
    setServiceType("khám bệnh"); // Reset dịch vụ
    setSearchQuery({ name: "", phone: "", cccd: "" });
  }
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
            {/* Bỏ CardHeader cũ, gộp tất cả nội dung vào CardContent */}
            <CardContent className="space-y-6 pt-6">
              
              {/* Vùng màu xanh chứa cả Tiêu đề và Ô nhập liệu */}
              <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                
                {/* Tiêu đề được đưa vào trong vùng xanh */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-blue-700">Tìm kiếm khách hàng theo bộ lọc</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => setSearchQuery({ name: "", phone: "", cccd: "" })}
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
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kết quả tìm kiếm (Phần danh sách khách hàng giữ nguyên bên dưới) */}
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="font-semibold text-gray-700">
                    Kết quả: <span className="text-blue-600">{filteredCustomers.length}</span> khách hàng
                  </span>
                </div>

                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>Không tìm thấy khách hàng phù hợp</p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-[500px] overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <Card
                        key={customer.id}
                        className="cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-semibold text-lg">{customer.name}</h4>
                              <div className="text-sm text-gray-600 space-y-0.5">
                                <div>
                                  <span className="font-medium">SĐT:</span> {customer.phone}
                                </div>
                                <div>
                                  <span className="font-medium">Email:</span> {customer.email}
                                </div>
                                <div>
                                  <span className="font-medium">CCCD:</span> {customer.cccd}
                                </div>
                                <div>
                                  <span className="font-medium">Địa chỉ:</span> {customer.address}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {/* Loại bỏ khai báo kiểu TypeScript: as keyof typeof mockPets */}
                              {mockPets[customer.id]?.length || 0} thú cưng
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
                      <span className="font-semibold">Khách hàng:</span> {selectedCustomer.name}
                    </div>
                    <div>
                      <span className="font-semibold">Số điện thoại:</span> {selectedCustomer.phone}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {selectedCustomer.email}
                    </div>
                    <div>
                      <span className="font-semibold">CCCD:</span> {selectedCustomer.cccd}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pet Selection */}
              <div className="space-y-3">
                <Label>Chọn thú cưng *</Label>
                <div className="grid gap-3">
                  {/* Loại bỏ khai báo kiểu TypeScript: as keyof typeof mockPets */}
                  {mockPets[selectedCustomer.id]?.map((pet) => (
                    <Card
                      key={pet.id}
                      className={`cursor-pointer transition-all ${
                        selectedPet === pet.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                      }`}
                      onClick={() => handleSelectPet(pet.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            selectedPet === pet.id ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          <PawPrint className={`h-6 w-6 ${selectedPet === pet.id ? "text-white" : "text-gray-500"}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{pet.name}</h4>
                          <div className="text-sm text-gray-600">
                            {pet.species} - {pet.breed} - {pet.gender} - {pet.age}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-3 mb-6">
                <Label className="text-blue-900 font-semibold">Loại dịch vụ thực hiện *</Label>
                <div className="flex gap-4">
                  <div 
                    onClick={() => setServiceType("Khám bệnh")}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      serviceType === "Khám bệnh" 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${serviceType === "Khám bệnh" ? "border-blue-600" : "border-gray-300"}`}>
                      {serviceType === "Khám bệnh" && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm font-medium">Khám bệnh</span>
                  </div>

                  <div 
                    onClick={() => setServiceType("Tiêm phòng")}
                    className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      serviceType === "Tiêm phòng" 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${serviceType === "Tiêm phòng" ? "border-blue-600" : "border-gray-300"}`}>
                      {serviceType === "Tiêm phòng" && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm font-medium">Tiêm phòng</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-6">
                {/* Nút quay lại nằm bên trái, kiểu dáng nhẹ nhàng hơn */}
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:bg-gray-100 px-6"
                  onClick={() => {
                    setStep("customer-list");
                    setSelectedCustomer(null);
                    setSelectedPet(null);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại bước trước
                </Button>

                {/* Nút chính nằm bên phải, nổi bật với màu xanh và bóng đổ */}
                <Button 
                  onClick={handleSubmit} 
                  disabled={!selectedPet} 
                  className={`gap-2 px-4 py-2 text-xs font-semibold transition-all ${
                    !selectedPet 
                      ? "bg-gray-200 text-gray-400" 
                      : "bg-blue-700 hover:bg-blue-700 text-white hover:shadow-blue-200"
                  }`}
                >
                  <Save className="h-3 w-3" />
                  TẠO HỒ SƠ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}