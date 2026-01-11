import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Sparkles,
  ChevronRight,
  X,
  Pill,
  Pencil,
} from "lucide-react";

export default function MedicalHistoryPage() {
  const [step, setStep] = useState("customer-list"); // customer-list, pet-select, history
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const CUSTOMERS_PER_PAGE = 1000;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [branches, setBranches] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Medical history filter states
  const [medicalSearchQuery, setMedicalSearchQuery] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  // Load tất cả khách hàng và chi nhánh khi mở trang
  useEffect(() => {
    loadInitialData();
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

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      // Fetch customers
      const customersRes = await api.get("/employees/customers", {
        params: { page: 1, limit: CUSTOMERS_PER_PAGE },
      });
      if (customersRes.data.success) {
        const customersList = customersRes.data.data?.customers || [];
        const pagination = customersRes.data.data?.pagination || {};
        setCustomers(Array.isArray(customersList) ? customersList : []);
        setTotalCustomers(pagination.total || customersList.length);
        setHasMore(pagination.hasNext || false);
      } else {
        console.error("Failed to fetch customers:", customersRes.data.message);
      }

      // Fetch branches for filter
      const branchesRes = await api.get("/branches", {
        params: { limit: 100 },
      });
      if (branchesRes.data.success) {
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

  // Load more customers
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await api.get("/employees/customers", {
        params: { page: nextPage, limit: CUSTOMERS_PER_PAGE },
      });
      if (response.data.success) {
        const newCustomers = response.data.data?.customers || [];
        const pagination = response.data.data?.pagination || {};
        setCustomers((prev) => [...prev, ...newCustomers]);
        setCurrentPage(nextPage);
        setHasMore(pagination.hasNext || false);
      }
    } catch (err) {
      console.error("Error loading more customers:", err);
    } finally {
      setLoadingMore(false);
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

  // Filter medical records
  const filteredMedicalRecords = medicalRecords.filter((record) => {
    const matchSearch =
      !medicalSearchQuery ||
      (record.maHoaDon &&
        record.maHoaDon
          .toLowerCase()
          .includes(medicalSearchQuery.toLowerCase()));

    const matchBranch =
      !selectedBranchFilter ||
      (record.chiNhanh &&
        record.chiNhanh
          .toLowerCase()
          .includes(selectedBranchFilter.toLowerCase()));

    const matchDoctor =
      !selectedDoctorFilter ||
      (record.bacSi &&
        record.bacSi
          .toLowerCase()
          .includes(selectedDoctorFilter.toLowerCase()));

    const matchDate =
      !selectedDateFilter ||
      (record.ngayKham && record.ngayKham.includes(selectedDateFilter));

    return matchSearch && matchBranch && matchDoctor && matchDate;
  });

  // Extract unique doctors and branches from medical records
  const uniqueDoctors = [
    ...new Set(medicalRecords.map((r) => r.bacSi).filter(Boolean)),
  ];
  const uniqueBranches = [
    ...new Set(medicalRecords.map((r) => r.chiNhanh).filter(Boolean)),
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600">
                Lịch sử khám bệnh thú cưng
              </h1>
              <p className="text-gray-600 mt-1">
                Tra cứu lịch sử khám bệnh của thú cưng
              </p>
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
                {/* Customers List */}
                <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                  <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                          <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
                          Danh sách khách hàng
                        </CardTitle>
                        <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                          {totalCustomers} khách hàng
                        </CardDescription>
                      </div>
                      {/* Search input */}
                      <div className="relative w-full lg:w-[500px] group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <Input
                          value={searchQuery}
                          placeholder="Tìm theo tên khách hàng hoặc số điện thoại..."
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-xl transition-all h-11 text-sm placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 bg-gray-50/50 h-[300px] pb-5">
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
                      <div className="space-y-2 h-full overflow-y-auto p-4">
                        {filteredCustomers.map((customer) => (
                          <div
                            key={`customer-${customer.maKhachHang}`}
                            onClick={() => handleSelectCustomer(customer)}
                            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></div>

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
                                        <Sparkles className="h-3 w-3" />
                                        {customer.capHoiVien}
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
                        {/* Load More Button */}
                        {hasMore && !searchQuery && (
                          <div className="flex justify-center pt-4">
                            <Button
                              onClick={handleLoadMore}
                              disabled={loadingMore}
                              variant="outline"
                              className="border-blue-400 text-blue-600 hover:bg-blue-50"
                            >
                              {loadingMore ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Đang tải...
                                </>
                              ) : (
                                "Tải thêm"
                              )}
                            </Button>
                          </div>
                        )}
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
              <div className="space-y-6">
                <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                  <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                    <div className="flex items-center justify-start gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                          Danh sách thú cưng ({selectedCustomer.hoTen})
                        </CardTitle>
                        <CardDescription className="mt-1 text-base text-gray-500 font-medium">
                          {pets.length} thú cưng • Chọn thú cưng để xem lịch sử
                          khám bệnh
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 bg-gray-50/50 h-[300px] pb-5">
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
                      <div className="space-y-2 h-full overflow-y-auto p-4">
                        {pets.map((pet) => (
                          <div
                            key={`pet-${pet.maThuCung}`}
                            onClick={() => handleSelectPet(pet)}
                            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></div>

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
                                    <span>
                                      Giống: <strong>{pet.giong}</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      Loài: <strong>{pet.loai}</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      Giới tính: <strong>{pet.gioiTinh}</strong>
                                    </span>
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
              <div className="space-y-6">
                <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                  <CardHeader className="bg-white px-8 pb-0 border-b border-gray-50">
                    <div className="flex items-center justify-start gap-4 mb-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                          Lịch sử khám bệnh ({selectedPet.tenThuCung})
                        </CardTitle>
                        <CardDescription className="mt-1 text-base text-gray-500 font-medium">
                          Chủ: {selectedCustomer?.hoTen}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 rounded-full font-bold w-fit">
                        {filteredMedicalRecords.length} lần khám
                      </Badge>
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Search by Invoice */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <Input
                          placeholder="Tìm theo hóa đơn..."
                          value={medicalSearchQuery}
                          onChange={(e) =>
                            setMedicalSearchQuery(e.target.value)
                          }
                          className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-lg transition-all h-10 text-sm placeholder:text-gray-500"
                        />
                      </div>

                      {/* Filter by Branch */}
                      <select
                        value={selectedBranchFilter}
                        onChange={(e) =>
                          setSelectedBranchFilter(e.target.value)
                        }
                        className="px-3 h-10 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      >
                        <option value="">Tất cả chi nhánh</option>
                        {uniqueBranches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>

                      {/* Filter by Doctor */}
                      <select
                        value={selectedDoctorFilter}
                        onChange={(e) =>
                          setSelectedDoctorFilter(e.target.value)
                        }
                        className="px-3 h-10 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      >
                        <option value="">Tất cả bác sĩ</option>
                        {uniqueDoctors.map((doctor) => (
                          <option key={doctor} value={doctor}>
                            {doctor}
                          </option>
                        ))}
                      </select>

                      {/* Filter by Date */}
                      <Input
                        type="date"
                        value={selectedDateFilter}
                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-lg transition-all h-10 text-sm"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 bg-gray-50/50 h-[300px] pb-5">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                        <p className="text-gray-600">Đang tải lịch sử...</p>
                      </div>
                    ) : medicalRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">
                          Không có lịch sử khám bệnh
                        </p>
                      </div>
                    ) : filteredMedicalRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">
                          Không tìm thấy kết quả khớp với bộ lọc
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 h-full overflow-y-auto p-4">
                        {filteredMedicalRecords.map((record, index) => (
                          <div
                            key={`record-${record.maHoaDon}-${record.stt}-${index}`}
                            onClick={() => handleViewDetail(record)}
                            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl"></div>

                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                                  <Stethoscope className="h-6 w-6 text-blue-700" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900">
                                    {record.maHoaDon} - {record.stt}
                                  </p>

                                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(record.ngayKham)}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {record.bacSi || "N/A"}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {record.chiNhanh || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                {(medicalSearchQuery ||
                  selectedBranchFilter ||
                  selectedDoctorFilter ||
                  selectedDateFilter) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:text-white hover:bg-red-600"
                      onClick={() => {
                        setMedicalSearchQuery("");
                        setSelectedBranchFilter("");
                        setSelectedDoctorFilter("");
                        setSelectedDateFilter("");
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Xóa bộ lọc
                    </Button>
                  )}
              </div>
            )}
          </div>

          {/* Detail Dialog */}
          <Dialog open={showDetail} onOpenChange={setShowDetail}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="px-6 py-5 border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-xl font-bold text-blue-600">
                      Chi tiết khám bệnh
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-slate-500">
                      Thông tin chẩn đoán, đơn thuốc và ghi chú
                    </DialogDescription>
                  </div>
                </div>

                {selectedRecord && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      {formatDate(selectedRecord.ngayKham)}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                      <User className="h-3.5 w-3.5 text-emerald-600" />
                      {selectedRecord.bacSi || "N/A"}
                    </span>

                    {selectedRecord.chiNhanh && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-violet-600" />
                        {selectedRecord.chiNhanh}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="px-6 pb-5 max-h-[70vh] overflow-y-auto bg-white">
                {selectedRecord ? (
                  <div className="space-y-5">
                    {/* Symptoms */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                        <AlertCircle className="h-4 w-4" />
                        Triệu chứng
                      </div>
                      <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                        {selectedRecord.trieuChung || "Không có"}
                      </p>
                    </div>

                    {/* Diagnosis */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                        <Stethoscope className="h-4 w-4" />
                        Chẩn đoán
                      </div>
                      <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                        {selectedRecord.chanDoan || "Không có"}
                      </p>
                    </div>

                    {/* Prescription */}
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-green-800">
                          <Pill className="h-4 w-4" />
                          Đơn thuốc
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                        {selectedRecord.donThuoc || "Không có"}
                      </p>
                    </div>

                    {/* Notes */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Pencil className="h-4 w-4" />
                        Ghi chú
                      </div>
                      <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                        {selectedRecord.ghiChu || "Không có"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-500">
                    Không có dữ liệu để hiển thị
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
