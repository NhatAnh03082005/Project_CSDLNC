const employeeRepo = require('./employees.repository');
const { ROLES, ACCOUNT_STATUS } = require('../../config/constants'); 

class EmployeeService {
  async getAllEmployees(query) {
    let page = null;
    let limit = null;

    if (query.page && query.limit) {
        page = parseInt(query.page);
        limit = parseInt(query.limit);
    }

    const { data, total } = await employeeRepo.findAll({ 
      page, limit, search: query.search, chucvu: query.chucvu, 
      trangThai: query.trangThai, maChiNhanh: query.maChiNhanh 
    });

    return {
      success: true,
      status: 200,
      data: data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getEmployeeById(id) {
    const employee = await employeeRepo.findById(id);
    if (!employee) {
      return {
        success: false,
        status: 404,
        message: 'Nhân viên không tồn tại'
      };
    }
    return {
      success: true,
      status: 200,
      data: employee
    };
  }

  async createEmployee(data) {
    // Validate cơ bản
    if (!data.HoTen || !data.MaChiNhanh || !data.ViTri) {
      return {
        success: false,
        status: 400,
        message: 'Thiếu thông tin bắt buộc (HoTen, MaChiNhanh, ViTri)'
      };
    }

    try {
      const newEmployee = await employeeRepo.create(data);
      return {
        success: true,
        status: 201,
        message: 'Thêm nhân viên thành công',
        data: newEmployee
      };
    } catch (error) {
      // Bắt lỗi từ SQL Trigger nếu có
      return {
        success: false,
        status: 500,
        message: 'Lỗi khi tạo nhân viên: ' + error.message
      };
    }
  }

  async updateEmployee(id, data) {
    const exists = await employeeRepo.findById(id);
    if (!exists) {
      return { success: false, status: 404, message: 'Nhân viên không tồn tại' };
    }

    try {
      const updated = await employeeRepo.update(id, data);
      return {
        success: true,
        status: 200,
        message: 'Cập nhật thành công',
        data: updated
      };
    } catch (error) {
      return { success: false, status: 500, message: error.message };
    }
  }

  async deleteEmployee(id) {
    const exists = await employeeRepo.findById(id);
    if (!exists) {
      return { success: false, status: 404, message: 'Nhân viên không tồn tại' };
    }

    await employeeRepo.softDelete(id);
    return {
      success: true,
      status: 200,
      message: 'Đã chuyển trạng thái nhân viên sang nghỉ việc'
    };
  }

  // API Public cho khách hàng/nhân viên đặt lịch
  async getDoctorsList() {
    // Tận dụng hàm findAll có sẵn, fix cứng tham số
    const { data } = await employeeRepo.findAll({
      chucvu: 'Bác sĩ thú y',
      trangThai: 0, // 0 là đang làm việc (Check lại logic 0 hay 1 trong DB của bạn, SQL ghi: 0 LÀ ĐANG LÀM VIỆC)
      page: 1,
      limit: 100 // Lấy tối đa 100 bác sĩ
    });

    // Chỉ map những thông tin cần thiết để public
    const doctors = data.map(d => ({
      MaNhanVien: d.MaNhanVien,
      HoTen: d.HoTen,
      MaChiNhanh: d.MaChiNhanh,
      GioiTinh: d.GioiTinh
    }));

    return {
      success: true,
      status: 200,
      data: doctors
    };
  }

  async transferEmployee(id, targetBranchId) {
    // 1. Kiểm tra nhân viên tồn tại
    const employee = await employeeRepo.findById(id);
    if (!employee) {
      return { success: false, status: 404, message: 'Nhân viên không tồn tại' };
    }

    // 2. Kiểm tra có đang chuyển sang chính chi nhánh hiện tại không
    if (employee.MaChiNhanh === targetBranchId) {
       return { success: false, status: 400, message: 'Nhân viên đã ở chi nhánh này' };
    }

    try {
      // 3. Gọi Repo update. 
      // Nếu là Quản lý, Trigger SQL sẽ ném lỗi, ta catch ở dưới.
      await employeeRepo.transfer(id, targetBranchId);
      
      return {
        success: true,
        status: 200,
        message: `Đã điều chuyển nhân viên sang chi nhánh ${targetBranchId}`
      };
    } catch (error) {
      // Lỗi từ Trigger sẽ lọt vào đây
      return {
        success: false,
        status: 400,
        message: error.message // Sẽ hiện: "Lỗi: Không được điều chuyển nhân viên..."
      };
    }
  }

  async getEmployeeTransferHistory(id) {
     const history = await employeeRepo.getTransferHistory(id);
     return {
        success: true,
        status: 200,
        data: history
     };
  }
  
  async updateEmployeeSalary(id, salary) {
      if(!salary || salary < 0) {
          return { success: false, status: 400, message: 'Lương không hợp lệ' };
      }
      await employeeRepo.updateSalary(id, salary);
      return { success: true, status: 200, message: 'Cập nhật lương thành công' };
  }
}

module.exports = new EmployeeService();