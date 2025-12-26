import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let redirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const publicPaths = ['/login', '/register', '/'];
      
      if (!publicPaths.includes(path) && !redirecting) {
        const token = localStorage.getItem("token");
        if (token) {
          redirecting = true;
          useAuthStore.getState().logout();
          localStorage.removeItem("token");
          
          setTimeout(() => {
            if (window.location.pathname === path && !publicPaths.includes(window.location.pathname)) {
              window.location.href = '/login';
            }
            redirecting = false;
          }, 50);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
