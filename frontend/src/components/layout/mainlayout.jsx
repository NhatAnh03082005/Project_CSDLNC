import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header'; // Đảm bảo đường dẫn đúng
import Footer from './footer'; // Đảm bảo đường dẫn đúng

const MainLayout = () => {
  return (
    /* flex-col: Xếp Header, Outlet và Footer theo chiều dọc.
      min-h-screen: Đảm bảo layout cao ít nhất bằng 100% chiều cao màn hình.
    */
    <div className="flex flex-col min-h-screen">
      {/* 1. Header cố định ở trên */}
      <Header />

      {/* 2. Phần nội dung chính (Outlet):
        flex-grow: Sẽ tự động giãn ra để chiếm toàn bộ khoảng trống còn thừa,
        từ đó đẩy Footer xuống đáy màn hình.
      */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. Footer luôn nằm ở cuối cùng */}
      <Footer />
    </div>
  );
};

export default MainLayout;