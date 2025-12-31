const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const petsService = require('./pets.service');

/**
 * @route   GET /api/pets
 * @desc    Danh sách thú cưng của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get('/', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await petsService.getCustomerPets(customerId);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   POST /api/pets
 * @desc    Thêm thú cưng mới
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

  const response = await petsService.createPet(customerId, req.body);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   PUT /api/pets/:id
 * @desc    Cập nhật thông tin thú cưng
 * @access  Private - KHACH_HANG
 */
router.put('/:id', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;
  const { id: petId } = req.params;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await petsService.updatePet(customerId, petId, req.body);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   DELETE /api/pets/:id
 * @desc    Xóa thú cưng
 * @access  Private - KHACH_HANG
 */
router.delete('/:id', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;
  const { id: petId } = req.params;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await petsService.deletePet(customerId, petId);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/pets/:id/medical-history
 * @desc    Lịch sử khám bệnh của thú cưng
 * @access  Private - KHACH_HANG
 */
router.get(
  '/:id/medical-history',
  authenticate,
  authorize(ROLES.CUSTOMER),
  async (req, res) => {
    const customerId = req.user.maKhachHang;
    const { id: petId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await petsService.getPetMedicalHistory(customerId, petId);
    return res.status(response.status || 200).json(response);
  }
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
  async (req, res) => {
    const customerId = req.user.maKhachHang;
    const { id: petId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy mã khách hàng trong token',
      });
    }

    const response = await petsService.getPetVaccinationHistory(customerId, petId);
    return res.status(response.status || 200).json(response);
  }
);

/**
 * @route   GET /api/pets/:id
 * @desc    Xem chi tiết thú cưng
 * @access  Private - KHACH_HANG
 */
router.get('/:id', authenticate, authorize(ROLES.CUSTOMER), async (req, res) => {
  const customerId = req.user.maKhachHang;
  const { id: petId } = req.params;

  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: 'Không tìm thấy mã khách hàng trong token',
    });
  }

  const response = await petsService.getPetDetails(customerId, petId);
  return res.status(response.status || 200).json(response);
});

module.exports = router;
