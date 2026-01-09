import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { employeeAPI } from "../../../api/services";
import { toast } from "../../../lib/toast";
import StaffHeader from "../../../components/staff/StaffHeader";
import StaffSidebar from "../../../components/staff/StaffSidebar";
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
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Stethoscope,
  Loader2,
  AlertCircle,
  RefreshCw,
  PawPrint,
  Calendar,
  User,
} from "lucide-react";

export default function MedicalRecordsPage() {
  const [pendingRecords, setPendingRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    prescription: "",
    followUpDate: "",
  });

  // Fetch pending records on mount
  useEffect(() => {
    fetchPendingRecords();
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

  const fetchPendingRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/medical/records/pending");
      if (response.data.success) {
        setPendingRecords(response.data.data || []);
      } else {
        setError(response.data.message || "Không thể lấy danh sách hồ sơ");
      }
    } catch (err) {
      console.error("Error fetching pending records:", err);
      setError(
        err.response?.data?.message || "Lỗi khi lấy danh sách hồ sơ khám bệnh"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setFormData({
      symptoms: "",
      diagnosis: "",
      prescription: "",
      followUpDate: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.symptoms.trim() ||
      !formData.diagnosis.trim() ||
      !formData.prescription.trim()
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.put(
        `/medical/records/${selectedRecord.maHoaDon}/${selectedRecord.stt}`,
        {
          TrieuChung: formData.symptoms,
          ChanDoan: formData.diagnosis,
          ToaThuoc: formData.prescription,
          NgayTaiKham: formData.followUpDate || null,
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật hồ sơ khám bệnh thành công!");
        setShowForm(false);
        setSelectedRecord(null);
        fetchPendingRecords(); // Refresh list
      } else {
        toast.error(response.data.message || "Không thể cập nhật hồ sơ");
      }
    } catch (err) {
      console.error("Error updating record:", err);
      toast.error(
        err.response?.data?.message || "Không thể cập nhật hồ sơ khám bệnh"
      );
    } finally {
      setSubmitting(false);
    }
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

        <main className="flex-1 p-8 min-w-0 bg-blue-50">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                  Cập nhật hồ sơ khám bệnh
                </h1>
                <p className="text-gray-500 mt-1">
                  Chọn hồ sơ cần điền thông tin khám bệnh
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchPendingRecords}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />{" "}
                Làm mới
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Danh sách hồ sơ chờ cập nhật</span>
                  {!loading && (
                    <Badge variant="secondary">
                      {pendingRecords.length} hồ sơ
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Click vào hồ sơ để điền thông tin khám bệnh
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 mx-auto mb-4 text-blue-500 animate-spin" />
                    <p className="text-gray-500">Đang tải danh sách hồ sơ...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    <AlertCircle className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">Lỗi</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                ) : pendingRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Stethoscope className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold">
                      Không có hồ sơ nào chờ cập nhật
                    </p>
                    <p className="text-sm mt-1">
                      Tất cả hồ sơ khám bệnh đã được điền thông tin
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRecords.map((record) => (
                      <Card
                        key={`${record.maHoaDon}-${record.stt}`}
                        className="cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                        onClick={() => handleSelectRecord(record)}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <PawPrint className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">
                                {record.tenKhachHang} - {record.tenThuCung}
                              </h4>
                              <div className="text-sm text-gray-600 flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />{" "}
                                  {record.maKhachHang}
                                </span>
                                <span>
                                  {record.loaiThuCung} - {record.giongThuCung}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Ngày tạo:{" "}
                                {record.ngayLap}
                                <span className="mx-2">|</span>
                                Mã HĐ: {record.maHoaDon}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            Chờ cập nhật
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Cập nhật hồ sơ khám bệnh</DialogTitle>
                  <DialogDescription>
                    Điền thông tin khám bệnh cho {selectedRecord?.tenKhachHang}{" "}
                    - {selectedRecord?.tenThuCung}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-semibold">Khách hàng:</span>{" "}
                          {selectedRecord?.tenKhachHang}
                        </div>
                        <div>
                          <span className="font-semibold">Thú cưng:</span>{" "}
                          {selectedRecord?.tenThuCung} (
                          {selectedRecord?.loaiThuCung} -{" "}
                          {selectedRecord?.giongThuCung})
                        </div>
                        <div>
                          <span className="font-semibold">Mã KH:</span>{" "}
                          {selectedRecord?.maKhachHang}
                        </div>
                        <div>
                          <span className="font-semibold">Mã HĐ:</span>{" "}
                          {selectedRecord?.maHoaDon} - STT:{" "}
                          {selectedRecord?.stt}
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
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, diagnosis: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prescription: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          followUpDate: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="flex items-center justify-start gap-3 pt-6 border-t border-gray-100 mt-6 ml-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-none px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-100 gap-2 transition-all active:scale-95"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Lưu hồ sơ khám bệnh
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="text-gray-500 hover:bg-gray-100 px-4 h-10 text-sm font-medium rounded-xl"
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
