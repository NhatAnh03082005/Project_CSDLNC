import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft, Save, Search, FilePlus, PawPrint } from "lucide-react";

// Xóa bỏ "use client"

export default function CreateRecordPage() {
  // Loại bỏ khai báo kiểu TypeScript: <"customer-list" | "pet-list">
  const [step, setStep] = useState("customer-list");
  // Loại bỏ khai báo kiểu TypeScript: <any> và <string | null>
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  
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
      // Loại bỏ khai báo kiểu TypeScript: as keyof typeof mockPets
      const customerPets = mockPets[selectedCustomer.id];
      const selectedPetData = customerPets?.find((p) => p.id === selectedPet);

      alert(
        `Hồ sơ đã được tạo thành công!\nKhách hàng: ${selectedCustomer.name}\nThú cưng: ${selectedPetData?.name}`,
      );
      
      // Reset
      setStep("customer-list");
      setSelectedCustomer(null);
      setSelectedPet(null);
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
            {step === "customer-list" ? "Tìm kiếm và chọn khách hàng" : "Chọn thú cưng để tạo hồ sơ"}
          </p>
        </div>

        {/* Step 1: Customer List with Search */}
        {step === "customer-list" && (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách khách hàng</CardTitle>
              <CardDescription>Tìm kiếm và chọn khách hàng để tạo hồ sơ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Filters */}
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="search-name">Tên khách hàng</Label>
                  <Input
                    id="search-name"
                    placeholder="Nhập tên..."
                    value={searchQuery.name}
                    onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-phone">Số điện thoại</Label>
                  <Input
                    id="search-phone"
                    placeholder="Nhập SĐT..."
                    value={searchQuery.phone}
                    onChange={(e) => setSearchQuery({ ...searchQuery, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-cccd">CCCD</Label>
                  <Input
                    id="search-cccd"
                    placeholder="Nhập CCCD..."
                    value={searchQuery.cccd}
                    onChange={(e) => setSearchQuery({ ...searchQuery, cccd: e.target.value })}
                  />
                </div>
              </div>

              {/* Customer List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Chọn khách hàng ({filteredCustomers.length} khách hàng)</Label>
                  <Button variant="ghost" size="sm" onClick={() => setSearchQuery({ name: "", phone: "", cccd: "" })}>
                    Xóa bộ lọc
                  </Button>
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

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSubmit} disabled={!selectedPet} className="gap-2">
                  <Save className="h-4 w-4" />
                  Tạo hồ sơ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("customer-list");
                    setSelectedCustomer(null);
                    setSelectedPet(null);
                  }}
                >
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}