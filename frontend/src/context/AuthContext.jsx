import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { authAPI } from "../api/services";
import { useAuthStore } from "../store/authStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      // Lấy state từ store (sử dụng getState để tránh re-render)
      const storeState = useAuthStore.getState();
      const storeToken = storeState.token;
      const storeUser = storeState.user;
      const storeIsAuth = storeState.isAuthenticated;
      
      // Kiểm tra token trong localStorage
      const localStorageToken = localStorage.getItem("token");
      
      // Nếu có thông tin trong store và token khớp
      if (storeToken && storeUser && storeToken === localStorageToken) {
        // Khôi phục từ store
        const path = window.location.pathname;
        const userRole = storeUser.Role;
        
        // Redirect ngay lập tức nếu cần (trước khi set state)
        if (path === '/login' || path === '/register') {
          if (userRole === "customer") {
            window.location.href = '/customer';
            return;
          } else if (userRole === "admin") {
            window.location.href = '/admin/demo';
            return;
          } else if (userRole === "staff") {
            window.location.href = '/staff/demo';
            return;
          }
        }
        // Nếu admin/staff đang ở trang customer hoặc root, redirect về trang của họ
        else if ((userRole === "admin" || userRole === "staff") && (path === '/' || path === '/customer' || path.startsWith('/customer'))) {
          if (userRole === "admin") {
            window.location.href = '/admin/demo';
            return;
          } else {
            window.location.href = '/staff/demo';
            return;
          }
        }
        // Nếu customer đang ở trang admin/staff, redirect về customer
        else if (userRole === "customer" && (path.startsWith('/admin') || path.startsWith('/staff'))) {
          window.location.href = '/customer';
          return;
        }
        
        // Nếu không cần redirect, set state bình thường
        if (mounted) {
          setUser(storeUser);
          setIsAuthenticated(storeIsAuth);
          setLoading(false);
        }
        return;
      }

      // Nếu có token trong localStorage nhưng không có trong store hoặc không khớp
      if (localStorageToken) {
        const path = window.location.pathname;
        // Chỉ skip fetch nếu đang ở login/register (không skip ở "/" vì cần check role)
        if (path === '/login' || path === '/register') {
          if (mounted) setLoading(false);
          return;
        }

        try {
          // Fetch user từ API (dùng /auth/me cho tất cả roles)
          const response = await authAPI.getCurrentUser();
          if (!mounted) return;
          
          if (response?.data?.success) {
            const userData = response.data.data;
            const currentPath = window.location.pathname;
            const userRole = userData.Role;
            
            // Đồng bộ vào store
            useAuthStore.getState().login(userData, localStorageToken);
            
            // Redirect ngay lập tức nếu cần (trước khi set state)
            if (currentPath === '/login' || currentPath === '/register') {
              if (userRole === "customer") {
                window.location.href = '/customer';
                return;
              } else if (userRole === "admin") {
                window.location.href = '/admin/demo';
                return;
              } else if (userRole === "staff") {
                window.location.href = '/staff/demo';
                return;
              }
            }
            // Nếu admin/staff đang ở trang customer hoặc root, redirect về trang của họ
            else if ((userRole === "admin" || userRole === "staff") && (currentPath === '/' || currentPath === '/customer' || currentPath.startsWith('/customer'))) {
              if (userRole === "admin") {
                window.location.href = '/admin/demo';
                return;
              } else {
                window.location.href = '/staff/demo';
                return;
              }
            }
            // Nếu customer đang ở trang admin/staff, redirect về customer
            else if (userRole === "customer" && (currentPath.startsWith('/admin') || currentPath.startsWith('/staff'))) {
              window.location.href = '/customer';
              return;
            }
            
            // Nếu không cần redirect, set state bình thường
            if (mounted) {
              setUser(userData);
              setIsAuthenticated(true);
              setLoading(false);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
            useAuthStore.getState().logout();
            localStorage.removeItem("token");
          }
        } catch (error) {
          if (!mounted) return;
          
          console.error("Lỗi khi tải thông tin người dùng:", error);
          setUser(null);
          setIsAuthenticated(false);
          useAuthStore.getState().logout();
          
          if (error.response?.status === 401) {
            const path = window.location.pathname;
            if (!['/login', '/register', '/'].includes(path)) {
              localStorage.removeItem("token");
            }
          }
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        // Không có token - xóa thông tin trong store nếu có
        if (storeToken || storeUser) {
          useAuthStore.getState().logout();
        }
        if (mounted) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const setUserMemo = useCallback((userData) => {
    setUser(userData);
    // Đồng bộ với store
    if (userData) {
      useAuthStore.getState().setUser(userData);
    }
  }, []);

  const setIsAuthenticatedMemo = useCallback((auth) => {
    setIsAuthenticated(auth);
    // Đồng bộ với store
    useAuthStore.getState().setIsAuthenticated(auth);
  }, []);
  
  const value = useMemo(() => ({
    setUser: setUserMemo,
    setIsAuthenticated: setIsAuthenticatedMemo,
    user,
    isAuthenticated,
  }), [user, isAuthenticated, setUserMemo, setIsAuthenticatedMemo]);

  if (loading) return <div>Loading</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
