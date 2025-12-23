const express = require("express");
const router = express.Router();
// const { authenticate, authorize } = require("../../middlewares/auth");
// const { ROLES } = require("../../config/constants");
const productsController = require("./products.controller");

/**
 * @route   GET /api/products
 * @desc    Danh sách sản phẩm
 * @access  Public (tạm thời)
 */
router.get("/", productsController.getAllProducts);

/**
 * @route   POST /api/products
 * @desc    Thêm sản phẩm mới
 * @access  Public (tạm thời)
 */
router.post("/", productsController.createProduct);

/**
 * @route   GET /api/products/:id
 * @desc    Chi tiết sản phẩm
 * @access  Public (tạm thời)
 */
router.get("/:id", productsController.getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật thông tin sản phẩm
 * @access  Public (tạm thời)
 */
router.put("/:id", productsController.updateProduct);

module.exports = router;
