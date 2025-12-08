const Schedule = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Lịch hẹn</h1>
      
      <div className="mb-6 flex gap-4">
        <select className="input max-w-xs">
          <option>Hôm nay</option>
          <option>Tuần này</option>
          <option>Tháng này</option>
        </select>
        
        <select className="input max-w-xs">
          <option>Tất cả bác sĩ</option>
          <option>BS. Nguyễn Văn A</option>
          <option>BS. Trần Thị B</option>
        </select>
      </div>

      <div className="card">
        <p className="text-gray-500">Đang tải lịch hẹn...</p>
      </div>
    </div>
  );
};

export default Schedule;
