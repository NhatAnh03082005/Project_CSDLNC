import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ArrowLeft, Calendar, Clock, Trash2, CalendarCheck, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { employeeAPI } from "../../../api/services";
import { useAuthStore } from "../../../store/authStore";

export default function WorkSchedulePage() {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [newShift, setNewShift] = useState({ 
    NgayLam: "", 
    GioBatDau: "08:00", 
    GioKetThuc: "17:00" 
  });

  // Fetch schedules on mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getWorkSchedule();
      const data = response.data;
      if (data.success) {
        setSchedules(data.data || []);
      } else {
        setError(data.message || "Lỗi khi lấy lịch làm việc");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    if (!newShift.NgayLam) {
      alert("Vui lòng chọn ngày làm việc");
      return;
    }

    try {
      setSubmitting(true);
      const response = await employeeAPI.createWorkSchedule(newShift);
      const data = response.data;
      
      if (data.success) {
        alert("Đăng ký lịch làm việc thành công!");
        setNewShift({ NgayLam: "", GioBatDau: "08:00", GioKetThuc: "17:00" });
        fetchSchedules();
      } else {
        alert(data.message || "Lỗi khi đăng ký lịch làm việc");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi đăng ký lịch làm việc");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShift = async (schedule) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa lịch làm việc ngày ${schedule.ngayLam}?`)) {
      return;
    }

    try {
      setDeleting(`${schedule.ngayLam}-${schedule.gioBatDau}`);
      const response = await employeeAPI.deleteWorkSchedule({
        ngayLam: schedule.ngayLam,
        gioBatDau: schedule.gioBatDau
      });
      const data = response.data;
      
      if (data.success) {
        alert("Xóa lịch làm việc thành công!");
        fetchSchedules();
      } else {
        alert(data.message || "Lỗi khi xóa lịch làm việc");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi xóa lịch làm việc");
    } finally {
      setDeleting(null);
    }
  };

  const getDayOfWeek = (dateString) => {
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatTime = (time) => {
    if (!time) return "";
    
    // Handle Date object (SQL TIME is often returned as Date with 1970-01-01)
    if (time instanceof Date) {
      const hours = time.getUTCHours();
      const minutes = time.getUTCMinutes();
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    // Handle ISO string like "1970-01-01T08:00:00.000Z"
    if (typeof time === 'string' && time.includes('T')) {
      const date = new Date(time);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    // Handle time object with hours/minutes properties
    if (typeof time === 'object' && time !== null) {
      return `${String(time.hours || 0).padStart(2, '0')}:${String(time.minutes || 0).padStart(2, '0')}`;
    }
    
    // Handle plain string like "08:00:00"
    return time.toString().substring(0, 5);
  };

  const getShiftName = (startTime, endTime) => {
    const start = parseInt(formatTime(startTime).split(':')[0]);
    const end = parseInt(formatTime(endTime).split(':')[0]);
    
    if (start < 12 && end <= 12) return "Ca sáng";
    if (start >= 12) return "Ca chiều";
    return "Ca sáng + chiều";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Link to="/staff/demo">
          <Button variant="ghost" className="gap-2 text-slate-500 hover:bg-white hover:shadow-sm transition-all">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarCheck className="h-8 w-8 text-blue-600" />
            Quản lý lịch làm việc
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi và sắp xếp thời gian làm việc
            {user?.ViTri && <span className="ml-2 text-blue-600 font-medium">({user.ViTri})</span>}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: DANH SÁCH ĐÃ ĐĂNG KÝ */}
          <Card className="lg:col-span-7 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-white/50 p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" /> Lịch làm việc của bạn
                  </CardTitle>
                  <CardDescription className="text-xs font-medium">Danh sách các lịch làm việc đã đăng ký</CardDescription>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 rounded-full font-bold">
                  {schedules.length} Lịch trình
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có lịch làm việc nào</p>
                  <p className="text-sm">Đăng ký lịch mới ở bên phải</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {schedules.map((schedule, index) => (
                    <div key={`${schedule.ngayLam}-${schedule.gioBatDau}-${index}`} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                      <div className="flex items-center gap-8">
                        <div className="text-left">
                          <div className="text-[11px] font-black text-blue-500 tracking-[0.2em] mb-1">
                            {getDayOfWeek(schedule.ngayLam).toUpperCase()}
                          </div>
                          <div className="text-xl font-bold text-slate-900">
                            {new Date(schedule.ngayLam).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="hidden md:block space-y-2 border-l border-slate-100 pl-8">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <div className="p-1 bg-amber-50 rounded-md"><Clock className="h-3.5 w-3.5 text-amber-500" /></div>
                            {formatTime(schedule.gioBatDau)} — {formatTime(schedule.gioKetThuc)}
                          </div>
                          <div className="text-xs font-medium text-slate-400 italic">
                            {getShiftName(schedule.gioBatDau, schedule.gioKetThuc)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-3 py-1">Đã xác nhận</Badge>
                        <Button 
                          variant="ghost" size="icon" 
                          className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => handleDeleteShift(schedule)}
                          disabled={deleting === `${schedule.ngayLam}-${schedule.gioBatDau}`}
                        >
                          {deleting === `${schedule.ngayLam}-${schedule.gioBatDau}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CỘT PHẢI: ĐĂNG KÝ MỚI */}
          <Card className="lg:col-span-5 border-none shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] bg-white rounded-3xl border-t-4 border-t-blue-600">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" /> Đăng ký lịch mới
              </CardTitle>
              <CardDescription className="text-xs">Vui lòng chọn thời gian bạn muốn làm việc</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleAddShift} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Ngày làm việc</Label>
                  <Input 
                    type="date" 
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    value={newShift.NgayLam}
                    onChange={(e) => setNewShift({...newShift, NgayLam: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Bắt đầu</Label>
                    <Input 
                      type="time" 
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50" 
                      value={newShift.GioBatDau} 
                      onChange={(e) => setNewShift({...newShift, GioBatDau: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Kết thúc</Label>
                    <Input 
                      type="time" 
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50" 
                      value={newShift.GioKetThuc} 
                      onChange={(e) => setNewShift({...newShift, GioKetThuc: e.target.value})} 
                      required
                    />
                  </div>
                </div>

                {user?.ViTri !== "Bác sĩ thú y" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Chỉ bác sĩ thú y mới có thể đăng ký lịch làm việc
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 mt-4 transition-all hover:-translate-y-1 active:scale-95"
                  disabled={submitting || user?.ViTri !== "Bác sĩ thú y"}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận đăng ký"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}