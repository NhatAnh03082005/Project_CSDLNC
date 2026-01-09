const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
const petsController = require("./pets.controller");

/**
 * @route   GET /api/pets/staff/:customerId/:petId/medical-history
 * @desc    Staff: Lấy lịch sử khám bệnh của thú cưng (cho trang tra cứu lịch sử khám bệnh)
 * @access  Private - NHAN_VIEN
 * @note    Phải đặt route này TRƯỚC các route /:id để tránh conflict
 */
router.get(
  "/staff/:customerId/:petId/medical-history",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  petsController.getStaffPetMedicalHistory
);

/**
 * @route   GET /api/pets
 * @desc    Danh sách thú cưng của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.getCustomerPets
);

/**
 * @route   POST /api/pets
 * @desc    Thêm thú cưng mới
 * @access  Private - KHACH_HANG
 */
router.post(
  "/",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.createPet
);

/**
 * @route   PUT /api/pets/:id
 * @desc    Cập nhật thông tin thú cưng
 * @access  Private - KHACH_HANG
 */
router.put(
  "/:id",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.updatePet
);

/**
 * @route   DELETE /api/pets/:id
 * @desc    Xóa thú cưng
 * @access  Private - KHACH_HANG
 */
router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.deletePet
);

/**
 * @route   GET /api/pets/:id/medical-history
 * @desc    Lịch sử khám bệnh của thú cưng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/:id/medical-history",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.getPetMedicalHistory
);

/**
 * @route   GET /api/pets/:id/vaccination-history
 * @desc    Lịch sử tiêm phòng của thú cưng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/:id/vaccination-history",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.getPetVaccinationHistory
);

/**
 * @route   GET /api/pets/:id
 * @desc    Xem chi tiết thú cưng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/:id",
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.getPetDetails
);

module.exports = router;
