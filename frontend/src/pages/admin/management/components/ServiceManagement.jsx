// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { branchAPI, serviceAPI } from "../../../../api/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/dialog";
// Import Icons
import {
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Syringe,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function ServiceManagement() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [servicesBranch, setServicesBranch] = useState([]);
  const [allServices, setAllServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] =
    useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // ✅ chỉ hiện dịch vụ CHƯA có trong chi nhánh
  const availableServices = useMemo(() => {
    const branchServiceIds = new Set(servicesBranch.map((s) => s.LoaiDichVu));
    return allServices.filter((s) => !branchServiceIds.has(s.LoaiDichVu));
  }, [servicesBranch, allServices]);

  // Fetch danh sách chi nhánh + dịch vụ khi mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [bRes, sRes] = await Promise.all([
          branchAPI.getAll(),
          serviceAPI.getAll(),
        ]);

        const branchesData = bRes.data?.data ?? bRes.data ?? [];
        const servicesData = sRes.data?.data ?? sRes.data ?? [];
        setBranches(branchesData);
        setAllServices(servicesData);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu ban đầu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch dịch vụ của chi nhánh khi chọn chi nhánh
  useEffect(() => {
    if (selectedBranch?.MaChiNhanh) {
      fetchServicesOfBranch(selectedBranch.MaChiNhanh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchServicesOfBranch = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getServicesStock(branchId);

      const list = res.data?.data ?? res.data ?? [];
      setServicesBranch(list);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải dịch vụ:", err);
      setError("Không thể tải dịch vụ");
      setServicesBranch([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setServicesBranch([]);
    setSelectedService("");
    setIsAddServiceDialogOpen(false);
    setError(null);
  };

  const handleAddServiceToBranch = async () => {
    if (!selectedBranch?.MaChiNhanh) return;

    if (!selectedService) {
      alert("Vui lòng chọn dịch vụ để thêm");
      return;
    }

    try {
      await branchAPI.addServiceToBranch(selectedBranch.MaChiNhanh, {
        LoaiDichVu: selectedService,
      });

      await fetchServicesOfBranch(selectedBranch.MaChiNhanh);
      // reset dialog
      setSelectedService("");
      setIsAddServiceDialogOpen(false);
      alert("Thêm dịch vụ thành công");
    } catch (err) {
      console.error("Lỗi khi thêm dịch vụ:", err);
      alert(err.response?.data?.message || "Không thể thêm dịch vụ");
    }
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setIsDeleteServiceDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!selectedBranch?.MaChiNhanh || !serviceToDelete) return;

    try {
      await branchAPI.deleteServiceFromBranch(
        selectedBranch.MaChiNhanh,
        serviceToDelete.LoaiDichVu
      );

      await fetchServicesOfBranch(selectedBranch.MaChiNhanh);
      setIsDeleteServiceDialogOpen(false);
      setServiceToDelete(null);
      alert("Xóa dịch vụ thành công");
    } catch (err) {
      console.error("Lỗi khi xóa dịch vụ:", err);
      alert(err.response?.data?.message || "Không thể xóa dịch vụ");
    }
  };

  // =========================
  // UI: Danh sách chi nhánh
  // =========================
  if (!selectedBranch) {
    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-teal-600 font-semibold text-xl">
            Danh sách chi nhánh
          </CardTitle>
          <CardDescription className="text-gray-600">
            Chọn chi nhánh để xem và quản lý dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <Button
                key={branch.MaChiNhanh}
                variant="outline"
                className="justify-start h-auto p-4 bg-transparent"
                onClick={() => setSelectedBranch(branch)}
              >
                <div className="text-left">
                  <div className="font-semibold text-teal-600">
                    {branch.TenChiNhanh}
                  </div>
                  <div className="text-sm text-gray-500">
                    {branch.ThanhPho} - Xem dịch vụ
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // =========================
  // UI: Trong 1 chi nhánh
  // =========================
  return (
    <>
      <Button
        variant="outline"
        className="bg-teal-100 text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
        onClick={handleBackToBranches}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách chi nhánh
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-teal-600 font-semibold text-xl">
                Dịch vụ tại {selectedBranch.TenChiNhanh}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Quản lý dịch vụ của chi nhánh
              </CardDescription>
            </div>

            <Dialog
              open={isAddServiceDialogOpen}
              onOpenChange={setIsAddServiceDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-teal-100 text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                  disabled={availableServices.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  Thêm dịch vụ
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-teal-600 font-semibold">
                    Thêm dịch vụ cho chi nhánh
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Chỉ hiển thị các dịch vụ chưa có trong chi nhánh
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceSelect">Chọn dịch vụ</Label>

                    {availableServices.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        Chi nhánh này đã có tất cả dịch vụ trong danh mục.
                      </div>
                    ) : (
                      <select
                        id="serviceSelect"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Chọn dịch vụ</option>
                        {availableServices.map((service) => (
                          <option
                            key={service.LoaiDichVu}
                            value={service.LoaiDichVu}
                          >
                            {service.LoaiDichVu}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleAddServiceToBranch}
                    variant="outline"
                    className="bg-teal-100 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors"
                    disabled={availableServices.length === 0}
                  >
                    Thêm dịch vụ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải dịch vụ...
            </div>
          ) : servicesBranch.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có dịch vụ nào
            </div>
          ) : (
            <div className="space-y-3">
              {servicesBranch.map((service) => {
                // Map tên dịch vụ với icon và màu phù hợp
                const getServiceConfig = (serviceName) => {
                  const name = serviceName.toLowerCase();

                  if (name.includes("tiêm") || name.includes("tiêm phòng")) {
                    return {
                      icon: Syringe,
                      bg: "bg-pink-100",
                      text: "text-pink-600",
                    };
                  }

                  if (
                    name.includes("mua") ||
                    name.includes("bán") ||
                    name.includes("hàng")
                  ) {
                    return {
                      icon: ShoppingBag,
                      bg: "bg-emerald-100",
                      text: "text-emerald-600",
                    };
                  }

                  if (name.includes("khám") || name.includes("bệnh")) {
                    return {
                      icon: Stethoscope,
                      bg: "bg-blue-100",
                      text: "text-blue-600",
                    };
                  }

                  // Default cho các dịch vụ khác
                  return {
                    icon: Sparkles,
                    bg: "bg-purple-100",
                    text: "text-purple-600",
                  };
                };

                const config = getServiceConfig(service.LoaiDichVu);
                const IconComponent = config.icon;

                return (
                  <div
                    key={service.LoaiDichVu}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center`}
                      >
                        <IconComponent className={`h-5 w-5 ${config.text}`} />
                      </div>
                      <div className="font-semibold text-teal-600">
                        {service.LoaiDichVu}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-100 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => handleDeleteService(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteServiceDialogOpen}
        onOpenChange={setIsDeleteServiceDialogOpen}
      >
        <DialogContent className="gap-0">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-red-600 font-semibold">
              Xác nhận xóa dịch vụ
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <strong>{serviceToDelete?.LoaiDichVu}</strong> khỏi chi nhánh này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button
              onClick={confirmDeleteService}
              variant="outline"
              className="bg-red-100 text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
