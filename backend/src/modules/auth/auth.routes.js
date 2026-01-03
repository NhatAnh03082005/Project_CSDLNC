const express = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth');
const router = express.Router();

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
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại dựa trên token
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;

