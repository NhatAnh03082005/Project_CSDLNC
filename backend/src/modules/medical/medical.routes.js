const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   POST /api/medical/records
 * @desc    Tạo hồ sơ khám bệnh mới
 * @access  Private - NHAN_VIEN
 */
router.post('/records', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create medical record' });
});

/**
 * @route   GET /api/medical/records/:petId
 * @desc    Lịch sử khám bệnh của thú cưng
 * @access  Private
 */
router.get('/records/:petId', authenticate, (req, res) => {
  res.json({ message: 'Get pet medical history' });
});

/**
 * @route   GET /api/medical/records/detail/:id
 * @desc    Chi tiết hồ sơ khám bệnh
 * @access  Private
 */
router.get('/records/detail/:id', authenticate, (req, res) => {
  res.json({ message: 'Get medical record details' });
});

/**
 * @route   PUT /api/medical/records/:id
 * @desc    Cập nhật hồ sơ khám bệnh
 * @access  Private - NHAN_VIEN
 */
router.put('/records/:id', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update medical record' });
});

/**
 * @route   POST /api/medical/prescriptions
 * @desc    Thêm toa thuốc
 * @access  Private - NHAN_VIEN
 */
router.post('/prescriptions', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Add prescription' });
});

module.exports = router;
