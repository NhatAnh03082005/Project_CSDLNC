const Products = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sản phẩm</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="input max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* TODO: Map product data here */}
        <div className="card">
          <p className="text-gray-500">Đang tải sản phẩm...</p>
        </div>
      </div>
    </div>
  );
};

export default Products;
