const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const ratingsService = require('./ratings.service');

/**
 * @route   POST /api/ratings
 * @desc    Đánh giá dịch vụ (khám bệnh hoặc tiêm phòng)
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

  const response = await ratingsService.createOrUpdateRating(customerId, req.body);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/ratings/branch/:branchId
 * @desc    Đánh giá của chi nhánh
 * @access  Public
 */
router.get('/branch/:branchId', (req, res) => {
  res.json({ message: 'Get branch ratings' });
});

/**
 * @route   GET /api/ratings/service/:serviceId
 * @desc    Đánh giá của dịch vụ
 * @access  Public
 */
router.get('/service/:serviceId', (req, res) => {
  res.json({ message: 'Get service ratings' });
});

/**
 * @route   GET /api/ratings/my-ratings
 * @desc    Danh sách dịch vụ sức khỏe đã sử dụng để đánh giá (sắp xếp theo thời gian)
 * @access  Private - KHACH_HANG
 */
router.get('/my-ratings', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await ratingsService.getRateableServices(customerId);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   PUT /api/ratings/:id
 * @desc    Cập nhật đánh giá
 * @access  Private - KHACH_HANG
 */
router.put('/:id', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Update rating' });
});

/**
 * @route   DELETE /api/ratings/:id
 * @desc    Xóa đánh giá
 * @access  Private - KHACH_HANG
 */
router.delete('/:id', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Delete rating' });
});

module.exports = router;
