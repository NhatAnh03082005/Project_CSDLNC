const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class ProductsService {
  /**
   * Lấy danh sách toàn bộ sản phẩm (Dùng cho Admin)
   * logic từ feature/admin
   */
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

  /**
   * Lấy danh sách sản phẩm theo chi nhánh (Dùng cho Client)
   * logic từ HEAD
   */
  async getProductsByBranch(maChiNhanh) {
    try {
      const pool = await poolPromise;

      if (!maChiNhanh) {
        return {
          success: false,
          status: 400,
          message: "Mã chi nhánh không được để trống",
        };
      }

      const maChiNhanhFormatted = String(maChiNhanh).trim();

      const branchCheck = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
        .query(
          `
          SELECT TOP 1 MaChiNhanh, TenChiNhanh
          FROM dbo.ChiNhanh
          WHERE MaChiNhanh = @MaChiNhanh
        `
        );

      if (branchCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: `Không tìm thấy chi nhánh với mã: ${maChiNhanh}`,
        };
      }

      const result = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
        .query(
          `
          SELECT 
            sp.MaSanPham,
            sp.TenSanPham,
            sp.LoaiSanPham,
            sp.DonGia,
            tk.SoLuongTon AS SoLuongTonKho
          FROM dbo.SanPham sp
          INNER JOIN dbo.SanPham_TonKho tk 
            ON sp.MaSanPham = tk.MaSanPham AND tk.MaChiNhanh = @MaChiNhanh
          WHERE tk.SoLuongTon > 0
          ORDER BY sp.LoaiSanPham, sp.TenSanPham
        `
        );

      const products = result.recordset.map((item) => ({
        maSanPham: item.MaSanPham,
        tenSanPham: item.TenSanPham,
        loaiSanPham: item.LoaiSanPham,
        donGia: parseFloat(item.DonGia),
        soLuongTonKho: item.SoLuongTonKho || 0,
      }));

      return {
        success: true,
        status: 200,
        data: {
          chiNhanh: {
            maChiNhanh: branchCheck.recordset[0].MaChiNhanh,
            tenChiNhanh: branchCheck.recordset[0].TenChiNhanh,
          },
          products,
        },
      };
    } catch (error) {
      console.error("Error fetching products by branch:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message,
      };
    }
  }

  /**
   * Lấy chi tiết sản phẩm
   * Gộp logic: Hỗ trợ cả truy vấn chung (Admin) và truy vấn kèm tồn kho chi nhánh (Client)
   */
  async getProductById(maSanPham, maChiNhanh = null) {
    try {
      const pool = await poolPromise;

      if (!maSanPham) {
        // Trả về error format cho client nếu thiếu params
        if (maChiNhanh)
          return { success: false, status: 400, message: "Thiếu mã sản phẩm" };
        throw new Error("Mã sản phẩm không được để trống");
      }

      // Nếu có maChiNhanh -> Trả về format chi tiết kèm tồn kho (Client logic HEAD)
      if (maChiNhanh) {
        const maChiNhanhFormatted = String(maChiNhanh).trim();
        const result = await pool
          .request()
          .input("MaSanPham", sql.Char(5), maSanPham)
          .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
          .query(
            `
            SELECT 
              sp.MaSanPham,
              sp.TenSanPham,
              sp.LoaiSanPham,
              sp.DonGia,
              ISNULL(tk.SoLuongTon, 0) AS SoLuongTonKho
            FROM dbo.SanPham sp
            LEFT JOIN dbo.SanPham_TonKho tk 
              ON sp.MaSanPham = tk.MaSanPham AND tk.MaChiNhanh = @MaChiNhanh
            WHERE sp.MaSanPham = @MaSanPham
          `
          );

        if (result.recordset.length === 0) {
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy sản phẩm",
          };
        }

        const product = result.recordset[0];
        const branchResult = await pool
          .request()
          .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
          .query(
            `SELECT TOP 1 MaChiNhanh, TenChiNhanh FROM dbo.ChiNhanh WHERE MaChiNhanh = @MaChiNhanh`
          );

        return {
          success: true,
          status: 200,
          data: {
            maSanPham: product.MaSanPham,
            tenSanPham: product.TenSanPham,
            loaiSanPham: product.LoaiSanPham,
            donGia: parseFloat(product.DonGia),
            soLuongTonKho: product.SoLuongTonKho || 0,
            chiNhanh:
              branchResult.recordset.length > 0
                ? {
                    maChiNhanh: branchResult.recordset[0].MaChiNhanh,
                    tenChiNhanh: branchResult.recordset[0].TenChiNhanh,
                  }
                : null,
            moTa: null,
          },
        };
      }

      // Nếu không có maChiNhanh -> Trả về format đơn giản (Admin logic feature/admin)
      const result = await pool
        .request()
        .input("MaSanPham", sql.NVarChar, maSanPham)
        .query(
          `SELECT MaSanPham, TenSanPham, LoaiSanPham, DonGia FROM SanPham WHERE MaSanPham = @MaSanPham`
        );

      return result.recordset[0];
    } catch (error) {
      if (maChiNhanh)
        return {
          success: false,
          status: 500,
          message: "Lỗi Server",
          error: error.message,
        };
      throw error;
    }
  }

  /**
   * Tạo sản phẩm mới (Admin)
   * logic từ feature/admin
   * MaSanPham sẽ được database tự động tạo thông qua trigger
   */
  async createProduct(productData) {
    try {
      const pool = await poolPromise;
      const { TenSanPham, LoaiSanPham, DonGia } = productData;

      if (!TenSanPham || !LoaiSanPham || !DonGia) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // Insert sản phẩm mới (MaSanPham sẽ được trigger tự động tạo)
      await pool
        .request()
        .input("TenSanPham", sql.NVarChar, TenSanPham)
        .input("LoaiSanPham", sql.NVarChar, LoaiSanPham)
        .input("DonGia", sql.Int, DonGia).query(`
          INSERT INTO SanPham (TenSanPham, LoaiSanPham, DonGia)
          VALUES (@TenSanPham, @LoaiSanPham, @DonGia);
        `);

      return { success: true };
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  /**
   * Cập nhật sản phẩm (Admin)
   * logic từ feature/admin
   */
  async updateProduct(maSanPham, productData) {
    try {
      const pool = await poolPromise;
      const { TenSanPham, LoaiSanPham, DonGia } = productData;

      await pool
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
