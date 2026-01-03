// Auth Service - Business logic cho authentication
const { poolPromise, sql } = require("../../config/database");
const jwt = require("jsonwebtoken");

class AuthService {
  /**
   * Đăng ký khách hàng mới
   * @param {object} userData
   */
  async register(userData) {
    const { HoTen, GioiTinh, SDT, CCCD, Email, MatKhau, NgaySinh } = userData;

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

      // Insert (MaKhachHang sẽ được trigger tự động sinh)
      // Lưu mật khẩu dạng plain text (không hash)
      await pool
        .request()
        .input("HoTen", sql.NVarChar(50), HoTen)
        .input("GioiTinh", sql.NVarChar(3), GioiTinh)
        .input("SDT", sql.Char(10), SDT)
        .input("CCCD", sql.Char(12), CCCD)
        .input("Email", sql.VarChar(50), Email)
        .input("MatKhau", sql.VarChar(100), MatKhau)
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
      const result = await pool
        .request()
        .input("Email", sql.VarChar(50), email)
        .query("SELECT * FROM dbo.KhachHang WHERE Email = @Email");

      const user = result.recordset[0];

      if (!user) {
        return { success: false, status: 401, message: "Email không tồn tại" };
      }

      const isMatch = password === user.MatKhau;
      if (!isMatch) {
        return {
          success: false,
          status: 401,
          message: "Mật khẩu không chính xác",
        };
      }

      const token = jwt.sign(
        { maKhachHang: user.MaKhachHang, role: "KHACH_HANG" },
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
          Role: "customer",
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Lỗi hệ thống",
        error: error.message,
      };
    }
  }

  async loginStaff(staffCode) {
    try {
      const pool = await poolPromise;
      // Truy vấn thông tin nhân viên từ bảng NhanVien dựa vào MaNhanVien
      const result = await pool
        .request()
        .input("MaNhanVien", sql.VarChar(20), staffCode)
        .query(
          "SELECT MaNhanVien, HoTen, ViTri, MaChiNhanh FROM dbo.NhanVien WHERE MaNhanVien = @MaNhanVien"
        );

      const staff = result.recordset[0];

      if (!staff) {
        return {
          success: false,
          status: 401,
          message: "Mã nhân viên không tồn tại",
        };
      }

      // Phân loại Role dựa trên ViTri
      let role = "staff";
      if (staff.ViTri === "Quản lý chi nhánh") {
        role = "admin";
      }

      // Tạo JWT token cho nhân viên
      const token = jwt.sign(
        { maNhanVien: staff.MaNhanVien, role: role, viTri: staff.ViTri },
        process.env.JWT_SECRET || "your_secret_key",
        { expiresIn: "1d" }
      );

      return {
        success: true,
        status: 200,
        message: "Đăng nhập nhân viên thành công",
        token,
        data: {
          HoTen: staff.HoTen,
          MaNhanVien: staff.MaNhanVien,
          ViTri: staff.ViTri,
          Role: role, // Trả về role để frontend điều hướng
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: "Lỗi hệ thống",
        error: error.message,
      };
    }
  }

  /**
   * Lấy thông tin user hiện tại dựa trên token (cho tất cả roles)
   * @param {object} decodedToken - Token đã được decode từ middleware
   */
  async getCurrentUser(decodedToken) {
    try {
      const pool = await poolPromise;
      const { role, maKhachHang, maNhanVien } = decodedToken;

      // Nếu là khách hàng (role trong token là "KHACH_HANG")
      if (role === "KHACH_HANG" && maKhachHang) {
        const result = await pool
          .request()
          .input("MaKhachHang", sql.Char(7), maKhachHang)
          .query(
            `
            SELECT TOP 1 
              MaKhachHang, HoTen, Email, GioiTinh, SDT, CCCD, NgaySinh, DiemLoyalty, CapHoiVien
            FROM dbo.KhachHang
            WHERE MaKhachHang = @MaKhachHang
          `
          );

        if (result.recordset.length === 0) {
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy thông tin khách hàng",
          };
        }

        const customer = result.recordset[0];
        return {
          success: true,
          status: 200,
          data: {
            ...customer,
            Role: "customer",
          },
        };
      }

      // Nếu là nhân viên/admin (role trong token là "admin" hoặc "staff")
      // Hoặc role là "NHAN_VIEN" hoặc "QUAN_TRI" (nếu có token cũ)
      if (maNhanVien && (role === "admin" || role === "staff" || role === "NHAN_VIEN" || role === "QUAN_TRI")) {
        const result = await pool
          .request()
          .input("MaNhanVien", sql.Char(5), maNhanVien)
          .query(
            `
            SELECT TOP 1 
              MaNhanVien, HoTen, ViTri, MaChiNhanh
            FROM dbo.NhanVien
            WHERE MaNhanVien = @MaNhanVien
          `
          );

        if (result.recordset.length === 0) {
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy thông tin nhân viên",
          };
        }

        const staff = result.recordset[0];
        // Xác định role dựa trên ViTri
        let userRole = "staff";
        if (staff.ViTri === "Quản lý chi nhánh") {
          userRole = "admin";
        }

        return {
          success: true,
          status: 200,
          data: {
            MaNhanVien: staff.MaNhanVien,
            HoTen: staff.HoTen,
            ViTri: staff.ViTri,
            MaChiNhanh: staff.MaChiNhanh,
            Role: userRole,
          },
        };
      }

      return {
        success: false,
        status: 400,
        message: "Thông tin token không hợp lệ",
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy thông tin người dùng",
        error: error.message,
      };
    }
  }
}

module.exports = new AuthService();
