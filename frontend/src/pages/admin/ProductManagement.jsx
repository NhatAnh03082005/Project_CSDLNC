const ProductManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <button className="btn btn-primary">+ Thêm sản phẩm</button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="input max-w-md"
        />
        
        <select className="input max-w-xs">
          <option>Tất cả loại</option>
          <option>Thức ăn</option>
          <option>Thuốc</option>
          <option>Phụ kiện</option>
        </select>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Tên sản phẩm</th>
              <th className="text-left py-3 px-4">Loại</th>
              <th className="text-left py-3 px-4">Giá bán</th>
              <th className="text-left py-3 px-4">Tồn kho</th>
              <th className="text-left py-3 px-4">Trạng thái</th>
              <th className="text-left py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="text-center py-8 text-gray-500">
                Chưa có sản phẩm nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
