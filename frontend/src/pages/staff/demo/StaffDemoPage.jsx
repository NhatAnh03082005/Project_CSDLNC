import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Menu,
  Bell,
  LogOut,
  Home,
  Receipt,
  Stethoscope,
  Syringe,
  Clock,
  FilePlus,
  Search,
  User,
  Phone,
  Info
} from "lucide-react";

export default function StaffDemoPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notifications, setNotifications] = useState(3);

  // Mock dữ liệu lịch hẹn
const [appointments, setAppointments] = useState([
    { id: 1, time: "09:00", duration: "30 phút", customer: "Trần Thị B", pet: "Mèo Miu", status: "waiting", service: "Khám bệnh", phone: "0912345678", detail: "Mèo kém ăn, uể oải 2 ngày" },
    { id: 2, time: "10:30", duration: "45 phút", customer: "Lê Văn C", pet: "Chó Lulu", status: "confirmed", service: "Tiêm phòng", phone: "0987654321", detail: "Tiêm vaccine 5 bệnh" },
    { id: 3, time: "14:00", duration: "30 phút", customer: "Phạm Thị D", pet: "Chó Golden", status: "completed", service: "Khám bệnh", phone: "0901223344", detail: "Đã khám xong lúc 14:25" },
  ]);

  const handleConfirm = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'confirmed' } : app));
    if(notifications > 0) setNotifications(notifications - 1);
  };

  const handleCancel = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: 'cancelled' } : app
      ));
    }
  };

  const handleShowDetail = (app) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  // Logic tìm kiếm đa năng theo Tên hoặc SĐT
  const filteredAppointments = appointments.filter(app => 
    app.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header*/}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PetCare Logo" className="h-8 w-8 rounded-full object-cover"/>
            <div>
              <div className="font-semibold text-sm">PetCareX Staff</div>
              <div className="text-xs text-gray-500">Chi nhánh Quận 1</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {/* Số 3 giả định có 3 thông báo mới */}
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                      2
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-white shadow-xl rounded-xl border border-gray-100" align="end">
                  <DropdownMenuLabel className="font-bold text-gray-700">Thông báo mới</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-blue-50 cursor-pointer">
                    <div className="font-bold text-[10px] text-blue-600 uppercase tracking-wider">Lịch hẹn mới</div>
                    <div className="text-sm font-medium text-gray-800 text-left">Khách hàng Nguyễn Văn A vừa đặt lịch tiêm phòng</div>
                    <div className="text-[10px] text-gray-400 font-bold">10 phút trước</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-blue-50 cursor-pointer">
                    <div className="font-bold text-[10px] text-orange-600 uppercase tracking-wider">Nhắc nhở</div>
                    <div className="text-sm font-medium text-gray-800 text-left">Lịch khám của Bé Miu sắp bắt đầu (09:00)</div>
                    <div className="text-[10px] text-gray-400 font-bold">30 phút trước</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            <div className="flex items-center gap-3 border-l pl-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Nguyễn Văn A</div>
                <div className="text-xs text-gray-500 italic">Nhân viên</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">NA</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Thêm hiệu ứng màu cho Trang chủ */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <Link to="/staff/demo">
              <Button 
                variant={location.pathname === "/staff/demo" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 ${location.pathname === "/staff/demo" ? "bg-blue-600 shadow-sm" : ""}`}
              >
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
            </Link>
            <Link to="/staff/create-record">
              <Button variant="ghost" className="w-full justify-start gap-3"><FilePlus className="h-4 w-4" />Tra cứu và tạo hồ sơ</Button>
            </Link>
            <Link to="/staff/invoice">
              <Button variant="ghost" className="w-full justify-start gap-3"><Receipt className="h-4 w-4" />Lập hóa đơn</Button>
            </Link>
            <Link to="/staff/work-schedule">
              <Button variant="ghost" className="w-full justify-start gap-3"><Clock className="h-4 w-4" />Quản lý lịch làm việc</Button>
            </Link>
            <Link to="/staff/medical-records">
              <Button variant="ghost" className="w-full justify-start gap-3"><Stethoscope className="h-4 w-4" />Cập nhật hồ sơ khám bệnh</Button>
            </Link>
            <Link to="/staff/vaccination-records">
              <Button variant="ghost" className="w-full justify-start gap-3"><Syringe className="h-4 w-4" />Cập nhật hồ sơ tiêm phòng</Button>
            </Link>
            <div className="pt-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Đăng xuất</Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Nhân viên</h1>
              <p className="text-gray-500 mt-1">Quản lý lịch hẹn và tra cứu thông tin</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5"/> Hôm nay</CardDescription>
                  <CardTitle className="text-3xl font-bold text-blue-600">24</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Lịch hẹn tổng</div></CardContent>
              </Card>
              <Card className="hover:border-orange-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><Clock className="h-3.5 w-3.5"/> Đang chờ</CardDescription>
                  <CardTitle className="text-3xl text-orange-600 font-bold">8</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Chưa xác nhận</div></CardContent>
              </Card>
              <Card className="hover:border-green-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5"/> Hoàn thành</CardDescription>
                  <CardTitle className="text-3xl text-green-600 font-bold">12</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Đã khám xong</div></CardContent>
              </Card>
              <Card className="hover:border-red-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><XCircle className="h-3.5 w-3.5"/> Hủy</CardDescription>
                  <CardTitle className="text-3xl text-red-600 font-bold">4</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Lịch hủy hôm nay</div></CardContent>
              </Card>
            </div>

            {/* Danh sách lịch hẹn - tìm kiếm */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-800">Danh sách lịch hẹn hôm nay</CardTitle>
                    <CardDescription>Quản lý và xác nhận lịch hẹn khách hàng</CardDescription>
                  </div>
                  <div className="relative w-full md:w-[450px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Tìm lịch hẹn theo tên hoặc SĐT khách hàng..." 
                      className="pl-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy lịch hẹn phù hợp</div>
                  ) : (
                    filteredAppointments.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4 hover:border-blue-300 hover:bg-gray-50/50 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-6">
                            <div className="text-center border-r pr-6 border-gray-100">
                              <div className={`text-2xl font-bold ${app.status === 'completed' ? 'text-gray-400' : 'text-blue-600'}`}>{app.time}</div>
                              <div className="text-[10px] text-gray-400 uppercase font-bold">{app.duration}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-800">{app.customer} — <span className="text-blue-500">{app.pet}</span></h4>
                                <Badge variant="outline" className={`
                                  ${app.status === 'waiting' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                    app.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    app.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-gray-100 text-gray-600 border-gray-200'}
                                `}>
                                  {app.status === 'waiting' ? 'Chờ xác nhận' : 
                                  app.status === 'confirmed' ? 'Đã xác nhận' : 
                                  app.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-gray-400"/> Loại: {app.service}</div>
                                <div className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-gray-400"/> Ghi chú: {app.detail}</div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400"><Phone className="h-3 w-3"/> SĐT: {app.phone}</div>
                              </div>
                            </div>
                          </div>
                          
                        <div className="flex gap-2">
                          {app.status === 'waiting' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleConfirm(app.id)} // Gán hàm xác nhận
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Xác nhận
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleCancel(app.id)} 
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Hủy
                                </Button>
                              </>
                            )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1.5"
                            onClick={() => handleShowDetail(app)}
                          >
                            <FileText className="h-4 w-4" /> Chi tiết
                          </Button>
                        </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        {/* DIALOG HIỂN THỊ CHI TIẾT LỊCH HẸN*/}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl bg-white shadow-xl">
            <DialogHeader className="text-left">
              <DialogTitle className="text-blue-700 flex items-center gap-2 text-left">
                <FileText className="h-5 w-5" /> Chi tiết lịch hẹn
              </DialogTitle>
              <DialogDescription className="text-left italic text-gray-500">
                Thông tin đầy đủ lịch hẹn
              </DialogDescription>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-4 py-4 text-sm text-left">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div className="text-left">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Khách hàng</p>
                    <p className="font-bold text-gray-800">{selectedApp.customer}</p>
                    <p className="text-gray-500">{selectedApp.phone}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Thú cưng </p>
                    <p className="font-bold text-blue-600">{selectedApp.pet}</p>
                    <p className="text-gray-500">{selectedApp.breed} - {selectedApp.gender}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-left">
                  <p className="text-gray-400 text-xs font-bold uppercase">Dịch vụ & Ghi chú</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-left">
                    <p className="font-semibold text-gray-700">{selectedApp.service}</p>
                    <p className="text-gray-600 mt-1 italic leading-relaxed">"{selectedApp.detail}"</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-bold text-blue-700">
                    <Clock className="h-4 w-4" /> {selectedApp.time} ({selectedApp.duration})
                  </div>
                  <Badge className="bg-white text-blue-600 border-blue-200">Hôm nay</Badge>
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl">Đóng</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}