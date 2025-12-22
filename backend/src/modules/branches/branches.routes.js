const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
const branchesController = require("./branches.controller");

/**
 * @route   GET /api/branches
 * @desc    Danh sách chi nhánh
 * @access  Public
 */
router.get("/", branchesController.getAllBranches);

/**
 * @route   GET /api/branches/:id
 * @desc    Chi tiết chi nhánh
 * @access  Public
 */
router.get("/:id", branchesController.getBranchById);

/**
 * @route   POST /api/branches
 * @desc    Tạo chi nhánh mới
 * @access  Private - QUAN_TRI
 */
router.post("/", authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Create branch" });
});

/**
 * @route   PUT /api/branches/:id
 * @desc    Cập nhật thông tin chi nhánh
 * @access  Private - QUAN_TRI
 */
router.put("/:id", authenticate, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Update branch" });
});

/**
 * @route   GET /api/branches/:id/services
 * @desc    Danh sách dịch vụ của chi nhánh
 * @access  Public
 */
router.get("/:id/services", (req, res) => {
  res.json({ message: "Get branch services" });
});

/**
 * @route   GET /api/branches/:id/employees
 * @desc    Danh sách nhân viên của chi nhánh
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/:id/employees",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  (req, res) => {
    res.json({ message: "Get branch employees" });
  }
);

module.exports = router;
