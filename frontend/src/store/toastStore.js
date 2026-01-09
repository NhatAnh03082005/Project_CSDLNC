import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast,
      duration: toast.duration || 3000,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Tự động xóa sau duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

export default useToastStore;

