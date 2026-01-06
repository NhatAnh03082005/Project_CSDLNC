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
        message: "Không được phép thay đổi email. Vui lòng liên hệ hỗ trợ nếu cần cập nhật email.",
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
        const dupCheck = await pool.request()
          .input("CCCD", sql.Char(12), CCCD)
          .input("MaKH", sql.Char(7), customerId)
          .query("SELECT 1 FROM dbo.KhachHang WHERE CCCD = @CCCD AND MaKhachHang <> @MaKH");

        if (dupCheck.recordset.length > 0) {
          return { success: false, status: 409, message: "Số CCCD đã tồn tại trong hệ thống" };
        }
      }

      const request = pool.request().input("MaKhachHang", sql.Char(7), customerId);
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

      const formattedDetails = invoiceDetails.recordset.map((item) => {
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
          ...invoiceInfo.recordset[0],
          chiTiet: formattedDetails,
          // Đảm bảo trả về thông tin khuyến mãi
          MaKhuyenMai: invoiceInfo.recordset[0].MaKhuyenMai || null,
          TiLeGiamGia: invoiceInfo.recordset[0].TiLeGiamGia || 0,
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
    } else if (paymentMethod === "ChuyenKhoan" || paymentMethod === "Chuyển khoản") {
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

      const customerCheck = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT TOP 1 MaKhachHang, HoTen, CapHoiVien
          FROM dbo.KhachHang
          WHERE MaKhachHang = @MaKhachHang
        `
        );

      if (customerCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy khách hàng",
        };
      }

      const branchCheck = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanh)
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
          message: "Không tìm thấy chi nhánh",
        };
      }

      for (const item of items) {
        if (!item.maSanPham || !item.soLuong || item.soLuong <= 0) {
          return {
            success: false,
            status: 400,
            message: `Sản phẩm ${item.maSanPham || "N/A"} có thông tin không hợp lệ`,
          };
        }

        const productCheck = await pool
          .request()
          .input("MaSanPham", sql.Char(5), item.maSanPham)
          .input("MaChiNhanh", sql.Char(4), maChiNhanh)
          .query(
            `
            SELECT TOP 1 
              sp.MaSanPham, 
              sp.TenSanPham, 
              sp.DonGia,
              tk.SoLuongTon AS TonKho
            FROM dbo.SanPham sp
            LEFT JOIN dbo.SanPham_TonKho tk 
              ON sp.MaSanPham = tk.MaSanPham AND tk.MaChiNhanh = @MaChiNhanh
            WHERE sp.MaSanPham = @MaSanPham
          `
          );

        if (productCheck.recordset.length === 0) {
          return {
            success: false,
            status: 404,
            message: `Không tìm thấy sản phẩm ${item.maSanPham}`,
          };
        }

        const product = productCheck.recordset[0];
        const tonKho = product.TonKho || 0;

        if (tonKho < item.soLuong) {
          return {
            success: false,
            status: 400,
            message: `Sản phẩm ${product.TenSanPham} không đủ tồn kho. Tồn kho: ${tonKho}, Yêu cầu: ${item.soLuong}`,
          };
        }
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const ngayLapStr = `${year}-${month}-${day}`;

      const customer = customerCheck.recordset[0];
      const capHoiVien = customer.CapHoiVien || "Cơ bản";
      const { TIER_DISCOUNTS, POINTS_PER_VND } = require("../../config/constants");
      // Map từ database (Cơ bản, Thân thiết, VIP) sang constants (CoBan, ThanThiet, VIP)
      const tierMap = {
        "Cơ bản": "CoBan",
        "Thân thiết": "ThanThiet",
        "VIP": "VIP"
      };
      const tierKey = tierMap[capHoiVien] || "CoBan";
      const discountPercent = TIER_DISCOUNTS[tierKey] || 0;

      let tongTien = 0;

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        const request = new sql.Request(transaction);

        const itemsData = [];
        for (const item of items) {
          // Tạo request mới cho mỗi query để tránh trùng lặp parameter
          const productRequest = new sql.Request(transaction);
          const productResult = await productRequest
            .input("MaSanPham", sql.Char(5), item.maSanPham)
            .input("MaChiNhanh", sql.Char(4), maChiNhanh)
            .query(
              `
              SELECT TOP 1 
                sp.MaSanPham, 
                sp.TenSanPham, 
                sp.DonGia,
                tk.SoLuongTon AS TonKho
              FROM dbo.SanPham sp
              LEFT JOIN dbo.SanPham_TonKho tk 
                ON sp.MaSanPham = tk.MaSanPham AND tk.MaChiNhanh = @MaChiNhanh
              WHERE sp.MaSanPham = @MaSanPham
            `
            );

          if (!productResult.recordset || productResult.recordset.length === 0) {
            await transaction.rollback();
            return {
              success: false,
              status: 404,
              message: `Không tìm thấy sản phẩm với mã: ${item.maSanPham}`,
            };
          }

          const product = productResult.recordset[0];
          
          if (!product.DonGia) {
            await transaction.rollback();
            return {
              success: false,
              status: 400,
              message: `Sản phẩm ${product.TenSanPham || item.maSanPham} không có giá`,
            };
          }

          // Kiểm tra tồn kho (chỉ cảnh báo, không chặn vì sẽ trừ khi nhân viên xác nhận)
          const tonKho = product.TonKho || 0;
          if (tonKho < item.soLuong) {
            await transaction.rollback();
            return {
              success: false,
              status: 400,
              message: `Sản phẩm ${product.TenSanPham || item.maSanPham} chỉ còn ${tonKho} sản phẩm trong kho`,
            };
          }

          const donGia = product.DonGia;
          const thanhTien = donGia * item.soLuong;
          const thanhTienSauGiam = thanhTien * (1 - discountPercent / 100);
          tongTien += thanhTienSauGiam;

          itemsData.push({
            ...item,
            thanhTienSauGiam,
          });
        }

        // Không cộng phí vận chuyển vì trigger trong database đã tự động tính tổng tiền
        const tongTienFinal = tongTien;
        // Tính điểm loyalty (sẽ cộng vào KhachHang khi nhân viên xác nhận)
        const diemLoyalty = Math.floor(tongTienFinal / POINTS_PER_VND);

        // Tạo hóa đơn với NhanVienLap = NULL (chờ xác nhận)
        // Trigger trong database sẽ tự động sinh MaHoaDon
        // Lưu ý: DiemLoyalty không có trong bảng HoaDon, chỉ lưu trong KhachHang
        // Thứ tự cột theo schema: MaHoaDon, MaKhachHang, NgayLap, TongTien, HinhThucThanhToan, MaKhuyenMai, NhanVienLap, MaChiNhanh
        // INSERT và sau đó query lại để lấy MaHoaDon vừa được trigger tạo
        const insertHoaDonRequest = new sql.Request(transaction);
        let insertResult;
        try {
          // INSERT với MaHoaDon = NULL (trigger sẽ tự sinh)
          // Nếu trigger yêu cầu MaHoaDon phải có giá trị, sẽ báo lỗi
          insertResult = await insertHoaDonRequest
            .input("MaKhachHang", sql.Char(7), customerId)
            .input("NgayLap", sql.Date, ngayLapStr)
            .input("TongTien", sql.Int, Math.round(tongTienFinal)) // Schema là INT, không phải MONEY
            .input("HinhThucThanhToan", sql.NVarChar(20), hinhThucThanhToan) // Đã convert sang tiếng Việt
            .input("MaChiNhanh", sql.Char(4), maChiNhanh)
            .query(
              `
              INSERT INTO dbo.HoaDon (
                MaHoaDon, MaKhachHang, NgayLap, TongTien, HinhThucThanhToan, NhanVienLap, MaChiNhanh
              )
              VALUES (
                NULL, @MaKhachHang, @NgayLap, @TongTien, @HinhThucThanhToan, NULL, @MaChiNhanh
              )
            `
            );
        } catch (insertError) {
          await transaction.rollback();
          console.error("Error inserting HoaDon:", insertError);
          console.error("Error details:", {
            message: insertError.message,
            code: insertError.code,
            number: insertError.number,
            originalError: insertError.originalError
          });
          throw insertError;
        }

        // Query lại để lấy MaHoaDon vừa được trigger tạo
        // Dùng điều kiện chính xác với tất cả giá trị INSERT để tìm record vừa tạo
        let maHoaDon;
        const getMaHoaDonRequest = new sql.Request(transaction);
        const maHoaDonResult = await getMaHoaDonRequest
          .input("MaKhachHang", sql.Char(7), customerId)
          .input("NgayLap", sql.Date, ngayLapStr)
          .input("TongTien", sql.Int, Math.round(tongTienFinal))
          .input("MaChiNhanh", sql.Char(4), maChiNhanh)
          .input("HinhThucThanhToan", sql.NVarChar(20), hinhThucThanhToan)
          .query(
            `
            SELECT TOP 1 MaHoaDon, NgayLap, TongTien, MaChiNhanh, NhanVienLap, HinhThucThanhToan
            FROM dbo.HoaDon
            WHERE MaKhachHang = @MaKhachHang
              AND NgayLap = @NgayLap
              AND TongTien = @TongTien
              AND MaChiNhanh = @MaChiNhanh
              AND HinhThucThanhToan = @HinhThucThanhToan
              AND NhanVienLap IS NULL
            ORDER BY MaHoaDon DESC
          `
          );

        // Lấy MaHoaDon vừa được trigger tạo
        if (maHoaDonResult.recordset && maHoaDonResult.recordset.length > 0) {
          maHoaDon = maHoaDonResult.recordset[0].MaHoaDon;
        } else {
          // Nếu không tìm thấy với điều kiện chính xác, thử query không có NhanVienLap IS NULL
          const fallbackQuery = new sql.Request(transaction);
          const fallbackResult = await fallbackQuery
            .input("MaKhachHang", sql.Char(7), customerId)
            .input("NgayLap", sql.Date, ngayLapStr)
            .input("TongTien", sql.Int, Math.round(tongTienFinal))
            .input("MaChiNhanh", sql.Char(4), maChiNhanh)
            .input("HinhThucThanhToan", sql.NVarChar(20), hinhThucThanhToan)
            .query(
              `
              SELECT TOP 1 MaHoaDon, NgayLap, TongTien, MaChiNhanh, NhanVienLap, HinhThucThanhToan
              FROM dbo.HoaDon
              WHERE MaKhachHang = @MaKhachHang
                AND NgayLap = @NgayLap
                AND TongTien = @TongTien
                AND MaChiNhanh = @MaChiNhanh
                AND HinhThucThanhToan = @HinhThucThanhToan
              ORDER BY MaHoaDon DESC
            `
            );
          
          if (fallbackResult.recordset && fallbackResult.recordset.length > 0) {
            maHoaDon = fallbackResult.recordset[0].MaHoaDon;
          } else {
            await transaction.rollback();
            return {
              success: false,
              status: 500,
              message: "Không thể lấy mã hóa đơn sau khi tạo. Có thể trigger không chạy hoặc có lỗi. Vui lòng kiểm tra trigger trong database.",
            };
          }
        }

        // Tạo chi tiết hóa đơn (CTHD và CTHD_MuaHang)
        // Trigger trong database sẽ tự động sinh STT cho mỗi CTHD
        // INSERT và sau đó query lại để lấy STT vừa được trigger tạo
        for (const itemData of itemsData) {
          // Tạo request mới cho mỗi query để tránh trùng lặp parameter
          const cthdRequest = new sql.Request(transaction);
          const cthdResult = await cthdRequest
            .input("MaHoaDon", sql.Char(8), maHoaDon)
            .input("LoaiDichVu", sql.NVarChar(20), "Mua hàng")
            .input("ThanhTien", sql.Int, Math.round(itemData.thanhTienSauGiam)) // Schema là INT
            .query(
              `
              INSERT INTO dbo.CTHD (MaHoaDon, LoaiDichVu, ThanhTien)
              VALUES (@MaHoaDon, @LoaiDichVu, @ThanhTien)
            `
            );

          // Query lại để lấy STT vừa được trigger tạo
          // Đơn giản hóa query: chỉ dùng MaHoaDon và LoaiDichVu, ORDER BY để lấy mới nhất
          const getSTTRequest = new sql.Request(transaction);
          const sttResult = await getSTTRequest
            .input("MaHoaDon", sql.Char(8), maHoaDon)
            .input("LoaiDichVu", sql.NVarChar(20), "Mua hàng")
            .query(
              `
              SELECT TOP 1 STT
              FROM dbo.CTHD
              WHERE MaHoaDon = @MaHoaDon
                AND LoaiDichVu = @LoaiDichVu
              ORDER BY STT DESC
            `
            );

          // Lấy STT vừa được trigger tạo
          if (!sttResult.recordset || sttResult.recordset.length === 0) {
            await transaction.rollback();
            console.error("Cannot find STT after INSERT CTHD. MaHoaDon:", maHoaDon);
            return {
              success: false,
              status: 500,
              message: "Không thể lấy STT sau khi tạo CTHD",
            };
          }
          const stt = sttResult.recordset[0].STT;

          const muaHangRequest = new sql.Request(transaction);
          const muaHangResult = await muaHangRequest
            .input("MaHoaDon", sql.Char(8), maHoaDon)
            .input("STT", sql.Int, stt)
            .input("MaSanPham", sql.Char(5), itemData.maSanPham)
            .input("SoLuong", sql.Int, itemData.soLuong)
            .query(
              `
              INSERT INTO dbo.CTHD_MuaHang (MaHoaDon, STT, MaSanPham, SoLuong)
              VALUES (@MaHoaDon, @STT, @MaSanPham, @SoLuong)
            `
            );
        }

        // KHÔNG cập nhật tồn kho và KHÔNG cộng điểm ở đây
        // Sẽ làm khi nhân viên xác nhận

        await transaction.commit();

        return {
          success: true,
          status: 201,
          message: "Đặt hàng thành công. Đơn hàng đang chờ nhân viên xác nhận.",
          data: {
            maHoaDon,
            ngayLap: ngayLapStr,
            tongTien: tongTienFinal,
            diemLoyalty, // Điểm sẽ được cộng khi nhân viên xác nhận
            trangThai: "Chờ xác nhận",
          },
        };
      } catch (error) {
        await transaction.rollback();
        console.error("Transaction error details:", {
          message: error.message,
          code: error.code,
          number: error.number,
          originalError: error.originalError,
          stack: error.stack
        });
        // Re-throw để outer catch xử lý
        throw error;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        number: error.number,
        originalError: error.originalError,
        stack: error.stack
      });
      // Xử lý các lỗi SQL Server phổ biến
      let errorMessage = "Lỗi hệ thống khi tạo đơn hàng";
      
      if (error.originalError) {
        const sqlError = error.originalError;
        
        // Foreign key constraint violation
        if (sqlError.number === 547) {
          if (sqlError.message.includes("FK_HD_CN")) {
            errorMessage = "Mã chi nhánh không tồn tại trong hệ thống";
          } else if (sqlError.message.includes("FK_HD_NV")) {
            errorMessage = "Mã nhân viên không tồn tại trong hệ thống";
          } else if (sqlError.message.includes("FK_HD_KM")) {
            errorMessage = "Mã khuyến mãi không tồn tại trong hệ thống";
          } else if (sqlError.message.includes("FK_MH_SP")) {
            errorMessage = "Mã sản phẩm không tồn tại trong hệ thống";
          } else {
            errorMessage = "Dữ liệu không hợp lệ: " + sqlError.message;
          }
        }
        // Check constraint violation
        else if (sqlError.number === 515) {
          errorMessage = "Thiếu thông tin bắt buộc: " + sqlError.message;
        }
        // Duplicate key
        else if (sqlError.number === 2627) {
          errorMessage = "Mã hóa đơn đã tồn tại. Vui lòng thử lại.";
        }
        else {
          errorMessage = sqlError.message || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        status: 500,
        message: errorMessage,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          number: error.number,
          originalError: error.originalError?.message
        } : undefined
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
        ngayDat: order.NgayLap ? order.NgayLap.toISOString().split("T")[0] : null,
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
          ngayDat: order.NgayLap ? order.NgayLap.toISOString().split("T")[0] : null,
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
        ngayDat: order.NgayLap ? order.NgayLap.toISOString().split("T")[0] : null,
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

  /**
   * Xác nhận hóa đơn (cập nhật NhanVienLap, cập nhật tồn kho, cộng điểm)
   * @param {string} maHoaDon
   * @param {string} nhanVienId - Mã nhân viên xác nhận
   */
  async confirmOrder(maHoaDon, nhanVienId) {
    try {
      const pool = await poolPromise;

      // Kiểm tra hóa đơn chờ xác nhận
      const hoaDonCheck = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .query(
          `
          SELECT TOP 1 
            hd.*,
            kh.CapHoiVien
          FROM dbo.HoaDon hd
          JOIN dbo.KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
          WHERE hd.MaHoaDon = @MaHoaDon
            AND hd.NhanVienLap IS NULL
            AND EXISTS (
              SELECT 1 FROM dbo.CTHD cthd 
              WHERE cthd.MaHoaDon = hd.MaHoaDon 
              AND cthd.LoaiDichVu = N'Mua hàng'
            )
        `
        );

      if (hoaDonCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy hóa đơn chờ xác nhận",
        };
      }

      const hoaDon = hoaDonCheck.recordset[0];

      // Kiểm tra tồn kho
      const chiTietResult = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .input("MaChiNhanh", sql.Char(4), hoaDon.MaChiNhanh)
        .query(
          `
          SELECT 
            mh.MaSanPham,
            mh.SoLuong,
            ISNULL(tk.SoLuongTon, 0) AS TonKho
          FROM dbo.CTHD_MuaHang mh
          LEFT JOIN dbo.SanPham_TonKho tk 
            ON mh.MaSanPham = tk.MaSanPham 
            AND tk.MaChiNhanh = @MaChiNhanh
          WHERE mh.MaHoaDon = @MaHoaDon
        `
        );

      for (const item of chiTietResult.recordset) {
        if (item.TonKho < item.SoLuong) {
          return {
            success: false,
            status: 400,
            message: `Sản phẩm ${item.MaSanPham} không đủ tồn kho. Tồn kho: ${item.TonKho}, Yêu cầu: ${item.SoLuong}`,
          };
        }
      }

      const { POINTS_PER_VND } = require("../../config/constants");
      const diemLoyalty = hoaDon.DiemLoyalty || Math.floor(hoaDon.TongTien / POINTS_PER_VND);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        const request = new sql.Request(transaction);

        // Cập nhật NhanVienLap trong hóa đơn
        await request
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("NhanVienLap", sql.Char(5), nhanVienId)
          .query(
            `
            UPDATE dbo.HoaDon
            SET NhanVienLap = @NhanVienLap
            WHERE MaHoaDon = @MaHoaDon
          `
          );

        // Cập nhật tồn kho
        const chiTietMuaHang = await request
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .query(
            `
            SELECT MaSanPham, SoLuong
            FROM dbo.CTHD_MuaHang
            WHERE MaHoaDon = @MaHoaDon
          `
          );

        for (const item of chiTietMuaHang.recordset) {
          await request
            .input("MaSanPham", sql.Char(5), item.MaSanPham)
            .input("MaChiNhanh", sql.Char(4), hoaDon.MaChiNhanh)
            .input("SoLuong", sql.Int, item.SoLuong)
            .query(
              `
              UPDATE dbo.SanPham_TonKho
              SET SoLuongTon = SoLuongTon - @SoLuong
              WHERE MaSanPham = @MaSanPham AND MaChiNhanh = @MaChiNhanh
              
              IF @@ROWCOUNT = 0
              BEGIN
                INSERT INTO dbo.SanPham_TonKho (MaSanPham, MaChiNhanh, SoLuongTon)
                VALUES (@MaSanPham, @MaChiNhanh, -@SoLuong)
              END
            `
            );
        }

        // Cộng điểm loyalty
        await request
          .input("MaKhachHang", sql.Char(7), hoaDon.MaKhachHang)
          .input("DiemLoyalty", sql.Int, diemLoyalty)
          .query(
            `
            UPDATE dbo.KhachHang
            SET DiemLoyalty = DiemLoyalty + @DiemLoyalty
            WHERE MaKhachHang = @MaKhachHang
          `
          );

        await transaction.commit();

        return {
          success: true,
          status: 200,
          message: "Xác nhận đơn hàng thành công",
          data: {
            maHoaDon,
            diemLoyalty,
          },
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi xác nhận đơn hàng",
        error: error.message,
      };
    }
  }
  /**
   * Lấy danh sách khách hàng
   * - Nếu có params.page VÀ params.limit -> Phân trang
   * - Nếu thiếu -> Lấy tất cả (Get All)
   * @param {Object} params - { page, limit, search, capHoiVien }
   */
  async getAllCustomers(params = {}) {
    try {
      // 1. Kiểm tra xem Client có muốn phân trang không?
      // Điều kiện: Phải truyền ĐỦ cả page và limit
      const isPagination = params.page && params.limit;

      const search = params.search || '';
      const capHoiVien = params.capHoiVien || '';

      // 2. Lấy kết nối Pool
      const pool = await poolPromise;
      const request = pool.request();

      // 3. Xây dựng điều kiện lọc (WHERE ...) dùng chung cho cả 2 trường hợp
      let baseCondition = "WHERE 1=1";

      if (search) {
        baseCondition += " AND (HoTen LIKE @search OR SDT LIKE @search OR Email LIKE @search)";
        request.input('search', sql.NVarChar, `%${search}%`);
      }

      if (capHoiVien) {
        baseCondition += " AND CapHoiVien = @capHoiVien";
        request.input('capHoiVien', sql.NVarChar, capHoiVien);
      }

      // --- KHỐI XỬ LÝ CHÍNH ---
      let resultData = [];
      let totalRecords = 0;
      let totalPages = 1;
      let currentPage = 1;
      let currentLimit = 0; // 0 nghĩa là không giới hạn

      if (isPagination) {
        // === TRƯỜNG HỢP 1: CÓ PHÂN TRANG ===
        currentPage = parseInt(params.page);
        currentLimit = parseInt(params.limit);
        const offset = (currentPage - 1) * currentLimit;

        // Query 1: Đếm tổng
        const countQuery = `SELECT COUNT(*) AS Total FROM KhachHang ${baseCondition}`;
        const countResult = await request.query(countQuery);
        totalRecords = countResult.recordset[0].Total;
        totalPages = Math.ceil(totalRecords / currentLimit);

        // Query 2: Lấy dữ liệu theo trang
        const dataQuery = `
          SELECT * FROM KhachHang 
          ${baseCondition}
          ORDER BY MaKhachHang DESC 
          OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
        `;
        
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, currentLimit);
        
        const result = await request.query(dataQuery);
        resultData = result.recordset;

      } else {
        // === TRƯỜNG HỢP 2: GET ALL (LẤY HẾT) ===
        // Không dùng OFFSET/FETCH NEXT
        const dataQuery = `
          SELECT * FROM KhachHang 
          ${baseCondition}
          ORDER BY MaKhachHang DESC
        `;
        
        const result = await request.query(dataQuery);
        resultData = result.recordset;
        
        // Cập nhật lại thông tin meta
        totalRecords = resultData.length;
        totalPages = 1;
        currentPage = 1;
        currentLimit = totalRecords;
      }

      // 4. Trả về kết quả
      return {
        success: true,
        status: 200,
        message: isPagination 
            ? "Lấy danh sách khách hàng (phân trang) thành công" 
            : "Lấy toàn bộ danh sách khách hàng thành công",
        data: {
          customers: resultData,
          pagination: {
            page: currentPage,
            limit: currentLimit,
            totalRecords: totalRecords,
            totalPages: totalPages
          }
        }
      };

    } catch (error) {
      console.error("CustomersService -> getAllCustomers:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi hệ thống khi lấy danh sách khách hàng",
        error: error.message
      };
    }
  }
}

module.exports = new CustomersService();

