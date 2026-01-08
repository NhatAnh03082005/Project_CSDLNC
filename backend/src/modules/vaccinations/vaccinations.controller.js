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

  // =====================================================================
  // LOGIC HỒ SƠ TIÊM PHÒNG CHO NHÂN VIÊN
  // =====================================================================

  /**
   * Ghi nhận tiêm phòng
   * POST /api/vaccinations/records
   */
  async createVaccinationRecord(req, res, next) {
    try {
      const recordData = req.body;
      const response = await vaccinationsService.createVaccinationRecord(recordData);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật hồ sơ tiêm phòng
   * PUT /api/vaccinations/records/:maHoaDon/:stt
   */
  async updateVaccinationRecord(req, res, next) {
    try {
      const { maHoaDon, stt } = req.params;
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const updateData = req.body;
      const response = await vaccinationsService.updateVaccinationRecord(
        maHoaDon,
        parseInt(stt),
        maNhanVien,
        updateData
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách hồ sơ tiêm phòng chờ cập nhật
   * GET /api/vaccinations/records/pending
   */
  async getPendingVaccinationRecords(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      // Lấy chi nhánh từ database
      const { poolPromise } = require("../../config/database");
      const sql = require("mssql");
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `SELECT TOP 1 MaChiNhanh FROM dbo.NhanVien WHERE MaNhanVien = @MaNhanVien`
        );
      
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
        });
      }
      
      const maChiNhanh = result.recordset[0].MaChiNhanh;
      const response = await vaccinationsService.getPendingVaccinationRecords(maChiNhanh);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách vaccine có tồn kho > 0 tại chi nhánh
   * GET /api/vaccinations/available
   */
  async getAvailableVaccines(req, res, next) {
    try {
      const { maChiNhanh } = req.params;
      const response = await vaccinationsService.getAvailableVaccines(maChiNhanh);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách gói tiêm đã đăng ký của khách hàng (cho nhân viên)
   * GET /api/vaccinations/customer/:maKhachHang/subscriptions
   */
  async getCustomerSubscriptionsForEmployee(req, res, next) {
    try {
      const { maKhachHang } = req.params;
      
      if (!maKhachHang) {
        return res.status(400).json({
          success: false,
          message: "Thiếu mã khách hàng",
        });
      }

      const response = await vaccinationsService.getCustomerSubscriptions(maKhachHang);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách vaccine trong gói đăng ký
   * GET /api/vaccinations/packages/:maGoiDK/vaccines
   */
  async getPackageVaccines(req, res, next) {
    try {
      const { maGoiDK } = req.params;
      
      if (!maGoiDK) {
        return res.status(400).json({
          success: false,
          message: "Thiếu mã gói đăng ký",
        });
      }

      // Gọi service để lấy vaccine trong gói
      const { poolPromise } = require("../../config/database");
      const sql = require("mssql");
      const pool = await poolPromise;
      
      const result = await pool
        .request()
        .input("MaGoiDK", sql.Char(6), maGoiDK)
        .query(`
          SELECT vxgd.MaVacXin, vx.TenVacXin, vx.GiaTien AS GiaGoc, vxgd.GiaSauUuDai
          FROM dbo.VacXin_GoiDK vxgd
          INNER JOIN dbo.VacXin vx ON vxgd.MaVacXin = vx.MaVacXin
          WHERE vxgd.MaGoiDK = @MaGoiDK
        `);

      return res.status(200).json({
        success: true,
        count: result.recordset.length,
        data: result.recordset,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VaccinationsController();
