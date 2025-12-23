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
            SoNha,
            TenDuong,
            Phuong,
            ThanhPho,
            SDT,
            TGMoCua,
            TGDongCua,
            QuanLy
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
            SoNha,
            TenDuong,
            Phuong,
            ThanhPho,
            SDT,
            TGMoCua,
            TGDongCua,
            QuanLy
          FROM ChiNhanh
          WHERE MaChiNhanh = @MaChiNhanh
        `);

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async updateBranch(maChiNhanh, branchData) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaChiNhanh", sql.NVarChar, maChiNhanh)
        .input("TenChiNhanh", sql.NVarChar, branchData.TenChiNhanh)
        .input("SoNha", sql.NVarChar, branchData.SoNha)
        .input("TenDuong", sql.NVarChar, branchData.TenDuong)
        .input("Phuong", sql.NVarChar, branchData.Phuong)
        .input("ThanhPho", sql.NVarChar, branchData.ThanhPho)
        .input("SDT", sql.NVarChar, branchData.SDT)
        .input("TGMoCua", sql.Time, branchData.TGMoCua)
        .input("TGDongCua", sql.Time, branchData.TGDongCua)
        .input("QuanLy", sql.NVarChar, branchData.QuanLy).query(`
          UPDATE ChiNhanh
          SET
            TenChiNhanh = @TenChiNhanh,
            SoNha = @SoNha,
            TenDuong = @TenDuong,
            Phuong = @Phuong,
            ThanhPho = @ThanhPho,
            SDT = @SDT,
            TGMoCua = @TGMoCua,
            TGDongCua = @TGDongCua,
            QuanLy = @QuanLy
          WHERE MaChiNhanh = @MaChiNhanh
        `);
      return await this.getBranchById(maChiNhanh);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BranchesService();
