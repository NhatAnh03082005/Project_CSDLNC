const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class ServicesService {
  async getAllServices() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            LoaiDichVu
          FROM DichVu
          ORDER BY LoaiDichVu
        `);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServicesService();
