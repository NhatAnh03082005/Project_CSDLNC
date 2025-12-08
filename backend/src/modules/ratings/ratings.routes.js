const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   POST /api/ratings
 * @desc    Đánh giá dịch vụ
 * @access  Private - KHACH_HANG
 */
router.post('/', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Create rating' });
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
 * @desc    Đánh giá của tôi
 * @access  Private - KHACH_HANG
 */
router.get('/my-ratings', authenticate, authorize(ROLES.CUSTOMER), (req, res) => {
  res.json({ message: 'Get my ratings' });
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
