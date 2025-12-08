const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Quản trị</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Tổng doanh thu tháng</h3>
          <p className="text-2xl font-bold text-primary-600">245.8M</p>
          <p className="text-sm text-green-600 mt-1">↑ 12.5% so với tháng trước</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Khách hàng mới</h3>
          <p className="text-2xl font-bold text-primary-600">156</p>
          <p className="text-sm text-green-600 mt-1">↑ 8.3%</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Lịch hẹn tháng</h3>
          <p className="text-2xl font-bold text-primary-600">423</p>
          <p className="text-sm text-green-600 mt-1">↑ 15.2%</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Hóa đơn tháng</h3>
          <p className="text-2xl font-bold text-primary-600">512</p>
          <p className="text-sm text-green-600 mt-1">↑ 10.8%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Doanh thu theo chi nhánh</h2>
          <p className="text-gray-500">Biểu đồ đang được tải...</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top dịch vụ</h2>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
