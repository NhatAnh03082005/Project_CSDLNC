const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');
const productsService = require('./products.service');

/**
 * @route   GET /api/products/branch/:maChiNhanh
 * @desc    Danh sách sản phẩm theo chi nhánh
 * @access  Public
 */
router.get('/branch/:maChiNhanh', async (req, res) => {
  const { maChiNhanh } = req.params;
  const response = await productsService.getProductsByBranch(maChiNhanh);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/products/:maSanPham/branch/:maChiNhanh
 * @desc    Chi tiết sản phẩm theo chi nhánh
 * @access  Public
 */
router.get('/:maSanPham/branch/:maChiNhanh', async (req, res) => {
  const { maSanPham, maChiNhanh } = req.params;
  const response = await productsService.getProductById(maSanPham, maChiNhanh);
  return res.status(response.status || 200).json(response);
});

/**
 * @route   GET /api/products
 * @desc    Danh sách sản phẩm (có filter)
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ message: 'Get products list' });
});

/**
 * @route   GET /api/products/:id
 * @desc    Chi tiết sản phẩm
 * @access  Public
 */
router.get('/:id', (req, res) => {
  res.json({ message: 'Get product details' });
});

/**
 * @route   POST /api/products
 * @desc    Thêm sản phẩm mới
 * @access  Private - QUAN_TRI
 */
router.post('/', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Create product' });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm
 * @access  Private - QUAN_TRI
 */
router.put('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update product' });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm
 * @access  Private - QUAN_TRI
 */
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Delete product' });
});

/**
 * @route   GET /api/products/:id/stock
 * @desc    Tồn kho sản phẩm theo chi nhánh
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get('/:id/stock', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get product stock' });
});

/**
 * @route   PUT /api/products/:id/stock
 * @desc    Cập nhật tồn kho
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.put('/:id/stock', authenticate, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Update product stock' });
});

/**
 * @route   GET /api/products/categories
 * @desc    Danh sách danh mục sản phẩm
 * @access  Public
 */
router.get('/categories', (req, res) => {
  res.json({ message: 'Get product categories' });
});

module.exports = router;
