// Import UI components (giữ nguyên đường dẫn tương đối đã sửa)
import { Button } from "../../../../components/ui/button";
import { branchAPI } from "../../../../api/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Users, ArrowLeft } from "lucide-react";

export default function EmployeeTransferHistory() {
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
        setBranches(branchesData);
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
    if (selectedBranch?.MaChiNhanh) {
      fetchTransferHistory(selectedBranch.MaChiNhanh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  const fetchTransferHistory = async (branchId) => {
    try {
      setLoading(true);
      const res = await branchAPI.getEmployeeTransferHistory(branchId);
      const list = res.data?.data ?? res.data ?? [];
      setTransferHistory(list);
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

  const formatDate = (dateString) => {
    if (!dateString) return "Đến nay";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // =========================
  // UI: Danh sách chi nhánh
  // =========================
  if (!selectedBranch) {
    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-red-600">{error}</div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 font-semibold text-xl">
            Danh sách chi nhánh
          </CardTitle>
          <CardDescription className="text-gray-600">
            Chọn chi nhánh để xem lịch sử điều động nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <Button
                key={branch.MaChiNhanh}
                variant="outline"
                className="justify-start h-auto p-4 bg-transparent"
                onClick={() => setSelectedBranch(branch)}
              >
                <div className="text-left">
                  <div className="font-semibold text-blue-600">
                    {branch.TenChiNhanh}
                  </div>
                  <div className="text-sm text-gray-500">
                    {branch.ThanhPho} - Xem lịch sử điều động
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // =========================
  // UI: Lịch sử điều động
  // =========================
  return (
    <>
      <Button
        variant="outline"
        className="bg-blue-100 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
        onClick={handleBackToBranches}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách chi nhánh
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 font-semibold text-xl">
            Lịch sử điều động tại {selectedBranch.TenChiNhanh}
          </CardTitle>
          <CardDescription className="text-gray-600">
            Danh sách nhân viên đã và đang làm việc tại chi nhánh
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải lịch sử...
            </div>
          ) : transferHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có lịch sử điều động nào
            </div>
          ) : (
            <div className="space-y-3">
              {transferHistory.map((record, index) => {
                const isCurrentEmployee = !record.NgayKetThuc;
                return (
                  <div
                    key={`${record.MaNhanVien}-${index}`}
                    className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow ${
                      isCurrentEmployee
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`h-10 w-10 rounded-lg ${
                          isCurrentEmployee ? "bg-green-100" : "bg-blue-100"
                        } flex items-center justify-center`}
                      >
                        <Users
                          className={`h-5 w-5 ${
                            isCurrentEmployee
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-600">
                          {record.HoTen}
                        </div>
                        <div className="text-sm text-gray-600">
                          Mã NV: {record.MaNhanVien}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        {formatDate(record.NgayBatDau)} -{" "}
                        {formatDate(record.NgayKetThuc)}
                      </div>
                      {isCurrentEmployee && (
                        <div className="text-xs text-green-600 font-semibold mt-1">
                          Đang làm việc
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
