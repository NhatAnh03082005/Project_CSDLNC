const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const branchesService = require('./branches.service');

/**
 * @route   GET /api/branches
 * @desc    Danh sách chi nhánh (có filter và phân trang)
 * @access  Public
 * @query   page, limit, search, service
 */
router.get('/', async (req, res) => {
  const { page, limit, search, service } = req.query;
  
  let serviceFilter = null;
  if (service === 'exam') {
    serviceFilter = 'Khám bệnh';
  } else if (service === 'vaccination') {
    serviceFilter = 'Tiêm phòng';
  } else if (service === 'products') {
    serviceFilter = 'Mua hàng';
  } else if (service) {
    serviceFilter = service;
  }

  const response = await branchesService.getBranches({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 6,
    search,
    service: serviceFilter,
  });
  
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/branches/:id
 * @desc    Chi tiết chi nhánh
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const response = await branchesService.getBranchById(id);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   POST /api/branches
 * @desc    Tạo chi nhánh mới
 * @access  Private - QUAN_TRI
 */
router.post('/', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create branch' });
});

/**
 * @route   PUT /api/branches/:id
 * @desc    Cập nhật thông tin chi nhánh
 * @access  Private - QUAN_TRI
 */
router.put('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update branch' });
});

/**
 * @route   DELETE /api/branches/:id
 * @desc    Xóa chi nhánh
 * @access  Private - QUAN_TRI
 */
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Delete branch' });
});

/**
 * @route   GET /api/branches/:id/services
 * @desc    Danh sách dịch vụ của chi nhánh
 * @access  Public
 */
router.get('/:id/services', (req, res) => {
  res.json({ message: 'Get branch services' });
});

/**
 * @route   GET /api/branches/:id/employees
 * @desc    Danh sách nhân viên của chi nhánh
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get('/:id/employees', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get branch employees' });
});

module.exports = router;
