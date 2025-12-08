const CreateInvoice = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Lập hóa đơn</h1>
      
      <div className="card">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khách hàng
              </label>
              <input type="text" className="input" placeholder="Tìm khách hàng..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thú cưng
              </label>
              <select className="input">
                <option>Chọn thú cưng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dịch vụ/Sản phẩm
            </label>
            <button type="button" className="btn btn-secondary">
              + Thêm dịch vụ/sản phẩm
            </button>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng tiền:</span>
              <span className="text-primary-600">0 VND</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary">
              Thanh toán
            </button>
            <button type="button" className="btn btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
