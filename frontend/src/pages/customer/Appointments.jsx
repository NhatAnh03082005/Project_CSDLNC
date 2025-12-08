const Appointments = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lịch hẹn</h1>
        <button className="btn btn-primary">+ Đặt lịch mới</button>
      </div>

      <div className="card">
        <p className="text-gray-500">Chưa có lịch hẹn nào</p>
      </div>
    </div>
  );
};

export default Appointments;
