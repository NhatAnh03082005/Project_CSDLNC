import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { ArrowLeft, Save, Syringe } from "lucide-react";

// Xóa bỏ "use client" và import type React

export default function VaccinationRecordsPage() {
  // Loại bỏ khai báo kiểu TypeScript: <string | null>
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    vaccineId: "",
  });

  const pendingRecords = [
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      petName: "Chó Bobby",
      serviceType: "Tiêm phòng",
      date: "2024-01-15",
      time: "09:30",
      customerId: "KH004",
      petId: "TC004",
    },
    {
      id: "2",
      customerName: "Hoàng Thị E",
      petName: "Mèo Tom",
      serviceType: "Tiêm phòng",
      date: "2024-01-15",
      time: "11:00",
      customerId: "KH005",
      petId: "TC005",
    },
    {
      id: "3",
      customerName: "Đỗ Văn F",
      petName: "Chó Max",
      serviceType: "Tiêm vaccine định kỳ",
      date: "2024-01-15",
      time: "15:30",
      customerId: "KH006",
      petId: "TC006",
    },
  ];

  const vaccines = [
    { id: "1", name: "Vaccine 5 bệnh (DHPPL)", type: "Chó" },
    { id: "2", name: "Vaccine 7 bệnh", type: "Chó" },
    { id: "3", name: "Vaccine dại", type: "Chó & Mèo" },
    { id: "4", name: "Vaccine 3 bệnh (FVRCP)", type: "Mèo" },
    { id: "5", name: "Vaccine 4 bệnh", type: "Mèo" },
    { id: "6", name: "Nobivac KC", type: "Chó" },
  ];

  // Loại bỏ khai báo kiểu TypeScript: (recordId: string)
  const handleSelectRecord = (recordId) => {
    setSelectedRecord(recordId);
    setShowForm(true);
  };

  // Loại bỏ khai báo kiểu TypeScript: (e: React.FormEvent)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vaccineId) {
        alert("Vui lòng chọn loại vaccine!");
        return;
    }
    alert("Hồ sơ tiêm phòng đã được cập nhật thành công!");
    setShowForm(false);
    setSelectedRecord(null);
    setFormData({ vaccineId: "" }); // Reset form
  };

  const selectedRecordData = pendingRecords.find((r) => r.id === selectedRecord);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Sửa Link href -> to */}
        <Link to="/staff/demo">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Syringe className="h-8 w-8 text-green-600" />
            Cập nhật hồ sơ tiêm phòng
          </h1>
          <p className="text-gray-500 mt-1">Chọn hồ sơ cần chọn loại vaccine</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách hồ sơ chờ cập nhật</CardTitle>
            <CardDescription>Click vào hồ sơ để chọn loại vaccine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRecords.map((record) => (
                <Card
                  key={record.id}
                  className="cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                  onClick={() => handleSelectRecord(record.id)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex gap-4 items-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{record.time}</div>
                        <div className="text-xs text-gray-500">{record.date}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {record.customerName} - {record.petName}
                        </h4>
                        <div className="text-sm text-gray-600">Loại dịch vụ: {record.serviceType}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Mã KH: {record.customerId} | Mã TC: {record.petId}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Chờ cập nhật
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cập nhật hồ sơ tiêm phòng</DialogTitle>
              <DialogDescription>
                Chọn loại vaccine cho {selectedRecordData?.customerName} - {selectedRecordData?.petName}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold">Khách hàng:</span> {selectedRecordData?.customerName}
                    </div>
                    <div>
                      <span className="font-semibold">Thú cưng:</span> {selectedRecordData?.petName}
                    </div>
                    <div>
                      <span className="font-semibold">Mã KH:</span> {selectedRecordData?.customerId}
                    </div>
                    <div>
                      <span className="font-semibold">Mã TC:</span> {selectedRecordData?.petId}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="vaccine">Chọn loại vaccine *</Label>
                <Select
                  value={formData.vaccineId}
                  onValueChange={(value) => setFormData({ ...formData, vaccineId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại vaccine cần tiêm" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccines.map((vaccine) => (
                      <SelectItem key={vaccine.id} value={vaccine.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{vaccine.name}</span>
                          <span className="text-xs text-gray-500">Dành cho: {vaccine.type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Kiểm tra tình trạng sức khỏe của thú cưng trước khi tiêm</li>
                    <li>Xác nhận thông tin khách hàng và thú cưng chính xác</li>
                    <li>Ghi chú ngày hẹn tiêm mũi tiếp theo nếu cần</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Lưu hồ sơ tiêm phòng
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}