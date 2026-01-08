const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const invoicesController = require('./invoices.controller');

/**
 * @route   POST /api/invoices
 * @desc    Tạo hóa đơn mới (từ dịch vụ đã sử dụng + sản phẩm mua thêm)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.post('/', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), invoicesController.createInvoice);

/**
 * @route   GET /api/invoices/pending
 * @desc    Lấy danh sách hóa đơn chờ xác nhận (NhanVienLap = NULL)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get('/pending', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), invoicesController.getPendingInvoices);

/**
 * @route   PUT /api/invoices/:id/confirm
 * @desc    Xác nhận đơn hàng (set NhanVienLap, trừ tồn kho, cộng điểm loyalty)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.put('/:id/confirm', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), invoicesController.confirmInvoice);

/**
 * @route   GET /api/invoices/:id
 * @desc    Chi tiết hóa đơn (header + chi tiết dịch vụ/sản phẩm)
 * @access  Private
 */
router.get('/:id', authenticate, invoicesController.getInvoiceDetails);

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

/**
 * @route   POST /api/invoices/:id/products
 * @desc    Thêm sản phẩm vào hóa đơn chưa xác nhận
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.post('/:id/products', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), invoicesController.addProductToInvoice);

module.exports = router;
