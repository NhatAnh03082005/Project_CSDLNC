const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class BranchesService {
  async getAllBranches() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            MaChiNhanh,
            TenChiNhanh,
            DiaChi,
            SoDienThoai,
            ThoiGianMoCua,
            ThoiGianDongCua
          FROM ChiNhanh
          ORDER BY MaChiNhanh
        `);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getBranchById(maChiNhanh) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaChiNhanh", sql.NVarChar, maChiNhanh).query(`
          SELECT 
            MaChiNhanh,
            TenChiNhanh,
            DiaChi,
            SoDienThoai,
            Email,
            ThoiGianMoCua,
            ThoiGianDongCua
          FROM ChiNhanh
          WHERE MaChiNhanh = @MaChiNhanh
        `);

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BranchesService();
