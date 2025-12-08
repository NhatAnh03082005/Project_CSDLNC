// Auth Service - Business logic cho authentication
// TODO: Implement auth service methods

class AuthService {
  async register(userData) {
    // TODO: Validate & create new customer account
  }

  async login(username, password) {
    // TODO: Verify credentials & generate JWT token
  }

  async getCurrentUser(userId, role) {
    // TODO: Get user info based on role
  }
}

module.exports = new AuthService();
