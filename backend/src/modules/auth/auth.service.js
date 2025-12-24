// Auth Service - Business logic cho authentication
const bcrypt = require("bcryptjs");
const { poolPromise, sql } = require("../../config/database");
const jwt = require("jsonwebtoken")

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
      console.log("pass:", hashed);
      

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
    console.log(user);
    
    

    // 1. Kiểm tra user tồn tại
    if (!user) {
      return { success: false, status: 401, message: "Email không tồn tại" };
    }

    // 2. Kiểm tra mật khẩu
    // const isMatch = await bcrypt.compare(password, user.MatKhau);
        
    // if (!isMatch) {
    //     return { success: false, status: 401, message: "Mật khẩu không chính xác" };
    // }
    // 2. So sánh trực tiếp mật khẩu (Sửa đổi tại đây)
    const isMatch = (password === user.MatKhau);
        
    if (!isMatch) {
        return { success: false, status: 401, message: "Mật khẩu không chính xác" };
    }

    // 3. Tạo JWT Token (Thay 'SECRET_KEY' bằng key trong file .env của bạn)
    
    const token = jwt.sign(
      { maKhachHang: user.MaKhachHang, role: 'KHACH_HANG' },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" }
    );
    console.log(token);
    

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

  async getCurrentUser(maKhachHang, role) {
  try {
    const pool = await poolPromise;
    let query = "";
    if (role === 'staff') {
      query = "SELECT MaNhanVien, HoTen, 'staff' as Role FROM dbo.NhanVien WHERE MaNhanVien = @ID";
    } else {
      query = "SELECT MaKhachHang, HoTen, 'customer' as Role FROM dbo.KhachHang WHERE MaKhachHang = @ID";
    }

    const result = await pool.request()
      .input("ID", sql.VarChar(20), maKhachHang)
      .query(query);

    if (result.recordset.length === 0) {
      return { success: false, status: 404, message: "Không tìm thấy người dùng" };
    }

    return { success: true, status: 200, data: result.recordset[0] };
  } catch (error) {
    return { success: false, status: 500, message: "Lỗi lấy thông tin user", error: error.message };
  }
}


  // Trong file auth.service.js

async loginStaff(staffCode) {
  try {
    const pool = await poolPromise;
    // Tìm nhân viên dựa trên mã nhân viên (MaNhanVien)
    const result = await pool.request()
      .input("MaNV", sql.VarChar(20), staffCode)
      .query("SELECT * FROM dbo.NhanVien WHERE MaNhanVien = @MaNV");

    const staff = result.recordset[0];

    if (!staff) {
      return { success: false, status: 404, message: "Mã nhân viên không tồn tại" };
    }

    // Tạo token cho nhân viên
    const token = jwt.sign(
      { maKhachHang: staff.MaNhanVien, role: 'staff' },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "8h" }
    );

    return {
      success: true,
      status: 200,
      message: "Nhân viên đăng nhập thành công",
      token,
      data: {
        HoTen: staff.HoTen,
        MaNhanVien: staff.MaNhanVien,
        role: 'staff'
      }
    };
  } catch (error) {
    console.error("Staff login error:", error);
    return { success: false, status: 500, message: "Lỗi đăng nhập nhân viên" };
  }
}
}

module.exports = new AuthService();

