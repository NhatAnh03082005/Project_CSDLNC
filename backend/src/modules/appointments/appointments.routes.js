const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const appointmentsService = require('./appointments.service');

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
 * @desc    Đặt lịch hẹn mới (khám bệnh hoặc tiêm phòng)
 * @access  Private - KHACH_HANG
 */
router.post('/', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await appointmentsService.createAppointment(customerId, req.body);
  return res.status(response.status || 200).json(response);
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
router.put('/:id/cancel', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;
  const { id: maLichHen } = req.params;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  if (!maLichHen) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu mã lịch hẹn',
    });
  }

  const response = await appointmentsService.cancelAppointment(customerId, maLichHen);
  return res.status(response.status || 200).json(response);
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
 * @query   MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach? (optional)
 */
router.get('/available-slots', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const response = await appointmentsService.getAvailableSlots(req.query);
  return res.status(response.status || 200).json(response);
});

module.exports = router;
