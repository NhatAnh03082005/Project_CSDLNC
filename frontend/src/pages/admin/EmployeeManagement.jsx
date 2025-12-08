const EmployeeManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
        <button className="btn btn-primary">+ Thêm nhân viên</button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          className="input max-w-md"
        />
        
        <select className="input max-w-xs">
          <option>Tất cả chi nhánh</option>
          <option>Chi nhánh 1</option>
          <option>Chi nhánh 2</option>
        </select>

        <select className="input max-w-xs">
          <option>Tất cả chức vụ</option>
          <option>Bác sĩ</option>
          <option>Lễ tân</option>
          <option>Bán hàng</option>
        </select>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Họ tên</th>
              <th className="text-left py-3 px-4">Chức vụ</th>
              <th className="text-left py-3 px-4">Chi nhánh</th>
              <th className="text-left py-3 px-4">Ngày vào làm</th>
              <th className="text-left py-3 px-4">Lương</th>
              <th className="text-left py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="text-center py-8 text-gray-500">
                Chưa có nhân viên nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;
