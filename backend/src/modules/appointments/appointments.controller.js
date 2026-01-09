const appointmentsService = require("./appointments.service");

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
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const { page, limit, status } = req.query;
      const response = await appointmentsService.getCustomerAppointments(
        customerId,
        {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
          status,
        }
      );

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
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await appointmentsService.createAppointment(
        customerId,
        req.body
      );
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
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      if (!maLichHen) {
        return res.status(400).json({
          success: false,
          message: "Thiếu mã lịch hẹn",
        });
      }

      const response = await appointmentsService.cancelAppointment(
        customerId,
        maLichHen
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy lịch hẹn theo chi nhánh/ngày/trạng thái (cho nhân viên)
   * GET /api/appointments/schedule
   */
  async getAppointmentsSchedule(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien || null;
      const { MaChiNhanh, NgayHen, TrangThai, page, limit } = req.query;
      const response = await appointmentsService.getAppointmentsSchedule(
        { MaChiNhanh, NgayHen, TrangThai, page, limit },
        maNhanVien
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy lịch hẹn hôm nay với thống kê (cho nhân viên)
   * GET /api/appointments/today
   */
  async getTodayAppointments(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien || null;
      const { MaChiNhanh, date } = req.query;
      const response = await appointmentsService.getTodayAppointments(
        MaChiNhanh,
        maNhanVien,
        date
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết lịch hẹn (cho nhân viên)
   * GET /api/appointments/:id
   */
  async getAppointmentDetails(req, res, next) {
    try {
      const { id: maLichHen } = req.params;
      const response = await appointmentsService.getAppointmentDetails(
        maLichHen
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy lịch hẹn của bác sĩ theo ngày
   * GET /api/appointments/doctor
   */
  async getDoctorAppointments(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const { date } = req.query;
      const response = await appointmentsService.getDoctorAppointments(
        maNhanVien,
        date
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentsController();
