const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   GET /api/promotions
 * @desc    Danh sách chương trình khuyến mãi
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ message: 'Get promotions list' });
});

/**
 * @route   GET /api/promotions/:id
 * @desc    Chi tiết khuyến mãi
 * @access  Public
 */
router.get('/:id', (req, res) => {
  res.json({ message: 'Get promotion details' });
});

/**
 * @route   POST /api/promotions
 * @desc    Tạo chương trình khuyến mãi
 * @access  Private - QUAN_TRI
 */
router.post('/', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create promotion' });
});

/**
 * @route   PUT /api/promotions/:id
 * @desc    Cập nhật khuyến mãi
 * @access  Private - QUAN_TRI
 */
router.put('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update promotion' });
});

/**
 * @route   DELETE /api/promotions/:id
 * @desc    Xóa/Dừng khuyến mãi
 * @access  Private - QUAN_TRI
 */
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Delete promotion' });
});

/**
 * @route   GET /api/promotions/active
 * @desc    Khuyến mãi đang áp dụng
 * @access  Public
 */
router.get('/active', (req, res) => {
  res.json({ message: 'Get active promotions' });
});

/**
 * @route   POST /api/promotions/check-applicable
 * @desc    Kiểm tra khuyến mãi áp dụng cho đơn hàng
 * @access  Private
 */
router.post('/check-applicable', authenticate, (req, res) => {
  res.json({ message: 'Check applicable promotions' });
});

module.exports = router;
