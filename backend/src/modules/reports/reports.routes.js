const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   GET /api/reports/revenue
 * @desc    Báo cáo doanh thu
 * @access  Private - QUAN_TRI
 */
router.get('/revenue', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get revenue report' });
});

/**
 * @route   GET /api/reports/revenue/branch/:branchId
 * @desc    Báo cáo doanh thu theo chi nhánh
 * @access  Private - QUAN_TRI
 */
router.get('/revenue/branch/:branchId', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get branch revenue report' });
});

/**
 * @route   GET /api/reports/revenue/service
 * @desc    Báo cáo doanh thu theo dịch vụ
 * @access  Private - QUAN_TRI
 */
router.get('/revenue/service', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get service revenue report' });
});

/**
 * @route   GET /api/reports/revenue/product
 * @desc    Báo cáo doanh thu theo sản phẩm
 * @access  Private - QUAN_TRI
 */
router.get('/revenue/product', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get product revenue report' });
});

/**
 * @route   GET /api/reports/customers
 * @desc    Thống kê khách hàng
 * @access  Private - QUAN_TRI
 */
router.get('/customers', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get customer statistics' });
});

/**
 * @route   GET /api/reports/customers/new
 * @desc    Thống kê khách hàng mới
 * @access  Private - QUAN_TRI
 */
router.get('/customers/new', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get new customers report' });
});

/**
 * @route   GET /api/reports/customers/by-tier
 * @desc    Thống kê theo hạng thành viên
 * @access  Private - QUAN_TRI
 */
router.get('/customers/by-tier', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get customers by tier report' });
});

/**
 * @route   GET /api/reports/vaccinations
 * @desc    Thống kê tiêm phòng
 * @access  Private - QUAN_TRI
 */
router.get('/vaccinations', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get vaccination statistics' });
});

/**
 * @route   GET /api/reports/vaccinations/top
 * @desc    Top vacxin được sử dụng nhiều nhất
 * @access  Private - QUAN_TRI
 */
router.get('/vaccinations/top', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get top vaccinations' });
});

/**
 * @route   GET /api/reports/employees/performance
 * @desc    Hiệu suất nhân viên
 * @access  Private - QUAN_TRI
 */
router.get('/employees/performance', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get employee performance report' });
});

/**
 * @route   GET /api/reports/dashboard
 * @desc    Dashboard tổng quan
 * @access  Private - QUAN_TRI
 */
router.get('/dashboard', authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: 'Get dashboard statistics' });
});

module.exports = router;
