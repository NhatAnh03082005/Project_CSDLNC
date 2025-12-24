import { createContext, useContext, useEffect, useState } from "react";
import { customerAPI } from "../api/services";

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // thông tin user
  const [loading, setLoading] = useState(true); // trạng thái load auth

  // 3. Load user từ localStorage khi reload trang
  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await customerAPI.getProfile();
      // Kiểm tra kỹ cấu trúc dữ liệu trước khi set
      if (response && response.data && response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
      // Nếu lỗi 401/500, có thể xóa token để bắt đăng nhập lại
      // localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);
  const value = {
    user,
    isAuthenticated: !!user,
  };

  // 7. Tránh render khi đang load
  if (loading) return <div>Loading</div>;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 8. Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
