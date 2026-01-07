const appointmentsService = require('./appointments.service');

class AppointmentsController {
    /**
     * Lấy danh sách lịch hẹn của khách hàng
     * GET /api/appointments
     */
    async getCustomerAppointments(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const { page, limit, status } = req.query;
            const response = await appointmentsService.getCustomerAppointments(customerId, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                status,
            });

            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Tạo lịch hẹn mới
     * POST /api/appointments
     */
    async createAppointment(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await appointmentsService.createAppointment(customerId, req.body);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách khung giờ còn trống
     * GET /api/appointments/available-slots
     */
    async getAvailableSlots(req, res, next) {
        try {
            const response = await appointmentsService.getAvailableSlots(req.query);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách bác sĩ rảnh
     * GET /api/appointments/available-doctors
     */
    async getAvailableDoctors(req, res, next) {
        try {
            const response = await appointmentsService.getAvailableDoctors(req.query);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Hủy lịch hẹn
     * PUT /api/appointments/:id/cancel
     */
    async cancelAppointment(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;
            const { id: maLichHen } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            if (!maLichHen) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu mã lịch hẹn',
                });
            }

            const response = await appointmentsService.cancelAppointment(customerId, maLichHen);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
// ---------------------- API cho staff and admin - DƯƠNG ----
    // GET /api/appointments/schedule
  async getSchedule(req, res, next) {
    try {
      // Lấy các tham số filter từ query param
      const { branchId, doctorId, date, status } = req.query;
      
      const result = await appointmentsService.getStaffSchedule({ 
        branchId, 
        doctorId, 
        date, 
        status 
      });
      
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/appointments/:id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await appointmentsService.getAppointmentDetail(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/appointments/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body; // { ThoiGianHen, BacSiPhuTrach, ... }
      
      const result = await appointmentsService.updateAppointment(id, data);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/appointments/:id/confirm
  async confirm(req, res, next) {
    try {
      const { id } = req.params;
      const result = await appointmentsService.confirmAppointment(id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/appointments/:id/complete
  async complete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await appointmentsService.completeAppointment(id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentsController();
