const express = require("express");
const router = express.Router();
// const { authenticate, authorize } = require("../../middlewares/auth");
// const { ROLES } = require("../../config/constants");
const employeesController = require("./employees.controller");

/**
 * @route   GET /api/employees
 * @desc    Danh sách nhân viên
 * @access  Public (tạm thời)
 */
router.get("/", employeesController.getAllEmployees);

/**
 * @route   POST /api/employees
 * @desc    Thêm nhân viên mới
 * @access  Public (tạm thời)
 */
router.post("/", employeesController.createEmployee);

/**
 * @route   GET /api/employees/:id
 * @desc    Chi tiết nhân viên
 * @access  Public (tạm thời)
 */
router.get("/:id", employeesController.getEmployeeById);

/**
 * @route   PUT /api/employees/:id
 * @desc    Cập nhật thông tin nhân viên
 * @access  Public (tạm thời)
 */
router.put("/:id", employeesController.updateEmployee);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Xóa nhân viên
 * @access  Public (tạm thời)
 */
router.delete("/:id", employeesController.deleteEmployee);

/**
 * @route   GET /api/employees/doctors
 * @desc    Danh sách bác sĩ (để đặt lịch)
 * @access  Public (tạm thời)
 */
router.get("/doctors", (req, res) => {
  res.json({ message: "Get doctors list" });
});

module.exports = router;
