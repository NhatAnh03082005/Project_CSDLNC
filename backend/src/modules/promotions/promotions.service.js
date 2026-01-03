const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class PromotionsService {
  async getAllPromotions() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            MaKhuyenMai,
            NgayBatDau,
            NgayKetThuc,
            TiLeGiamGia
          FROM KhuyenMai
          ORDER BY MaKhuyenMai
        `);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy khuyến mãi đang hoạt động (theo ngày hiện tại)
   * Trả về khuyến mãi có TiLeGiamGia cao nhất (giống logic trigger)
   */
  async getActivePromotion() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT TOP 1
            MaKhuyenMai,
            NgayBatDau,
            NgayKetThuc,
            TiLeGiamGia
          FROM KhuyenMai
          WHERE CAST(GETDATE() AS DATE) BETWEEN NgayBatDau AND NgayKetThuc
          ORDER BY TiLeGiamGia DESC
        `);

      return result.recordset[0] || null;
    } catch (error) {
      throw error;
    }
  }

  async getPromotionById(maKhuyenMai) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaKhuyenMai", sql.NVarChar, maKhuyenMai).query(`
          SELECT 
            MaKhuyenMai,
            NgayBatDau,
            NgayKetThuc,
            TiLeGiamGia
          FROM KhuyenMai
          WHERE MaKhuyenMai = @MaKhuyenMai
        `);

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async createPromotion(promotionData) {
    try {
      const pool = await poolPromise;
      const { NgayBatDau, NgayKetThuc, TiLeGiamGia } = promotionData;

      if (!NgayBatDau || !NgayKetThuc || !TiLeGiamGia) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const insertResult = await pool
        .request()
        .input("NgayBatDau", sql.Date, NgayBatDau)
        .input("NgayKetThuc", sql.Date, NgayKetThuc)
        .input("TiLeGiamGia", sql.Int, TiLeGiamGia).query(`
          INSERT INTO KhuyenMai (NgayBatDau, NgayKetThuc, TiLeGiamGia)
          VALUES (@NgayBatDau, @NgayKetThuc, @TiLeGiamGia);
            SELECT SCOPE_IDENTITY() AS MaKhuyenMai;
        `);
      const maKhuyenMai = insertResult.recordset[0].MaKhuyenMai;
      return await this.getPromotionById(maKhuyenMai);
    } catch (error) {
      console.error("Error in createEmployee:", error);
      throw error;
    }
  }

  async updatePromotion(maKhuyenMai, promotionData) {
    try {
      const pool = await poolPromise;
      const { NgayBatDau, NgayKetThuc, TiLeGiamGia } = promotionData;

      const result = await pool
        .request()
        .input("MaKhuyenMai", sql.NVarChar, maKhuyenMai)
        .input("NgayBatDau", sql.Date, NgayBatDau)
        .input("NgayKetThuc", sql.Date, NgayKetThuc)
        .input("TiLeGiamGia", sql.Int, TiLeGiamGia).query(`
            UPDATE KhuyenMai
            SET
              NgayBatDau = @NgayBatDau,
              NgayKetThuc = @NgayKetThuc,
              TiLeGiamGia = @TiLeGiamGia
            WHERE MaKhuyenMai = @MaKhuyenMai
        `);
      return await this.getPromotionById(maKhuyenMai);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PromotionsService();
