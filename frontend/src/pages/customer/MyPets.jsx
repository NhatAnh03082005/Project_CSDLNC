const MyPets = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Thú cưng của tôi</h1>
        <button className="btn btn-primary">+ Thêm thú cưng</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TODO: Map pet data here */}
        <div className="card">
          <p className="text-gray-500">Chưa có thú cưng nào</p>
        </div>
      </div>
    </div>
  );
};

export default MyPets;
