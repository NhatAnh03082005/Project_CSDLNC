const { sql, poolPromise } = require("../../config/database");

class CustomersService {
  /**
   * Lấy thông tin hồ sơ khách hàng
   * @param {string} customerId
   */
  async getProfile(customerId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        // MaKhachHang là CHAR(7) nên dùng sql.Char(7)
        .input("CustomerId", sql.Char(7), customerId)
        .query(
          `
          SELECT TOP 1 *
          FROM dbo.KhachHang
          WHERE MaKhachHang = @CustomerId
        `
        );

      if (result.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy thông tin khách hàng",
        };
      }

      return {
        success: true,
        status: 200,
        data: result.recordset[0],
      };
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy thông tin khách hàng",
        error: error.message,
      };
    }
  }

  /**
   * Cập nhật thông tin hồ sơ khách hàng
   * @param {string} customerId
   * @param {object} payload
   */
  async updateProfile(customerId, payload) {
    const { HoTen, GioiTinh, SDT, Email, NgaySinh } = payload;

    // Không cho phép thay đổi Email vì đây là tài khoản đăng nhập
    if (Email !== undefined) {
      return {
        success: false,
        status: 400,
        message:
          "Không được phép thay đổi email. Vui lòng liên hệ hỗ trợ nếu cần cập nhật email.",
      };
    }

    if (!HoTen && !GioiTinh && !SDT && !NgaySinh) {
      return {
        success: false,
        status: 400,
        message: "Không có dữ liệu để cập nhật",
      };
    }

    try {
      const pool = await poolPromise;
      const request = pool.request().input(
        "MaKhachHang",
        sql.Char(7),
        customerId
      );

      // Xây dựng phần SET động, chỉ cập nhật field được gửi lên
      const setClauses = [];

      if (HoTen !== undefined) {
        setClauses.push("HoTen = @HoTen");
        request.input("HoTen", sql.NVarChar(50), HoTen);
      }

      if (GioiTinh !== undefined) {
        setClauses.push("GioiTinh = @GioiTinh");
        request.input("GioiTinh", sql.NVarChar(3), GioiTinh);
      }

      if (SDT !== undefined) {
        setClauses.push("SDT = @SDT");
        request.input("SDT", sql.Char(10), SDT);
      }

      if (NgaySinh !== undefined) {
        setClauses.push("NgaySinh = @NgaySinh");
        request.input("NgaySinh", sql.Date, NgaySinh || null);
      }

      const updateQuery = `
        UPDATE dbo.KhachHang
        SET ${setClauses.join(", ")}
        WHERE MaKhachHang = @MaKhachHang;

        SELECT TOP 1 *
        FROM dbo.KhachHang
        WHERE MaKhachHang = @MaKhachHang;
      `;

      const result = await request.query(updateQuery);

      if (result.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy khách hàng để cập nhật",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Cập nhật thông tin khách hàng thành công",
        data: result.recordset[0],
      };
    } catch (error) {
      console.error("Error updating customer profile:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi cập nhật thông tin khách hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách lịch hẹn của khách hàng
   * @param {string} customerId
   */
  async getAppointments(customerId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT
            lh.MaLichHen,
            lh.MaKhachHang,
            lh.MaChiNhanh,
            lh.LoaiDichVu,
            lh.ThoiGianHen,
            lh.NgayLap,
            lh.TrangThai,
            nvLap.HoTen AS TenNhanVienLap,
            nvBs.HoTen AS TenBacSiPhuTrach
          FROM dbo.LichHen lh
          INNER JOIN dbo.NhanVien nvLap
            ON lh.NhanVienLap = nvLap.MaNhanVien
          LEFT JOIN dbo.NhanVien nvBs
            ON lh.BacSiPhuTrach = nvBs.MaNhanVien
          WHERE lh.MaKhachHang = @MaKhachHang
          ORDER BY lh.ThoiGianHen DESC, lh.NgayLap DESC
        `
        );

      return {
        success: true,
        status: 200,
        count: result.recordset.length,
        data: result.recordset,
      };
    } catch (error) {
      console.error("Error fetching customer appointments:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy lịch hẹn của khách hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách hóa đơn của khách hàng
   * @param {string} customerId
   */
  async getInvoices(customerId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT
            hd.MaHoaDon,
            hd.NgayLap,
            hd.TongTien,
            hd.HinhThucThanhToan,
            hd.MaKhuyenMai,
            hd.MaChiNhanh,
            nv.HoTen AS TenNhanVienLap,
            cn.TenChiNhanh
          FROM dbo.HoaDon hd
          LEFT JOIN dbo.NhanVien nv
            ON hd.NhanVienLap = nv.MaNhanVien
          LEFT JOIN dbo.ChiNhanh cn
            ON hd.MaChiNhanh = cn.MaChiNhanh
          WHERE hd.MaKhachHang = @MaKhachHang
          ORDER BY hd.NgayLap DESC, hd.MaHoaDon DESC
        `
        );

      return {
        success: true,
        status: 200,
        count: result.recordset.length,
        data: result.recordset,
      };
    } catch (error) {
      console.error("Error fetching customer invoices:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách hóa đơn",
        error: error.message,
      };
    }
  }

  /**
   * Lấy chi tiết hóa đơn của khách hàng
   * @param {string} customerId
   * @param {string} maHoaDon
   */
  async getInvoiceDetails(customerId, maHoaDon) {
    try {
      const pool = await poolPromise;

      // Kiểm tra hóa đơn có thuộc về khách hàng này không
      const checkInvoice = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT TOP 1 MaHoaDon
          FROM dbo.HoaDon
          WHERE MaHoaDon = @MaHoaDon AND MaKhachHang = @MaKhachHang
        `
        );

      if (checkInvoice.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message:
            "Không tìm thấy hóa đơn hoặc bạn không có quyền xem hóa đơn này",
        };
      }

      // Lấy thông tin hóa đơn chính
      const invoiceInfo = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .query(
          `
          SELECT
            hd.MaHoaDon,
            hd.NgayLap,
            hd.TongTien,
            hd.HinhThucThanhToan,
            hd.MaKhuyenMai,
            hd.MaChiNhanh,
            nv.HoTen AS TenNhanVienLap,
            cn.TenChiNhanh,
            km.TiLeGiamGia
          FROM dbo.HoaDon hd
          LEFT JOIN dbo.NhanVien nv
            ON hd.NhanVienLap = nv.MaNhanVien
          LEFT JOIN dbo.ChiNhanh cn
            ON hd.MaChiNhanh = cn.MaChiNhanh
          LEFT JOIN dbo.KhuyenMai km
            ON hd.MaKhuyenMai = km.MaKhuyenMai
          WHERE hd.MaHoaDon = @MaHoaDon
        `
        );

      // Lấy tất cả chi tiết hóa đơn (CTHD) với thông tin đầy đủ
      const invoiceDetails = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .query(
          `
          SELECT
            cthd.MaHoaDon,
            cthd.STT,
            cthd.LoaiDichVu,
            cthd.ThanhTien,
            -- Thông tin mua hàng (nếu có)
            mh.MaSanPham,
            mh.SoLuong AS SoLuongMuaHang,
            sp.TenSanPham,
            sp.DonGia AS DonGiaSanPham,
            -- Thông tin dịch vụ sức khỏe (nếu có)
            dvsk.MaThuCung,
            dvsk.BacSi AS MaBacSi,
            nvBs.HoTen AS TenBacSi,
            -- Thông tin khám bệnh (nếu có)
            kb.TrieuChung,
            kb.ChanDoan,
            kb.ToaThuoc,
            kb.NgayTaiKham,
            -- Thông tin tiêm phòng (nếu có)
            tp.MaVacXin,
            tp.MaGoiDK,
            vx.TenVacXin
          FROM dbo.CTHD cthd
          LEFT JOIN dbo.CTHD_MuaHang mh
            ON cthd.MaHoaDon = mh.MaHoaDon AND cthd.STT = mh.STT
          LEFT JOIN dbo.SanPham sp
            ON mh.MaSanPham = sp.MaSanPham
          LEFT JOIN dbo.CTHD_DVSucKhoe dvsk
            ON cthd.MaHoaDon = dvsk.MaHoaDon AND cthd.STT = dvsk.STT
          LEFT JOIN dbo.NhanVien nvBs
            ON dvsk.BacSi = nvBs.MaNhanVien
          LEFT JOIN dbo.CTHD_KhamBenh kb
            ON dvsk.MaHoaDon = kb.MaHoaDon AND dvsk.STT = kb.STT
          LEFT JOIN dbo.CTHD_TiemPhong tp
            ON dvsk.MaHoaDon = tp.MaHoaDon AND dvsk.STT = tp.STT
          LEFT JOIN dbo.VacXin vx
            ON tp.MaVacXin = vx.MaVacXin
          WHERE cthd.MaHoaDon = @MaHoaDon
          ORDER BY cthd.STT
        `
        );

      // Format lại dữ liệu để dễ hiểu hơn
      const formattedDetails = invoiceDetails.recordset.map((item) => {
        const detail = {
          STT: item.STT,
          LoaiDichVu: item.LoaiDichVu,
          ThanhTien: item.ThanhTien,
          LoaiChiTiet: null, // MuaHang, KhamBenh, hoặc TiemPhong (3 dịch vụ chính của hệ thống)
          ChiTiet: {},
        };

        // Xác định loại chi tiết
        if (item.MaSanPham) {
          detail.LoaiChiTiet = "MuaHang";
          detail.ChiTiet = {
            MaSanPham: item.MaSanPham,
            TenSanPham: item.TenSanPham,
            SoLuong: item.SoLuongMuaHang,
            DonGia: item.DonGiaSanPham,
          };
        } else if (item.MaThuCung) {
          if (item.TrieuChung || item.ChanDoan) {
            detail.LoaiChiTiet = "KhamBenh";
            detail.ChiTiet = {
              MaThuCung: item.MaThuCung,
              MaBacSi: item.MaBacSi,
              TenBacSi: item.TenBacSi,
              TrieuChung: item.TrieuChung,
              ChuanDoan: item.ChanDoan,
              ToaThuoc: item.ToaThuoc,
              NgayTaiKham: item.NgayTaiKham,
            };
          } else if (item.MaVacXin) {
            detail.LoaiChiTiet = "TiemPhong";
            detail.ChiTiet = {
              MaThuCung: item.MaThuCung,
              MaBacSi: item.MaBacSi,
              TenBacSi: item.TenBacSi,
              MaVacXin: item.MaVacXin,
              TenVacXin: item.TenVacXin,
              MaGoiDK: item.MaGoiDK,
            };
          }
        }
        return detail;
      });

      return {
        success: true,
        status: 200,
        data: {
          ...invoiceInfo.recordset[0],
          chiTiet: formattedDetails,
        },
      };
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy chi tiết hóa đơn",
        error: error.message,
      };
    }
  }
}

module.exports = new CustomersService();

