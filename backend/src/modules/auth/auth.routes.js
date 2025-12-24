const express = require('express');
const { body } = require('express-validator');
const validate = require('../../middlewares/validate');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth');
const router = express.Router();

// Controllers (sẽ implement sau)
// const authController = require('./auth.controller');

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản khách hàng mới
 * @access  Public
 */
router.post(
  '/register',
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login',authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
router.post('/logout',authenticate,
  authController.logout
);

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

