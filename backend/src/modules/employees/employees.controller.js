const employeesService = require("./employees.service");

class EmployeesController {
  /**
   * Lấy danh sách tất cả nhân viên
   */
  async getAllEmployees(req, res, next) {
    try {
      const employees = await employeesService.getAllEmployees();

      res.json({
        success: true,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin chi tiết nhân viên theo ID
   */
  async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await employeesService.getEmployeeById(id);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
        });
      }

      res.json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo nhân viên mới
   */
  async createEmployee(req, res, next) {
    try {
      const employeeData = req.body;
      const newEmployee = await employeesService.createEmployee(employeeData);

      res.status(201).json({
        success: true,
        message: "Thêm nhân viên thành công",
        data: newEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thông tin nhân viên
   */
  async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const employeeData = req.body;

      const updatedEmployee = await employeesService.updateEmployee(
        id,
        employeeData
      );

      if (!updatedEmployee) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thông tin nhân viên thành công",
        data: updatedEmployee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa nhân viên
   */
  async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const result = await employeesService.deleteEmployee(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
        });
      }

      res.json({
        success: true,
        message: "Xóa nhân viên thành công",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeesController();
