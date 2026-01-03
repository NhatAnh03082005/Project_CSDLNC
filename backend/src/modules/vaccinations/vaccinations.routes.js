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
 * @desc    Ghi nhận tiêm phòng
 * @access  Private - NHAN_VIEN, ADMIN
 */
router.post(
  "/records",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "Create vaccination record" });
  }
);

/**
 * @route   GET /api/vaccinations/records/:petId
 * @desc    Lịch sử tiêm phòng của thú cưng
 * @access  Private
 */
router.get("/records/:petId", authenticate, (req, res) => {
  res.json({ message: "Get pet vaccination history" });
});

// =====================================================================
// LOGIC GÓI TIÊM PHÒNG (PACKAGES)
// =====================================================================

/**
 * @route   GET /api/vaccinations/packages
 * @desc    Danh sách gói tiêm phòng
 * @access  Public
 */
router.get("/packages", vaccinationsController.getVaccinationPackages);

/**
 * @route   POST /api/vaccinations/packages
 * @desc    Tạo gói tiêm mới
 * @access  Private - QUAN_TRI (ADMIN)
 */
router.post("/packages", authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Create vaccination package" });
});

/**
 * @route   PUT /api/vaccinations/packages/:id
 * @desc    Cập nhật gói tiêm
 * @access  Private - QUAN_TRI (ADMIN)
 */
router.put(
  "/packages/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "Update vaccination package" });
  }
);

/**
 * @route   DELETE /api/vaccinations/packages/:id
 * @desc    Xóa gói tiêm
 * @access  Private - QUAN_TRI (ADMIN)
 */
router.delete(
  "/packages/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "Delete vaccination package" });
  }
);

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
