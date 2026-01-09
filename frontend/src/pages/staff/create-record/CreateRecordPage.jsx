import React, { useState, useEffect } from "react";
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
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  ArrowLeft,
  Save,
  Search,
  FilePlus,
  PawPrint,
  User,
  Phone,
  CreditCard,
  X,
  AlertCircle,
  Loader2,
  Check,
  Plus,
  Mail,
  ChevronRight,
} from "lucide-react";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";
import { employeeAPI } from "../../../api/services";
import { toast } from "../../../lib/toast";

export default function CreateRecordPage() {
  const [step, setStep] = useState("customer-list");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedServices, setSelectedServices] = useState(["Khám bệnh"]);
  const [selectedPetsWithServices, setSelectedPetsWithServices] = useState([]);

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
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAllCustomers();
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

  const loadAllCustomers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      setIsSearchMode(false);

      const response = await api.get("/employees/customers", {
        params: { page, limit: 20 },
      });

      if (response.data.success) {
        setCustomers(response.data.data.customers || []);
        setPagination({
          page: response.data.data.pagination.page,
          totalPages: response.data.data.pagination.totalPages,
          total: response.data.data.pagination.total,
        });
      } else {
        setError(response.data.message || "Không thể tải danh sách khách hàng");
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error loading customers:", err);
      setError(
        err.response?.data?.message || "Lỗi khi tải danh sách khách hàng"
      );
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.phone.trim() && !searchQuery.cccd.trim()) {
      toast.error("Vui lòng nhập số điện thoại hoặc CCCD để tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsSearchMode(true);

      const params = {};
      if (searchQuery.phone.trim()) params.phone = searchQuery.phone.trim();
      if (searchQuery.cccd.trim()) params.cccd = searchQuery.cccd.trim();

      const response = await api.get("/employees/customers/search", { params });

      if (response.data.success) {
        setCustomers(response.data.data || []);
        setPagination({
          page: 1,
          totalPages: 1,
          total: response.data.count || 0,
        });
      } else {
        setError(response.data.message || "Không thể tìm kiếm khách hàng");
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error searching customers:", err);
      setError(err.response?.data?.message || "Lỗi khi tìm kiếm khách hàng");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setStep("pet-list");

    try {
      setPetsLoading(true);
      setError(null);

      const response = await api.get(
        `/employees/customers/${customer.maKhachHang}/pets`
      );

      if (response.data.success) {
        setPets(response.data.data.pets || []);
      } else {
        setError(response.data.message || "Không thể lấy danh sách thú cưng");
        setPets([]);
      }
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(err.response?.data?.message || "Lỗi khi lấy danh sách thú cưng");
      setPets([]);
    } finally {
      setPetsLoading(false);
    }
  };

  const handleSelectPet = (petId) => {
    setSelectedPet(petId);
    setSelectedServices(["Khám bệnh"]);
  };

  const handleClearSearch = () => {
    setSearchQuery({ name: "", phone: "", cccd: "" });
    setError(null);
    loadAllCustomers();
  };

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== service);
      }
      return [...prev, service];
    });
  };

  const handleAddPetWithServices = () => {
    if (!selectedPet || selectedServices.length === 0) {
      setError("Vui lòng chọn thú cưng và ít nhất 1 dịch vụ");
      return;
    }

    const petData = pets.find((p) => p.maThuCung === selectedPet);
    if (!petData) {
      setError("Không tìm thấy thông tin thú cưng");
      return;
    }

    const existingIndex = selectedPetsWithServices.findIndex(
      (item) => item.maThuCung === selectedPet
    );

    if (existingIndex >= 0) {
      const updated = [...selectedPetsWithServices];
      updated[existingIndex] = {
        ...updated[existingIndex],
        services: [...selectedServices],
      };
      setSelectedPetsWithServices(updated);
    } else {
      setSelectedPetsWithServices((prev) => [
        ...prev,
        {
          maThuCung: selectedPet,
          tenThuCung: petData.tenThuCung,
          loai: petData.loai,
          giong: petData.giong,
          services: [...selectedServices],
        },
      ]);
    }

    setSelectedPet(null);
    setSelectedServices(["Khám bệnh"]);
    setError(null);
  };

  const handleRemovePet = (maThuCung) => {
    setSelectedPetsWithServices((prev) =>
      prev.filter((item) => item.maThuCung !== maThuCung)
    );
  };

  const handleEditPetServices = (maThuCung) => {
    const petData = selectedPetsWithServices.find(
      (item) => item.maThuCung === maThuCung
    );
    if (petData) {
      setSelectedPet(maThuCung);
      setSelectedServices([...petData.services]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || selectedPetsWithServices.length === 0) {
      setError("Vui lòng chọn ít nhất 1 thú cưng với dịch vụ");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const petsData = selectedPetsWithServices.map((item) => ({
        MaThuCung: item.maThuCung,
        services: item.services,
      }));

      const recordData = {
        MaKhachHang: selectedCustomer.maKhachHang,
        pets: petsData,
      };

      const response = await api.post("/employees/records", recordData);

      if (response.data.success) {
        toast.success(
          `Tạo hồ sơ thành công! KH: ${selectedCustomer.hoTen}. Mã HĐ: ${
            response.data.data?.maHoaDon || "N/A"
          }`
        );

        setStep("customer-list");
        setSelectedCustomer(null);
        setSelectedPet(null);
        setSelectedServices(["Khám bệnh"]);
        setSelectedPetsWithServices([]);
        setSearchQuery({ name: "", phone: "", cccd: "" });
        setPets([]);
        loadAllCustomers();
      } else {
        setError(response.data.message || "Không thể tạo hồ sơ");
      }
    } catch (err) {
      console.error("Error creating record:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Lỗi khi tạo hồ sơ. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const vipBadgeClass = (capHoiVien) => {
    if (capHoiVien === "VIP")
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (capHoiVien === "Thân thiết")
      return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
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
            {/* Page title */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
                <FilePlus className="h-8 w-8 text-blue-600" />
                Tạo hồ sơ khám & tiêm
              </h1>
              <p className="text-gray-600 mt-1">
                {step === "customer-list"
                  ? "Bước 1: Tìm khách hàng để tạo hồ sơ"
                  : "Bước 2: Chọn thú cưng và dịch vụ"}
              </p>

              {/* Step pills */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border ${
                    step === "customer-list"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  1. Khách hàng
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold border ${
                    step === "pet-list"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  2. Thú cưng & dịch vụ
                </span>
              </div>
            </div>

            {/* Global error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* STEP 1 */}
            {step === "customer-list" && (
              <>
                <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                  <CardHeader className="bg-white px-8 pt-8 pb-0 border-b border-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                          <span className="bg-blue-600 w-2 h-6 rounded-full block" />
                          Chọn khách hàng
                        </CardTitle>
                        <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                          {isSearchMode ? customers.length : pagination.total}{" "}
                          khách hàng
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex gap-4 items-end">
                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                          <Input
                            className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-lg transition-all h-10 text-sm placeholder:text-gray-500"
                            placeholder="Số điện thoại"
                            value={searchQuery.phone}
                            onChange={(e) =>
                              setSearchQuery({
                                ...searchQuery,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                          <Input
                            className="pl-10 border-gray-300 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-lg transition-all h-10 text-sm placeholder:text-gray-500"
                            placeholder="CCCD"
                            value={searchQuery.cccd}
                            onChange={(e) =>
                              setSearchQuery({
                                ...searchQuery,
                                cccd: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSearch}
                        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Tìm kiếm
                      </Button>
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
                    ) : customers.length > 0 ? (
                      <div className="space-y-2 h-full overflow-y-auto p-4">
                        {customers.map((customer) => (
                          <div
                            key={customer.maKhachHang}
                            onClick={() => handleSelectCustomer(customer)}
                            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-xl" />

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
                                      {customer.sdt || "N/A"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <CreditCard className="h-3 w-3" />
                                      {customer.cccd || "N/A"}
                                    </span>
                                    {customer.soLuongThuCung ? (
                                      <span className="flex items-center gap-1">
                                        <PawPrint className="h-3 w-3" />
                                        {customer.soLuongThuCung} thú cưng
                                      </span>
                                    ) : null}
                                    {customer.capHoiVien && (
                                      <Badge
                                        variant="outline"
                                        className={`${vipBadgeClass(
                                          customer.capHoiVien
                                        )} text-[10px] px-2 py-0`}
                                      >
                                        {customer.capHoiVien}
                                      </Badge>
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
                {(searchQuery.phone || searchQuery.cccd) && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 rounded-xl transition-all"
                      onClick={handleClearSearch}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* STEP 2 */}
            {step === "pet-list" && selectedCustomer && (
              <Card className="border-0 shadow-lg shadow-gray-300 bg-white rounded-3xl overflow-hidden ring-1 ring-gray-100">
                <CardHeader className="bg-white px-8 pt-8 pb-0 border-b border-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <span className="bg-blue-600 w-2 h-6 rounded-full block" />
                        Chọn thú cưng & dịch vụ
                      </CardTitle>
                      <CardDescription className="pl-4 mt-1 text-base text-gray-500 font-medium">
                        Chọn thú cưng, chọn dịch vụ, thêm vào danh sách rồi tạo
                        hồ sơ
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 bg-gray-50/50">
                  <div className="p-4 space-y-6">
                    {/* Customer info (premium card) */}
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Khách hàng
                          </p>
                          <p className="font-bold text-gray-900 mt-1">
                            {selectedCustomer.hoTen}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            Mã KH:{" "}
                            <span className="font-semibold">
                              {selectedCustomer.maKhachHang}
                            </span>
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Email liên hệ
                          </p>
                          <p className="inline-flex items-center gap-1 text-gray-900 font-semibold mt-1">
                            <Mail className="h-3 w-3" />
                            {selectedCustomer.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-blue-200 px-3 py-1 font-semibold text-blue-700">
                          <Phone className="h-3 w-3" />
                          {selectedCustomer.sdt || "N/A"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-blue-200 px-3 py-1 font-semibold text-blue-700">
                          <CreditCard className="h-3 w-3" />
                          {selectedCustomer.cccd || "N/A"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-blue-200 px-3 py-1 font-semibold text-blue-700">
                          <PawPrint className="h-3 w-3" />
                          {selectedCustomer.soLuongThuCung || 0} thú cưng
                        </span>
                      </div>
                    </div>

                    {/* Selected pets */}
                    {selectedPetsWithServices.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold text-emerald-700 uppercase tracking-wider ml-1">
                            Danh sách thú cưng đã chọn (
                            {selectedPetsWithServices.length})
                          </Label>
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                            Sẵn sàng tạo hồ sơ
                          </Badge>
                        </div>

                        <div className="grid gap-2">
                          {selectedPetsWithServices.map((item) => (
                            <div
                              key={item.maThuCung}
                              className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-emerald-600" />
                                    <p className="font-black text-gray-900 truncate">
                                      {item.tenThuCung}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                                    >
                                      {item.loai} • {item.giong}
                                    </Badge>
                                  </div>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.services.map((s, idx) => (
                                      <Badge
                                        key={idx}
                                        className="bg-blue-600 text-white font-bold"
                                      >
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-semibold"
                                    onClick={() =>
                                      handleEditPetServices(item.maThuCung)
                                    }
                                  >
                                    Sửa
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                    onClick={() =>
                                      handleRemovePet(item.maThuCung)
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pets list */}
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Chọn thú cưng
                      </Label>

                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {petsLoading ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                            <p className="text-gray-600">
                              Đang tải danh sách thú cưng...
                            </p>
                          </div>
                        ) : pets.length === 0 ? (
                          <div className="text-center py-16 text-gray-500">
                            <PawPrint className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-semibold">
                              Khách hàng chưa có thú cưng
                            </p>
                            <p className="text-sm mt-1">
                              Hãy tạo thú cưng trước khi tạo hồ sơ
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-[360px] overflow-y-auto p-4 space-y-2">
                            {pets.map((pet) => {
                              const isAlreadySelected =
                                selectedPetsWithServices.some(
                                  (it) => it.maThuCung === pet.maThuCung
                                );
                              const isCurrentlySelected =
                                selectedPet === pet.maThuCung;

                              return (
                                <div
                                  key={`${pet.maKhachHang}-${pet.maThuCung}`}
                                  onClick={() =>
                                    !isAlreadySelected &&
                                    handleSelectPet(pet.maThuCung)
                                  }
                                  className={`rounded-lg p-4 border shadow-sm transition-all duration-300 relative overflow-hidden group ${
                                    isCurrentlySelected
                                      ? "bg-blue-50 border-blue-400 shadow-xl shadow-blue-500/10"
                                      : isAlreadySelected
                                      ? "bg-emerald-50/40 border-emerald-200 opacity-70"
                                      : "bg-white border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5 cursor-pointer"
                                  }`}
                                >
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl transition-opacity duration-300 ${
                                      isCurrentlySelected
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                    }`}
                                  />

                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        isAlreadySelected
                                          ? "bg-emerald-600"
                                          : isCurrentlySelected
                                          ? "bg-blue-600"
                                          : "bg-gray-100"
                                      }`}
                                    >
                                      {isAlreadySelected ? (
                                        <Check className="h-6 w-6 text-white" />
                                      ) : (
                                        <PawPrint
                                          className={`h-6 w-6 ${
                                            isCurrentlySelected
                                              ? "text-white"
                                              : "text-gray-500"
                                          }`}
                                        />
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="font-black text-gray-900 truncate">
                                        {pet.tenThuCung}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {pet.loai || "N/A"} •{" "}
                                        {pet.giong || "N/A"} •{" "}
                                        {pet.gioiTinh || "N/A"}
                                        {pet.ngaySinh
                                          ? ` • Sinh: ${new Date(
                                              pet.ngaySinh
                                            ).toLocaleDateString("vi-VN")}`
                                          : ""}
                                      </p>
                                      {pet.tinhTrangSucKhoe && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Tình trạng: {pet.tinhTrangSucKhoe}
                                        </p>
                                      )}
                                      {isAlreadySelected && (
                                        <p className="text-xs text-emerald-700 mt-2 font-bold">
                                          ✓ Đã thêm vào danh sách
                                        </p>
                                      )}
                                    </div>

                                    <div className="flex-shrink-0">
                                      {isCurrentlySelected && (
                                        <Badge className="bg-blue-600 text-white font-bold">
                                          Đang chọn
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service picker */}
                    {selectedPet && (
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                          Dịch vụ cho{" "}
                          <span className="text-blue-700 font-black">
                            {pets.find((p) => p.maThuCung === selectedPet)
                              ?.tenThuCung || "thú cưng"}
                          </span>
                        </Label>

                        <div className="grid md:grid-cols-2 gap-3">
                          {/* Khám bệnh */}
                          <div
                            onClick={() => toggleService("Khám bệnh")}
                            className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                              selectedServices.includes("Khám bệnh")
                                ? "bg-blue-50 border-blue-300 shadow-sm"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedServices.includes("Khám bệnh")
                                    ? "border-blue-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedServices.includes("Khám bệnh") && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                )}
                              </div>

                              <div className="flex-1">
                                <p className="font-black text-gray-900">
                                  Khám bệnh
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Tạo hồ sơ khám và chờ bác sĩ cập nhật
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Tiêm phòng */}
                          <div
                            onClick={() => toggleService("Tiêm phòng")}
                            className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                              selectedServices.includes("Tiêm phòng")
                                ? "bg-blue-50 border-blue-300 shadow-sm"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                  selectedServices.includes("Tiêm phòng")
                                    ? "border-blue-600"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedServices.includes("Tiêm phòng") && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                )}
                              </div>

                              <div className="flex-1">
                                <p className="font-black text-gray-900">
                                  Tiêm phòng
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Tạo hồ sơ tiêm và chờ chọn vaccine
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleAddPetWithServices}
                          disabled={selectedServices.length === 0}
                          className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md shadow-emerald-100"
                        >
                          <Plus className="h-4 w-4" />
                          {selectedPetsWithServices.some(
                            (it) => it.maThuCung === selectedPet
                          )
                            ? "Cập nhật dịch vụ cho thú cưng này"
                            : "Thêm thú cưng này vào danh sách"}
                        </Button>

                        {selectedServices.length === 2 && (
                          <p className="text-xs text-emerald-700 font-bold">
                            ✓ Đã chọn cả 2 dịch vụ
                          </p>
                        )}
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <Button
                        variant="outline"
                        className="h-11 rounded-xl border-green-600 text-green-700 hover:bg-green-700 hover:text-white hover:border-green-700 transition-all font-bold gap-2"
                        onClick={() => {
                          setStep("customer-list");
                          setSelectedCustomer(null);
                          setSelectedPet(null);
                          setSelectedServices(["Khám bệnh"]);
                          setSelectedPetsWithServices([]);
                          setPets([]);
                          setError(null);
                        }}
                        disabled={submitting}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại bước trước
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        disabled={
                          selectedPetsWithServices.length === 0 || submitting
                        }
                        className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md shadow-blue-100 gap-2 transition-all active:scale-95"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Tạo hồ sơ ({selectedPetsWithServices.length})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
