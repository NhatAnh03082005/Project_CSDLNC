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
      const capHoiVien = customer.CapHoiVien || "CoBan";
      const { TIER_DISCOUNTS, POINTS_PER_VND } = require("../../config/constants");
      const discountPercent = TIER_DISCOUNTS[capHoiVien] || 0;

      let tongTien = 0;
      let stt = 1;
      let maHoaDon = null;

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        const request = new sql.Request(transaction);

        const itemsData = [];
        for (const item of items) {
          const productResult = await request
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

          const product = productResult.recordset[0];
          const donGia = product.DonGia;
          const thanhTien = donGia * item.soLuong;
          const thanhTienSauGiam = thanhTien * (1 - discountPercent / 100);
          tongTien += thanhTienSauGiam;

          itemsData.push({
            ...item,
            thanhTienSauGiam,
          });
        }

        const phuThu = 0;
        const tongTienFinal = tongTien + phuThu;
        const diemLoyalty = Math.floor(tongTienFinal / POINTS_PER_VND);

        const hoaDonResult = await request
          .input("NgayLap", sql.NVarChar(10), ngayLapStr)
          .input("MaKhachHang", sql.Char(7), customerId)
          .input("MaChiNhanh", sql.Char(4), maChiNhanh)
          .input("NhanVienLap", sql.Char(5), null)
          .input("TongTien", sql.Money, tongTienFinal)
          .input("PhuThu", sql.Money, phuThu)
          .input("PhuongThucThanhToan", sql.NVarChar(20), paymentMethod)
          .input("DiemLoyalty", sql.Int, diemLoyalty)
          .query(
            `
            INSERT INTO dbo.HoaDon (
              NgayLap, MaKhachHang, MaChiNhanh, 
              NhanVienLap, TongTien, PhuThu, PhuongThucThanhToan, DiemLoyalty
            )
            OUTPUT INSERTED.MaHoaDon
            VALUES (
              @NgayLap, @MaKhachHang, @MaChiNhanh,
              @NhanVienLap, @TongTien, @PhuThu, @PhuongThucThanhToan, @DiemLoyalty
            )
          `
          );

        maHoaDon = hoaDonResult.recordset[0].MaHoaDon;

        for (const itemData of itemsData) {
          await request
            .input("MaHoaDon", sql.Char(8), maHoaDon)
            .input("STT", sql.Int, stt)
            .input("LoaiDichVu", sql.NVarChar(20), "Mua hàng")
            .input("ThanhTien", sql.Money, itemData.thanhTienSauGiam)
            .query(
              `
              INSERT INTO dbo.CTHD (MaHoaDon, STT, LoaiDichVu, ThanhTien)
              VALUES (@MaHoaDon, @STT, @LoaiDichVu, @ThanhTien)
            `
            );

          await request
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

          await request
            .input("MaSanPham", sql.Char(5), itemData.maSanPham)
            .input("MaChiNhanh", sql.Char(4), maChiNhanh)
            .input("SoLuong", sql.Int, itemData.soLuong)
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

          stt++;
        }

        await request
          .input("MaKhachHang", sql.Char(7), customerId)
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
          status: 201,
          message: "Đặt hàng thành công",
          data: {
            maHoaDon,
            ngayLap: ngayLapStr,
            tongTien: tongTienFinal,
            diemLoyalty,
          },
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi tạo đơn hàng",
        error: error.message,
      };
    }
  }
}

module.exports = new CustomersService();

