// Auth Service - Business logic cho authentication
const bcrypt = require("bcryptjs");
const { poolPromise, sql } = require("../../config/database");
const jwt = require("jsonwebtoken");

class AuthService {
  /**
   * Đăng ký khách hàng mới
   * @param {object} userData
   */
  async register(userData) {
    const {
      HoTen,
      GioiTinh,
      SDT,
      CCCD,
      Email,
      MatKhau,
      NgaySinh,
    } = userData;

    // Kiểm tra các trường bắt buộc
    if (!HoTen || !GioiTinh || !SDT || !CCCD || !Email || !MatKhau) {
      return {
        success: false,
        status: 400,
        message: "Thiếu trường bắt buộc",
      };
    }

    try {
      const pool = await poolPromise;

      // Check trùng Email / SDT / CCCD 
      const dup = await pool
        .request()
        .input("Email", sql.VarChar(50), Email)
        .input("SDT", sql.Char(10), SDT)
        .input("CCCD", sql.Char(12), CCCD)
        .query(
          `
          SELECT TOP 1 1
          FROM dbo.KhachHang
          WHERE Email = @Email OR SDT = @SDT OR CCCD = @CCCD
        `
        );

      if (dup.recordset.length > 0) {
        return {
          success: false,
          status: 400,
          message: "Email/SĐT/CCCD đã được sử dụng",
        };
      }

      // Hash mật khẩu
      const hashed = await bcrypt.hash(MatKhau, 10);

      // Insert (MaKhachHang sẽ được trigger tự động sinh)
      await pool
        .request()
        .input("HoTen", sql.NVarChar(50), HoTen)
        .input("GioiTinh", sql.NVarChar(3), GioiTinh)
        .input("SDT", sql.Char(10), SDT)
        .input("CCCD", sql.Char(12), CCCD)
        .input("Email", sql.VarChar(50), Email)
        .input("MatKhau", sql.VarChar(100), hashed)
        .input("NgaySinh", sql.Date, NgaySinh || null)
        .input("DiemLoyalty", sql.Int, 0)
        .query(
          `
          INSERT INTO dbo.KhachHang
            (HoTen, GioiTinh, SDT, CCCD, Email, MatKhau, NgaySinh, DiemLoyalty)
          VALUES
            (@HoTen, @GioiTinh, @SDT, @CCCD, @Email, @MatKhau, @NgaySinh, @DiemLoyalty)
        `
        );

      // Lấy thông tin khách hàng vừa tạo (bao gồm MaKhachHang được trigger sinh)
      const newCustomer = await pool
        .request()
        .input("Email", sql.VarChar(50), Email)
        .query(
          `
          SELECT TOP 1 
            MaKhachHang, HoTen, GioiTinh, SDT, CCCD, Email, NgaySinh, DiemLoyalty, CapHoiVien
          FROM dbo.KhachHang
          WHERE Email = @Email
          ORDER BY MaKhachHang DESC
        `
        );

      if (newCustomer.recordset.length === 0) {
        return {
          success: false,
          status: 500,
          message: "Không thể lấy thông tin khách hàng sau khi tạo",
        };
      }

      const customerData = newCustomer.recordset[0];

      return {
        success: true,
        status: 201,
        message: "Tạo tài khoản thành công",
        data: {
          MaKhachHang: customerData.MaKhachHang,
          HoTen: customerData.HoTen,
          GioiTinh: customerData.GioiTinh,
          SDT: customerData.SDT,
          CCCD: customerData.CCCD,
          Email: customerData.Email,
          NgaySinh: customerData.NgaySinh,
          DiemLoyalty: customerData.DiemLoyalty,
          CapHoiVien: customerData.CapHoiVien,
        },
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi tạo tài khoản khách hàng",
        error: error.message,
      };
    }
  }

  async login(email, password) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input("Email", sql.VarChar(50), email)
        .query("SELECT * FROM dbo.KhachHang WHERE Email = @Email");

      const user = result.recordset[0];

      if (!user) {
        return { success: false, status: 401, message: "Email không tồn tại" };
      }

      const isMatch = (password === user.MatKhau);
      if (!isMatch) {
        return { success: false, status: 401, message: "Mật khẩu không chính xác" };
      }

      const token = jwt.sign(
        { maKhachHang: user.MaKhachHang, role: 'KHACH_HANG' },
        process.env.JWT_SECRET || "your_secret_key",
        { expiresIn: "1d" }
      );

      return {
        success: true,
        status: 200,
        message: "Đăng nhập thành công",
        token,
        data: {
          HoTen: user.HoTen,
          Email: user.Email,
          Role: 'customer'
        }
      };
    } catch (error) {
      return { success: false, status: 500, message: "Lỗi hệ thống", error: error.message };
    }
  }

}

module.exports = new AuthService();

