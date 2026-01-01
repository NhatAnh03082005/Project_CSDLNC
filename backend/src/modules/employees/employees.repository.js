const { poolPromise, sql } = require('../../config/database');

class EmployeeRepository {
  /**
   * Lấy danh sách nhân viên có filter - có pagination nếu cần =))
   */
  async findAll({ page, limit, search, viTri, trangThai, maChiNhanh }) {
    const pool = await poolPromise;
    const offset = (page - 1) * limit;
    
    // Xây dựng câu query động
    let query = `
      SELECT Count(*) OVER() as TotalCount, * FROM dbo.NhanVien 
      WHERE 1=1
    `;
    
    const request = pool.request();

    if (search) {
      query += ` AND (HoTen LIKE @Search OR MaNhanVien LIKE @Search)`;
      request.input('Search', sql.NVarChar, `%${search}%`);
    }

    if (viTri) {
      query += ` AND ViTri = @ViTri`;
      request.input('ViTri', sql.NVarChar, viTri);
    }

    if (trangThai !== undefined && trangThai !== null) {
      query += ` AND TrangThai = @TrangThai`;
      request.input('TrangThai', sql.Int, trangThai);
    }

    if (maChiNhanh) {
      query += ` AND MaChiNhanh = @MaChiNhanh`;
      request.input('MaChiNhanh', sql.Char(4), maChiNhanh);
    }

   // SỬA ĐOẠN NÀY: Xử lý phân trang có điều kiện
    query += ` ORDER BY MaNhanVien DESC`; // Bắt buộc phải có ORDER BY

    if (page && limit) {
        const offset = (page - 1) * limit;
        query += ` OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`;
        request.input('Offset', sql.Int, offset);
        request.input('Limit', sql.Int, limit);
    }

    const result = await request.query(query);
    return {
      data: result.recordset,
      total: result.recordset.length > 0 ? result.recordset[0].TotalCount : 0
    };
  }

  /**
   * Lấy chi tiết nhân viên theo ID
   */
  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MaNhanVien', sql.Char(5), id)
      .query(`SELECT * FROM dbo.NhanVien WHERE MaNhanVien = @MaNhanVien`);
    return result.recordset[0];
  }

  /**
   * Tạo nhân viên mới
   */
  async create(data) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('HoTen', sql.NVarChar(50), data.HoTen)
      .input('GioiTinh', sql.NVarChar(3), data.GioiTinh)
      .input('NgaySinh', sql.Date, data.NgaySinh)
      .input('NgayVaoLam', sql.Date, data.NgayVaoLam || new Date())
      .input('ViTri', sql.NVarChar(50), data.ViTri)
      .input('LuongCoBan', sql.Int, data.LuongCoBan)
      .input('MaChiNhanh', sql.Char(4), data.MaChiNhanh)
      .query(`
        INSERT INTO dbo.NhanVien (HoTen, GioiTinh, NgaySinh, NgayVaoLam, ViTri, LuongCoBan, MaChiNhanh, TrangThai)
        VALUES (@HoTen, @GioiTinh, @NgaySinh, @NgayVaoLam, @ViTri, @LuongCoBan, @MaChiNhanh, 0);
        
        -- Lấy lại record vừa tạo (dựa vào trigger tự sinh ID, ta lấy record mới nhất)
        SELECT TOP 1 * FROM dbo.NhanVien ORDER BY MaNhanVien DESC;
      `);
    return result.recordset[0];
  }

  /**
   * Cập nhật thông tin nhân viên
   */
  async update(id, data) {
    const pool = await poolPromise;
    await pool.request()
      .input('MaNhanVien', sql.Char(5), id)
      .input('HoTen', sql.NVarChar(50), data.HoTen)
      .input('GioiTinh', sql.NVarChar(3), data.GioiTinh)
      .input('NgaySinh', sql.Date, data.NgaySinh)
      .input('ViTri', sql.NVarChar(50), data.ViTri)
      .input('LuongCoBan', sql.Int, data.LuongCoBan)
      .query(`
        UPDATE dbo.NhanVien
        SET HoTen = @HoTen, GioiTinh = @GioiTinh, NgaySinh = @NgaySinh, ViTri = @ViTri, LuongCoBan = @LuongCoBan
        WHERE MaNhanVien = @MaNhanVien
      `);
    return this.findById(id);
  }

  /**
   * Soft Delete (Chuyển trạng thái sang 1 - Nghỉ việc)
   */
  async softDelete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('MaNhanVien', sql.Char(5), id)
      .query(`UPDATE dbo.NhanVien SET TrangThai = 1 WHERE MaNhanVien = @MaNhanVien`);
    return true;
  }

  /**
   * Lấy lịch sử điều động của nhân viên
   */
  async getTransferHistory(maNhanVien) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MaNhanVien', sql.Char(5), maNhanVien)
      .query(`
        SELECT ls.MaNhanVien, ls.MaChiNhanh, cn.TenChiNhanh, ls.NgayBatDau, ls.NgayKetThuc
        FROM dbo.LichSuDieuDong ls
        JOIN dbo.ChiNhanh cn ON ls.MaChiNhanh = cn.MaChiNhanh
        WHERE ls.MaNhanVien = @MaNhanVien
        ORDER BY ls.NgayBatDau DESC
      `);
    return result.recordset;
  }

  /**
   * Cập nhật chi nhánh (Điều chuyển)
   * Trigger TRG_NV_ChangeBranch_UpdateLSDD sẽ tự động ghi log lịch sử
   * Trigger TRG_Block_Transfer_If_Manager sẽ chặn nếu là Quản lý
   */
  async transfer(id, maChiNhanhMoi) {
    const pool = await poolPromise;
    await pool.request()
      .input('MaNhanVien', sql.Char(5), id)
      .input('MaChiNhanh', sql.Char(4), maChiNhanhMoi)
      .query(`
        UPDATE dbo.NhanVien 
        SET MaChiNhanh = @MaChiNhanh 
        WHERE MaNhanVien = @MaNhanVien
      `);
    return true;
  }
  
  /**
   * Cập nhật lương
   */
  async updateSalary(id, luongMoi) {
      const pool = await poolPromise;
      await pool.request()
        .input('MaNhanVien', sql.Char(5), id)
        .input('LuongCoBan', sql.Int, luongMoi)
        .query(`UPDATE dbo.NhanVien SET LuongCoBan = @LuongCoBan WHERE MaNhanVien = @MaNhanVien`);
      return true;
  }
}

module.exports = new EmployeeRepository();