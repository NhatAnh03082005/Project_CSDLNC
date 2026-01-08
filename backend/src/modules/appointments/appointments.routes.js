const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const appointmentsController = require('./appointments.controller');

/**
 * @route   GET /api/appointments
 * @desc    Danh sách lịch hẹn của khách hàng (có phân trang)
 * @access  Private - KHACH_HANG
 * @query   page, limit, status?
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  appointmentsController.getCustomerAppointments
);

/**
 * @route   POST /api/appointments
 * @desc    Đặt lịch hẹn mới (khám bệnh hoặc tiêm phòng)
 * @access  Private - KHACH_HANG
 */
router.post(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  appointmentsController.createAppointment
);

/**
 * @route   GET /api/appointments/available-slots
 * @desc    Khung giờ còn trống để đặt lịch
 * @access  Private - KHACH_HANG
 * @query   MaChiNhanh, LoaiDichVu, ThoiGianHen, BacSiPhuTrach? (optional)
 */
router.get(
  '/available-slots',
  authenticate,
  authorize(ROLES.CUSTOMER),
  appointmentsController.getAvailableSlots
);

/**
 * @route   GET /api/appointments/available-doctors
 * @desc    Danh sách bác sĩ rảnh theo chi nhánh và ngày
 * @access  Private - KHACH_HANG
 * @query   MaChiNhanh, ThoiGianHen, LoaiDichVu? (optional)
 */
router.get(
  '/available-doctors',
  authenticate,
  authorize(ROLES.CUSTOMER),
  appointmentsController.getAvailableDoctors
);

/**
 * @route   GET /api/appointments/schedule
 * @desc    Lịch hẹn theo chi nhánh/ngày/trạng thái (cho nhân viên)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 * @query   MaChiNhanh?, NgayHen?, TrangThai?, page?, limit?
 */
router.get(
  '/schedule',
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  appointmentsController.getAppointmentsSchedule
);

/**
 * @route   GET /api/appointments/today
 * @desc    Lịch hẹn hôm nay của chi nhánh với thống kê (cho nhân viên)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 * @query   MaChiNhanh?
 */
router.get(
  '/today',
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  appointmentsController.getTodayAppointments
);

/**
 * @route   PUT /api/appointments/:id/cancel
 * @desc    Hủy lịch hẹn (chỉ khách hàng)
 * @access  Private - KHACH_HANG
 */
router.put(
  '/:id/cancel',
  authenticate,
  authorize(ROLES.CUSTOMER),
  appointmentsController.cancelAppointment
);

/**
 * @route   GET /api/appointments/:id
 * @desc    Chi tiết lịch hẹn (cho nhân viên và khách hàng)
 * @access  Private - NHAN_VIEN, QUAN_TRI, KHACH_HANG
 */
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.CUSTOMER),
  appointmentsController.getAppointmentDetails
);

module.exports = router;

