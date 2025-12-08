const express = require('express');
const router = express.Router();

// Controllers (sẽ implement sau)
// const authController = require('./auth.controller');

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản khách hàng mới
 * @access  Public
 */
router.post('/register', (req, res) => {
  // TODO: Implement registration logic
  res.json({ message: 'Register endpoint' });
});

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login', (req, res) => {
  // TODO: Implement login logic
  res.json({ message: 'Login endpoint' });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
router.post('/logout', (req, res) => {
  // TODO: Implement logout logic
  res.json({ message: 'Logout endpoint' });
});

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
router.get('/me', (req, res) => {
  // TODO: Implement get current user logic
  res.json({ message: 'Get me endpoint' });
});

module.exports = router;
