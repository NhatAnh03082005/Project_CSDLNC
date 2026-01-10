const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
const vaccinationsController = require("./vaccinations.controller");

/**
 * @route   GET /api/vaccinations
 * @desc    Danh sách vắc-xin
 * @access  Public (tạm thời)
 */
router.get("/", vaccinationsController.getAllVaccines);

/**
 * @route   POST /api/vaccinations
 * @desc    Thêm vắc-xin mới
 * @access  Public (tạm thời)
 */
router.post("/", vaccinationsController.createVaccine);

// =====================================================================
// LOGIC GHI NHẬN & LỊCH SỬ TIÊM PHÒNG
// =====================================================================

/**
 * @route   POST /api/vaccinations/records
 * @desc    Ghi nhận tiêm phòng (tạo HoaDon + CTHD + CTHD_DVSucKhoe + CTHD_TiemPhong)
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.post(
  "/records",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  vaccinationsController.createVaccinationRecord
);

/**
 * @route   PUT /api/vaccinations/records/:maHoaDon/:stt
 * @desc    Cập nhật hồ sơ tiêm phòng (chọn vaccine, bác sĩ)
 * @access  Private - NHAN_VIEN (chỉ bác sĩ thú y), ADMIN
 */
router.put(
  "/records/:maHoaDon/:stt",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  vaccinationsController.updateVaccinationRecord
);

/**
 * @route   GET /api/vaccinations/records/pending
 * @desc    Lấy danh sách hồ sơ tiêm phòng chờ cập nhật (lịch hẹn đã xác nhận nhưng chưa chọn vaccine)
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.get(
  "/records/pending",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  vaccinationsController.getPendingVaccinationRecords
);

/**
 * @route   GET /api/vaccinations/available/:maChiNhanh
 * @desc    Lấy danh sách vaccine có tồn kho > 0 tại chi nhánh
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.get(
  "/available/:maChiNhanh",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  vaccinationsController.getAvailableVaccines
);

/**
 * @route   GET /api/vaccinations/customer/:maKhachHang/subscriptions
 * @desc    Lấy danh sách gói tiêm đã đăng ký của khách hàng (cho nhân viên)
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.get(
  "/customer/:maKhachHang/subscriptions",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  vaccinationsController.getCustomerSubscriptionsForEmployee
);

/**
 * @route   GET /api/vaccinations/packages/:maGoiDK/vaccines
 * @desc    Lấy danh sách vaccine trong gói đăng ký
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.get(
  "/packages/:maGoiDK/vaccines",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  vaccinationsController.getPackageVaccines
);

// =====================================================================
// LOGIC GÓI TIÊM PHÒNG (PACKAGES)
// =====================================================================

/**
 * @route   GET /api/vaccinations/packages
 * @desc    Danh sách gói tiêm phòng
 * @access  Public
 */
router.get("/packages", vaccinationsController.getVaccinationPackages);


// =====================================================================
// LOGIC ĐĂNG KÝ & QUẢN LÝ GÓI ĐÃ ĐĂNG KÝ (SUBSCRIPTIONS)
// =====================================================================

/**
 * @route   POST /api/vaccinations/packages/subscribe
 * @desc    Đăng ký gói tiêm cho thú cưng
 * @access  Private - KHACH_HANG
 */
router.post(
  "/packages/subscribe",
  authenticate,
  authorize(ROLES.CUSTOMER),
  vaccinationsController.subscribeToPackage
);

/**
 * @route   GET /api/vaccinations/subscriptions
 * @desc    Danh sách gói tiêm đang đăng ký của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/subscriptions",
  authenticate,
  authorize(ROLES.CUSTOMER),
  vaccinationsController.getCustomerSubscriptions
);

/**
 * @route   GET /api/vaccinations/subscriptions/:maGoiDK
 * @desc    Chi tiết gói tiêm đã đăng ký của khách hàng (bao gồm danh sách vaccine)
 * @access  Private - KHACH_HANG
 */
router.get(
  "/subscriptions/:maGoiDK",
  authenticate,
  authorize(ROLES.CUSTOMER),
  vaccinationsController.getSubscriptionDetails
);

// =====================================================================
// LOGIC QUẢN LÝ VẮC-XIN (ADMIN) - Phải đặt sau các route cụ thể
// =====================================================================

/**
 * @route   GET /api/vaccinations/:id
 * @desc    Chi tiết vắc-xin
 * @access  Public (tạm thời)
 */
router.get("/:id", vaccinationsController.getVaccineById);

/**
 * @route   PUT /api/vaccinations/:id
 * @desc    Cập nhật thông tin vắc-xin
 * @access  Public (tạm thời)
 */
router.put("/:id", vaccinationsController.updateVaccine);

module.exports = router;
