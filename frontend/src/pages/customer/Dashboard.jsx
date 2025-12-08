const CustomerDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chào mừng quay trở lại!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Thú cưng</h3>
          <p className="text-3xl font-bold text-primary-600">5</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Lịch hẹn</h3>
          <p className="text-3xl font-bold text-primary-600">2</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Điểm tích lũy</h3>
          <p className="text-3xl font-bold text-primary-600">1,250</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Lịch hẹn sắp tới</h2>
        <p className="text-gray-500">Chưa có lịch hẹn nào</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
