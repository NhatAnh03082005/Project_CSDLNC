const Membership = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hội viên & Điểm tích lũy</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Hạng thành viên</h3>
          <p className="text-2xl font-bold text-primary-600 mb-2">Thân thiết</p>
          <p className="text-sm text-gray-500">Giảm giá 5% cho tất cả dịch vụ</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Điểm tích lũy</h3>
          <p className="text-2xl font-bold text-primary-600 mb-2">1,250 điểm</p>
          <p className="text-sm text-gray-500">= 125,000 VND</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Lịch sử điểm</h2>
        <p className="text-gray-500">Chưa có lịch sử tích điểm</p>
      </div>
    </div>
  );
};

export default Membership;
