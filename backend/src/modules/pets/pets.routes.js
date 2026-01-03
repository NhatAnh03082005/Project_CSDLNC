const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const petsController = require('./pets.controller');

/**
 * @route   GET /api/pets
 * @desc    Danh sách thú cưng của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  '/',
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
  '/',
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
  '/:id',
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
  '/:id',
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
  '/:id/medical-history',
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
  '/:id/vaccination-history',
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
  '/:id',
  authenticate,
  authorize(ROLES.CUSTOMER),
  petsController.getPetDetails
);

module.exports = router;

