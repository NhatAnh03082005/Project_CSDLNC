const jwt = require('jsonwebtoken');
const { JWT_SECRET, ROLES } = require('../config/constants');

/**
 * Middleware xác thực JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // {  maKhachHang, role, username }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

/**
 * Middleware kiểm tra role
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    // Map role từ token sang role trong constants
    // Token có thể có: "staff", "admin", "KHACH_HANG", "NHAN_VIEN", "QUAN_TRI"
    let userRole = req.user.role;
    
    // Chuyển đổi role từ token sang format trong constants
    if (userRole === "staff") {
      userRole = ROLES.EMPLOYEE; // "NHAN_VIEN"
    } else if (userRole === "admin") {
      userRole = ROLES.ADMIN; // "QUAN_TRI"
    } else if (userRole === "customer") {
      userRole = ROLES.CUSTOMER; // "KHACH_HANG"
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
