const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   GET /api/appointments
 * @desc    Danh sách lịch hẹn
 * @access  Private
 */
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Get appointments list' });
});

/**
 * @route   POST /api/appointments
 * @desc    Đặt lịch hẹn mới
 * @access  Private - KHACH_HANG
 */
router.post('/', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Create appointment' });
});

/**
 * @route   GET /api/appointments/:id
 * @desc    Chi tiết lịch hẹn
 * @access  Private
 */
router.get('/:id', authenticate, (req, res) => {
  res.json({ message: 'Get appointment details' });
});

/**
 * @route   PUT /api/appointments/:id
 * @desc    Cập nhật lịch hẹn
 * @access  Private
 */
router.put('/:id', authenticate, (req, res) => {
  res.json({ message: 'Update appointment' });
});

/**
 * @route   PUT /api/appointments/:id/cancel
 * @desc    Hủy lịch hẹn
 * @access  Private - KHACH_HANG
 */
router.put('/:id/cancel', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Cancel appointment' });
});

/**
 * @route   PUT /api/appointments/:id/confirm
 * @desc    Xác nhận lịch hẹn
 * @access  Private - NHAN_VIEN
 */
router.put('/:id/confirm', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Confirm appointment' });
});

/**
 * @route   PUT /api/appointments/:id/complete
 * @desc    Hoàn thành lịch hẹn
 * @access  Private - NHAN_VIEN
 */
router.put('/:id/complete', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Complete appointment' });
});

/**
 * @route   GET /api/appointments/schedule
 * @desc    Lịch hẹn theo chi nhánh/bác sĩ/ngày
 * @access  Private - NHAN_VIEN
 */
router.get('/schedule', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get schedule' });
});

/**
 * @route   GET /api/appointments/available-slots
 * @desc    Khung giờ còn trống để đặt lịch
 * @access  Private - KHACH_HANG
 */
router.get('/available-slots', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get available time slots' });
});

module.exports = router;
