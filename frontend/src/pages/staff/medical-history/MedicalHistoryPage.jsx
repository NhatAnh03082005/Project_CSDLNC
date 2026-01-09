import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
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
  PawPrint,
  User,
  Phone,
  Calendar,
  Stethoscope,
  Loader2,
  AlertCircle,
  MapPin,
  ChevronRight,
  X,
} from "lucide-react";

export default function MedicalHistoryPage() {
  const [step, setStep] = useState("customer-list"); // customer-list, pet-select, history
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [branches, setBranches] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Load tất cả khách hàng và chi nhánh khi mở trang
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch customers
      const customersRes = await api.get("/employees/customers", {
        params: { limit: 1000 },
      });
      if (customersRes.data.success) {
        // Backend returns: {success, status, data: {customers: [...], pagination: {...}}}
        const customersList = customersRes.data.data?.customers || [];
        setCustomers(Array.isArray(customersList) ? customersList : []);
      } else {
        console.error("Failed to fetch customers:", customersRes.data.message);
      }

      // Fetch branches for filter
      const branchesRes = await api.get("/branches", {
        params: { limit: 100 },
      });
      if (branchesRes.data.success) {
        // Backend returns: {success, status, data: {branches: [...]}}
        const branchesList = branchesRes.data.data?.branches || [];
        setBranches(Array.isArray(branchesList) ? branchesList : []);
      } else {
        console.error("Failed to fetch branches:", branchesRes.data.message);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.response?.data?.message || "Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm khách hàng
  const handleSearchCustomer = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/employees/customers", {
        params: {
          search: searchQuery,
          limit: 50,
        },
      });
      if (response.data.success) {
        setCustomers(response.data.data.customers || []);
        if (response.data.data.customers.length === 0) {
          setError("Không tìm thấy khách hàng nào");
        }
      } else {
        setError(response.data.message || "Lỗi khi tìm kiếm");
      }
    } catch (err) {
      console.error("Error searching customers:", err);
      setError(err.response?.data?.message || "Lỗi khi tìm kiếm khách hàng");
    } finally {
      setLoading(false);
    }
  };

  // Chọn khách hàng -> lấy danh sách thú cưng
  const handleSelectCustomer = async (customer) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/employees/customers/${customer.maKhachHang}/pets`
      );
      if (response.data.success) {
        // Backend returns: {success, status, data: {customer: {...}, pets: [...], count}}
        const petsList = response.data.data?.pets || [];
        setPets(Array.isArray(petsList) ? petsList : []);
        setSelectedCustomer(customer);
        setStep("pet-select");
      } else {
        setError(response.data.message || "Không thể lấy danh sách thú cưng");
      }
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(err.response?.data?.message || "Lỗi khi lấy danh sách thú cưng");
    } finally {
      setLoading(false);
    }
  };

  // Chọn thú cưng -> lấy lịch sử khám bệnh
  const handleSelectPet = async (pet) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/pets/staff/${selectedCustomer.maKhachHang}/${pet.maThuCung}/medical-history`
      );
      if (response.data.success) {
        setMedicalRecords(response.data.data || []);
        setSelectedPet(pet);
        setStep("history");
      } else {
        setError(response.data.message || "Không thể lấy lịch sử khám bệnh");
      }
    } catch (err) {
      console.error("Error fetching medical history:", err);
      setError(err.response?.data?.message || "Lỗi khi lấy lịch sử khám bệnh");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleBack = () => {
    if (step === "pet-select") {
      setStep("customer-list");
      setSelectedCustomer(null);
      setPets([]);
    } else if (step === "history") {
      setStep("pet-select");
      setMedicalRecords([]);
      setSelectedPet(null);
    }
  };

  // Filter customers based on search, branch, and date
  const filteredCustomers = customers.filter((customer) => {
    const matchSearch =
      !searchQuery ||
      (customer.hoTen &&
        customer.hoTen.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.sdt && customer.sdt.includes(searchQuery));

    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/staff/demo">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch sử khám bệnh thú cưng
            </h1>
            <p className="text-gray-600 mt-1">
              Tra cứu lịch sử khám bệnh của thú cưng
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6 flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Customer List */}
        {step === "customer-list" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Bộ lọc và tìm kiếm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm theo tên khách hàng hoặc SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Clear filters button */}
                {(searchQuery || selectedBranch || selectedDate) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedBranch("");
                      setSelectedDate("");
                      loadInitialData();
                    }}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Customers List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>
                  {filteredCustomers.length} khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-gray-600">Đang tải danh sách...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={`customer-${customer.maKhachHang}`}
                        onClick={() => handleSelectCustomer(customer)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {customer.hoTen}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {customer.sdt}
                                </span>
                                {customer.diemLoyalty && (
                                  <span className="flex items-center gap-1">
                                    <Badge className="text-xs">
                                      {customer.capHoiVien}
                                    </Badge>
                                  </span>
                                )}
                                {customer.soLuongThuCung && (
                                  <span className="flex items-center gap-1">
                                    <PawPrint className="h-3 w-3" />
                                    {customer.soLuongThuCung} thú cưng
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Không có khách hàng nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Select Pet */}
        {step === "pet-select" && selectedCustomer && (
          <div className="space-y-4">
            {/* Back button and header */}
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedCustomer.hoTen}
                </h2>
                <p className="text-sm text-gray-500">{selectedCustomer.sdt}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách thú cưng</CardTitle>
                <CardDescription>
                  Chọn thú cưng để xem lịch sử khám bệnh
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-gray-600">
                      Đang tải danh sách thú cưng...
                    </p>
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center py-12">
                    <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Khách hàng không có thú cưng nào
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pets.map((pet) => (
                      <div
                        key={`pet-${pet.maThuCung}`}
                        onClick={() => handleSelectPet(pet)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                              <PawPrint className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {pet.tenThuCung}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                <span>{pet.giong}</span>
                                <span>•</span>
                                <span>{pet.loai}</span>
                                <span>•</span>
                                <span>{pet.gioiTinh}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Medical History */}
        {step === "history" && selectedPet && (
          <div className="space-y-4">
            {/* Back button and header */}
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedPet.tenThuCung}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedCustomer.hoTen} • {selectedPet.giong}
                </p>
              </div>
            </div>

            {/* Medical Records List */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử khám bệnh</CardTitle>
                <CardDescription>
                  Các cuộc khám bệnh của {selectedPet.tenThuCung}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-gray-600">Đang tải lịch sử...</p>
                  </div>
                ) : medicalRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-lg">
                      Không có lịch sử khám bệnh
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {medicalRecords.map((record, index) => (
                      <div
                        key={`record-${record.maHoaDon}-${record.stt}-${index}`}
                        onClick={() => handleViewDetail(record)}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                                <Stethoscope className="h-4 w-4 text-green-600" />
                              </div>
                              <h3 className="font-semibold text-gray-900">
                                Lần khám #{record.stt}
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3 ml-11 text-sm">
                              <div>
                                <p className="text-gray-500">Ngày khám</p>
                                <p className="font-medium text-gray-900 flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {record.ngayKham}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Bác sĩ</p>
                                <p className="font-medium text-gray-900">
                                  {record.bacSi || "N/A"}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-500">Chi nhánh</p>
                                <p className="font-medium text-gray-900 flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  {record.chiNhanh || "N/A"}
                                </p>
                              </div>
                            </div>
                            {record.trieuChung && (
                              <div className="mt-3 ml-11 p-2 bg-yellow-50 rounded border border-yellow-200">
                                <p className="text-xs font-medium text-yellow-700">
                                  Triệu chứng: {record.trieuChung}
                                </p>
                              </div>
                            )}
                            {record.chanDoan && (
                              <div className="mt-2 ml-11 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs font-medium text-blue-700">
                                  Chẩn đoán: {record.chanDoan}
                                </p>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết khám bệnh</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khám
                  </label>
                  <p className="text-gray-900">{selectedRecord.ngayKham}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bác sĩ
                  </label>
                  <p className="text-gray-900">{selectedRecord.bacSi}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Triệu chứng
                </label>
                <p className="text-gray-900">
                  {selectedRecord.trieuChung || "Không có"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chẩn đoán
                </label>
                <p className="text-gray-900">
                  {selectedRecord.chanDoan || "Không có"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn thuốc
                </label>
                <p className="text-gray-900">
                  {selectedRecord.donThuoc || "Không có"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <p className="text-gray-900">
                  {selectedRecord.ghiChu || "Không có"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
