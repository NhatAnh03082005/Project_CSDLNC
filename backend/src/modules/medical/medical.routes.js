const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
const medicalController = require("./medical.controller");

/**
 * @route   POST /api/medical/records
 * @desc    Tạo hồ sơ khám bệnh mới (tạo HoaDon + CTHD + CTHD_DVSucKhoe + CTHD_KhamBenh)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.post(
  "/records",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  medicalController.createMedicalRecord
);

/**
 * @route   PUT /api/medical/records/:maHoaDon/:stt
 * @desc    Cập nhật hồ sơ khám bệnh (triệu chứng, chẩn đoán, toa thuốc, ngày tái khám)
 * @access  Private - NHAN_VIEN (chỉ bác sĩ thú y), QUAN_TRI
 */
router.put(
  "/records/:maHoaDon/:stt",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  medicalController.updateMedicalRecord
);

/**
 * @route   GET /api/medical/records/pending
 * @desc    Lấy danh sách hồ sơ khám bệnh chờ cập nhật (lịch hẹn đã xác nhận nhưng chưa có thông tin khám)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/records/pending",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  medicalController.getPendingMedicalRecords
);

/**
 * @route   GET /api/medical/pet/:maThucung/history
 * @desc    Lấy lịch sử khám bệnh của thú cưng
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/pet/:maThucung/history",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  medicalController.getPetMedicalHistory
);

/**
 * @route   GET /api/medical/records/:petId
 * @desc    Lịch sử khám bệnh của thú cưng
 * @access  Private
 */
router.get("/records/:petId", authenticate, (req, res) => {
  res.json({ message: "Get pet medical history" });
});

/**
 * @route   GET /api/medical/records/detail/:id
 * @desc    Chi tiết hồ sơ khám bệnh
 * @access  Private
 */
router.get("/records/detail/:id", authenticate, (req, res) => {
  res.json({ message: "Get medical record details" });
});

/**
 * @route   POST /api/medical/prescriptions
 * @desc    Thêm toa thuốc
 * @access  Private - NHAN_VIEN
 */
router.post(
  "/prescriptions",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "Add prescription" });
  }
);

module.exports = router;
