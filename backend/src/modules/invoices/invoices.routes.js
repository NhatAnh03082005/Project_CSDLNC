const express = require('express');
const router = express.Router();
const invoiceController = require('./invoices.controller.js');
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   POST /api/invoices
 * @desc    Tạo hóa đơn mới (Header + Details)
 * @access  Private - NHAN_VIEN
 */
// router.post('/',   authenticate,  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),  (req, res) => {
//  res.json({ message: 'Create invoice' });
// });
router.post('/', 
  authenticate, 
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN), 
  invoiceController.createInvoice
);

/**
 * @route   GET /api/invoices/:id
 * @desc    Chi tiết hóa đơn 
 * @access  Private
 */
// router.get('/:id',  authenticate,  (req, res) => {
//   res.json({ message: 'Get invoice details' });
// });
router.get('/:id', 
  authenticate, 
  invoiceController.getInvoiceById
);


/**
 * @route   GET /api/invoices
 * @desc    Danh sách hóa đơn (filter)
 * @access  Private
 */
// router.get('/', 
//   authenticate, 
//   (req, res) => {
//   res.json({ message: 'Get invoices list' });
// });
router.get('/', 
  authenticate, 
  invoiceController.getInvoices
);

/**
 * @route   GET /api/invoices/customer/:customerId
 * @desc    Lịch sử hóa đơn của khách hàng
 * @access  Private
 */
// router.get('/customer/:customerId',  authenticate,  (req, res) => {
//   res.json({ message: 'Get customer invoices' });
// });
router.get('/customer/:customerId', 
  authenticate, 
  invoiceController.getCustomerInvoices
);



/**
 * @route   PUT /api/invoices/:id
 * @desc    Cập nhật thông tin hóa đơn (NgayLap, HinhThucThanhToan...)
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.put('/:id', 
  authenticate, 
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  invoiceController.updateInvoice
);


/**
 * @route   GET /api/invoices/:id/print
 * @desc    In hóa đơn
 * @access  Private
 */
// router.get('/:id/print', 
//   authenticate, 
//   (req, res) => {
//   res.json({ message: 'Print invoice' });
// });
/**
 * @route   GET /api/invoices/:id/print
 * @desc    In hóa đơn (Placeholder logic) - có lẽ api này ko nhất thiết phải liên quan đến be, chỉ cần call get by id rồi sử dụng chức năng xuất pdf ở FE là được
 * @access  Private
 */
router.get('/:id/print', 
  authenticate, 
  (req, res) => {
    res.json({ message: 'Print invoice functionality pending' });
  }
);

module.exports = router;
