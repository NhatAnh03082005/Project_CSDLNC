const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   GET /api/customers/profile
 * @desc    Xem thông tin cá nhân khách hàng
 * @access  Private - KHACH_HANG
 */
router.get('/profile', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get customer profile' });
});

/**
 * @route   PUT /api/customers/profile
 * @desc    Cập nhật thông tin cá nhân
 * @access  Private - KHACH_HANG
 */
router.put('/profile', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Update customer profile' });
});

/**
 * @route   GET /api/customers/membership
 * @desc    Xem thông tin hạng thành viên & điểm loyalty
 * @access  Private - KHACH_HANG
 */
router.get('/membership', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get membership info' });
});

/**
 * @route   GET /api/customers/appointments
 * @desc    Xem lịch hẹn của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get('/appointments', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get customer appointments' });
});

/**
 * @route   GET /api/customers/invoices
 * @desc    Xem lịch sử hóa đơn
 * @access  Private - KHACH_HANG
 */
router.get('/invoices', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get customer invoices' });
});

module.exports = router;
