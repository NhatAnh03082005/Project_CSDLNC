const employeeService = require('./employees.service');

class EmployeeController {
  // GET /api/employees
  async getAll(req, res, next) {
    try {
      const result = await employeeService.getAllEmployees(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/employees/:id
  async getById(req, res, next) {
    try {
      const result = await employeeService.getEmployeeById(req.params.id);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/employees
  async create(req, res, next) {
    try {
      const result = await employeeService.createEmployee(req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/employees/:id
  async update(req, res, next) {
    try {
      const result = await employeeService.updateEmployee(req.params.id, req.body);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/employees/:id
  async delete(req, res, next) {
    try {
      const result = await employeeService.deleteEmployee(req.params.id);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/employees/doctors
  async getDoctors(req, res, next) {
    try {
      const result = await employeeService.getDoctorsList();
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/employees/:id/transfer
  async transfer(req, res, next) {
    try {
      const { targetBranchId } = req.body; // Body gửi lên: { "targetBranchId": "CN02" }
      if (!targetBranchId) {
        return res.status(400).json({ success: false, message: 'Chưa chọn chi nhánh đích' });
      }
      const result = await employeeService.transferEmployee(req.params.id, targetBranchId);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/employees/:id/transfer-history
  async getTransferHistory(req, res, next) {
    try {
      const result = await employeeService.getEmployeeTransferHistory(req.params.id);
      return res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
  
  // PUT /api/employees/:id/salary
  async updateSalary(req, res, next) {
      try {
          const { salary } = req.body;
          const result = await employeeService.updateEmployeeSalary(req.params.id, salary);
          return res.status(result.status).json(result);
      } catch (error) {
          next(error);
      }
  }
}

module.exports = new EmployeeController();
