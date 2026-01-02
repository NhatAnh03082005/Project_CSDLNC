import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeCheck, MapPin, Calendar } from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { Button } from "../../../../components/ui/button";
import { branchAPI } from "../../../../api/services";
import { Card, CardContent } from "../../../../components/ui/card";
import { formatDate } from "../../management/utils/timeFormat";

export default function EmployeeTransferHistory() {
  const navigate = useNavigate();
  const onBackToManagement = () => navigate("/admin/management");

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch danh sách chi nhánh khi mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await branchAPI.getAll();
        const branchesData = res.data?.data ?? res.data ?? [];
        setBranches(Array.isArray(branchesData) ? branchesData : []);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải chi nhánh:", err);
        setError("Không thể tải danh sách chi nhánh");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch lịch sử điều động khi chọn chi nhánh
  useEffect(() => {
    if (selectedBranch?.MaChiNhanh)
      fetchTransferHistory(selectedBranch.MaChiNhanh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchTransferHistory = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getEmployeeTransferHistory(branchId);
      const list = res.data?.data ?? res.data ?? [];
      setTransferHistory(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử điều động:", err);
      setError("Không thể tải lịch sử điều động");
      setTransferHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setTransferHistory([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminHeader />

      <main className="w-full">
        <div className="max-w-[1920px] mx-auto px-6 py-8 space-y-6">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                onClick={
                  selectedBranch ? handleBackToBranches : onBackToManagement
                }
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {selectedBranch
                    ? `Lịch sử điều động - ${selectedBranch.TenChiNhanh}`
                    : "Lịch sử điều động nhân viên"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedBranch
                    ? "Danh sách nhân viên đã/đang làm việc tại chi nhánh"
                    : "Chọn chi nhánh để xem lịch sử điều động"}
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Đang tải dữ liệu...
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {error}
              </CardContent>
            </Card>
          ) : !selectedBranch ? (
            // =========================
            // DANH SÁCH CHI NHÁNH (1 dòng 5 cột)
            // =========================
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {branches.map((branch) => (
                <Card
                  key={branch.MaChiNhanh}
                  className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sky-600"
                >
                  <CardContent>
                    <div className="mb-4 pr-4">
                      <h3 className="text-lg font-bold text-sky-600 mb-2">
                        {branch.TenChiNhanh}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {branch.MaChiNhanh}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-7">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>
                        {branch.Phuong}, {branch.ThanhPho}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
                      onClick={() => setSelectedBranch(branch)}
                    >
                      Xem lịch sử
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : transferHistory.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                Chưa có lịch sử điều động nào
              </CardContent>
            </Card>
          ) : (
            // =========================
            // LỊCH SỬ (card grid 1 dòng 5 cột)
            // =========================
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {transferHistory.map((record, index) => {
                const trangThai = Number(record.TrangThai); // 0/1
                const ngayKetThucNull =
                  record.NgayKetThuc === null ||
                  record.NgayKetThuc === undefined ||
                  record.NgayKetThuc === "";

                const statusKey =
                  trangThai === 1
                    ? "quit"
                    : trangThai === 0 && ngayKetThucNull
                    ? "working"
                    : "transferred";

                const statusConfig = {
                  working: {
                    label: "Đang làm việc",
                    iconText: "text-emerald-600",
                  },
                  transferred: {
                    label: "Đã chuyển công tác",
                    iconText: "text-amber-600",
                  },
                  quit: {
                    label: "Đã nghỉ việc",
                    iconText: "text-red-600",
                  },
                };

                const cfg = statusConfig[statusKey];

                return (
                  <Card
                    key={`${record.MaNhanVien}-${index}`}
                    className={
                      "relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border border-sky-600"
                    }
                  >
                    <CardContent className="pr-4 pl-4">
                      {/* Top */}
                      <div className="mb-6 pr-8">
                        <h3 className="text-lg font-bold text-sky-600 mb-2">
                          {record.HoTen}
                        </h3>

                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          {record.MaNhanVien}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="space-y-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span>
                            {formatDate(record.NgayBatDau)} →{" "}
                            {formatDate(record.NgayKetThuc)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <BadgeCheck
                          className={`h-4 w-4 flex-shrink-0 ${cfg.iconText}`}
                        />
                        <span className={`${cfg.iconText}`}>{cfg.label}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
