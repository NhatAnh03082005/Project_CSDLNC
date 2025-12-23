import React, { useState, useEffect } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../components/ui/button";
import {
  employeeAPI,
  branchAPI,
  promotionAPI,
  productAPI,
  vaccinationAPI,
} from "../../../api/services";
import AdminHeader from "../components/AdminHeader";
//import { BranchManagement } from "./BranchManagement";
//import { EmployeeTransferHistory } from "./EmployeeTransferHistory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/ui/dialog";
// Import Icons
import {
  BarChart3,
  Users,
  Menu,
  Bell,
  Settings,
  Shield,
  Activity,
  LogOut,
  UserCog,
  Tag,
  Package,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Syringe,
  Sparkles,
  MapPin,
  History,
} from "lucide-react";
import { Link } from "react-router-dom"; // Giữ Link của React Router DOM

// ======================================================================
// 1. COMPONENT CHÍNH: ManagementPage
// ======================================================================
export default function ManagementPage() {
  // Loại bỏ khai báo kiểu TypeScript: useState<string | null>(null)
  const [selectedManagement, setSelectedManagement] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            <Link to="/admin/demo">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/statistics">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Activity className="h-4 w-4" />
                Thống kê
              </Button>
            </Link>
            <Link to="/admin/management">
              <Button variant="default" className="w-full justify-start gap-3">
                <Users className="h-4 w-4" />
                Quản lý
              </Button>
            </Link>

            <div className="pt-4 border-t mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {selectedManagement ? (
              <ManagementDetail
                type={selectedManagement}
                onBack={() => setSelectedManagement(null)}
              />
            ) : (
              <>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quản lý</h1>
                  <p className="text-gray-500 mt-1">
                    Chọn mục quản lý bạn muốn thao tác
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("employee")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                        <UserCog className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý nhân viên
                      </CardTitle>
                      <CardDescription>
                        Thêm, sửa, xóa nhân viên trên toàn công ty
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("promotion")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                        <Tag className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý khuyến mãi
                      </CardTitle>
                      <CardDescription>
                        Thêm, sửa, xóa các chương trình khuyến mãi
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-green-100 hover:bg-green-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("inventory")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                        <Package className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">Quản lý tồn kho</CardTitle>
                      <CardDescription>
                        Quản lý sản phẩm tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-purple-100 hover:bg-purple-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("product")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                        <ShoppingBag className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý sản phẩm
                      </CardTitle>
                      <CardDescription>
                        Xem danh sách và thêm sản phẩm mới
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-orange-100 hover:bg-orange-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("vaccine")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center mb-2">
                        <Syringe className="h-6 w-6 text-pink-600" />
                      </div>
                      <CardTitle className="text-lg">Quản lý vắc-xin</CardTitle>
                      <CardDescription>
                        Xem danh sách và thêm vắc-xin mới
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-pink-100 hover:bg-pink-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("service")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-cyan-600" />
                      </div>
                      <CardTitle className="text-lg">Quản lý dịch vụ</CardTitle>
                      <CardDescription>
                        Quản lý dịch vụ tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-cyan-100 hover:bg-cyan-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("vaccinestock")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-2">
                        <Package className="h-6 w-6 text-red-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý kho vắc-xin
                      </CardTitle>
                      <CardDescription>
                        Quản lý tồn kho vắc-xin tại các chi nhánh
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-red-100 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("branch")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
                        <MapPin className="h-6 w-6 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Quản lý chi nhánh
                      </CardTitle>
                      <CardDescription>
                        Quản lý thông tin chi nhánh công ty
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedManagement("transfer")}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-2">
                        <History className="h-6 w-6 text-yellow-600" />
                      </div>
                      <CardTitle className="text-lg">
                        Lịch sử điều động
                      </CardTitle>
                      <CardDescription>
                        Quản lý lịch sử điều chuyển công tác nhân viên
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full bg-yellow-100 hover:bg-yellow-600 hover:text-white transition-colors"
                      >
                        Quản lý
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ======================================================================
// 2. COMPONENT CON: ManagementDetail
// ======================================================================
// Loại bỏ khai báo kiểu TypeScript cho props
function ManagementDetail({ type, onBack }) {
  const getTitleByType = () => {
    switch (type) {
      case "employee":
        return "Quản lý nhân viên";
      case "promotion":
        return "Quản lý khuyến mãi";
      case "service":
        return "Quản lý dịch vụ";
      case "product":
        return "Quản lý sản phẩm";
      case "inventory":
        return "Quản lý tồn kho sản phẩm";
      case "vaccine":
        return "Quản lý vắc-xin";
      case "vaccinestock":
        return "Quản lý kho vắc-xin";
      case "branch":
        return "Quản lý chi nhánh";
      case "transfer":
        return "Lịch sử điều động nhân viên";
      default:
        return "Quản lý";
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:text-red-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getTitleByType()}
          </h1>
          <p className="text-gray-500 mt-1">Thêm, sửa, xóa thông tin</p>
        </div>
      </div>

      {type === "employee" && <EmployeeManagement />}
      {type === "promotion" && <PromotionManagement />}
      {type === "service" && <ServiceManagement />}
      {type === "product" && <ProductManagement />}
      {type === "inventory" && <InventoryManagement />}
      {type === "vaccine" && <VaccineManagement />}
      {type === "vaccinestock" && <VaccinestockManagement />}
      {type === "branch" && <BranchManagement />}
      {type === "transfer" && <EmployeeTransferHistory />}
    </>
  );
}

// ======================================================================
// 3. COMPONENT CON: EmployeeManagement
// ======================================================================
function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [addFormData, setAddFormData] = useState({
    HoTen: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoLam: "",
    ViTri: "",
    LuongCoBan: "",
    TenChiNhanh: "",
  });

  const [editFormData, setEditFormData] = useState({
    HoTen: "",
    GioiTinh: "",
    NgaySinh: "",
    NgayVaoLam: "",
    ViTri: "",
    LuongCoBan: "",
    TenChiNhanh: "",
  });

  const GENDER_OPTIONS = ["Nam", "Nữ"];

  const POSITION_OPTIONS = [
    "Bác sĩ thú y",
    "Nhân viên bán hàng",
    "Nhân viên lễ tân",
    "Quản lý chi nhánh",
  ];

  // Fetch employees and branches on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        employeeAPI.getAll(),
        branchAPI.getAll(),
      ]);

      const employeesRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;
      const branchesRes =
        results[1]?.status === "fulfilled" ? results[1].value : null;

      // Support response shapes: { data: [...] } or { data: { data: [...] } }
      const employeesData =
        employeesRes?.data?.data ?? employeesRes?.data ?? [];
      const branchesData = branchesRes?.data?.data ?? branchesRes?.data ?? [];

      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setBranches(Array.isArray(branchesData) ? branchesData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await employeeAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        HoTen: "",
        GioiTinh: "",
        NgaySinh: "",
        NgayVaoLam: "",
        ViTri: "",
        LuongCoBan: "",
        TenChiNhanh: "",
      });
      alert("Thêm nhân viên thành công!");
    } catch (err) {
      console.error("Error adding employee:", err);
      alert(err.response?.data?.message || "Không thể thêm nhân viên");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);

    setEditFormData({
      HoTen: employee.HoTen || "",
      GioiTinh: employee.GioiTinh || "",
      NgaySinh: employee.NgaySinh?.split("T")[0] || "",
      NgayVaoLam: employee.NgayVaoLam?.split("T")[0] || "",
      ViTri: employee.ViTri?.trim() || "",
      LuongCoBan: employee.LuongCoBan || "",
      TenChiNhanh: employee.TenChiNhanh || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await employeeAPI.delete(selectedEmployee.MaNhanVien);
      await fetchData();
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      alert("Xóa nhân viên thành công!");
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert(err.response?.data?.message || "Không thể xóa nhân viên");
    }
  };

  const saveEdit = async () => {
    try {
      await employeeAPI.update(selectedEmployee.MaNhanVien, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      alert("Cập nhật nhân viên thành công!");
    } catch (err) {
      console.error("Error updating employee:", err);
      alert(err.response?.data?.message || "Không thể cập nhật nhân viên");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchData} className="mt-4 mx-auto block">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-600 font-semibold text-xl">
              Danh sách nhân viên
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý nhân viên trên toàn công ty (10 chi nhánh)
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Thêm nhân viên
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-blue-600 font-semibold">
                    Thêm nhân viên mới
                  </DialogTitle>
                  <DialogDescription>
                    <p className="text-gray-600 mt-1">
                      {" "}
                      Điền thông tin nhân viên mới vào form bên dưới
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-name">Họ tên</Label>
                      <Input
                        id="add-name"
                        placeholder="Nhập họ và tên"
                        value={addFormData.HoTen}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            HoTen: e.target.value,
                          })
                        }
                        className="text-black placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-gender">Giới tính</Label>
                      <select
                        id="add-gender"
                        value={addFormData.GioiTinh}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            GioiTinh: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Chọn giới tính</option>
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-birthdate">Ngày sinh</Label>
                      <Input
                        id="add-birthdate"
                        type="date"
                        value={addFormData.NgaySinh}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            NgaySinh: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-startdate">Ngày vào làm</Label>
                      <Input
                        id="add-startdate"
                        type="date"
                        value={addFormData.NgayVaoLam}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            NgayVaoLam: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-position">Vị trí</Label>
                      <select
                        id="add-position"
                        value={addFormData.ViTri}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            ViTri: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Chọn vị trí</option>
                        {POSITION_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-salary">Lương cơ bản</Label>
                      <Input
                        id="add-salary"
                        type="number"
                        placeholder="Nhập lương cơ bản"
                        value={addFormData.LuongCoBan}
                        onChange={(e) =>
                          setAddFormData({
                            ...addFormData,
                            LuongCoBan: e.target.value,
                          })
                        }
                        className="text-black placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-branch">Chi nhánh</Label>
                    <select
                      id="add-branch"
                      value={addFormData.TenChiNhanh}
                      onChange={(e) =>
                        setAddFormData({
                          ...addFormData,
                          TenChiNhanh: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Chọn chi nhánh</option>
                      {branches.map((b) => (
                        <option key={b.MaChiNhanh} value={b.TenChiNhanh}>
                          {b.TenChiNhanh}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAdd}
                    variant="outline"
                    className="bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Thêm nhân viên
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {employees.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có nhân viên nào
            </div>
          ) : (
            employees.map((employee) => (
              <div
                key={employee.MaNhanVien}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-blue-600">
                    {employee.MaNhanVien} - {employee.HoTen}
                  </div>
                  <div className="text-sm text-gray-500">
                    {employee.TenChiNhanh} - {employee.ViTri}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => handleDelete(employee)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-600 font-semibold">
                {" "}
                Chỉnh sửa thông tin nhân viên
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin nhân viên{" "}
                <strong>{selectedEmployee?.HoTen}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Họ tên</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.HoTen}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        HoTen: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Giới tính</Label>
                  <select
                    id="edit-gender"
                    value={editFormData.GioiTinh}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        GioiTinh: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-birthdate">Ngày sinh</Label>
                  <Input
                    id="edit-birthdate"
                    type="date"
                    value={editFormData.NgaySinh}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        NgaySinh: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startdate">Ngày vào làm</Label>
                  <Input
                    id="edit-startdate"
                    type="date"
                    value={editFormData.NgayVaoLam}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        NgayVaoLam: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Vị trí</Label>
                  <select
                    id="edit-position"
                    value={editFormData.ViTri}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        ViTri: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Chọn vị trí</option>
                    {POSITION_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Lương cơ bản</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={editFormData.LuongCoBan}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        LuongCoBan: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-branch">Chi nhánh</Label>
                <select
                  id="edit-branch"
                  value={editFormData.TenChiNhanh}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TenChiNhanh: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Chọn chi nhánh</option>
                  {branches.map((b) => (
                    <option key={b.MaChiNhanh} value={b.TenChiNhanh}>
                      {b.TenChiNhanh}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={saveEdit}
                variant="outline"
                className="bg-green-100 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="gap-0">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-red-600 font-semibold">
                Xác nhận xóa nhân viên
              </DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa nhân viên{" "}
                <strong>{selectedEmployee?.HoTen}</strong> khỏi hệ thống?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-3">
              <Button
                onClick={confirmDelete}
                variant="outline"
                className="bg-red-100 text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 4. COMPONENT CON: PromotionManagement
// ======================================================================
function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const [addFormData, setAddFormData] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    TiLeGiamGia: "",
  });

  const [editFormData, setEditFormData] = useState({
    NgayBatDau: "",
    NgayKetThuc: "",
    TiLeGiamGia: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([promotionAPI.getAll()]);

      const promotionsRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;

      const promotionsData =
        promotionsRes?.data?.data ?? promotionsRes?.data ?? [];

      setPromotions(Array.isArray(promotionsData) ? promotionsData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await promotionAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        NgayBatDau: "",
        NgayKetThuc: "",
        TiLeGiamGia: "",
      });
      alert("Thêm khuyến mãi thành công!");
    } catch (err) {
      console.error("Error adding promotion:", err);
      alert(err.response?.data?.message || "Không thể thêm khuyến mãi");
    }
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setEditFormData({
      NgayBatDau: promotion.NgayBatDau?.split("T")[0] || "",
      NgayKetThuc: promotion.NgayKetThuc?.split("T")[0] || "",
      TiLeGiamGia: promotion.TiLeGiamGia || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await promotionAPI.update(selectedPromotion.MaKhuyenMai, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedPromotion(null);
      alert("Cập nhật khuyến mãi thành công!");
    } catch (err) {
      console.error("Error updating promotion:", err);
      alert(err.response?.data?.message || "Không thể cập nhật khuyến mãi");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchData} className="mt-4 mx-auto block">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách khuyến mãi</CardTitle>
            <CardDescription>
              Quản lý các chương trình khuyến mãi trên hệ thống
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm khuyến mãi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khuyến mãi mới</DialogTitle>
                <DialogDescription>
                  Tạo chương trình khuyến mãi mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="NgayBatDau">Ngày bắt đầu</Label>
                  <Input
                    id="NgayBatDau"
                    type="date"
                    placeholder="Nhập ngày bắt đầu"
                    value={addFormData.NgayBatDau}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        NgayBatDau: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="NgayKetThuc">Ngày kết thúc</Label>
                  <Input
                    id="NgayKetThuc"
                    type="date"
                    placeholder="Nhập ngày kết thúc"
                    value={addFormData.NgayKetThuc}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        NgayKetThuc: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="TiLeGiamGia">Tỉ lệ giảm giá (%)</Label>
                  <Input
                    id="TiLeGiamGia"
                    type="number"
                    placeholder="Nhập tỉ lệ giảm giá"
                    value={addFormData.TiLeGiamGia}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        TiLeGiamGia: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
                >
                  Thêm khuyến mãi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {promotions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có khuyến mãi nào
            </div>
          ) : (
            promotions.map((promotion) => (
              <div
                key={promotion.MaKhuyenMai}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-green-600">
                    {promotion.MaKhuyenMai} - Giảm {promotion.TiLeGiamGia}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {promotion.NgayBatDau.split("T")[0]} đến{" "}
                    {promotion.NgayKetThuc.split("T")[0]}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(promotion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin khuyến mãi {selectedPromotion?.MaKhuyenMai}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Ngày bắt đầu</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editFormData.NgayBatDau}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      NgayBatDau: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editFormData.NgayKetThuc}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      NgayKetThuc: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Tỉ lệ giảm giá (%)</Label>
                <Input
                  id="edit-discount"
                  type="number"
                  value={editFormData.TiLeGiamGia}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TiLeGiamGia: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={saveEdit}
                variant="outline"
                className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 5. COMPONENT CON: InventoryManagement
// ======================================================================
function InventoryManagement() {
  // Loại bỏ khai báo kiểu TypeScript: useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const allProducts = [
    { id: 1, name: "Royal Canin Mini Adult", category: "Thức ăn" },
    { id: 2, name: "Nexgard Spectra", category: "Thuốc" },
    { id: 3, name: "Vòng cổ chống bọ chét", category: "Phụ kiện" },
    { id: 4, name: "Pedigree Adult", category: "Thức ăn" },
    { id: 5, name: "Whiskas Adult", category: "Thức ăn" },
    { id: 6, name: "Thuốc tẩy giun", category: "Thuốc" },
  ];

  const branches = [
    "PetCare Quận 1",
    "PetCare Quận 3",
    "PetCare Bình Thạnh",
    "PetCare Thủ Đức",
    "PetCare Gò Vấp",
    "PetCare Tân Bình",
    "PetCare Phú Nhuận",
    "PetCare Quận 7",
    "PetCare Quận 10",
    "PetCare Bình Tân",
  ];

  const products = [
    {
      id: 1,
      name: "Royal Canin Mini Adult",
      type: "Thức ăn",
      quantity: 45,
      price: 450000,
    },
    {
      id: 2,
      name: "Nexgard Spectra",
      type: "Thuốc",
      quantity: 28,
      price: 165000,
    },
    {
      id: 3,
      name: "Vòng cổ chống bọ chét",
      type: "Phụ kiện",
      quantity: 67,
      price: 120000,
    },
    {
      id: 4,
      name: "Pedigree Adult",
      type: "Thức ăn",
      quantity: 52,
      price: 380000,
    },
  ];

  if (selectedBranch) {
    return (
      <>
        <Button
          variant="ghost"
          className="gap-2 mb-4 hover:text-red-600 hover:bg-red-50"
          onClick={() => setSelectedBranch(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách chi nhánh
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sản phẩm tại {selectedBranch}</CardTitle>
                <CardDescription>
                  Quản lý số lượng sản phẩm tồn kho
                </CardDescription>
              </div>
              <Dialog
                open={isAddProductDialogOpen}
                onOpenChange={setIsAddProductDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm sản phẩm vào kho
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm sản phẩm vào kho</DialogTitle>
                    <DialogDescription>
                      Chọn sản phẩm từ danh sách và nhập số lượng
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="productSelect">Chọn sản phẩm</Label>
                      <select
                        id="productSelect"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {allProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.category})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialQuantity">Số lượng ban đầu</Label>
                      <Input
                        id="initialQuantity"
                        type="number"
                        placeholder="0"
                        defaultValue="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddProductDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={() => setIsAddProductDialogOpen(false)}>
                      Thêm vào kho
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.type}</div>
                    <div className="text-sm font-medium text-blue-600">
                      {product.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor={`quantity-${product.id}`}
                      className="text-sm"
                    >
                      Số lượng:
                    </Label>
                    <Input
                      id={`quantity-${product.id}`}
                      type="number"
                      defaultValue={product.quantity}
                      className="w-24"
                    />
                    <Button size="sm">Cập nhật</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn chi nhánh</CardTitle>
        <CardDescription>
          Chọn chi nhánh để xem và quản lý tồn kho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {branches.map((branch, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="text-left">
                <div className="font-semibold">{branch}</div>
                <div className="text-sm text-gray-500">
                  Xem sản phẩm tồn kho
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 6. COMPONENT CON: ProductManagement
// ======================================================================
function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [addFormData, setAddFormData] = useState({
    TenSanPham: "",
    LoaiSanPham: "",
    DonGia: "",
  });

  const [editFormData, setEditFormData] = useState({
    TenSanPham: "",
    LoaiSanPham: "",
    DonGia: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([productAPI.getAll()]);

      const productsRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;

      const productsData = productsRes?.data?.data ?? productsRes?.data ?? [];

      setProducts(Array.isArray(productsData) ? productsData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await productAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        TenSanPham: "",
        LoaiSanPham: "",
        DonGia: "",
      });
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error("Error adding product:", err);
      alert(err.response?.data?.message || "Không thể thêm sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      TenSanPham: product.TenSanPham || "",
      LoaiSanPham: product.LoaiSanPham || "",
      DonGia: product.DonGia || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await productAPI.update(selectedProduct.MaSanPham, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Error updating product:", err);
      alert(err.response?.data?.message || "Không thể cập nhật sản phẩm");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchData} className="mt-4 mx-auto block">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-orange-600 font-semibold text-xl">
              Danh sách sản phẩm
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quản lý tất cả sản phẩm của công ty (10 chi nhánh)
            </CardDescription>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-orange-100 hover:bg-orange-600 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-orange-600 font-semibold">
                  Thêm sản phẩm mới
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Thêm sản phẩm mới vào danh mục
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="TenSanPham">Tên sản phẩm</Label>
                  <Input
                    id="TenSanPham"
                    placeholder="Nhập tên sản phẩm"
                    value={addFormData.TenSanPham}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        TenSanPham: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="LoaiSanPham">Loại sản phẩm</Label>
                  <Input
                    id="LoaiSanPham"
                    placeholder="Thức ăn / Thuốc / Phụ kiện"
                    value={addFormData.LoaiSanPham}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        LoaiSanPham: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="DonGia">Đơn giá (VNĐ)</Label>
                  <Input
                    id="DonGia"
                    type="number"
                    placeholder="Nhập đơn giá"
                    value={addFormData.DonGia}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        DonGia: Number(e.target.value),
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="bg-orange-100 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  Thêm sản phẩm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có sản phẩm nào
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.MaSanPham}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-orange-600">
                    {product.MaSanPham} - {product.TenSanPham}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.LoaiSanPham} - {product.DonGia} VNĐ
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-600 font-semibold">
                Chỉnh sửa sản phẩm
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin sản phẩm{" "}
                <strong>{selectedProduct?.MaSanPham}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-TenSanPham">Tên sản phẩm</Label>
                <Input
                  id="edit-TenSanPham"
                  value={editFormData.TenSanPham}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TenSanPham: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-LoaiSanPham">Loại sản phẩm</Label>
                <Input
                  id="edit-LoaiSanPham"
                  value={editFormData.LoaiSanPham}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      LoaiSanPham: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-DonGia">Đơn giá (VNĐ)</Label>
                <Input
                  id="edit-DonGia"
                  type="number"
                  value={editFormData.DonGia}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      DonGia: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={saveEdit}
                variant="outline"
                className="bg-green-100 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 7. COMPONENT CON: VaccineManagement
// ======================================================================
function VaccineManagement() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const [addFormData, setAddFormData] = useState({
    TenVacXin: "",
    HangSanXuat: "",
    GiaTien: "",
    MoTa: "",
  });

  const [editFormData, setEditFormData] = useState({
    TenVacXin: "",
    HangSanXuat: "",
    GiaTien: "",
    MoTa: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([vaccinationAPI.getAll()]);

      const vaccinesRes =
        results[0]?.status === "fulfilled" ? results[0].value : null;

      const vaccinesData = vaccinesRes?.data?.data ?? vaccinesRes?.data ?? [];

      setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await vaccinationAPI.create(addFormData);
      await fetchData();
      setIsAddDialogOpen(false);
      setAddFormData({
        TenVacXin: "",
        HangSanXuat: "",
        GiaTien: "",
        MoTa: "",
      });
      alert("Thêm vắc-xin thành công!");
    } catch (err) {
      console.error("Error adding vaccine:", err);
      alert(err.response?.data?.message || "Không thể thêm vắc-xin");
    }
  };

  const handleEdit = (vaccine) => {
    setSelectedVaccine(vaccine);
    setEditFormData({
      TenVacXin: vaccine.TenVacXin || "",
      HangSanXuat: vaccine.HangSanXuat || "",
      GiaTien: vaccine.GiaTien || "",
      MoTa: vaccine.MoTa || "",
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = async () => {
    try {
      await vaccinationAPI.update(selectedVaccine.MaVacXin, editFormData);
      await fetchData();
      setIsEditDialogOpen(false);
      setSelectedVaccine(null);
      alert("Cập nhật vắc-xin thành công!");
    } catch (err) {
      console.error("Error updating vaccine:", err);
      alert(err.response?.data?.message || "Không thể cập nhật vắc-xin");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={fetchData} className="mt-4 mx-auto block">
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách vắc-xin</CardTitle>
            <CardDescription>
              Quản lý tất cả vắc-xin trong hệ thống
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Plus className="h-4 w-4" />
                Thêm vắc-xin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm vắc-xin mới</DialogTitle>
                <DialogDescription>
                  Thêm vắc-xin mới vào danh mục
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="TenVacXin">Tên vắc-xin</Label>
                  <Input
                    id="TenVacXin"
                    placeholder="Vắc-xin 5 bệnh"
                    value={addFormData.TenVacXin}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        TenVacXin: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="HangSanXuat">Nhà sản xuất</Label>
                  <Input
                    id="HangSanXuat"
                    placeholder="Nobivac"
                    value={addFormData.HangSanXuat}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        HangSanXuat: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="GiaTien">Giá (VNĐ)</Label>
                  <Input
                    id="GiaTien"
                    type="number"
                    placeholder="200000"
                    value={addFormData.GiaTien}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        GiaTien: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="MoTa">Mô tả</Label>
                  <Input
                    id="MoTa"
                    placeholder="Mô tả vắc-xin"
                    value={addFormData.MoTa}
                    onChange={(e) =>
                      setAddFormData({
                        ...addFormData,
                        MoTa: e.target.value,
                      })
                    }
                    className="text-black placeholder:text-gray-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAdd}
                  className="bg-blue-100 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Thêm vắc-xin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vaccines.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có vắc-xin nào
            </div>
          ) : (
            vaccines.map((vaccine) => (
              <div
                key={vaccine.MaVacXin}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-semibold text-pink-600">
                    {vaccine.MaVacXin} - {vaccine.TenVacXin}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vaccine.HangSanXuat}
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {vaccine.GiaTien?.toLocaleString("vi-VN")} ₫
                  </div>
                  {vaccine.MoTa && (
                    <div className="text-sm text-gray-500">{vaccine.MoTa}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    onClick={() => handleEdit(vaccine)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa vắc-xin</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin vắc-xin {selectedVaccine?.MaVacXin}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-TenVacXin">Tên vắc-xin</Label>
                <Input
                  id="edit-TenVacXin"
                  value={editFormData.TenVacXin}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      TenVacXin: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-HangSanXuat">Nhà sản xuất</Label>
                <Input
                  id="edit-HangSanXuat"
                  value={editFormData.HangSanXuat}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      HangSanXuat: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-GiaTien">Giá (VNĐ)</Label>
                <Input
                  id="edit-GiaTien"
                  type="number"
                  value={editFormData.GiaTien}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      GiaTien: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-MoTa">Mô tả</Label>
                <Input
                  id="edit-MoTa"
                  value={editFormData.MoTa}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      MoTa: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={saveEdit}
                className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 8. COMPONENT CON: ServiceManagement
// ======================================================================
function ServiceManagement() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Khám tổng quát",
      price: 100000,
      duration: "30 phút",
    },
    {
      id: 2,
      name: "Tắm và vệ sinh",
      price: 150000,
      duration: "45 phút",
    },
    {
      id: 3,
      name: "Cắt tỉa lông",
      price: 200000,
      duration: "60 phút",
    },
  ]);

  const branches = [
    "PetCare Quận 1",
    "PetCare Quận 3",
    "PetCare Bình Thạnh",
    "PetCare Thủ Đức",
    "PetCare Gò Vấp",
    "PetCare Tân Bình",
    "PetCare Phú Nhuận",
    "PetCare Quận 7",
    "PetCare Quận 10",
    "PetCare Bình Tân",
  ];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: 0,
    duration: "",
  });

  const handleEdit = (service) => {
    setSelectedService(service);
    setEditFormData({
      name: service.name,
      price: service.price,
      duration: service.duration,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setServices(services.filter((srv) => srv.id !== selectedService.id));
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
  };

  const saveEdit = () => {
    setServices(
      services.map((srv) =>
        srv.id === selectedService.id ? { ...srv, ...editFormData } : srv
      )
    );
    setIsEditDialogOpen(false);
    setSelectedService(null);
  };

  if (selectedBranch) {
    return (
      <>
        <Button
          variant="ghost"
          className="gap-2 mb-4 hover:text-red-600 hover:bg-red-50"
          onClick={() => setSelectedBranch(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách chi nhánh
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dịch vụ tại {selectedBranch}</CardTitle>
                <CardDescription>Quản lý dịch vụ tại chi nhánh</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                    <Plus className="h-4 w-4" />
                    Thêm dịch vụ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm dịch vụ mới</DialogTitle>
                    <DialogDescription>
                      Thêm dịch vụ cho {selectedBranch}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Tên dịch vụ</Label>
                      <Input id="serviceName" placeholder="Khám tổng quát" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servicePrice">Giá (VNĐ)</Label>
                      <Input
                        id="servicePrice"
                        type="number"
                        placeholder="100000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Thời gian</Label>
                      <Input id="duration" placeholder="30 phút" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Thêm dịch vụ
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-semibold">{service.name}</div>
                    <div className="text-sm text-gray-500">
                      Thời gian: {service.duration}
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {service.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => handleDelete(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin dịch vụ {selectedService?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-serviceName">Tên dịch vụ</Label>
                    <Input
                      id="edit-serviceName"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-servicePrice">Giá (VNĐ)</Label>
                    <Input
                      id="edit-servicePrice"
                      type="number"
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-duration">Thời gian</Label>
                    <Input
                      id="edit-duration"
                      value={editFormData.duration}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={saveEdit}
                    className="bg-green-100 text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    Lưu thay đổi
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogContent className="gap-0">
                <DialogHeader className="pb-4">
                  <DialogTitle>Xác nhận xóa dịch vụ</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa dịch vụ{" "}
                    <strong>{selectedService?.name}</strong> khỏi hệ thống?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4">
                  <Button
                    onClick={confirmDelete}
                    className="bg-red-100 text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Xác nhận
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn chi nhánh</CardTitle>
        <CardDescription>
          Chọn chi nhánh để xem và quản lý dịch vụ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {branches.map((branch, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="text-left">
                <div className="font-semibold">{branch}</div>
                <div className="text-sm text-gray-500">
                  Xem dịch vụ chi nhánh
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 9. COMPONENT CON: vaccineStockManagement
// ======================================================================
function VaccinestockManagement() {
  // Loại bỏ khai báo kiểu TypeScript: useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isAddVaccineDialogOpen, setIsAddVaccineDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState("");

  const allVaccines = [
    { id: 1, name: "Vắc-xin 5 bệnh", manufacturer: "Nobivac" },
    { id: 2, name: "Vắc-xin dại", manufacturer: "Rabigen" },
    { id: 3, name: "Vắc-xin cúm", manufacturer: "Canigen" },
    { id: 4, name: "Vắc-xin 7 bệnh", manufacturer: "Vanguard" },
  ];

  const branches = [
    "PetCare Quận 1",
    "PetCare Quận 3",
    "PetCare Bình Thạnh",
    "PetCare Thủ Đức",
    "PetCare Gò Vấp",
    "PetCare Tân Bình",
    "PetCare Phú Nhuận",
    "PetCare Quận 7",
    "PetCare Quận 10",
    "PetCare Bình Tân",
  ];

  const vaccines = [
    {
      id: 1,
      name: "Vắc-xin cúm",
      type: "Vắc-xin phòng bệnh",
      quantity: 45,
      price: 450000,
    },
    {
      id: 2,
      name: "Vắc-xin dại",
      type: "Vắc-xin phòng bệnh",
      quantity: 28,
      price: 165000,
    },
    {
      id: 3,
      name: "Vắc-xin 5 bệnh",
      type: "Vắc-xin phòng bệnh",
      quantity: 67,
      price: 120000,
    },
    {
      id: 4,
      name: "Vắc-xin 7 bệnh",
      type: "Vắc-xin phòng bệnh",
      quantity: 52,
      price: 380000,
    },
  ];

  if (selectedBranch) {
    return (
      <>
        <Button
          variant="ghost"
          className="gap-2 mb-4 hover:text-red-600 hover:bg-red-50"
          onClick={() => setSelectedBranch(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách chi nhánh
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vắc-xin tại {selectedBranch}</CardTitle>
                <CardDescription>
                  Quản lý số lượng vắc-xin tồn kho
                </CardDescription>
              </div>
              <Dialog
                open={isAddVaccineDialogOpen}
                onOpenChange={setIsAddVaccineDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm vắc-xin vào kho
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm vắc-xin vào kho</DialogTitle>
                    <DialogDescription>
                      Chọn vắc-xin từ danh sách và nhập số lượng
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="vaccineSelect">Chọn vắc-xin</Label>
                      <select
                        id="vaccineSelect"
                        value={selectedVaccine}
                        onChange={(e) => setSelectedVaccine(e.target.value)}
                        className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">-- Chọn vắc-xin --</option>
                        {allVaccines.map((vaccine) => (
                          <option key={vaccine.id} value={vaccine.id}>
                            {vaccine.name} ({vaccine.manufacturer})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vaccineInitialQuantity">
                        Số lượng ban đầu
                      </Label>
                      <Input
                        id="vaccineInitialQuantity"
                        type="number"
                        placeholder="0"
                        defaultValue="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddVaccineDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={() => setIsAddVaccineDialogOpen(false)}>
                      Thêm vào kho
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{vaccine.name}</div>
                    <div className="text-sm text-gray-500">{vaccine.type}</div>
                    <div className="text-sm font-medium text-blue-600">
                      {vaccine.price.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor={`quantity-${vaccine.id}`}
                      className="text-sm"
                    >
                      Số lượng:
                    </Label>
                    <Input
                      id={`quantity-${vaccine.id}`}
                      type="number"
                      defaultValue={vaccine.quantity}
                      className="w-24"
                    />
                    <Button size="sm">Cập nhật</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn chi nhánh</CardTitle>
        <CardDescription>
          Chọn chi nhánh để xem và quản lý tồn kho
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {branches.map((branch, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => setSelectedBranch(branch)}
            >
              <div className="text-left">
                <div className="font-semibold">{branch}</div>
                <div className="text-sm text-gray-500">
                  Xem sản phẩm tồn kho
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
