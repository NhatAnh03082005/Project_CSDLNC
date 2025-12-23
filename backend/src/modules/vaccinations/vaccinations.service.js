const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class VaccinationsService {
  async getAllVaccines() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            MaVacXin,
            TenVacXin,
            GiaTien
          FROM VacXin
          ORDER BY MaVacXin
        `);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getVaccineById(maVacXin) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaVacXin", sql.NVarChar, maVacXin).query(`
          SELECT 
            MaVacXin,
            TenVacXin,
            GiaTien
          FROM VacXin
          WHERE MaVacXin = @MaVacXin
        `);

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async createVaccine(vaccineData) {
    try {
      const pool = await poolPromise;
      const { TenVacXin, HangSanXuat, GiaTien, MoTa } = vaccineData;

      if (!TenVacXin || !HangSanXuat || !GiaTien) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const insertResult = await pool
        .request()
        .input("TenVacXin", sql.NVarChar, TenVacXin)
        .input("GiaTien", sql.Int, GiaTien).query(`
          INSERT INTO VacXin (TenVacXin, GiaTien)
          VALUES (@TenVacXin, @GiaTien);
          SELECT SCOPE_IDENTITY() AS MaVacXin;
        `);

      const maVacXin = insertResult.recordset[0].MaVacXin;
      return await this.getVaccineById(maVacXin);
    } catch (error) {
      console.error("Error in createVaccine:", error);
      throw error;
    }
  }

  async updateVaccine(maVacXin, vaccineData) {
    try {
      const pool = await poolPromise;
      const { TenVacXin, HangSanXuat, GiaTien, MoTa } = vaccineData;

      const result = await pool
        .request()
        .input("MaVacXin", sql.NVarChar, maVacXin)
        .input("TenVacXin", sql.NVarChar, TenVacXin)
        .input("GiaTien", sql.Int, GiaTien).query(`
          UPDATE VacXin
          SET 
            TenVacXin = @TenVacXin,
            GiaTien = @GiaTien
          WHERE MaVacXin = @MaVacXin
        `);

      return await this.getVaccineById(maVacXin);
    } catch (error) {
      console.error("Error in updateVaccine:", error);
      throw error;
    }
  }
}

module.exports = new VaccinationsService();
