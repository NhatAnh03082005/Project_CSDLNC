const authService = require("./auth.service");

class AuthController {
  /**
   * Đăng ký khách hàng mới
   */
  async register(req, res, next) {
    try {
      const response = await authService.register(req.body);
      return res.status(response.status || 201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đăng nhập (Dùng chung cho cả khách hàng và nhân viên)
   */
  async login(req, res, next) {
    try {
      const { email, password, staffCode, role } = req.body;
     
      let response;

      if (role === "staff") {
        // Gọi hàm đăng nhập cho nhân viên (chỉ cần mã nhân viên)
        response = await authService.loginStaff(staffCode);
      } else {
        // Gọi hàm đăng nhập cho khách hàng (email + mật khẩu)
        response = await authService.login(email, password);
      }

      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Log out successfully!",
      error: null
    });
  }

  /**
   * Lấy thông tin người dùng hiện tại từ Token
   */
  async getCurrentUser(req, res, next) {
    try {
      // req.user được điền bởi authMiddleware sau khi verify JWT
      const { maKhachHang, role } = req.user;
      const response = await authService.getCurrentUser(maKhachHang, role);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();