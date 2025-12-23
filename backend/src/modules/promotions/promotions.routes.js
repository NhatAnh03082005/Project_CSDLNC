const express = require("express");
const router = express.Router();
// const { authenticate, authorize } = require("../../middlewares/auth");
// const { ROLES } = require("../../config/constants");
const promotionsController = require("./promotions.controller");

/**
 * @route   GET /api/promotions
 * @desc    Danh sách nhân viên
 * @access  Public (tạm thời)
 */
router.get("/", promotionsController.getAllPromotions);

/**
 * @route   POST /api/promotions
 * @desc    Thêm chương trình khuyến mãi mới
 * @access  Public (tạm thời)
 */
router.post("/", promotionsController.createPromotion);

/**
 * @route   GET /api/promotions/:id
 * @desc    Chi tiết chương trình khuyến mãi
 * @access  Public (tạm thời)
 */
router.get("/:id", promotionsController.getPromotionById);

/**
 * @route   PUT /api/promotions/:id
 * @desc    Cập nhật thông tin chương trình khuyến mãi
 * @access  Public (tạm thời)
 */
router.put("/:id", promotionsController.updatePromotion);

module.exports = router;
