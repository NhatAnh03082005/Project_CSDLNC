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
 * @access  Public (tạm thời bỏ auth)
 */
router.post("/", branchesController.createBranch);

/**
 * @route   PUT /api/branches/:id
 * @desc    Cập nhật thông tin chi nhánh
 * @access  Public (tạm thời bỏ auth)
 */
router.put("/:id", branchesController.updateBranch);

/**
 * @route   GET /api/branches/:id/products
 * @desc    Danh sách sản phẩm tồn kho của chi nhánh
 * @access  Public
 */
router.get("/:id/products", branchesController.getProductsStockByBranch);

/**
 * @route   POST /api/branches/:id/products
 * @desc    Tạo tồn kho mới
 * @access  Public (tạm thời bỏ auth)
 */
router.post("/:id/products", branchesController.addProductToStock);

/**
 * @route   PUT /api/branches/:id/products
 * @desc    Cập nhật thông tin sản phẩm tồn kho của chi nhánh
 * @access  Public (tạm thời bỏ auth)
 */
router.put("/:id/products/:maSanPham", branchesController.updateProductQty);

/**
 * @route   GET /api/branches/:id/vaccines
 * @desc    Danh sách vắc xin tồn kho của chi nhánh
 * @access  Public
 */
router.get("/:id/vaccines", branchesController.getVaccinesStockByBranch);

/**
 * @route   POST /api/branches/:id/vaccines
 * @desc    Tạo tồn kho mới
 * @access  Public (tạm thời bỏ auth)
 */
router.post("/:id/vaccines", branchesController.addVaccineToStock);
/**
 * @route   PUT /api/branches/:id/vaccines
 * @desc    Cập nhật thông tin vắc xin tồn kho của chi nhánh
 * @access  Public (tạm thời bỏ auth)
 */
router.put("/:id/vaccines/:maVacXin", branchesController.updateVaccineQty);

/**
 * @route   GET /api/branches/:id/services
 * @desc    Danh sách dịch vụ của chi nhánh
 * @access  Public
 */
router.get("/:id/services", branchesController.getServicesByBranch);

/**
 * @route   POST /api/branches/:id/services
 * @desc    Tạo dịch vụ chi nhánh mới
 * @access  Public (tạm thời bỏ auth)
 */
router.post("/:id/services", branchesController.addServiceToBranch);

/**
 * @route   DELETE /api/branches/:id/services/:loaiDichVu
 * @desc    Xóa dịch vụ khỏi chi nhánh
 * @access  Public (tạm thời)
 */
router.delete(
  "/:id/services/:loaiDichVu",
  branchesController.deleteServiceFromBranch
);

/**
 * @route   GET /api/branches/:id/tranferHictory
 * @desc    Lịch sử chuyển kho giữa các chi nhánh
 * @access  Public
 */
router.get(
  "/:id/transferHistory",
  branchesController.getAllEmployeeTransferHistory
);

module.exports = router;
