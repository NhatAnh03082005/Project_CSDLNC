import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => 
          item.maSanPham === product.maSanPham && 
          item.maChiNhanh === product.maChiNhanh
        );
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.maSanPham === product.maSanPham && item.maChiNhanh === product.maChiNhanh
                ? { ...item, soLuong: item.soLuong + (product.soLuong || 1) }
                : item
            )
          });
        } else {
          set({
            items: [...items, { 
              maSanPham: product.maSanPham,
              tenSanPham: product.tenSanPham || product.name,
              donGia: product.donGia || product.price,
              loaiSanPham: product.loaiSanPham || product.type,
              soLuong: product.soLuong || 1,
              maChiNhanh: product.maChiNhanh
            }]
          });
        }
      },
      
      removeItem: (maSanPham) => {
        set({
          items: get().items.filter(item => item.maSanPham !== maSanPham)
        });
      },
      
      updateQuantity: (maSanPham, soLuong) => {
        if (soLuong <= 0) {
          get().removeItem(maSanPham);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.maSanPham === maSanPham
              ? { ...item, soLuong }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.donGia || item.price || 0) * item.soLuong;
        }, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.soLuong, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

