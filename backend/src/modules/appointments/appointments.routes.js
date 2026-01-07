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
 * @desc    Lịch hẹn theo chi nhánh/bác sĩ/ngày
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.get('/schedule', 
  authenticate, 
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN), 
  appointmentsController.getSchedule
);

/**
 * @route   GET /api/appointments/:id
 * @desc    Chi tiết lịch hẹn
 * @access  Private (Staff/Admin xem chi tiết)
 */
router.get('/:id', 
  authenticate, 
  appointmentsController.getById
);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Cập nhật lịch hẹn (Dời lịch, đổi bác sĩ)
 * @access  Private (Thường là Staff/Admin)
 */
router.put('/:id', 
  authenticate, 
  //authorize(ROLES.EMPLOYEE, ROLES.ADMIN), // Thêm authorize nếu muốn chặn khách tự sửa
  appointmentsController.update
);

/**
 * @route   PUT /api/appointments/:id/cancel
 * @desc    Hủy lịch hẹn
 * @access  Private - KHACH_HANG
 */
router.put(
  '/:id/cancel',
  authenticate,
  authorize(ROLES.CUSTOMER),
  appointmentsController.cancelAppointment
);

/**
 * @route   PUT /api/appointments/:id/confirm
 * @desc    Xác nhận lịch hẹn
 * @access  Private - NHAN_VIEN
 */
router.put('/:id/confirm', 
  authenticate, 
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN), 
  appointmentsController.confirm
);

/**
 * @route   PUT /api/appointments/:id/complete
 * @desc    Hoàn thành lịch hẹn
 * @access  Private - NHAN_VIEN
 */
router.put('/:id/complete', 
  authenticate, 
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN), 
  appointmentsController.complete
);

module.exports = router;

