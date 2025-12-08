const MedicalRecords = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hồ sơ khám bệnh</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên thú cưng, khách hàng..."
          className="input max-w-md"
        />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách hồ sơ</h2>
          <button className="btn btn-primary">+ Tạo hồ sơ mới</button>
        </div>
        
        <p className="text-gray-500">Chưa có hồ sơ nào</p>
      </div>
    </div>
  );
};

export default MedicalRecords;
