const medicalService = require("./medical.service");

class MedicalController {
  /**
   * Tạo hồ sơ khám bệnh mới
   * POST /api/medical/records
   */
  async createMedicalRecord(req, res, next) {
    try {
      const recordData = req.body;
      const response = await medicalService.createMedicalRecord(recordData);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật hồ sơ khám bệnh
   * PUT /api/medical/records/:maHoaDon/:stt
   */
  async updateMedicalRecord(req, res, next) {
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
      const response = await medicalService.updateMedicalRecord(
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
   * Lấy danh sách hồ sơ khám bệnh chờ cập nhật
   * GET /api/medical/records/pending
   */
  async getPendingMedicalRecords(req, res, next) {
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
      const response = await medicalService.getPendingMedicalRecords(maChiNhanh);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MedicalController();

