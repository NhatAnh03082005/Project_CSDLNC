import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ArrowLeft, Calendar, Clock, Plus, Trash2, CalendarCheck, Sparkles } from "lucide-react";

export default function WorkSchedulePage() {
  const [schedules, setSchedules] = useState([
    { id: 1, date: "2025-12-12", dayOfWeek: "THỨ SÁU", startTime: "08:00", endTime: "17:00", shift: "Ca sáng + chiều" },
    { id: 2, date: "2025-12-13", dayOfWeek: "THỨ BẢY", startTime: "08:00", endTime: "12:00", shift: "Ca sáng" },
  ]);

  const [newShift, setNewShift] = useState({ date: "", startTime: "08:00", endTime: "17:00", shift: "Ca sáng + chiều" });

  const handleAddShift = (e) => {
    e.preventDefault();
    if (!newShift.date) return;
    const days = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];
    const dayName = days[new Date(newShift.date).getDay()];
    const newEntry = { id: Date.now(), ...newShift, dayOfWeek: dayName };
    setSchedules([...schedules, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewShift({ date: "", startTime: "08:00", endTime: "17:00", shift: "Ca sáng + chiều" });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8"> {/* Nền xám nhạt hơn để Card trắng nổi lên */}
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
                  <p className="text-gray-500 mt-1">Theo dõi và sắp xếp thời gian làm việc</p>
                </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: DANH SÁCH ĐÃ ĐĂNG KÝ (Chiếm 7/12 không gian) */}
          <Card className="lg:col-span-7 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-white/50 p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" /> Lịch làm việc trong tuần
                  </CardTitle>
                  <CardDescription className="text-xs font-medium">Danh sách các lịch làm việc đã đăng ký tuần này</CardDescription>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 rounded-full font-bold">
                  {schedules.length} Lịch trình
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                    <div className="flex items-center gap-8">
                      <div className="text-left">
                        <div className="text-[11px] font-black text-blue-500 tracking-[0.2em] mb-1">{schedule.dayOfWeek}</div>
                        <div className="text-xl font-bold text-slate-900">{new Date(schedule.date).toLocaleDateString('vi-VN')}</div>
                      </div>
                      <div className="hidden md:block space-y-2 border-l border-slate-100 pl-8">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <div className="p-1 bg-amber-50 rounded-md"><Clock className="h-3.5 w-3.5 text-amber-500" /></div>
                          {schedule.startTime} — {schedule.endTime}
                        </div>
                        <div className="text-xs font-medium text-slate-400 italic">{schedule.shift}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-3 py-1">Đã xác nhận</Badge>
                      <Button 
                        variant="ghost" size="icon" 
                        className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => setSchedules(schedules.filter(s => s.id !== schedule.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CỘT PHẢI: ĐĂNG KÝ MỚI (Chiếm 5/12 không gian) */}
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
                    value={newShift.date}
                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Tên ca làm</Label>
                  <Input 
                    placeholder="VD: Ca trực sáng..." 
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white"
                    value={newShift.shift}
                    onChange={(e) => setNewShift({...newShift, shift: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Bắt đầu</Label>
                    <Input type="time" className="h-12 rounded-xl border-slate-100 bg-slate-50/50" value={newShift.startTime} onChange={(e) => setNewShift({...newShift, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Kết thúc</Label>
                    <Input type="time" className="h-12 rounded-xl border-slate-100 bg-slate-50/50" value={newShift.endTime} onChange={(e) => setNewShift({...newShift, endTime: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 mt-4 transition-all hover:-translate-y-1 active:scale-95">
                  Xác nhận đăng ký
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}