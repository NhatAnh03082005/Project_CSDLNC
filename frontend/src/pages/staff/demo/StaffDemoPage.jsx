import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; 
//api services
import { appointmentAPI, branchAPI } from "../../../api/services";
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
  DialogFooter,
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
  Info,
  CheckSquare,
} from "lucide-react";

export default function StaffDemoPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [notifications, setNotifications] = useState(3);

  // Mock dữ liệu lịch hẹn
const [mockAppointments, setMockAppointments] = useState([
    { id: 1, time: "09:00", duration: "30 phút", customer: "Trần Thị B", pet: "Mèo Miu", status: "waiting", service: "Khám bệnh", phone: "0912345678", detail: "Mèo kém ăn, uể oải 2 ngày" },
    { id: 2, time: "10:30", duration: "45 phút", customer: "Lê Văn C", pet: "Chó Lulu", status: "confirmed", service: "Tiêm phòng", phone: "0987654321", detail: "Tiêm vaccine 5 bệnh" },
    { id: 3, time: "14:00", duration: "30 phút", customer: "Phạm Thị D", pet: "Chó Golden", status: "completed", service: "Khám bệnh", phone: "0901223344", detail: "Đã khám xong lúc 14:25" },
  ]);

  // State dữ liệu thực tế
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State lưu thông tin nhân viên và tên chi nhánh
  const [currentUser, setCurrentUser] = useState(null);
  const [branchName, setBranchName] = useState("Đang tải...");

  // State thống kê
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,   // Chờ xác nhận
    confirmed: 0, // Đã lên lịch / Đã xác nhận
    completed: 0, // Hoàn thành
    cancelled: 0  // Đã hủy
  });


  // --- 1. LẤY THÔNG TIN USER VÀ CHI NHÁNH ---
  useEffect(() => {
    const loadUserInfo = async () => {
      // Giả sử sau khi login bạn lưu user vào localStorage key "user"
      // Cấu trúc user thường là: { MaNhanVien: "NV01", MaChiNhanh: "CN01", ... }
      const userStr = localStorage.getItem("user"); 
      
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);

        // Nếu user có Mã chi nhánh, gọi API để lấy tên
        if (user.MaChiNhanh) {
          try {
            const res = await branchAPI.getById(user.MaChiNhanh);
            if (res.data && res.data.success) {
              setBranchName(res.data.data.TenChiNhanh);
            }
          } catch (error) {
            console.error("Lỗi lấy tên chi nhánh:", error);
            setBranchName(user.MaChiNhanh); // Fallback: hiện mã nếu lỗi
          }
        } else {
            setBranchName("Chưa phân công");
        }
      }
    };
    loadUserInfo();
    fetchAppointments(); // Gọi hàm lấy lịch hẹn
  }, []); // useEffect chạy 1 lần khi mount

  //Fetch dữ liệu khi load trang
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Lấy ngày hôm nay định dạng YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // Gọi API getSchedule
      const res = await appointmentAPI.getSchedule({ date: today });
      
      if (res.data && res.data.success) {
        const data = res.data.data;
        setAppointments(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tính toán số liệu thống kê từ danh sách
  const calculateStats = (data) => {
    const newStats = {
      total: data.length,
      // Lưu ý: So sánh string phải khớp với DB (Tiếng Việt) hoặc Logic backend
      waiting: data.filter(a => a.TrangThai === 'Chờ xác nhận').length,  // ko có trạng thái này
      confirmed: data.filter(a => a.TrangThai === 'Đã lên lịch').length,
      completed: data.filter(a => a.TrangThai === 'Hoàn thành').length,
      cancelled: data.filter(a => a.TrangThai === 'Đã hủy').length,// ko có trạng thái này
    };
    setStats(newStats);
  };

  // 2. Xử lý logic Xác nhận
  const handleConfirm = async (id) => {
    try {
     const res = await appointmentAPI.confirm(id);
      // Refresh lại dữ liệu sau khi thao tác
      fetchAppointments();
    } catch (error) {
      alert("Lỗi khi xác nhận: " + (error.response?.data?.message || error.message));
    }
  };
  // Hoàn thành (Chuyển sang 'Hoàn thành')
  const handleComplete = async (id) => {
    try {
     // if(window.confirm("Xác nhận đã hoàn thành buổi khám/dịch vụ này?")) {
        await appointmentAPI.complete(id);
        fetchAppointments();
      //}
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  /* [TẠM ẨN - TODO: Mở lại khi có API cancel cho Staff]
  // 3. Xử lý logic Hủy
  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
      try {
        await appointmentAPI.cancel(id); // Đảm bảo Backend có API cancel - Đây là api dành cho customer nên tạm thời ko dùng đc
        fetchAppointments();
      } catch (error) {
        alert("Lỗi khi hủy: " + (error.response?.data?.message || error.message));
      }
    }
  };
  */

  const handleShowDetail = (app) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  /// 4. Logic tìm kiếm (Filter Client-side)
  // Mapping field: app.TenKhachHang, app.SDTKhachHang từ API Backend
  const filteredAppointments = appointments.filter(app => {
    const search = searchTerm.toLowerCase();
    const name = app.TenKhachHang ? app.TenKhachHang.toLowerCase() : "";
    const phone = app.SDTKhachHang ? app.SDTKhachHang : "";
    return name.includes(search) || phone.includes(search);
  });
  // Hàm tiện ích render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Chờ xác nhận</Badge>;
      case 'Đã xác nhận':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Đã xác nhận</Badge>;
      case 'Hoàn thành':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Hoàn thành xác nhận</Badge>;
      case 'Đã hủy':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header*/}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-6">
          <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          {/* [CẬP NHẬT]: Hiển thị thông tin Chi Nhánh động */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="PetCare Logo" className="h-8 w-8 rounded-full object-cover"/>
            <div>
              <div className="font-semibold text-sm">PetCareX Staff</div>
              <div className="text-xs text-gray-500">
                {/* Hiển thị tên chi nhánh lấy từ API */}
                {branchName} 
              </div>
            </div>
          </div>
          {/* ----------------------------------------------- */}
          <div className="ml-auto flex items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                      {stats.waiting}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-white shadow-xl rounded-xl border border-gray-100" align="end">
                  <DropdownMenuLabel className="font-bold text-gray-700">Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3">
                    <div className="text-sm">Bạn có {stats.waiting} lịch hẹn chờ xác nhận.</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            <div className="flex items-center gap-3 border-l pl-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Nhân viên</div>
                <div className="text-xs text-gray-500 italic">Staff</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">ST</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16 hidden md:block">
          <nav className="p-4 space-y-2">
            <Link to="/staff/demo">
              <Button 
                variant={location.pathname === "/staff/demo" ? "default" : "ghost"} 
                className={`w-full justify-start gap-3 ${location.pathname === "/staff/demo" ? "bg-blue-600 shadow-sm" : ""}`}
              >
                <Home className="h-4 w-4" /> Trang chủ
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
              <p className="text-gray-500 mt-1">Quản lý lịch hẹn và tra cứu thông tin (Ngày: {new Date().toLocaleDateString('vi-VN')})</p>
            </div>

            {/* Stats Cards - Dữ liệu thật */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5"/> Hôm nay</CardDescription>
                  <CardTitle className="text-3xl font-bold text-blue-600">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Lịch hẹn tổng</div></CardContent>
              </Card>
              <Card className="hover:border-orange-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><Clock className="h-3.5 w-3.5"/> Chờ xác nhận</CardDescription>
                  <CardTitle className="text-3xl text-orange-600 font-bold">{stats.waiting}</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Cần xử lý</div></CardContent>
              </Card>
              <Card className="hover:border-green-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5"/> Hoàn thành xác nhận</CardDescription>
                  <CardTitle className="text-3xl text-green-600 font-bold">{stats.completed}</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Đã khám xong</div></CardContent>
              </Card>
              <Card className="hover:border-red-200 transition-colors">
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2"><XCircle className="h-3.5 w-3.5"/> Hủy</CardDescription>
                  <CardTitle className="text-3xl text-red-600 font-bold">{stats.cancelled}</CardTitle>
                </CardHeader>
                <CardContent><div className="text-xs text-gray-500 font-medium">Lịch hủy hôm nay</div></CardContent>
              </Card>
            </div>

            {/* Danh sách lịch hẹn */}
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
                      placeholder="Tìm theo tên hoặc SĐT..." 
                      className="pl-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy lịch hẹn phù hợp</div>
                  ) : (
                    filteredAppointments.map((app) => (
                      <div key={app.MaLichHen} className="border rounded-lg p-4 hover:border-blue-300 hover:bg-gray-50/50 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-6">
                            <div className="text-center border-r pr-6 border-gray-100 min-w-[80px]">
                              {/* Backend trả về ThoiGianHen dạng Date, ta hiển thị ngày */}
                              <div className="text-lg font-bold text-blue-600">
                                {app.ThoiGianHen ? app.ThoiGianHen.split('T')[0] : '--'}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase font-bold">
                                {app.MaLichHen}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-800">
                                  {app.TenKhachHang}
                                </h4>
                                {renderStatusBadge(app.TrangThai)}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <Stethoscope className="h-3.5 w-3.5 text-gray-400"/> 
                                  Dịch vụ: {app.LoaiDichVu}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5 text-gray-400"/> 
                                  Bác sĩ: {app.TenBacSi || "Chưa phân công"}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <Phone className="h-3 w-3"/> SĐT: {app.SDTKhachHang}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {/* Chỉ hiện nút xác nhận/hủy nếu trạng thái là Đã lên lịch */}
                            {app.TrangThai !== 'Hoàn thành' 
                              && app.TrangThai !== 'Đã hủy' 
                              && (
                              <>
                                {app.TrangThai === 'Đã lên lịch' && (
                                  <Button 
                                    size="sm" variant="outline" 
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                    onClick={() => handleComplete(app.MaLichHen)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Xác nhận
                                  </Button>
                                )}
                                {/* [TẠM ẨN - TODO: API Hủy hiện tại chỉ dành cho Customer. 
                                    Cần bổ sung API cho Staff trước khi mở lại nút này]
                                <Button 
                                  size="sm" variant="outline" 
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleCancel(app.MaLichHen)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Hủy
                                </Button>
                                */}
                              </>
                            )}
                            <Button 
                              size="sm" variant="outline" className="gap-1.5"
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
                <FileText className="h-5 w-5" /> Chi tiết lịch hẹn: {selectedApp?.MaLichHen}
              </DialogTitle>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-4 py-4 text-sm text-left">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div className="text-left">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Khách hàng</p>
                    <p className="font-bold text-gray-800">{selectedApp.TenKhachHang}</p>
                    <p className="text-gray-500">{selectedApp.SDTKhachHang}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Chi Nhánh</p>
                    <p className="font-bold text-blue-600">{selectedApp.MaChiNhanh}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-left">
                  <p className="text-gray-400 text-xs font-bold uppercase">Dịch vụ</p>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-left">
                    <p className="font-semibold text-gray-700">{selectedApp.LoaiDichVu}</p>
                    <p className="text-gray-600 mt-1">Bác sĩ: {selectedApp.TenBacSi || "Chưa có"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-bold text-blue-700">
                    <Clock className="h-4 w-4" /> {selectedApp.ThoiGianHen}
                  </div>
                  {renderStatusBadge(selectedApp.TrangThai)}
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