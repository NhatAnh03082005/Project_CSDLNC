const sql = require("mssql");
const { poolPromise } = require("../../config/database");

// Helper function để format time từ SQL Server
const formatTime = (timeValue) => {
  if (!timeValue) return null;

  // Nếu là Date object từ SQL Server
  if (timeValue instanceof Date) {
    const hours = timeValue.getUTCHours().toString().padStart(2, "0");
    const minutes = timeValue.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return timeValue;
};

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

      // Format time fields
      const formattedData = result.recordset.map((branch) => ({
        ...branch,
        TGMoCua: formatTime(branch.TGMoCua),
        TGDongCua: formatTime(branch.TGDongCua),
      }));

      return formattedData;
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

      const branch = result.recordset[0];
      if (branch) {
        branch.TGMoCua = formatTime(branch.TGMoCua);
        branch.TGDongCua = formatTime(branch.TGDongCua);
      }
      return branch;
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

      console.log("Backend nhận được:", { TGMoCua, TGDongCua });

      if (!TenChiNhanh || !SoNha || !TenDuong || !Phuong || !ThanhPho || !SDT) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const request = pool.request();

      request
        .input("TenChiNhanh", sql.NVarChar, branchData.TenChiNhanh)
        .input("SoNha", sql.Int, branchData.SoNha)
        .input("TenDuong", sql.NVarChar, branchData.TenDuong)
        .input("Phuong", sql.NVarChar, branchData.Phuong)
        .input("ThanhPho", sql.NVarChar, branchData.ThanhPho)
        .input("SDT", sql.NVarChar, branchData.SDT)
        .input("TGMoCua", sql.VarChar(8), branchData.TGMoCua || null)
        .input("TGDongCua", sql.VarChar(8), branchData.TGDongCua || null);

      const result = await request.query(`
          INSERT INTO ChiNhanh
          (TenChiNhanh, SoNha, TenDuong, Phuong, ThanhPho, SDT, TGMoCua, TGDongCua)
          VALUES
          (@TenChiNhanh, @SoNha, @TenDuong, @Phuong, @ThanhPho, @SDT, @TGMoCua, @TGDongCua);
          SELECT SCOPE_IDENTITY() AS MaChiNhanh;
        `);
      const newBranchId = result.recordset[0].MaChiNhanh;
      return await this.getBranchById(newBranchId);
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

      if (!TenChiNhanh || !SoNha || !TenDuong || !Phuong || !ThanhPho || !SDT) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const request = pool.request();

      request
        .input("MaChiNhanh", sql.NVarChar, maChiNhanh)
        .input("TenChiNhanh", sql.NVarChar, branchData.TenChiNhanh)
        .input("SoNha", sql.Int, branchData.SoNha)
        .input("TenDuong", sql.NVarChar, branchData.TenDuong)
        .input("Phuong", sql.NVarChar, branchData.Phuong)
        .input("ThanhPho", sql.NVarChar, branchData.ThanhPho)
        .input("SDT", sql.NVarChar, branchData.SDT)
        .input("TGMoCua", sql.VarChar(8), branchData.TGMoCua || null)
        .input("TGDongCua", sql.VarChar(8), branchData.TGDongCua || null)
        .input("QuanLy", sql.NVarChar, branchData.QuanLy || null);

      const result = await request.query(`
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

  // GET tồn kho sản phẩm theo chi nhánh
  async getProductsStockByBranch(maChiNhanh) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("MaChiNhanh", sql.VarChar, maChiNhanh).query(`
        SELECT 
          tk.MaSanPham,
          sp.TenSanPham,
          sp.LoaiSanPham,
          sp.DonGia,
          tk.SoLuongTon
        FROM SanPham_TonKho tk
        JOIN SanPham sp ON sp.MaSanPham = tk.MaSanPham
        WHERE tk.MaChiNhanh = @MaChiNhanh
        ORDER BY tk.MaSanPham
      `);

    return result.recordset;
  }

  // POST thêm 1 sản phẩm vào kho
  async addProductToStock(maChiNhanh, body) {
    const pool = await poolPromise;
    const { MaSanPham, SoLuongTon } = body;

    const qty = Number(SoLuongTon);
    if (!MaSanPham) throw new Error("Thiếu MaSanPham");
    if (!Number.isInteger(qty) || qty < 0)
      throw new Error("SoLuongTon phải là số nguyên >= 0");

    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaSanPham", sql.Char(5), MaSanPham)
      .input("SoLuongTon", sql.Int, qty).query(`
      INSERT INTO SanPham_TonKho (MaChiNhanh, MaSanPham, SoLuongTon)
      VALUES (@MaChiNhanh, @MaSanPham, @SoLuongTon)
    `);

    return true;
  }

  // PUT cập nhật số lượng 1 sản phẩm
  async updateProductQty(maChiNhanh, maSanPham, { SoLuongTon }) {
    const pool = await poolPromise;

    const qty = Number(SoLuongTon);
    if (!Number.isInteger(qty) || qty < 0) {
      throw new Error("SoLuongTon phải là số nguyên >= 0");
    }

    const rs = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaSanPham", sql.Char(5), maSanPham)
      .input("SoLuongTon", sql.Int, qty).query(`
      UPDATE SanPham_TonKho
      SET SoLuongTon = @SoLuongTon
      WHERE MaChiNhanh=@MaChiNhanh AND MaSanPham=@MaSanPham;

      SELECT @@ROWCOUNT AS affected;
    `);

    if (rs.recordset[0].affected === 0) {
      throw new Error("Không tìm thấy dòng tồn kho để cập nhật");
    }

    return rs.recordset[0];
  }

  // GET tồn kho vắc xin theo chi nhánh
  async getVaccinesStockByBranch(maChiNhanh) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("MaChiNhanh", sql.VarChar, maChiNhanh).query(`
        SELECT 
          tk.MaVacXin,
          sp.TenVacXin,
          sp.GiaTien,
          tk.SoLuongTon
        FROM VacXin_TonKho tk
        JOIN VacXin sp ON sp.MaVacXin = tk.MaVacXin
        WHERE tk.MaChiNhanh = @MaChiNhanh
        ORDER BY tk.MaVacXin
      `);

    return result.recordset;
  }

  // POST thêm 1 vắc xin vào kho
  async addVaccineToStock(maChiNhanh, body) {
    const pool = await poolPromise;
    const { MaVacXin, SoLuongTon } = body;

    const qty = Number(SoLuongTon);
    if (!MaVacXin) throw new Error("Thiếu MaVacXin");
    if (!Number.isInteger(qty) || qty < 0)
      throw new Error("SoLuongTon phải là số nguyên >= 0");

    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaVacXin", sql.Char(4), MaVacXin)
      .input("SoLuongTon", sql.Int, qty).query(`
      INSERT INTO VacXin_TonKho (MaChiNhanh, MaVacXin, SoLuongTon)
      VALUES (@MaChiNhanh, @MaVacXin, @SoLuongTon)
    `);

    return true;
  }

  // PUT cập nhật số lượng 1 vắc xin
  async updateVaccineQty(maChiNhanh, maVacXin, { SoLuongTon }) {
    const pool = await poolPromise;

    const qty = Number(SoLuongTon);
    if (!Number.isInteger(qty) || qty < 0) {
      throw new Error("SoLuongTon phải là số nguyên >= 0");
    }

    const rs = await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("MaVacXin", sql.Char(4), maVacXin)
      .input("SoLuongTon", sql.Int, qty).query(`
      UPDATE VacXin_TonKho
      SET SoLuongTon = @SoLuongTon
      WHERE MaChiNhanh=@MaChiNhanh AND MaVacXin=@MaVacXin;
      SELECT @@ROWCOUNT AS affected;
    `);

    if (rs.recordset[0].affected === 0) {
      throw new Error("Không tìm thấy dòng tồn kho để cập nhật");
    }

    return rs.recordset[0];
  }

  // GET dịch vụ theo chi nhánh
  async getServicesByBranch(maChiNhanh) {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("MaChiNhanh", sql.VarChar, maChiNhanh).query(`
        SELECT 
          dvcn.LoaiDichVu
        FROM DichVu_ChiNhanh dvcn
        JOIN DichVu dv ON dv.LoaiDichVu = dvcn.LoaiDichVu
        WHERE dvcn.MaChiNhanh = @MaChiNhanh
        ORDER BY dvcn.LoaiDichVu
      `);

    return result.recordset;
  }

  // POST thêm 1 dịch vụ cho chi nhánh
  async addServiceToBranch(maChiNhanh, body) {
    const pool = await poolPromise;
    const { LoaiDichVu } = body;

    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("LoaiDichVu", sql.NVarChar, LoaiDichVu).query(`
      INSERT INTO DichVu_ChiNhanh (MaChiNhanh, LoaiDichVu)
      VALUES (@MaChiNhanh, @LoaiDichVu)
    `);

    return true;
  }

  async deleteServiceFromBranch(maChiNhanh, loaiDichVu) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("MaChiNhanh", sql.Char(4), maChiNhanh)
      .input("LoaiDichVu", sql.NVarChar, loaiDichVu).query(`
      DELETE FROM DichVu_ChiNhanh
      WHERE MaChiNhanh = @MaChiNhanh AND LoaiDichVu = @LoaiDichVu
    `);
    return true;
  }

  async getAllEmployeeTransferHistory(maChiNhanh) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT nv.MaNhanVien, nv.HoTen, ls.NgayBatDau, ls.NgayKetThuc, nv.TrangThai
        FROM LichSuDieuDong ls
        JOIN NhanVien nv ON ls.MaNhanVien = nv.MaNhanVien
        WHERE ls.MaChiNhanh = @maChiNhanh
        ORDER BY nv.TrangThai, nv.MaNhanVien
      `;
      const result = await pool
        .request()
        .input("maChiNhanh", sql.NVarChar, maChiNhanh)
        .query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error in getAllEmployeeTransferHistory:", error);
      throw error;
    }
  }
}

module.exports = new BranchesService();
