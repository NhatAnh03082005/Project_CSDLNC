const { sql, poolPromise } = require("../../config/database");

class EmployeesService {
  /**
   * Lấy danh sách tất cả nhân viên
   */
  async getAllEmployees() {
    try {
      const pool = await poolPromise;

      // Get all employees with full information
      const query = `
        SELECT nv.MaNhanVien, nv.HoTen, nv.GioiTinh, nv.NgaySinh, nv.NgayVaoLam, nv.ViTri, nv.LuongCoBan, cn.TenChiNhanh
        FROM NhanVien nv
        JOIN ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh
        Where nv.TrangThai = 0
        ORDER BY cn.MaChiNhanh, nv.MaNhanVien
      `;

      const result = await pool.request().query(query);

      return result.recordset;
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết nhân viên theo MaNhanVien
   */
  async getEmployeeById(maNhanVien) {
    try {
      const pool = await poolPromise;
      const query = `
        SELECT nv.HoTen, nv.GioiTinh, nv.NgaySinh, nv.NgayVaoLam, nv.ViTri, nv.LuongCoBan, cn.TenChiNhanh
        FROM NhanVien nv
        JOIN ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh
        WHERE nv.MaNhanVien = @maNhanVien
          AND nv.TrangThai = 0
      `;

      const result = await pool
        .request()
        .input("maNhanVien", sql.NVarChar, maNhanVien)
        .query(query);

      return result.recordset[0];
    } catch (error) {
      console.error("Error in getEmployeeById:", error);
      throw error;
    }
  }

  /**
   * Tạo nhân viên mới
   */
  async createEmployee(employeeData) {
    try {
      const pool = await poolPromise;
      const {
        HoTen,
        GioiTinh,
        NgaySinh,
        NgayVaoLam,
        ViTri,
        LuongCoBan,
        TenChiNhanh,
      } = employeeData;

      if (
        !HoTen ||
        !GioiTinh ||
        !NgaySinh ||
        !NgayVaoLam ||
        !ViTri ||
        LuongCoBan == null ||
        !TenChiNhanh
      ) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // Lấy MaChiNhanh từ TenChiNhanh
      const branchResult = await pool
        .request()
        .input("TenChiNhanh", sql.NVarChar, TenChiNhanh)
        .query(
          `SELECT MaChiNhanh FROM ChiNhanh WHERE TenChiNhanh = @TenChiNhanh`
        );

      if (branchResult.recordset.length === 0)
        throw new Error("Tên chi nhánh không tồn tại");

      const MaChiNhanh = branchResult.recordset[0].MaChiNhanh;

      const insertResult = await pool
        .request()
        .input("HoTen", sql.NVarChar, HoTen)
        .input("GioiTinh", sql.NVarChar, GioiTinh)
        .input("NgaySinh", sql.Date, NgaySinh)
        .input("NgayVaoLam", sql.Date, NgayVaoLam)
        .input("ViTri", sql.NVarChar, ViTri)
        .input("LuongCoBan", sql.Int, LuongCoBan)
        .input("MaChiNhanh", sql.NVarChar, MaChiNhanh).query(`
        DECLARE @NewId TABLE (MaNhanVien INT);

        INSERT INTO NhanVien (HoTen, GioiTinh, NgaySinh, NgayVaoLam, ViTri, LuongCoBan, MaChiNhanh)
        OUTPUT INSERTED.MaNhanVien INTO @NewId(MaNhanVien)
        VALUES (@HoTen, @GioiTinh, @NgaySinh, @NgayVaoLam, @ViTri, @LuongCoBan, @MaChiNhanh);

        SELECT MaNhanVien FROM @NewId;
      `);

      return { success: true };
    } catch (error) {
      console.error("Error in createEmployee:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin nhân viên
   */
  async updateEmployee(maNhanVien, employeeData) {
    try {
      const pool = await poolPromise;

      // 1) Lấy nhân viên hiện tại
      const employee = await this.getEmployeeById(maNhanVien);
      if (!employee) return null;

      const {
        HoTen,
        NgaySinh,
        GioiTinh,
        NgayVaoLam,
        ViTri,
        LuongCoBan,
        TenChiNhanh, // FE gửi tên CN (optional)
      } = employeeData;

      // 2) Xác định có đổi chi nhánh không
      const currentTenCN = employee.TenChiNhanh; // lấy từ JOIN ở getEmployeeById
      const hasBranchChange =
        TenChiNhanh &&
        (!currentTenCN || TenChiNhanh.trim() !== String(currentTenCN).trim());

      // 3) Update các field cơ bản (KHÔNG đụng MaChiNhanh ở đây)
      const queryUpdateFields = `
      UPDATE NhanVien
      SET 
        HoTen = @HoTen,
        NgaySinh = @NgaySinh,
        GioiTinh = @GioiTinh,
        NgayVaoLam = @NgayVaoLam,
        ViTri = @ViTri,
        LuongCoBan = @LuongCoBan
      WHERE MaNhanVien = @MaNhanVien
    `;

      await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .input("HoTen", sql.NVarChar, HoTen ?? employee.HoTen)
        .input("NgaySinh", sql.Date, NgaySinh ?? employee.NgaySinh)
        .input("GioiTinh", sql.NVarChar, GioiTinh ?? employee.GioiTinh)
        .input("NgayVaoLam", sql.Date, NgayVaoLam ?? employee.NgayVaoLam)
        .input("ViTri", sql.NVarChar, ViTri ?? employee.ViTri)
        .input("LuongCoBan", sql.Int, LuongCoBan ?? employee.LuongCoBan)
        .query(queryUpdateFields);

      // 4) Nếu không đổi chi nhánh -> xong
      if (!hasBranchChange) {
        return await this.getEmployeeById(maNhanVien);
      }

      // 5) Có đổi chi nhánh: map TenChiNhanh -> MaChiNhanh
      const branchResult = await pool
        .request()
        .input("TenChiNhanh", sql.NVarChar, TenChiNhanh.trim()).query(`
        SELECT TOP 1 MaChiNhanh
        FROM ChiNhanh
        WHERE TenChiNhanh = @TenChiNhanh
      `);

      if (branchResult.recordset.length === 0) {
        throw new Error("Tên chi nhánh không tồn tại");
      }

      const maChiNhanhMoi = String(branchResult.recordset[0].MaChiNhanh).trim();

      // 6) Gọi SP để đổi chi nhánh + cập nhật lịch sử điều động
      // SP của bạn nhận CHAR(4) -> truyền đúng kiểu CHAR(4)
      await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .input("MaChiNhanhMoi", sql.Char(4), maChiNhanhMoi)
        .execute("dbo.sp_NV_ChangeBranch_UpdateLSDD");

      // 7) Trả về nhân viên mới nhất
      return await this.getEmployeeById(maNhanVien);
    } catch (error) {
      console.error("Error in updateEmployee:", error);
      throw error;
    }
  }

  async deleteEmployee(maNhanVien) {
    try {
      const pool = await poolPromise;

      // Check if employee exists
      const employee = await this.getEmployeeById(maNhanVien);
      if (!employee) {
        return null;
      }

      // Nếu nhân viên đang là quản lý chi nhánh, set QuanLy = null
      await pool.request().input("maNhanVien", sql.NVarChar, maNhanVien).query(`
          UPDATE ChiNhanh
          SET QuanLy = NULL
          WHERE QuanLy = @maNhanVien
        `);

      // Sau đó mới xóa nhân viên (soft delete)
      await pool.request().input("maNhanVien", sql.NVarChar, maNhanVien).query(`
          UPDATE NhanVien
          SET TrangThai = 1
          WHERE MaNhanVien = @maNhanVien
        `);

      return true;
    } catch (error) {
      console.error("Error in deleteEmployee:", error);
      throw error;
    }
  }
}

module.exports = new EmployeesService();
