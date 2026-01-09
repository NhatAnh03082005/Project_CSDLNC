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
        .input("CustomerId", sql.Char(7), customerId)
        .query(
          `
          SELECT 
            kh.MaKhachHang, 
            kh.HoTen, 
            kh.GioiTinh, 
            kh.SDT, 
            kh.CCCD, 
            kh.Email, 
            kh.NgaySinh, 
            kh.DiemLoyalty, 
            kh.CapHoiVien,
            ISNULL(SUM(hd.TongTien), 0) AS TongChiTieu
          FROM dbo.KhachHang kh
          LEFT JOIN dbo.HoaDon hd ON kh.MaKhachHang = hd.MaKhachHang
          WHERE kh.MaKhachHang = @CustomerId
          GROUP BY 
            kh.MaKhachHang, 
            kh.HoTen, 
            kh.GioiTinh, 
            kh.SDT, 
            kh.CCCD, 
            kh.Email, 
            kh.NgaySinh, 
            kh.DiemLoyalty, 
            kh.CapHoiVien
        `
        );

      if (result.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy thông tin khách hàng",
        };
      }

      const customerData = result.recordset[0];
      const tongChiTieu = customerData.TongChiTieu || 0;

      let capHoiVien = "Cơ bản";
      let chiTieuGiuHang = 0;

      if (tongChiTieu >= 15000000) {
        capHoiVien = "VIP";
        chiTieuGiuHang = 15000000;
      } else if (tongChiTieu >= 5000000) {
        capHoiVien = "Thân thiết";
        chiTieuGiuHang = 5000000;
      } else {
        capHoiVien = "Cơ bản";
        chiTieuGiuHang = 0;
      }

      if (customerData.CapHoiVien !== capHoiVien) {
        await pool
          .request()
          .input("MaKhachHang", sql.Char(7), customerId)
          .input("CapHoiVien", sql.NVarChar(20), capHoiVien)
          .query(
            `
            UPDATE dbo.KhachHang
            SET CapHoiVien = @CapHoiVien
            WHERE MaKhachHang = @MaKhachHang
          `
          );
      }

      return {
        success: true,
        status: 200,
        data: {
          ...customerData,
          CapHoiVien: capHoiVien,
          TongChiTieu: tongChiTieu,
          ChiTieuGiuHang: chiTieuGiuHang,
        },
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

  // customers.service.js

  /**
   * Cập nhật thông tin hồ sơ khách hàng
   * @param {string} customerId
   * @param {object} payload
   */
  async updateProfile(customerId, payload) {
    const { HoTen, GioiTinh, SDT, Email, NgaySinh, CCCD } = payload;

    if (Email !== undefined) {
      return {
        success: false,
        status: 400,
        message:
          "Không được phép thay đổi email. Vui lòng liên hệ hỗ trợ nếu cần cập nhật email.",
      };
    }

    if (!HoTen && !GioiTinh && !SDT && !NgaySinh && !CCCD) {
      return {
        success: false,
        status: 400,
        message: "Không có dữ liệu để cập nhật",
      };
    }

    try {
      const pool = await poolPromise;

      if (CCCD !== undefined) {
        const dupCheck = await pool
          .request()
          .input("CCCD", sql.Char(12), CCCD)
          .input("MaKH", sql.Char(7), customerId)
          .query(
            "SELECT 1 FROM dbo.KhachHang WHERE CCCD = @CCCD AND MaKhachHang <> @MaKH"
          );

        if (dupCheck.recordset.length > 0) {
          return {
            success: false,
            status: 409,
            message: "Số CCCD đã tồn tại trong hệ thống",
          };
        }
      }

      const request = pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId);
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

      if (CCCD !== undefined) {
        setClauses.push("CCCD = @CCCD");
        request.input("CCCD", sql.Char(12), CCCD);
      }

      const updateQuery = `
        UPDATE dbo.KhachHang
        SET ${setClauses.join(", ")}
        WHERE MaKhachHang = @MaKhachHang;

        SELECT TOP 1 MaKhachHang, HoTen, GioiTinh, SDT, CCCD, Email, NgaySinh, DiemLoyalty, CapHoiVien
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

      // GỌI STORED PROCEDURE sp_TV4_GetInvoices
      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .execute("sp_TV4_GetInvoices");

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

      // GỌI STORED PROCEDURE sp_TV4_GetInvoiceDetails
      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .output("ErrorMessage", sql.NVarChar(500))
        .output("StatusCode", sql.Int)
        .execute("sp_TV4_GetInvoiceDetails");

      const { ErrorMessage, StatusCode } = result.output;

      if (StatusCode !== 200) {
        return {
          success: false,
          status: StatusCode,
          message: ErrorMessage,
        };
      }

      // Result sets: [0] = invoice header, [1] = invoice details
      const invoiceHeader = result.recordsets[0][0];
      const invoiceDetails = result.recordsets[1];

      // Format chi tiết như logic cũ
      const formattedDetails = invoiceDetails.map((item) => {
        const detail = {
          STT: item.STT,
          LoaiDichVu: item.LoaiDichVu,
          ThanhTien: item.ThanhTien,
          LoaiChiTiet: null,
          ChiTiet: {},
        };

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
          ...invoiceHeader,
          chiTiet: formattedDetails,
          MaKhuyenMai: invoiceHeader.MaKhuyenMai || null,
          TiLeGiamGia: invoiceHeader.TiLeGiamGia || 0,
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

  async createOrder(customerId, orderData) {
    const { items, paymentMethod, maChiNhanh } = orderData;

    // Validation cơ bản
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Danh sách sản phẩm không được để trống",
      };
    }

    if (!paymentMethod) {
      return {
        success: false,
        status: 400,
        message: "Phương thức thanh toán không được để trống",
      };
    }

    if (!maChiNhanh) {
      return {
        success: false,
        status: 400,
        message: "Mã chi nhánh không được để trống",
      };
    }

    // Convert paymentMethod từ frontend sang format database
    // Frontend: "TienMat" hoặc "ChuyenKhoan"
    // Database: "Tiền mặt" hoặc "Chuyển khoản"
    let hinhThucThanhToan;
    if (paymentMethod === "TienMat" || paymentMethod === "Tiền mặt") {
      hinhThucThanhToan = "Tiền mặt";
    } else if (
      paymentMethod === "ChuyenKhoan" ||
      paymentMethod === "Chuyển khoản"
    ) {
      hinhThucThanhToan = "Chuyển khoản";
    } else {
      return {
        success: false,
        status: 400,
        message: "Phương thức thanh toán không hợp lệ",
      };
    }

    try {
      const pool = await poolPromise;

      // Chuẩn bị JSON cho stored procedure
      const itemsJSON = JSON.stringify(items);

      // GỌI STORED PROCEDURE sp_TV3_CreateOrder
      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .input("MaChiNhanh", sql.Char(4), maChiNhanh)
        .input("HinhThucThanhToan", sql.NVarChar(20), hinhThucThanhToan)
        .input("ItemsJSON", sql.NVarChar(sql.MAX), itemsJSON)
        .output("MaHoaDon", sql.Char(8))
        .output("TongTien", sql.Int)
        .output("DiemLoyalty", sql.Int)
        .output("ErrorMessage", sql.NVarChar(500))
        .output("StatusCode", sql.Int)
        .execute("sp_TV3_CreateOrder");

      const { MaHoaDon, TongTien, DiemLoyalty, ErrorMessage, StatusCode } =
        result.output;

      if (StatusCode !== 201) {
        return {
          success: false,
          status: StatusCode,
          message: ErrorMessage,
        };
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const ngayLapStr = `${year}-${month}-${day}`;

      return {
        success: true,
        status: 201,
        message: ErrorMessage,
        data: {
          maHoaDon: MaHoaDon,
          ngayLap: ngayLapStr,
          tongTien: TongTien,
          diemLoyalty: DiemLoyalty,
          trangThai: "Chờ xác nhận",
        },
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi hệ thống khi tạo đơn hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách đơn hàng (hóa đơn) của khách hàng
   * @param {string} customerId
   */
  async getOrders(customerId) {
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
            CASE 
              WHEN hd.NhanVienLap IS NULL THEN N'Chờ xác nhận'
              ELSE N'Đã xác nhận'
            END AS TrangThai,
            hd.HinhThucThanhToan AS PhuongThucThanhToan,
            hd.TongTien,
            cn.TenChiNhanh,
            nv.HoTen AS TenNhanVienXacNhan
          FROM dbo.HoaDon hd
          LEFT JOIN dbo.ChiNhanh cn ON hd.MaChiNhanh = cn.MaChiNhanh
          LEFT JOIN dbo.NhanVien nv ON hd.NhanVienLap = nv.MaNhanVien
          WHERE hd.MaKhachHang = @MaKhachHang
            AND EXISTS (
              SELECT 1 FROM dbo.CTHD cthd 
              WHERE cthd.MaHoaDon = hd.MaHoaDon 
              AND cthd.LoaiDichVu = N'Mua hàng'
            )
          ORDER BY hd.NgayLap DESC
        `
        );

      const orders = result.recordset.map((order) => ({
        maHoaDon: order.MaHoaDon,
        ngayDat: order.NgayLap
          ? order.NgayLap.toISOString().split("T")[0]
          : null,
        trangThai: order.TrangThai,
        phuongThucThanhToan: order.PhuongThucThanhToan,
        tongTien: order.TongTien,
        tenChiNhanh: order.TenChiNhanh,
        tenNhanVienXacNhan: order.TenNhanVienXacNhan,
      }));

      return {
        success: true,
        status: 200,
        data: orders,
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách đơn hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy chi tiết đơn hàng (hóa đơn) của khách hàng
   * @param {string} customerId
   * @param {string} maHoaDon
   */
  async getOrderDetails(customerId, maHoaDon) {
    try {
      const pool = await poolPromise;

      // Kiểm tra hóa đơn thuộc về khách hàng và là đơn mua hàng
      const orderCheck = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT TOP 1 
            hd.MaHoaDon,
            hd.NgayLap,
            CASE 
              WHEN hd.NhanVienLap IS NULL THEN N'Chờ xác nhận'
              ELSE N'Đã xác nhận'
            END AS TrangThai,
            hd.HinhThucThanhToan AS PhuongThucThanhToan,
            hd.TongTien,
            cn.MaChiNhanh,
            cn.TenChiNhanh,
            nv.HoTen AS TenNhanVienXacNhan
          FROM dbo.HoaDon hd
          LEFT JOIN dbo.ChiNhanh cn ON hd.MaChiNhanh = cn.MaChiNhanh
          LEFT JOIN dbo.NhanVien nv ON hd.NhanVienLap = nv.MaNhanVien
          WHERE hd.MaHoaDon = @MaHoaDon 
            AND hd.MaKhachHang = @MaKhachHang
            AND EXISTS (
              SELECT 1 FROM dbo.CTHD cthd 
              WHERE cthd.MaHoaDon = hd.MaHoaDon 
              AND cthd.LoaiDichVu = N'Mua hàng'
            )
        `
        );

      if (orderCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy đơn hàng",
        };
      }

      const order = orderCheck.recordset[0];

      // Lấy chi tiết sản phẩm từ CTHD_MuaHang
      const detailsResult = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .query(
          `
          SELECT 
            mh.MaSanPham,
            sp.TenSanPham,
            sp.LoaiSanPham,
            mh.SoLuong,
            sp.DonGia,
            cthd.ThanhTien
          FROM dbo.CTHD_MuaHang mh
          JOIN dbo.CTHD cthd ON mh.MaHoaDon = cthd.MaHoaDon AND mh.STT = cthd.STT
          JOIN dbo.SanPham sp ON mh.MaSanPham = sp.MaSanPham
          WHERE mh.MaHoaDon = @MaHoaDon
        `
        );

      const chiTiet = detailsResult.recordset.map((item) => ({
        maSanPham: item.MaSanPham,
        tenSanPham: item.TenSanPham,
        loaiSanPham: item.LoaiSanPham,
        soLuong: item.SoLuong,
        donGia: item.DonGia,
        thanhTien: item.ThanhTien,
      }));

      return {
        success: true,
        status: 200,
        data: {
          maHoaDon: order.MaHoaDon,
          ngayDat: order.NgayLap
            ? order.NgayLap.toISOString().split("T")[0]
            : null,
          trangThai: order.TrangThai,
          phuongThucThanhToan: order.PhuongThucThanhToan,
          tongTien: order.TongTien,
          chiNhanh: {
            maChiNhanh: order.MaChiNhanh,
            tenChiNhanh: order.TenChiNhanh,
          },
          tenNhanVienXacNhan: order.TenNhanVienXacNhan,
          chiTiet: chiTiet,
        },
      };
    } catch (error) {
      console.error("Error fetching order details:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy chi tiết đơn hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách hóa đơn chờ xác nhận (cho nhân viên)
   * @param {string} maChiNhanh - Mã chi nhánh (optional, nếu null thì lấy tất cả)
   */
  async getPendingOrders(maChiNhanh = null) {
    try {
      const pool = await poolPromise;

      let query = `
        SELECT 
          hd.MaHoaDon,
          hd.MaKhachHang,
          kh.HoTen AS TenKhachHang,
          kh.SDT,
          hd.MaChiNhanh,
          cn.TenChiNhanh,
          hd.NgayLap,
          hd.HinhThucThanhToan AS PhuongThucThanhToan,
          hd.TongTien
        FROM dbo.HoaDon hd
        JOIN dbo.KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
        JOIN dbo.ChiNhanh cn ON hd.MaChiNhanh = cn.MaChiNhanh
        WHERE hd.NhanVienLap IS NULL
          AND EXISTS (
            SELECT 1 FROM dbo.CTHD cthd 
            WHERE cthd.MaHoaDon = hd.MaHoaDon 
            AND cthd.LoaiDichVu = N'Mua hàng'
          )
      `;

      const request = pool.request();
      if (maChiNhanh) {
        query += ` AND hd.MaChiNhanh = @MaChiNhanh`;
        request.input("MaChiNhanh", sql.Char(4), maChiNhanh);
      }

      query += ` ORDER BY hd.NgayLap ASC`;

      const result = await request.query(query);

      const orders = result.recordset.map((order) => ({
        maHoaDon: order.MaHoaDon,
        maKhachHang: order.MaKhachHang,
        tenKhachHang: order.TenKhachHang,
        sdt: order.SDT,
        maChiNhanh: order.MaChiNhanh,
        tenChiNhanh: order.TenChiNhanh,
        ngayDat: order.NgayLap
          ? order.NgayLap.toISOString().split("T")[0]
          : null,
        phuongThucThanhToan: order.PhuongThucThanhToan,
        tongTien: order.TongTien,
      }));

      return {
        success: true,
        status: 200,
        data: orders,
      };
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách đơn hàng chờ xác nhận",
        error: error.message,
      };
    }
  }
}

module.exports = new CustomersService();
