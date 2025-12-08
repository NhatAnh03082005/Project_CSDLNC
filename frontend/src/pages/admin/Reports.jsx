const Reports = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Báo cáo & Thống kê</h1>
      
      <div className="mb-6 flex gap-4">
        <select className="input max-w-xs">
          <option>Tháng này</option>
          <option>Tháng trước</option>
          <option>Quý này</option>
          <option>Năm nay</option>
        </select>
        
        <select className="input max-w-xs">
          <option>Tất cả chi nhánh</option>
          <option>Chi nhánh 1</option>
          <option>Chi nhánh 2</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Doanh thu theo thời gian</h2>
          <p className="text-gray-500">Biểu đồ đang được tải...</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Doanh thu theo dịch vụ</h2>
          <p className="text-gray-500">Biểu đồ đang được tải...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Thống kê khách hàng</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tổng khách hàng:</span>
              <span className="font-semibold">1,234</span>
            </div>
            <div className="flex justify-between">
              <span>Khách mới tháng này:</span>
              <span className="font-semibold text-green-600">+156</span>
            </div>
            <div className="flex justify-between">
              <span>Khách VIP:</span>
              <span className="font-semibold">234</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top vacxin sử dụng</h2>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
