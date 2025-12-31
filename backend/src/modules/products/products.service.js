const { sql, poolPromise } = require("../../config/database");

class ProductsService {
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
      console.error("maChiNhanh received:", maChiNhanh);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message,
      };
    }
  }

  async getProductById(maSanPham, maChiNhanh) {
    try {
      const pool = await poolPromise;

      if (!maSanPham) {
        return {
          success: false,
          status: 400,
          message: "Mã sản phẩm không được để trống",
        };
      }

      if (!maChiNhanh) {
        return {
          success: false,
          status: 400,
          message: "Mã chi nhánh không được để trống",
        };
      }

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
          `
          SELECT TOP 1 MaChiNhanh, TenChiNhanh
          FROM dbo.ChiNhanh
          WHERE MaChiNhanh = @MaChiNhanh
        `
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
          chiNhanh: branchResult.recordset.length > 0 ? {
            maChiNhanh: branchResult.recordset[0].MaChiNhanh,
            tenChiNhanh: branchResult.recordset[0].TenChiNhanh,
          } : null,
          moTa: null,
        },
      };
    } catch (error) {
      console.error("Error fetching product details:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy chi tiết sản phẩm",
        error: error.message,
      };
    }
  }
}

module.exports = new ProductsService();

