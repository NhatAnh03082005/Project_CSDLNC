import React, { useState } from "react";
// 1. Thay thế Next.js Link bằng React Router DOM Link
import { Link } from "react-router-dom"; 

// 2. Chuyển đổi imports alias (@/) sang đường dẫn tương đối (../...)
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { ArrowLeft, Save, Stethoscope } from "lucide-react";

// Xóa bỏ "use client" và import type React

export default function MedicalRecordsPage() {
  // Loại bỏ khai báo kiểu TypeScript: <string | null>
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    prescription: "",
    followUpDate: "",
  });

  const pendingRecords = [
    {
      id: "1",
      customerName: "Trần Thị B",
      petName: "Mèo Miu",
      serviceType: "Khám bệnh",
      date: "2024-01-15",
      time: "09:00",
      customerId: "KH001",
      petId: "TC001",
    },
    {
      id: "2",
      customerName: "Lê Văn C",
      petName: "Chó Lucky",
      serviceType: "Khám bệnh",
      date: "2024-01-15",
      time: "10:30",
      customerId: "KH002",
      petId: "TC002",
    },
    {
      id: "3",
      customerName: "Phạm Thị D",
      petName: "Chó Golden",
      serviceType: "Khám định kỳ",
      date: "2024-01-15",
      time: "14:00",
      customerId: "KH003",
      petId: "TC003",
    },
  ];

  // Loại bỏ khai báo kiểu TypeScript: (recordId: string)
  const handleSelectRecord = (recordId) => {
    setSelectedRecord(recordId);
    setShowForm(true);
  };

  // Loại bỏ khai báo kiểu TypeScript: (e: React.FormEvent)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Hồ sơ khám bệnh đã được cập nhật thành công!");
    setShowForm(false);
    setSelectedRecord(null);
  };

  const selectedRecordData = pendingRecords.find((r) => r.id === selectedRecord);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Sửa Link href -> to */}
        <Link to="/staff/demo">
          <Button variant="ghost" className="gap-2 text-slate-500 hover:bg-white hover:shadow-sm transition-all">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            Cập nhật hồ sơ khám bệnh
          </h1>
          <p className="text-gray-500 mt-1">Chọn hồ sơ cần điền thông tin khám bệnh</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách hồ sơ chờ cập nhật</CardTitle>
            <CardDescription>Click vào hồ sơ để điền thông tin khám bệnh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRecords.map((record) => (
                <Card
                  key={record.id}
                  className="cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                  onClick={() => handleSelectRecord(record.id)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex gap-4 items-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{record.time}</div>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cập nhật hồ sơ khám bệnh</DialogTitle>
              <DialogDescription>
                Điền thông tin khám bệnh cho {selectedRecordData?.customerName} - {selectedRecordData?.petName}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
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
                <Label htmlFor="symptoms">Triệu chứng *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Mô tả các triệu chứng của thú cưng..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Chuẩn đoán *</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Nhập chuẩn đoán bệnh..."
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescription">Toa thuốc *</Label>
                <Textarea
                  id="prescription"
                  placeholder="Nhập toa thuốc (tên thuốc, liều lượng, cách dùng)..."
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUpDate">Ngày hẹn tái khám</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>

              {/* Action Buttons - Đã căn chỉnh trực quan và thu gọn */}
              <div className="flex items-center justify-start gap-3 pt-6 border-t border-gray-100 mt-6 ml-4">
                {/* Nút Chính: Lưu hồ sơ - Nổi bật và bo góc đồng bộ */}
                <Button 
                  className="flex-none px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 gap-2 transition-all active:scale-95"
                >
                  <Save className="h-4 w-4" />
                  Lưu hồ sơ khám bệnh
                </Button>

                {/* Nút Phụ: Hủy - Dạng ghost/outline để giảm sự chú ý, nhỏ gọn hơn */}
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:bg-gray-100 px-4 h-10 text-sm font-medium rounded-xl"
                >
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