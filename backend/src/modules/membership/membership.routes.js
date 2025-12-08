const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   GET /api/membership/tiers
 * @desc    Danh sách hạng thành viên & quyền lợi
 * @access  Public
 */
router.get('/tiers', (req, res) => {
  res.json({ message: 'Get membership tiers' });
});

/**
 * @route   GET /api/membership/my-tier
 * @desc    Xem hạng thành viên hiện tại
 * @access  Private - KHACH_HANG
 */
router.get('/my-tier', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get my membership tier' });
});

/**
 * @route   GET /api/membership/points
 * @desc    Xem điểm loyalty
 * @access  Private - KHACH_HANG
 */
router.get('/points', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get loyalty points' });
});

/**
 * @route   GET /api/membership/points-history
 * @desc    Lịch sử tích/tiêu điểm
 * @access  Private - KHACH_HANG
 */
router.get('/points-history', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get points history' });
});

/**
 * @route   POST /api/membership/calculate-tier
 * @desc    Tính toán & cập nhật hạng thành viên (chạy định kỳ)
 * @access  Private - QUAN_TRI
 */
router.post('/calculate-tier', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Calculate and update membership tiers' });
});

module.exports = router;
