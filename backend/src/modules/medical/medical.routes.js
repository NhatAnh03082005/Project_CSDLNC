const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const medicalController = require('./medical.controller');

/**
 * @route   POST /api/medical/records
 * @desc    Tạo hồ sơ khám bệnh mới (tạo HoaDon + CTHD + CTHD_DVSucKhoe + CTHD_KhamBenh)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.post('/records', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), medicalController.createMedicalRecord);

/**
 * @route   PUT /api/medical/records/:maHoaDon/:stt
 * @desc    Cập nhật hồ sơ khám bệnh (triệu chứng, chẩn đoán, toa thuốc, ngày tái khám)
 * @access  Private - NHAN_VIEN (chỉ bác sĩ thú y), QUAN_TRI
 */
router.put('/records/:maHoaDon/:stt', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), medicalController.updateMedicalRecord);

/**
 * @route   GET /api/medical/records/pending
 * @desc    Lấy danh sách hồ sơ khám bệnh chờ cập nhật (lịch hẹn đã xác nhận nhưng chưa có thông tin khám)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get('/records/pending', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), medicalController.getPendingMedicalRecords);

module.exports = router;
