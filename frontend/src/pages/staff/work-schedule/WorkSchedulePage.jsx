import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import {
  Calendar,
  Clock,
  Trash2,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { employeeAPI } from "../../../api/services";
import { useAuthStore } from "../../../store/authStore";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";

export default function WorkSchedulePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [newShift, setNewShift] = useState({
    NgayLam: "",
    GioBatDau: "08:00",
    GioKetThuc: "17:00",
  });
  const [selectedShift, setSelectedShift] = useState(null);

  const shiftPresets = [
    { label: "Ca Sáng", start: "08:00", end: "12:00", id: "morning" },
    { label: "Ca Chiều", start: "13:00", end: "17:00", id: "afternoon" },
    { label: "Cả Ngày", start: "08:00", end: "17:00", id: "fullday" },
  ];

  const handleShiftPreset = (preset) => {
    setSelectedShift(preset.id);
    setNewShift((prev) => ({
      ...prev,
      GioBatDau: preset.start,
      GioKetThuc: preset.end,
    }));
  };

  useEffect(() => {
    fetchSchedules();
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

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getWorkSchedule();
      const data = response.data;
      if (data.success) setSchedules(data.data || []);
      else setError(data.message || "Lỗi khi lấy lịch làm việc");
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
        setSelectedShift(null);
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
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa lịch làm việc ngày ${schedule.ngayLam}?`
      )
    )
      return;

    try {
      setDeleting(`${schedule.ngayLam}-${schedule.gioBatDau}`);
      const response = await employeeAPI.deleteWorkSchedule({
        ngayLam: schedule.ngayLam,
        gioBatDau: schedule.gioBatDau,
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
    const days = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatTime = (time) => {
    if (!time) return "";

    if (time instanceof Date) {
      const hours = time.getUTCHours();
      const minutes = time.getUTCMinutes();
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }

    if (typeof time === "string" && time.includes("T")) {
      const date = new Date(time);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }

    if (typeof time === "object" && time !== null) {
      return `${String(time.hours || 0).padStart(2, "0")}:${String(
        time.minutes || 0
      ).padStart(2, "0")}`;
    }

    return time.toString().substring(0, 5);
  };

  const getShiftName = (startTime, endTime) => {
    const start = parseInt(formatTime(startTime).split(":")[0]);
    const end = parseInt(formatTime(endTime).split(":")[0]);
    if (start < 12 && end <= 12) return "Ca sáng";
    if (start >= 12) return "Ca chiều";
    return "Ca sáng + chiều";
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

        {/* Main */}
        <main className="flex-1 p-8 min-w-0 bg-blue-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* ✅ 2 card cùng chiều cao */}
            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              {/* LEFT */}
              <Card className="lg:col-span-7 border-none bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col h-[565px]">
                <CardHeader className="border-b border-blue-200 bg-white px-6 py-4 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Lịch làm việc của bạn
                      </CardTitle>
                      <CardDescription className="text-md text-gray-600">
                        Danh sách các lịch làm việc đã đăng ký
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 rounded-full font-bold">
                      {schedules.length} Lịch làm việc
                    </Badge>
                  </div>
                </CardHeader>

                {/* ✅ phần content scroll */}
                <CardContent className="p-0 flex-1 min-h-0">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : schedules.length === 0 ? (
                    <div className="text-center h-full flex flex-col items-center justify-center text-gray-500">
                      <Calendar className="h-12 w-12 mb-4 text-gray-300" />
                      <p>Chưa có lịch làm việc nào</p>
                      <p className="text-sm">Đăng ký lịch mới ở bên phải</p>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto divide-y divide-slate-100 pr-1">
                      {schedules.map((schedule, index) => (
                        <div
                          key={`${schedule.ngayLam}-${schedule.gioBatDau}-${index}`}
                          className="p-5 flex items-center gap-6 hover:bg-slate-50/60 transition-all group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span className="text-base font-bold text-slate-800">
                                {getDayOfWeek(schedule.ngayLam)},{" "}
                                {new Date(schedule.ngayLam).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-600">
                                {formatTime(schedule.gioBatDau)} —{" "}
                                {formatTime(schedule.gioKetThuc)}
                              </span>
                              <span className="text-sm text-gray-500">
                                ·{" "}
                                {getShiftName(
                                  schedule.gioBatDau,
                                  schedule.gioKetThuc
                                )}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => handleDeleteShift(schedule)}
                            disabled={
                              deleting ===
                              `${schedule.ngayLam}-${schedule.gioBatDau}`
                            }
                          >
                            {deleting ===
                            `${schedule.ngayLam}-${schedule.gioBatDau}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RIGHT (cùng height) */}
              <div className="lg:col-span-5">
                <Card className="border-none bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.07)] border-t-4 border-t-blue-600 flex flex-col h-[565px]">
                  <CardHeader className="p-6 flex-shrink-0">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      Đăng ký lịch mới
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Chọn nhanh ca làm việc hoặc tùy chỉnh thời gian
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 flex-1 min-h-0">
                    {/* ✅ nếu nội dung nhiều vẫn không vỡ layout */}
                    <div className="h-full overflow-y-auto pr-1">
                      <form onSubmit={handleAddShift} className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Ngày làm việc
                          </Label>
                          <Input
                            type="date"
                            className="h-12 rounded-xl border-slate-100 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                            value={newShift.NgayLam}
                            onChange={(e) =>
                              setNewShift((prev) => ({
                                ...prev,
                                NgayLam: e.target.value,
                              }))
                            }
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Chọn nhanh ca
                          </Label>
                          <div className="flex gap-2">
                            {shiftPresets.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleShiftPreset(preset)}
                                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${
                                  selectedShift === preset.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
                              Bắt đầu
                            </Label>
                            <Input
                              type="time"
                              className="h-12 rounded-xl border-slate-100 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                              value={newShift.GioBatDau}
                              onChange={(e) => {
                                setNewShift((prev) => ({
                                  ...prev,
                                  GioBatDau: e.target.value,
                                }));
                                setSelectedShift(null);
                              }}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase ml-1">
                              Kết thúc
                            </Label>
                            <Input
                              type="time"
                              className="h-12 rounded-xl border-slate-100 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                              value={newShift.GioKetThuc}
                              onChange={(e) => {
                                setNewShift((prev) => ({
                                  ...prev,
                                  GioKetThuc: e.target.value,
                                }));
                                setSelectedShift(null);
                              }}
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
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all hover:shadow-xl active:scale-[0.98]"
                          disabled={
                            submitting || user?.ViTri !== "Bác sĩ thú y"
                          }
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Đang xử lý...
                            </>
                          ) : (
                            "Xác nhận đăng ký"
                          )}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
