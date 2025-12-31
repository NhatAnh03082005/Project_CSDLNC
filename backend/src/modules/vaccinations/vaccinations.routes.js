const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const vaccinationsService = require('./vaccinations.service');

/**
 * @route   POST /api/vaccinations/records
 * @desc    Ghi nhận tiêm phòng
 * @access  Private - NHAN_VIEN
 */
router.post('/records', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create vaccination record' });
});

/**
 * @route   GET /api/vaccinations/records/:petId
 * @desc    Lịch sử tiêm phòng của thú cưng
 * @access  Private
 */
router.get('/records/:petId', authenticate, (req, res) => {
  res.json({ message: 'Get pet vaccination history' });
});

/**
 * @route   GET /api/vaccinations/packages
 * @desc    Danh sách gói tiêm phòng
 * @access  Public
 */
router.get('/packages', async (req, res) => {
  const response = await vaccinationsService.getVaccinationPackages();
  return res.status(response.status || 200).json(response);
});

/**
 * @route   POST /api/vaccinations/packages
 * @desc    Tạo gói tiêm mới
 * @access  Private - QUAN_TRI
 */
router.post('/packages', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create vaccination package' });
});

/**
 * @route   PUT /api/vaccinations/packages/:id
 * @desc    Cập nhật gói tiêm
 * @access  Private - QUAN_TRI
 */
router.put('/packages/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update vaccination package' });
});

/**
 * @route   DELETE /api/vaccinations/packages/:id
 * @desc    Xóa gói tiêm
 * @access  Private - QUAN_TRI
 */
router.delete('/packages/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Delete vaccination package' });
});

/**
 * @route   POST /api/vaccinations/packages/subscribe
 * @desc    Đăng ký gói tiêm cho thú cưng
 * @access  Private - KHACH_HANG
 */
router.post('/packages/subscribe', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await vaccinationsService.subscribeToPackage(customerId, req.body);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/vaccinations/subscriptions
 * @desc    Danh sách gói tiêm đang đăng ký của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get('/subscriptions', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await vaccinationsService.getCustomerSubscriptions(customerId);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/vaccinations/subscriptions/:maGoiDK
 * @desc    Chi tiết gói tiêm đã đăng ký của khách hàng (bao gồm danh sách vaccine)
 * @access  Private - KHACH_HANG
 */
router.get('/subscriptions/:maGoiDK', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;
  const { maGoiDK } = req.params;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  if (!maGoiDK) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu mã gói đăng ký',
    });
  }

  const response = await vaccinationsService.getSubscriptionDetails(customerId, maGoiDK);
  return res.status(response.status || 200).json(response);
});

module.exports = router;
