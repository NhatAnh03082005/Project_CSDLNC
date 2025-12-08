const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   POST /api/invoices
 * @desc    Tạo hóa đơn mới
 * @access  Private - NHAN_VIEN
 */
router.post('/', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create invoice' });
});

/**
 * @route   GET /api/invoices/:id
 * @desc    Chi tiết hóa đơn
 * @access  Private
 */
router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get invoice details' });
});

/**
 * @route   GET /api/invoices
 * @desc    Danh sách hóa đơn (filter)
 * @access  Private
 */
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Get invoices list' });
});

/**
 * @route   GET /api/invoices/customer/:customerId
 * @desc    Lịch sử hóa đơn của khách hàng
 * @access  Private
 */
router.get('/customer/:customerId', authenticate, (req, res) => {
  res.json({ message: 'Get customer invoices' });
});

/**
 * @route   PUT /api/invoices/:id/payment
 * @desc    Cập nhật thanh toán
 * @access  Private - NHAN_VIEN
 */
router.put('/:id/payment', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update invoice payment' });
});

/**
 * @route   GET /api/invoices/:id/print
 * @desc    In hóa đơn
 * @access  Private
 */
router.get('/:id/print', authenticate, (req, res) => {
  res.json({ message: 'Print invoice' });
});

module.exports = router;
