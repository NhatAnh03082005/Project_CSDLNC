const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../../middlewares/auth");
const { ROLES } = require("../../config/constants");
const customersController = require("./customers.controller");
const employeesController = require("../employees/employees.controller");

/**
 * @route   GET /api/customers/employees
 * @desc    Test danh sách nhân viên (không cần auth) - Giữ từ feature/admin
 * @access  Public
 */
router.get("/employees", employeesController.getAllEmployees);

/**
 * @route   GET /api/customers
 * @desc    Load toàn bộ danh sách khách hàng
 * @access  Private - staff, admin
 */
router.get(
  "/",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  customersController.getAll
);

/**
 * @route   GET /api/customers/profile
 * @desc    Xem thông tin cá nhân khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/profile",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.getProfile
);

/**
 * @route   PUT /api/customers/profile
 * @desc    Cập nhật thông tin cá nhân
 * @access  Private - KHACH_HANG
 */
router.put(
  "/profile",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.updateProfile
);

/**
 * @route   GET /api/customers/membership
 * @desc    Xem thông tin hạng thành viên & điểm loyalty
 * @access  Private - KHACH_HANG
 */
router.get(
  "/membership",
  authenticate,
  authorize(ROLES.CUSTOMER),
  (req, res) => {
    // Nếu customersController chưa có hàm này, giữ logic callback tạm thời
    res.json({ message: "Get membership info" });
  }
);

/**
 * @route   GET /api/customers/appointments
 * @desc    Xem lịch hẹn của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/appointments",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.getAppointments
);

/**
 * @route   GET /api/customers/invoices
 * @desc    Xem danh sách hóa đơn của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/invoices",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.getInvoices
);

/**
 * @route   GET /api/customers/invoices/:maHoaDon
 * @desc    Xem chi tiết hóa đơn (bao gồm tất cả CTHD: mua hàng, khám bệnh, tiêm phòng)
 * @access  Private - KHACH_HANG
 */
router.get(
  "/invoices/:maHoaDon",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.getInvoiceDetails
);

/**
 * @route   POST /api/customers/orders
 * @desc    Đặt mua sản phẩm (tạo đơn hàng chờ xác nhận)
 * @access  Private - KHACH_HANG
 */
router.post(
  "/orders",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.createOrder
);

/**
 * @route   GET /api/customers/orders
 * @desc    Xem danh sách đơn hàng của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/orders",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.getOrders
);

/**
 * @route   GET /api/customers/orders/:maHoaDon
 * @desc    Xem chi tiết đơn hàng của khách hàng
 * @access  Private - KHACH_HANG
 */
router.get(
  "/orders/:maHoaDon",
  authenticate,
  authorize(ROLES.CUSTOMER),
  customersController.getOrderDetails
);

/**
 * @route   GET /api/customers/orders/pending
 * @desc    Xem danh sách đơn hàng chờ xác nhận (cho nhân viên)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.get(
  "/orders/pending",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  customersController.getPendingOrders
);

/**
 * @route   PUT /api/customers/orders/:maHoaDon/confirm
 * @desc    Xác nhận đơn hàng (cho nhân viên)
 * @access  Private - NHAN_VIEN, QUAN_TRI
 */
router.put(
  "/orders/:maHoaDon/confirm",
  authenticate,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  customersController.confirmOrder
);

module.exports = router;
