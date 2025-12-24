const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const customersService = require('./customers.service');

/**
 * @route   GET /api/customers/profile
 * @desc    Xem thông tin cá nhân khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  '/profile',
  authenticate,
  authorize(ROLES.CUSTOMER),
  async (req, res) => {
    const customerId = req.user.maKhachHang;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await customersService.getProfile(customerId);
    return res.status(response.status || 200).json(response);
  }
);

/**
 * @route   PUT /api/customers/profile
 * @desc    Cập nhật thông tin cá nhân
 * @access  Private - KHACH_HANG
 */
router.put(
  '/profile',
  authenticate,
  authorize(ROLES.CUSTOMER),
  async (req, res) => {
    console.log(req.user);
    
    const customerId = req.user.maKhachHang;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await customersService.updateProfile(customerId, req.body);
    return res.status(response.status || 200).json(response);
  }
);

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
router.get(
  '/appointments',
  authenticate,
  authorize(ROLES.CUSTOMER),
  async (req, res) => {
    const customerId = req.user.maKhachHang;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await customersService.getAppointments(customerId);
    return res.status(response.status || 200).json(response);
  }
);

/**
 * @route   GET /api/customers/invoices
 * @desc    Xem danh sách hóa đơn của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  '/invoices',
  authenticate,
  authorize(ROLES.CUSTOMER),
  async (req, res) => {
    const customerId = req.user.maKhachHang;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await customersService.getInvoices(customerId);
    return res.status(response.status || 200).json(response);
  }
);

/**
 * @route   GET /api/customers/invoices/:maHoaDon
 * @desc    Xem chi tiết hóa đơn (bao gồm tất cả CTHD: mua hàng, khám bệnh, tiêm phòng)
 * @access  Private - KHACH_HANG
 */
router.get(
  '/invoices/:maHoaDon',
  authenticate,
  authorize(ROLES.CUSTOMER),
  async (req, res) => {
    const customerId = req.user.maKhachHang;
    const { maHoaDon } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await customersService.getInvoiceDetails(
      customerId,
      maHoaDon
    );
    return res.status(response.status || 200).json(response);
  }
);

module.exports = router;
