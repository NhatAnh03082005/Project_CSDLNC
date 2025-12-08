const BranchManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý chi nhánh</h1>
        <button className="btn btn-primary">+ Thêm chi nhánh</button>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Tên chi nhánh</th>
              <th className="text-left py-3 px-4">Địa chỉ</th>
              <th className="text-left py-3 px-4">Số điện thoại</th>
              <th className="text-left py-3 px-4">Giờ hoạt động</th>
              <th className="text-left py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500">
                Chưa có chi nhánh nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchManagement;
