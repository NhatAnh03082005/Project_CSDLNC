const express = require("express");
const router = express.Router();
const reportsController = require("./reports.controller");

/**
 * @route   GET /api/reports/revenue
 * @desc    Thống kê doanh thu
 * @access  Public
 */
router.get("/revenue", reportsController.getRevenueStats);

/**
 * @route   GET /api/reports/products
 * @desc    Thống kê sản phẩm
 * @access  Public
 */
router.get("/products", reportsController.getProductStats);

/**
 * @route   GET /api/reports/vaccines
 * @desc    Thống kê loại vacxin
 * @access  Public
 */
router.get("/vaccines", reportsController.getVaccineStats);

/**
 * @route   GET /api/reports/services
 * @desc    Thống kê dịch vụ
 * @access  Public
 */
router.get("/services", reportsController.getServiceStats);

/**
 * @route   GET /api/reports/customers
 * @desc    Thống kê khách hàng
 * @access  Public
 */
router.get("/customers", reportsController.getCustomerStats);

/**
 * @route   GET /api/reports/performance
 * @desc    Thống kê hiệu suất nhân viên
 * @access  Public
 */
router.get("/performance", reportsController.getPerformanceStats);

module.exports = router;
