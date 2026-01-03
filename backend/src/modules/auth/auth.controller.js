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
   * Đăng nhập khách hàng
   */
  // Trong file auth.controller.js
  async login(req, res, next) {
    try {
      const { email, password, staffCode, role } = req.body;
      let response;

      if (role === "staff" && staffCode) {
        response = await authService.loginStaff(staffCode);
      } else {
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
      message: "Đăng xuất thành công",
      error: null,
    });
  }

  /**
   * Lấy thông tin user hiện tại dựa trên token
   */
  async getCurrentUser(req, res, next) {
    try {
      const response = await authService.getCurrentUser(req.user);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
