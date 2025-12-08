const EmployeeDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Nhân viên</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Lịch hẹn hôm nay</h3>
          <p className="text-3xl font-bold text-primary-600">8</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Hóa đơn hôm nay</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Doanh thu hôm nay</h3>
          <p className="text-3xl font-bold text-primary-600">15.5M</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Lịch hẹn sắp tới</h2>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
