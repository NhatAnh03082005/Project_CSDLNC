import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { customerAPI } from "../api/services";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      const path = window.location.pathname;
      if (path === '/login' || path === '/register' || path === '/') {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const response = await customerAPI.getProfile();
        if (!mounted) return;
        
        if (response?.data?.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error("Lỗi khi tải thông tin người dùng:", error);
        setUser(null);
        setIsAuthenticated(false);
        
        if (error.response?.status === 401) {
          const path = window.location.pathname;
          if (!['/login', '/register', '/'].includes(path)) {
            localStorage.removeItem("token");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchUser();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  const setUserMemo = useCallback((userData) => {
    setUser(userData);
  }, []);

  const setIsAuthenticatedMemo = useCallback((auth) => {
    setIsAuthenticated(auth);
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
