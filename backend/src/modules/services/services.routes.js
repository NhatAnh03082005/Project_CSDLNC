const express = require("express");
const router = express.Router();
// const { authenticate, authorize } = require("../../middlewares/auth");
// const { ROLES } = require("../../config/constants");
const servicesController = require("./services.controller");

/**
 * @route   GET /api/services
 * @desc    Danh sách dịch vụ
 * @access  Public (tạm thời)
 */
router.get("/", servicesController.getAllServices);

module.exports = router;
