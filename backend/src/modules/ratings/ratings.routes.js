const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const ratingsController = require('./ratings.controller');

/**
 * @route   POST /api/ratings
 * @desc    Đánh giá dịch vụ (khám bệnh hoặc tiêm phòng)
 * @access  Private - KHACH_HANG
 */
router.post(
  '/',
  authenticate,
  authorize(ROLES.CUSTOMER),
  ratingsController.createOrUpdateRating
);

/**
 * @route   GET /api/ratings/my-ratings
 * @desc    Danh sách dịch vụ sức khỏe đã sử dụng để đánh giá (sắp xếp theo thời gian)
 * @access  Private - KHACH_HANG
 */
router.get(
  '/my-ratings',
  authenticate,
  authorize(ROLES.CUSTOMER),
  ratingsController.getRateableServices
);

/**
 * @route   PUT /api/ratings/:maHoaDon/:stt
 * @desc    Cập nhật đánh giá
 * @access  Private - KHACH_HANG
 */
router.put(
  '/:maHoaDon/:stt',
  authenticate,
  authorize(ROLES.CUSTOMER),
  ratingsController.updateRating
);

/**
 * @route   DELETE /api/ratings/:maHoaDon/:stt
 * @desc    Xóa đánh giá
 * @access  Private - KHACH_HANG
 */
router.delete(
  '/:maHoaDon/:stt',
  authenticate,
  authorize(ROLES.CUSTOMER),
  ratingsController.deleteRating
);

module.exports = router;

