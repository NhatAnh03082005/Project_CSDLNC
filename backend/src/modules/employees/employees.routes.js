const express = require("express");
const router = express.Router();
const employeeController = require('./employees.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const { ROLES } = require('../../config/constants');

/**
 * @route   GET /api/employees
 * @desc    Danh sách nhân viên
 * @access  Public (tạm thời)
 */
// router.get('/', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Get employees list' });
// });
router.get('/', 
   // authenticate, 
   // authorize(ROLES.ADMIN), 
employeeController.getAll);

/**
 * @route   POST /api/employees
 * @desc    Thêm nhân viên mới
 * @access  Public (tạm thời)
 */
// router.post('/', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Create employee' });
// });
router.post('/', 
   // authenticate, 
   // authorize(ROLES.ADMIN), 
    employeeController.create);

/**
 * @route   GET /api/employees/doctors
 * @desc    Danh sách bác sĩ (để đặt lịch)
 * @access  Public (tạm thời)
 */
// router.get('/doctors', authenticate, (req, res) => {
//   res.json({ message: 'Get doctors list' });
// });
router.get('/doctors', 
   // authenticate, 
    employeeController.getDoctors);
module.exports = router;



/**
 * @route   GET /api/employees/:id
 * @desc    Chi tiết nhân viên
 * @access  Private - QUAN_TRI
 */
// router.get('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Get employee details' });
// });
router.get('/:id', 
  //  authenticate, 
   // authorize(ROLES.ADMIN), 
    employeeController.getById);

/**
 * @route   PUT /api/employees/:id
 * @desc    Cập nhật thông tin nhân viên
 * @access  Private - QUAN_TRI
 */
// router.put('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Update employee' });
// });
router.put('/:id', 
   // authenticate, 
    //authorize(ROLES.ADMIN), 
    employeeController.update);
/**
 * @route   DELETE /api/employees/:id
 * @desc    Xóa nhân viên (nghỉ việc)
 * @access  Private - QUAN_TRI
 */
// router.delete('/:id', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Delete employee' });
// });
router.delete('/:id', 
   // authenticate, 
   // authorize(ROLES.ADMIN), 
    employeeController.delete);

/**
 * @route   POST /api/employees/:id/transfer
 * @desc    Điều động nhân viên sang chi nhánh khác
 * @access  Private - QUAN_TRI
 */
// router.post('/:id/transfer', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Transfer employee to another branch' });
// });
router.post('/:id/transfer', 
  //  authenticate, 
    //authorize(ROLES.ADMIN), 
    employeeController.transfer);
/**
 * @route   PUT /api/employees/:id/salary
 * @desc    Cập nhật lương
 * @access  Private - QUAN_TRI
 */
// router.put('/:id/salary', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Update employee salary' });
// });
router.put('/:id/salary', 
   // authenticate, 
  //  authorize(ROLES.ADMIN), 
    employeeController.updateSalary);

/**
 * @route   GET /api/employees/:id/transfer-history
 * @desc    Lịch sử điều động
 * @access  Private - QUAN_TRI
 */
// router.get('/:id/transfer-history', authenticate, authorize(ROLES.ADMIN), (req, res) => {
//   res.json({ message: 'Get employee transfer history' });
// });
router.get('/:id/transfer-history', 
    //authenticate, 
   // authorize(ROLES.ADMIN), 
    employeeController.getTransferHistory);

