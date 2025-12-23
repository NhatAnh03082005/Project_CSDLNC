const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class ProductsService {
  async getAllProducts() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            MaSanPham,
            TenSanPham,
            LoaiSanPham,
            DonGia
          FROM SanPham
          ORDER BY MaSanPham
        `);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(maSanPham) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaSanPham", sql.NVarChar, maSanPham).query(`
          SELECT 
            MaSanPham,
            TenSanPham,
            LoaiSanPham,
            DonGia
          FROM SanPham
          WHERE MaSanPham = @MaSanPham
        `);

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const pool = await poolPromise;
      const { TenSanPham, LoaiSanPham, DonGia } = productData;

      if (!TenSanPham || !LoaiSanPham || !DonGia) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const insertResult = await pool
        .request()
        .input("TenSanPham", sql.NVarChar, TenSanPham)
        .input("LoaiSanPham", sql.NVarChar, LoaiSanPham)
        .input("DonGia", sql.Int, DonGia).query(`
          INSERT INTO SanPham (TenSanPham, LoaiSanPham, DonGia)
          VALUES (@TenSanPham, @LoaiSanPham, @DonGia);
          SELECT SCOPE_IDENTITY() AS MaSanPham;
        `);
      const maSanPham = insertResult.recordset[0].MaSanPham;
      return await this.getProductById(maSanPham);
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(maSanPham, productData) {
    try {
      const pool = await poolPromise;
      const { TenSanPham, LoaiSanPham, DonGia } = productData;

      const result = await pool
        .request()
        .input("MaSanPham", sql.NVarChar, maSanPham)
        .input("TenSanPham", sql.NVarChar, TenSanPham)
        .input("LoaiSanPham", sql.NVarChar, LoaiSanPham)
        .input("DonGia", sql.Int, DonGia).query(`
            UPDATE SanPham
            SET
              TenSanPham = @TenSanPham,
              LoaiSanPham = @LoaiSanPham,
              DonGia = @DonGia
            WHERE MaSanPham = @MaSanPham
        `);
      return await this.getProductById(maSanPham);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductsService();
