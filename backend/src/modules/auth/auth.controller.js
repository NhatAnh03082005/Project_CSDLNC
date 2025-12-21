// Auth Service - Business logic cho authentication
const authService = require("./auth.service");

class AuthController {
  /**
   * Đăng ký khách hàng mới
   * @param {object} userData
   */
  async register(req, res) {

    const userData = req.body;
    const response = await authService.register(userData);
    return res.status(response.status || 200).json(response);
  }

  async login(username, password) {
    // TODO: Verify credentials & generate JWT token
  }

  async getCurrentUser(userId, role) {
    // TODO: Get user info based on role
  }
}

module.exports = new AuthController();
