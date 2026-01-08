const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
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
 * @route   GET /api/employees/doctors
 * @desc    Danh sách bác sĩ (để đặt lịch)
 * @access  Public (tạm thời)
 */
router.get("/doctors", (req, res) => {
  res.json({ message: "Get doctors list" });
});

/**
 * @route   GET /api/employees/customers
 * @desc    Lấy danh sách toàn bộ khách hàng hệ thống (có phân trang)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 * @query   page?, limit?, search?
 */
router.get(
  "/customers",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.getAllCustomers
);

/**
 * @route   GET /api/employees/customers/search
 * @desc    Tìm kiếm khách hàng theo tên, SĐT, CCCD
 * @access  Private - NHAN_VIEN, QUAN_TRI
 * @query   name?, phone?, cccd?
 */
router.get(
  "/customers/search",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.searchCustomers
);

/**
 * @route   GET /api/employees/customers/:maKhachHang/pets
 * @desc    Lấy danh sách thú cưng của khách hàng
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/customers/:maKhachHang/pets",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.getCustomerPets
);

/**
 * @route   GET /api/employees/products/branch/:maChiNhanh
 * @desc    Lấy danh sách sản phẩm có tồn kho > 0 tại chi nhánh
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/products/branch/:maChiNhanh",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.getProductsByBranch
);

/**
 * @route   GET /api/employees/profile
 * @desc    Lấy thông tin nhân viên hiện tại (từ token)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/profile",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.getProfile
);

/**
 * @route   GET /api/employees/branch
 * @desc    Lấy thông tin chi nhánh của nhân viên hiện tại
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/branch",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.getBranch
);

/**
 * @route   GET /api/employees/work-schedule
 * @desc    Lấy lịch làm việc của nhân viên
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/work-schedule",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.getWorkSchedule
);

/**
 * @route   POST /api/employees/work-schedule
 * @desc    Đăng ký lịch làm việc mới
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.post(
  "/work-schedule",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.createWorkSchedule
);

/**
 * @route   DELETE /api/employees/work-schedule
 * @desc    Xóa lịch làm việc
 * @access  Private - NHAN_VIEN, QUAN_TRI
 * @body    { ngayLam, gioBatDau }
 */
router.delete(
  "/work-schedule",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.deleteWorkSchedule
);

/**
 * @route   POST /api/employees/records
 * @desc    Tạo hồ sơ đa dịch vụ (1 HoaDon với nhiều CTHD)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 * @body    { MaKhachHang, MaThuCung, services: ['Khám bệnh', 'Tiêm phòng'] }
 */
router.post(
  "/records",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  employeesController.createMultiServiceRecord
);

/**
 * @route   GET /api/employees/:id
 * @desc    Chi tiết nhân viên
 * @access  Public (tạm thời)
 * @note    Phải đặt sau các route cụ thể để tránh conflict
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

module.exports = router;
