import React from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

// Xóa bỏ "use client"

export default function WorkSchedulePage() {
  const schedules = [
    {
      id: 1,
      date: "12/12/2025",
      dayOfWeek: "Thứ Sáu",
      startTime: "08:00",
      endTime: "17:00",
      shift: "Ca sáng + chiều",
    },
    {
      id: 2,
      date: "13/12/2025",
      dayOfWeek: "Thứ Bảy",
      startTime: "08:00",
      endTime: "12:00",
      shift: "Ca sáng",
    },
    {
      id: 3,
      date: "14/12/2025",
      dayOfWeek: "Chủ Nhật",
      startTime: "13:00",
      endTime: "20:00",
      shift: "Ca chiều",
    },
    {
      id: 4,
      date: "16/12/2025",
      dayOfWeek: "Thứ Hai",
      startTime: "08:00",
      endTime: "17:00",
      shift: "Ca sáng + chiều",
    },
    {
      id: 5,
      date: "17/12/2025",
      dayOfWeek: "Thứ Ba",
      startTime: "08:00",
      endTime: "17:00",
      shift: "Ca sáng + chiều",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Sửa Link href -> to */}
        <Link to="/staff/demo">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch làm việc của tôi</h1>
          <p className="text-gray-500 mt-1">Xem lịch làm việc được phân công</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch làm việc tuần này
            </CardTitle>
            <CardDescription>Danh sách ca làm việc được phân công cho bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{schedule.date}</div>
                        <div className="text-sm text-gray-500">{schedule.dayOfWeek}</div>
                      </div>
                      <div className="h-12 w-px bg-gray-200" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{schedule.shift}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Đã xác nhận
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}