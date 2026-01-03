const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
const productsController = require("./products.controller");

/**
 * @route   GET /api/products/branch/:maChiNhanh
 * @desc    Danh sách sản phẩm theo chi nhánh (Client/Public)
 * @access  Public
 */
router.get("/branch/:maChiNhanh", productsController.getProductsByBranch);

/**
 * @route   GET /api/products/:maSanPham/branch/:maChiNhanh
 * @desc    Chi tiết sản phẩm theo chi nhánh (Client/Public)
 * @access  Public
 */
router.get("/:maSanPham/branch/:maChiNhanh", productsController.getProductById);

/**
 * @route   GET /api/products
 * @desc    Danh sách toàn bộ sản phẩm (Admin)
 * @access  Public (tạm thời)
 */
router.get("/", productsController.getAllProducts);

/**
 * @route   POST /api/products
 * @desc    Thêm sản phẩm mới (Admin)
 * @access  Public (tạm thời)
 */
router.post("/", productsController.createProduct);

/**
 * @route   GET /api/products/:id
 * @desc    Chi tiết sản phẩm chung (Admin)
 * @access  Public (tạm thời)
 */
router.get("/:id", productsController.getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật thông tin sản phẩm (Admin)
 * @access  Public (tạm thời)
 */
router.put("/:id", productsController.updateProduct);

module.exports = router;
