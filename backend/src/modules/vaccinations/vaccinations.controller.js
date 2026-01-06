const vaccinationsService = require("./vaccinations.service");

class VaccinationsController {
  // =====================================================================
  // LOGIC QUẢN LÝ VẮC-XIN (ADMIN - feature/admin)
  // =====================================================================

  /**
   * Lấy danh sách toàn bộ vắc-xin
   * GET /api/vaccinations
   */
  async getAllVaccines(req, res, next) {
    try {
      const vaccines = await vaccinationsService.getAllVaccines();
      res.json({
        success: true,
        data: vaccines,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết vắc-xin theo ID
   * GET /api/vaccinations/:id
   */
  async getVaccineById(req, res, next) {
    try {
      const { id } = req.params;
      const vaccine = await vaccinationsService.getVaccineById(id);

      if (!vaccine) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy vắc-xin",
        });
      }

      res.json({
        success: true,
        data: vaccine,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm vắc-xin mới
   * POST /api/vaccinations
   */
  async createVaccine(req, res, next) {
    try {
      const vaccineData = req.body;
      const newVaccine = await vaccinationsService.createVaccine(vaccineData);

      res.status(201).json({
        success: true,
        message: "Thêm vắc-xin thành công",
        data: newVaccine,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thông tin vắc-xin
   * PUT /api/vaccinations/:id
   */
  async updateVaccine(req, res, next) {
    try {
      const { id } = req.params;
      const vaccineData = req.body;

      const updatedVaccine = await vaccinationsService.updateVaccine(
        id,
        vaccineData
      );

      if (!updatedVaccine) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy vắc-xin",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thông tin vắc-xin thành công",
        data: updatedVaccine,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================================
  // LOGIC GÓI TIÊM PHÒNG (CLIENT/CUSTOMER - HEAD)
  // =====================================================================

  /**
   * Lấy danh sách gói tiêm phòng
   * GET /api/vaccinations/packages
   */
  async getVaccinationPackages(req, res, next) {
    try {
      const response = await vaccinationsService.getVaccinationPackages();
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đăng ký gói tiêm cho thú cưng
   * POST /api/vaccinations/packages/subscribe
   */
  async subscribeToPackage(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await vaccinationsService.subscribeToPackage(
        customerId,
        req.body
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách gói tiêm đang đăng ký của khách hàng
   * GET /api/vaccinations/subscriptions
   */
  async getCustomerSubscriptions(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await vaccinationsService.getCustomerSubscriptions(
        customerId
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
   /** Dương: Bổ sung cho nghiệp vụ của nhân viên
   * Lấy danh sách gói tiêm đang đăng ký của khách hàng
   * GET /api/vaccinations/subscriptions/:customerId
   * Private: admin, staff
   */
  async staffGetCustomerSubscriptions(req, res, next) {
    try {
      const {customerId} = req.params;

      const response = await vaccinationsService.getCustomerSubscriptions(
        customerId
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết gói tiêm đã đăng ký (bao gồm danh sách vaccine)
   * GET /api/vaccinations/subscriptions/:maGoiDK
   */
  async getSubscriptionDetails(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;
      const { maGoiDK } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      if (!maGoiDK) {
        return res.status(400).json({
          success: false,
          message: "Thiếu mã gói đăng ký",
        });
      }

      const response = await vaccinationsService.getSubscriptionDetails(
        customerId,
        maGoiDK
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VaccinationsController();
