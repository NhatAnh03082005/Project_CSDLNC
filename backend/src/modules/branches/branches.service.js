const sql = require("mssql");
const { poolPromise } = require("../../config/database");

/**
 * Helper function để format time từ SQL Server dùng chung cho toàn bộ service
 */
const formatTime = (timeValue) => {
  if (!timeValue) return null;

  // Nếu là Date object từ SQL Server
  if (timeValue instanceof Date) {
    const hours = timeValue.getUTCHours().toString().padStart(2, "0");
    const minutes = timeValue.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Xử lý object dạng { hours, minutes }
  if (timeValue.hours !== undefined) {
    return `${String(timeValue.hours).padStart(2, "0")}:${String(
      timeValue.minutes || 0
    ).padStart(2, "0")}`;
  }

  // Xử lý string
  if (typeof timeValue === "string") {
    return timeValue.substring(0, 5);
  }

  return timeValue.toString().substring(0, 5);
};

class BranchesService {
  /**
   * Lấy danh sách chi nhánh với phân trang và filter (Logic từ HEAD)
   */
  async getBranches(options = {}) {
    const { page = 1, limit = 6, search, service } = options;

    try {
      const pool = await poolPromise;

      // GỌI STORED PROCEDURE sp_TV1_SearchBranches
      const result = await pool
        .request()
        .input('Page', sql.Int, parseInt(page))
        .input('Limit', sql.Int, parseInt(limit))
        .input('Search', sql.NVarChar(255), search || null)
        .input('Service', sql.NVarChar(50), service ? service.trim() : null)
        .output('TotalCount', sql.Int)
        .output('TotalPages', sql.Int)
        .execute('sp_TV1_SearchBranches');

      const { TotalCount, TotalPages } = result.output;
      const branches = result.recordset.map((branch) => ({
        MaChiNhanh: branch.MaChiNhanh,
        TenChiNhanh: branch.TenChiNhanh,
        DiaChi: branch.DiaChi,
        SDT: branch.SDT,
        TGMoCua: formatTime(branch.TGMoCua),
        TGDongCua: formatTime(branch.TGDongCua),
        DangMoCua: branch.DangMoCua === 1,
        DichVu: [], // Sẽ được populate ở bước sau
      }));

      // Lấy dịch vụ cho từng chi nhánh sử dụng stored procedure
      for (const branch of branches) {
        const servicesResult = await pool
          .request()
          .input('MaChiNhanh', sql.Char(4), branch.MaChiNhanh)
          .execute('sp_TV1_GetBranchServices');
        
        branch.DichVu = servicesResult.recordset.map((s) => s.LoaiDichVu);
      }

      return {
        success: true,
        status: 200,
        data: {
          branches,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: TotalCount || 0,
            totalPages: TotalPages || 0,
            hasNext: page < (TotalPages || 0),
            hasPrev: page > 1,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching branches:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách chi nhánh",
        error: error.message,
      };
    }
  }

  /**
   * Lấy toàn bộ danh sách chi nhánh (Logic từ feature/admin)
   */
  async getAllBranches() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT MaChiNhanh, TenChiNhanh, SoNha, TenDuong, Phuong, ThanhPho, SDT, TGMoCua, TGDongCua, QuanLy
          FROM ChiNhanh ORDER BY MaChiNhanh
        `);

      return result.recordset.map((branch) => ({
        ...branch,
        TGMoCua: formatTime(branch.TGMoCua),
        TGDongCua: formatTime(branch.TGDongCua),
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết chi nhánh (Gộp logic check DangMoCua từ HEAD và Format từ Admin)
   */
  async getBranchById(maChiNhanh) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaChiNhanh", sql.NVarChar, maChiNhanh).query(`
          SELECT *,
            CASE 
              WHEN TGMoCua IS NULL OR TGDongCua IS NULL THEN 0
              WHEN TGMoCua <= TGDongCua THEN
                CASE WHEN CAST(GETDATE() AS TIME) >= TGMoCua AND CAST(GETDATE() AS TIME) <= TGDongCua THEN 1 ELSE 0 END
              ELSE
                CASE WHEN CAST(GETDATE() AS TIME) >= TGMoCua OR CAST(GETDATE() AS TIME) <= TGDongCua THEN 1 ELSE 0 END
            END AS DangMoCua
          FROM ChiNhanh WHERE MaChiNhanh = @MaChiNhanh
        `);

      const branch = result.recordset[0];
      if (!branch) return null;

      // Lấy thêm danh sách dịch vụ (từ HEAD)
      const servicesResult = await pool
        .request()
        .input("MaChiNhanh", sql.NVarChar, maChiNhanh)
        .query(
          `SELECT LoaiDichVu FROM dbo.DichVu_ChiNhanh WHERE MaChiNhanh = @MaChiNhanh`
        );

      return {
        ...branch,
        TGMoCua: formatTime(branch.TGMoCua),
        TGDongCua: formatTime(branch.TGDongCua),
        DangMoCua: branch.DangMoCua === 1,
        DichVu: servicesResult.recordset.map((s) => s.LoaiDichVu),
        // Giữ nguyên format địa chỉ gộp cho client
        DiaChi: `${branch.SoNha} ${branch.TenDuong}, ${branch.Phuong}, ${branch.ThanhPho}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async createBranch(branchData) {
    try {
      const pool = await poolPromise;
      const {
        TenChiNhanh,
        SoNha,
        TenDuong,
        Phuong,
        ThanhPho,
        SDT,
        TGMoCua,
        TGDongCua,
      } = branchData;

      if (!TenChiNhanh || !SoNha || !TenDuong || !Phuong || !ThanhPho || !SDT) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const result = await pool
        .request()
        .input("TenChiNhanh", sql.NVarChar, TenChiNhanh)
        .input("SoNha", sql.Int, SoNha)
        .input("TenDuong", sql.NVarChar, TenDuong)
        .input("Phuong", sql.NVarChar, Phuong)
        .input("ThanhPho", sql.NVarChar, ThanhPho)
        .input("SDT", sql.NVarChar, SDT)
        .input("TGMoCua", sql.VarChar(8), TGMoCua || null)
        .input("TGDongCua", sql.VarChar(8), TGDongCua || null).query(`
          INSERT INTO ChiNhanh (TenChiNhanh, SoNha, TenDuong, Phuong, ThanhPho, SDT, TGMoCua, TGDongCua)
          VALUES (@TenChiNhanh, @SoNha, @TenDuong, @Phuong, @ThanhPho, @SDT, @TGMoCua, @TGDongCua);
          SELECT SCOPE_IDENTITY() AS MaChiNhanh;
        `);

      return await this.getBranchById(result.recordset[0].MaChiNhanh);
    } catch (error) {
      throw error;
    }
  }

  async updateBranch(maChiNhanh, branchData) {
    try {
      const pool = await poolPromise;
      const {
        TenChiNhanh,
        SoNha,
        TenDuong,
        Phuong,
        ThanhPho,
        SDT,
        TGMoCua,
        TGDongCua,
        QuanLy,
      } = branchData;

      await pool
        .request()
        .input("MaChiNhanh", sql.NVarChar, maChiNhanh)
        .input("TenChiNhanh", sql.NVarChar, TenChiNhanh)
        .input("SoNha", sql.Int, SoNha)
        .input("TenDuong", sql.NVarChar, TenDuong)
        .input("Phuong", sql.NVarChar, Phuong)
        .input("ThanhPho", sql.NVarChar, ThanhPho)
        .input("SDT", sql.NVarChar, SDT)
        .input("TGMoCua", sql.VarChar(8), TGMoCua || null)
        .input("TGDongCua", sql.VarChar(8), TGDongCua || null)
        .input("QuanLy", sql.NVarChar, QuanLy || null).query(`
          UPDATE ChiNhanh SET TenChiNhanh = @TenChiNhanh, SoNha = @SoNha, TenDuong = @TenDuong, 
          Phuong = @Phuong, ThanhPho = @ThanhPho, SDT = @SDT, TGMoCua = @TGMoCua, 
          TGDongCua = @TGDongCua, QuanLy = @QuanLy
          WHERE MaChiNhanh = @MaChiNhanh
        `);
      return await this.getBranchById(maChiNhanh);
    } catch (error) {
      throw error;
    }
  }

  // --- Logic quản lý Tồn kho & Dịch vụ (Từ feature/admin) ---

  async getProductsStockByBranch(maChiNhanh) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MaChiNhanh", sql.VarChar, maChiNhanh).query(`
        SELECT tk.MaSanPham, sp.TenSanPham, sp.LoaiSanPham, sp.DonGia, tk.SoLuongTon
        FROM SanPham_TonKho tk
        JOIN SanPham sp ON sp.MaSanPham = tk.MaSanPham
        WHERE tk.MaChiNhanh = @MaChiNhanh ORDER BY tk.MaSanPham
      `);
    return result.recordset;
  }

  async addProductToStock(maChiNhanh, body) {
    const pool = await poolPromise;
    const { MaSanPham, SoLuongTon } = body;
    const qty = Number(SoLuongTon);
    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaSanPham", sql.Char(5), MaSanPham)
      .input("SoLuongTon", sql.Int, qty)
      .query(
        `INSERT INTO SanPham_TonKho (MaChiNhanh, MaSanPham, SoLuongTon) VALUES (@MaChiNhanh, @MaSanPham, @SoLuongTon)`
      );
    return true;
  }

  async updateProductQty(maChiNhanh, maSanPham, { SoLuongTon }) {
    const pool = await poolPromise;
    const rs = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaSanPham", sql.Char(5), maSanPham)
      .input("SoLuongTon", sql.Int, Number(SoLuongTon))
      .query(
        `UPDATE SanPham_TonKho SET SoLuongTon = @SoLuongTon WHERE MaChiNhanh=@MaChiNhanh AND MaSanPham=@MaSanPham; SELECT @@ROWCOUNT AS affected;`
      );
    if (rs.recordset[0].affected === 0)
      throw new Error("Không tìm thấy dòng tồn kho để cập nhật");
    return rs.recordset[0];
  }

  async getVaccinesStockByBranch(maChiNhanh) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MaChiNhanh", sql.VarChar, maChiNhanh).query(`
        SELECT tk.MaVacXin, sp.TenVacXin, sp.GiaTien, tk.SoLuongTon
        FROM VacXin_TonKho tk
        JOIN VacXin sp ON sp.MaVacXin = tk.MaVacXin
        WHERE tk.MaChiNhanh = @MaChiNhanh ORDER BY tk.MaVacXin
      `);
    return result.recordset;
  }

  async addVaccineToStock(maChiNhanh, body) {
    const pool = await poolPromise;
    const { MaVacXin, SoLuongTon } = body;
    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaVacXin", sql.Char(4), MaVacXin)
      .input("SoLuongTon", sql.Int, Number(SoLuongTon))
      .query(
        `INSERT INTO VacXin_TonKho (MaChiNhanh, MaVacXin, SoLuongTon) VALUES (@MaChiNhanh, @MaVacXin, @SoLuongTon)`
      );
    return true;
  }

  async updateVaccineQty(maChiNhanh, maVacXin, { SoLuongTon }) {
    const pool = await poolPromise;
    const rs = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaVacXin", sql.Char(4), maVacXin)
      .input("SoLuongTon", sql.Int, Number(SoLuongTon))
      .query(
        `UPDATE VacXin_TonKho SET SoLuongTon = @SoLuongTon WHERE MaChiNhanh=@MaChiNhanh AND MaVacXin=@MaVacXin; SELECT @@ROWCOUNT AS affected;`
      );
    if (rs.recordset[0].affected === 0)
      throw new Error("Không tìm thấy dòng tồn kho để cập nhật");
    return rs.recordset[0];
  }

  async getServicesByBranch(maChiNhanh) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MaChiNhanh", sql.VarChar, maChiNhanh)
      .query(
        `SELECT dvcn.LoaiDichVu FROM DichVu_ChiNhanh dvcn WHERE dvcn.MaChiNhanh = @MaChiNhanh ORDER BY dvcn.LoaiDichVu`
      );
    return result.recordset;
  }

  async addServiceToBranch(maChiNhanh, body) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("LoaiDichVu", sql.NVarChar, body.LoaiDichVu)
      .query(
        `INSERT INTO DichVu_ChiNhanh (MaChiNhanh, LoaiDichVu) VALUES (@MaChiNhanh, @LoaiDichVu)`
      );
    return true;
  }

  async deleteServiceFromBranch(maChiNhanh, loaiDichVu) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("LoaiDichVu", sql.NVarChar, loaiDichVu)
      .query(
        `DELETE FROM DichVu_ChiNhanh WHERE MaChiNhanh = @MaChiNhanh AND LoaiDichVu = @LoaiDichVu`
      );
    return true;
  }

  async getAllEmployeeTransferHistory(maChiNhanh) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("maChiNhanh", sql.NVarChar, maChiNhanh).query(`
          SELECT nv.MaNhanVien, nv.HoTen, ls.NgayBatDau, ls.NgayKetThuc, nv.TrangThai
          FROM LichSuDieuDong ls JOIN NhanVien nv ON ls.MaNhanVien = nv.MaNhanVien
          WHERE ls.MaChiNhanh = @maChiNhanh ORDER BY nv.TrangThai, nv.MaNhanVien
        `);
      return result.recordset;
    } catch (error) {
      console.error("Error in getAllEmployeeTransferHistory:", error);
      throw error;
    }
  }
}

module.exports = new BranchesService();
