import useToastStore from '../store/toastStore';

/**
 * Hiển thị toast thông báo thành công (màu xanh lá)
 * @param {string} message - Nội dung thông báo
 * @param {string} title - Tiêu đề (optional)
 * @param {number} duration - Thời gian hiển thị (ms, mặc định 3000)
 */
export const toast = {
  success: (message, title = 'Thành công', duration = 3000) => {
    return useToastStore.getState().addToast({
      type: 'success',
      title,
      message,
      duration,
    });
  },

  /**
   * Hiển thị toast thông báo lỗi (màu đỏ)
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định 4000)
   */
  error: (message, title = 'Lỗi', duration = 4000) => {
    return useToastStore.getState().addToast({
      type: 'error',
      title,
      message,
      duration,
    });
  },

  /**
   * Hiển thị toast thông báo cảnh báo (màu vàng)
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định 3000)
   */
  warning: (message, title = 'Cảnh báo', duration = 3000) => {
    return useToastStore.getState().addToast({
      type: 'warning',
      title,
      message,
      duration,
    });
  },

  /**
   * Hiển thị toast thông báo thông tin (màu xanh dương)
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {number} duration - Thời gian hiển thị (ms, mặc định 3000)
   */
  info: (message, title = 'Thông tin', duration = 3000) => {
    return useToastStore.getState().addToast({
      type: 'info',
      title,
      message,
      duration,
    });
  },
};

export default toast;

