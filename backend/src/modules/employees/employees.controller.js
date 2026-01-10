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

  /**
   * Lấy danh sách toàn bộ khách hàng hệ thống
   * GET /api/employees/customers
   */
  async getAllCustomers(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      const response = await employeesService.getAllCustomers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        search: search || null,
      });
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tìm kiếm khách hàng theo tên, SĐT, CCCD
   * GET /api/employees/customers/search
   */
  async searchCustomers(req, res, next) {
    try {
      const { name, phone, cccd } = req.query;
      const response = await employeesService.searchCustomers({ name, phone, cccd });
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách thú cưng của khách hàng
   * GET /api/employees/customers/:maKhachHang/pets
   */
  async getCustomerPets(req, res, next) {
    try {
      const { maKhachHang } = req.params;
      const response = await employeesService.getCustomerPets(maKhachHang);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách sản phẩm có tồn kho > 0 tại chi nhánh
   * GET /api/employees/products/branch/:maChiNhanh
   */
  async getProductsByBranch(req, res, next) {
    try {
      const { maChiNhanh } = req.params;
      const response = await employeesService.getProductsByBranch(maChiNhanh);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin nhân viên hiện tại
   * GET /api/employees/profile
   */
  async getProfile(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const response = await employeesService.getEmployeeProfile(maNhanVien);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin chi nhánh của nhân viên hiện tại
   * GET /api/employees/branch
   */
  async getBranch(req, res, next) {
    try {
      const maNhanVien = req.user?.maNhanVien;
      
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên trong token. Vui lòng đăng nhập lại.",
        });
      }
      const response = await employeesService.getEmployeeBranch(maNhanVien);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      console.error('[getBranch] Error:', error);
      next(error);
    }
  }

  /**
   * Lấy lịch làm việc của nhân viên
   * GET /api/employees/work-schedule
   */
  async getWorkSchedule(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const response = await employeesService.getWorkSchedule(maNhanVien);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đăng ký lịch làm việc mới
   * POST /api/employees/work-schedule
   */
  async createWorkSchedule(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const scheduleData = req.body;
      const response = await employeesService.createWorkSchedule(
        maNhanVien,
        scheduleData
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa lịch làm việc
   * DELETE /api/employees/work-schedule
   * Body: { ngayLam, gioBatDau }
   */
  async deleteWorkSchedule(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const scheduleKey = req.body; // { ngayLam, gioBatDau }
      const response = await employeesService.deleteWorkSchedule(
        maNhanVien,
        scheduleKey
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo hồ sơ đa dịch vụ (1 HoaDon với nhiều CTHD)
   * POST /api/employees/records
   */
  async createMultiServiceRecord(req, res, next) {
    try {
      const maNhanVien = req.user?.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }

      // Lấy chi nhánh của nhân viên
      const branchResponse = await employeesService.getEmployeeBranch(maNhanVien);
      if (!branchResponse.success) {
        return res.status(branchResponse.status || 400).json(branchResponse);
      }

      const recordData = {
        ...req.body,
        MaChiNhanh: branchResponse.data.maChiNhanh,
      };

      const response = await employeesService.createMultiServiceRecord(recordData);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeesController();
