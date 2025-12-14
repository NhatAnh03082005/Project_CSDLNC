import React, { useState } from "react";
// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">PetCare Admin</div>
              <div className="text-xs text-gray-500">Hệ thống quản trị</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 border-l pl-3">
              <div className="text-right">
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-gray-500">Quản trị viên</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

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
                        className="w-full bg-transparent"
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
                        className="w-full bg-transparent"
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
                        className="w-full bg-transparent"
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
      case "inventory":
        return "Quản lý tồn kho";
      default:
        return "Quản lý";
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
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
      {type === "inventory" && <InventoryManagement />}
    </>
  );
}

// ======================================================================
// 3. COMPONENT CON: EmployeeManagement
// ======================================================================
function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Bác sĩ",
      branch: "Quận 1",
      phone: "0901234567",
      email: "nva@petcare.vn",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Lễ tân",
      branch: "Quận 1",
      phone: "0907654321",
      email: "ttb@petcare.vn",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Bác sĩ",
      branch: "Quận 3",
      phone: "0912345678",
      email: "lvc@petcare.vn",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Lễ tân",
      branch: "Quận 3",
      phone: "0918765432",
      email: "ptd@petcare.vn",
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách nhân viên</CardTitle>
            <CardDescription>
              Quản lý nhân viên trên toàn công ty (10 chi nhánh)
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin nhân viên mới vào form bên dưới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ tên</Label>
                  <Input id="name" placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  {/* Sửa lại select để sử dụng class Tailwind đã định nghĩa trong Input/UI */}
                  <select 
                      id="role" 
                      className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="doctor">Bác sĩ</option>
                    <option value="receptionist">Lễ tân</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Chi nhánh</Label>
                  <select 
                      id="branch" 
                      className="w-full border rounded-lg p-2 flex h-10 border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="q1">Quận 1</option>
                    <option value="q3">Quận 3</option>
                    <option value="bt">Bình Thạnh</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="0901234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="nva@petcare.vn" />
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
                  Thêm nhân viên
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="font-semibold">{employee.name}</div>
                <div className="text-sm text-gray-500">
                  {employee.role} - Chi nhánh {employee.branch}
                </div>
                <div className="text-sm text-gray-500">
                  {employee.phone} • {employee.email}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ======================================================================
// 4. COMPONENT CON: PromotionManagement
// ======================================================================
function PromotionManagement() {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      code: "SUMMER2024",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      discount: 15,
    },
    {
      id: 2,
      code: "NEWCUSTOMER",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      discount: 20,
    },
    {
      id: 3,
      code: "VACCINE50",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      discount: 10,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
              <Button className="gap-2">
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
                  <Label htmlFor="code">Mã khuyến mãi</Label>
                  <Input id="code" placeholder="SUMMER2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input id="endDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Tỉ lệ giảm giá (%)</Label>
                  <Input id="discount" type="number" placeholder="15" />
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
                  Thêm khuyến mãi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="font-semibold text-lg">{promotion.code}</div>
                <div className="text-sm text-gray-500">
                  {promotion.startDate} đến {promotion.endDate}
                </div>
                <div className="text-sm font-medium text-green-600">
                  Giảm {promotion.discount}%
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
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
          className="gap-2 mb-4"
          onClick={() => setSelectedBranch(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách chi nhánh
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm tại {selectedBranch}</CardTitle>
            <CardDescription>Quản lý số lượng sản phẩm tồn kho</CardDescription>
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