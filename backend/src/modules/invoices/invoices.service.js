const sql = require("mssql");
const { poolPromise } = require("../../config/database");
const { TIER_DISCOUNTS, POINTS_PER_VND } = require("../../config/constants");

class InvoicesService {
  /**
   * Tạo hóa đơn mới (từ dịch vụ đã sử dụng + sản phẩm mua thêm)
   * NhanVienLap = NULL khi tạo, chỉ cập nhật khi xác nhận
   * @param {object} invoiceData - { MaKhachHang, MaChiNhanh, services[], products[], MaKhuyenMai? }
   */
  async createInvoice(invoiceData) {
    const {
      MaKhachHang,
      MaChiNhanh,
      services = [],
      products = [],
      MaKhuyenMai = null,
    } = invoiceData;

    // Validation
    if (!MaKhachHang || !MaChiNhanh) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: MaKhachHang, MaChiNhanh",
      };
    }

    if (services.length === 0 && products.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Hóa đơn phải có ít nhất một dịch vụ hoặc sản phẩm",
      };
    }

    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);

      await transaction.begin();

      try {
        // Kiểm tra khách hàng
        const customerCheck = await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), MaKhachHang)
          .query(
            `SELECT TOP 1 MaKhachHang, CapHoiVien FROM dbo.KhachHang WHERE MaKhachHang = @MaKhachHang`
          );

        if (customerCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy khách hàng",
          };
        }

        const capHoiVien = customerCheck.recordset[0].CapHoiVien || "CoBan";
        const tiLeGiamGia = TIER_DISCOUNTS[capHoiVien] || 0;

        // Kiểm tra chi nhánh
        const branchCheck = await transaction
          .request()
          .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
          .query(
            `SELECT TOP 1 MaChiNhanh FROM dbo.ChiNhanh WHERE MaChiNhanh = @MaChiNhanh`
          );

        if (branchCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy chi nhánh",
          };
        }

        // Kiểm tra khuyến mãi (nếu có)
        let tiLeGiamGiaKM = 0;
        if (MaKhuyenMai) {
          const promotionCheck = await transaction
            .request()
            .input("MaKhuyenMai", sql.Char(6), MaKhuyenMai)
            .query(
              `
              SELECT TOP 1 TiLeGiamGia, NgayBatDau, NgayKetThuc
              FROM dbo.KhuyenMai
              WHERE MaKhuyenMai = @MaKhuyenMai
                AND TrangThai = N'Đang áp dụng'
            `
            );

          if (promotionCheck.recordset.length > 0) {
            const promotion = promotionCheck.recordset[0];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const ngayBatDau = new Date(promotion.NgayBatDau);
            const ngayKetThuc = new Date(promotion.NgayKetThuc);

            if (today >= ngayBatDau && today <= ngayKetThuc) {
              tiLeGiamGiaKM = promotion.TiLeGiamGia || 0;
            }
          }
        }

        // Tính tổng tiền dịch vụ
        let tongTienDichVu = 0;
        for (const service of services) {
          const { MaDichVu, MaThuCung } = service;

          // Lấy giá dịch vụ
          const serviceCheck = await transaction
            .request()
            .input("MaDichVu", sql.Char(5), MaDichVu)
            .query(
              `SELECT TOP 1 GiaTien FROM dbo.DichVu WHERE MaDichVu = @MaDichVu`
            );

          if (serviceCheck.recordset.length === 0) {
            await transaction.rollback();
            return {
              success: false,
              status: 404,
              message: `Không tìm thấy dịch vụ với mã: ${MaDichVu}`,
            };
          }

          tongTienDichVu += parseFloat(serviceCheck.recordset[0].GiaTien || 0);
        }

        // Tính tổng tiền sản phẩm
        let tongTienSanPham = 0;
        for (const product of products) {
          const { MaSanPham, SoLuong } = product;

          // Kiểm tra tồn kho
          const stockCheck = await transaction
            .request()
            .input("MaSanPham", sql.Char(5), MaSanPham)
            .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
            .query(
              `
              SELECT TOP 1 SoLuongTon, DonGia
              FROM dbo.SanPham_TonKho tk
              INNER JOIN dbo.SanPham sp ON tk.MaSanPham = sp.MaSanPham
              WHERE tk.MaSanPham = @MaSanPham
                AND tk.MaChiNhanh = @MaChiNhanh
            `
            );

          if (
            stockCheck.recordset.length === 0 ||
            stockCheck.recordset[0].SoLuongTon < SoLuong
          ) {
            await transaction.rollback();
            return {
              success: false,
              status: 400,
              message: `Sản phẩm ${MaSanPham} không đủ tồn kho`,
            };
          }

          const donGia = parseFloat(stockCheck.recordset[0].DonGia || 0);
          tongTienSanPham += donGia * SoLuong;
        }

        // Tổng tiền trước giảm giá
        const tongTienTruocGiam = tongTienDichVu + tongTienSanPham;

        // Áp dụng giảm giá khuyến mãi (nếu có)
        const giamGiaKM = (tongTienTruocGiam * tiLeGiamGiaKM) / 100;

        // Áp dụng giảm giá hạng thành viên
        const giamGiaHoiVien = (tongTienTruocGiam * tiLeGiamGia) / 100;

        // Tổng tiền sau giảm giá
        const tongTien = tongTienTruocGiam - giamGiaKM - giamGiaHoiVien;

        // Tính điểm loyalty (1 điểm / 100k VND)
        const diemLoyalty = Math.floor(tongTien / POINTS_PER_VND);

        // Lấy thời gian hiện tại để query chính xác
        const now = new Date();
        
        // Tạo hóa đơn với NhanVienLap = NULL
        await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), MaKhachHang)
          .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
          .input("TongTien", sql.Int, Math.round(tongTien))
          .input("MaKhuyenMai", sql.Char(6), MaKhuyenMai)
          .input("TiLeGiamGia", sql.Decimal(5, 2), tiLeGiamGiaKM)
          .query(
            `
            INSERT INTO dbo.HoaDon (MaKhachHang, MaChiNhanh, TongTien, NhanVienLap, MaKhuyenMai, TiLeGiamGia)
            VALUES (@MaKhachHang, @MaChiNhanh, @TongTien, NULL, @MaKhuyenMai, @TiLeGiamGia)
          `
          );

        // Lấy MaHoaDon vừa tạo (trigger tự động tạo MaHoaDon)
        // Sử dụng NgayLap và MaKhachHang để lấy chính xác
        const invoiceCheck = await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), MaKhachHang)
          .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
          .query(
            `
            SELECT TOP 1 MaHoaDon
            FROM dbo.HoaDon
            WHERE MaKhachHang = @MaKhachHang
              AND MaChiNhanh = @MaChiNhanh
              AND NhanVienLap IS NULL
            ORDER BY NgayLap DESC, MaHoaDon DESC
          `
          );

        if (invoiceCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 500,
            message: "Lỗi khi tạo hóa đơn: Không thể lấy mã hóa đơn",
          };
        }

        const finalMaHoaDon = invoiceCheck.recordset[0].MaHoaDon;

        // Thêm chi tiết dịch vụ
        let stt = 1;
        for (const service of services) {
          const { MaDichVu, MaThuCung } = service;

          const serviceInfo = await transaction
            .request()
            .input("MaDichVu", sql.Char(5), MaDichVu)
            .query(
              `SELECT TOP 1 GiaTien FROM dbo.DichVu WHERE MaDichVu = @MaDichVu`
            );

          const giaTien = parseFloat(serviceInfo.recordset[0].GiaTien || 0);
          const thanhTien = giaTien;

          await transaction
            .request()
            .input("MaHoaDon", sql.Char(8), finalMaHoaDon)
            .input("STT", sql.Int, stt)
            .input("LoaiDichVu", sql.NVarChar(50), "Dịch vụ sức khỏe")
            .input("ThanhTien", sql.Int, Math.round(thanhTien))
            .query(
              `
              INSERT INTO dbo.CTHD (MaHoaDon, STT, LoaiDichVu, ThanhTien)
              VALUES (@MaHoaDon, @STT, @LoaiDichVu, @ThanhTien)
            `
            );

          // Thêm vào CTHD_DVSucKhoe
          await transaction
            .request()
            .input("MaHoaDon", sql.Char(8), finalMaHoaDon)
            .input("STT", sql.Int, stt)
            .input("MaDichVu", sql.Char(5), MaDichVu)
            .input("MaThuCung", sql.Char(5), MaThuCung)
            .query(
              `
              INSERT INTO dbo.CTHD_DVSucKhoe (MaHoaDon, STT, MaDichVu, MaThuCung)
              VALUES (@MaHoaDon, @STT, @MaDichVu, @MaThuCung)
            `
            );

          stt++;
        }

        // Thêm chi tiết sản phẩm
        for (const product of products) {
          const { MaSanPham, SoLuong } = product;

          const productInfo = await transaction
            .request()
            .input("MaSanPham", sql.Char(5), MaSanPham)
            .query(
              `SELECT TOP 1 DonGia FROM dbo.SanPham WHERE MaSanPham = @MaSanPham`
            );

          const donGia = parseFloat(productInfo.recordset[0].DonGia || 0);
          const thanhTien = donGia * SoLuong;

          await transaction
            .request()
            .input("MaHoaDon", sql.Char(8), finalMaHoaDon)
            .input("STT", sql.Int, stt)
            .input("LoaiDichVu", sql.NVarChar(50), "Mua hàng")
            .input("ThanhTien", sql.Int, Math.round(thanhTien))
            .query(
              `
              INSERT INTO dbo.CTHD (MaHoaDon, STT, LoaiDichVu, ThanhTien)
              VALUES (@MaHoaDon, @STT, @LoaiDichVu, @ThanhTien)
            `
            );

          // Thêm vào CTHD_MuaHang
          await transaction
            .request()
            .input("MaHoaDon", sql.Char(8), finalMaHoaDon)
            .input("STT", sql.Int, stt)
            .input("MaSanPham", sql.Char(5), MaSanPham)
            .input("SoLuong", sql.Int, SoLuong)
            .query(
              `
              INSERT INTO dbo.CTHD_MuaHang (MaHoaDon, STT, MaSanPham, SoLuong)
              VALUES (@MaHoaDon, @STT, @MaSanPham, @SoLuong)
            `
            );

          stt++;
        }

        await transaction.commit();

        return {
          success: true,
          status: 201,
          message: "Tạo hóa đơn thành công",
          data: {
            maHoaDon: finalMaHoaDon,
            tongTien: Math.round(tongTien),
            diemLoyalty,
            trangThai: "Chờ xác nhận",
          },
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi tạo hóa đơn",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách hóa đơn chờ xác nhận (NhanVienLap = NULL)
   * @param {string} maChiNhanh - Chi nhánh của nhân viên
   */
  async getPendingInvoices(maChiNhanh) {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanh)
        .query(
          `
          SELECT 
            hd.MaHoaDon,
            hd.MaKhachHang,
            kh.HoTen AS TenKhachHang,
            kh.SDT,
            hd.NgayLap,
            hd.TongTien,
            hd.MaKhuyenMai,
            hd.TiLeGiamGia
          FROM dbo.HoaDon hd
          INNER JOIN dbo.KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
          WHERE hd.NhanVienLap IS NULL
            AND hd.MaChiNhanh = @MaChiNhanh
          ORDER BY hd.NgayLap DESC, hd.MaHoaDon DESC
        `
        );

      const invoices = result.recordset.map((invoice) => ({
        maHoaDon: invoice.MaHoaDon,
        maKhachHang: invoice.MaKhachHang,
        tenKhachHang: invoice.TenKhachHang,
        sdt: invoice.SDT,
        ngayLap: invoice.NgayLap
          ? invoice.NgayLap.toISOString().split("T")[0]
          : null,
        tongTien: invoice.TongTien,
        maKhuyenMai: invoice.MaKhuyenMai,
        tiLeGiamGia: invoice.TiLeGiamGia || 0,
        trangThai: "Chờ xác nhận",
      }));

      return {
        success: true,
        status: 200,
        count: invoices.length,
        data: invoices,
      };
    } catch (error) {
      console.error("Error fetching pending invoices:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách hóa đơn chờ xác nhận",
        error: error.message,
      };
    }
  }

  /**
   * Xác nhận đơn hàng (set NhanVienLap, trừ tồn kho, cộng điểm loyalty)
   * @param {string} maHoaDon
   * @param {string} maNhanVien
   */
  async confirmInvoice(maHoaDon, maNhanVien) {
    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);

      await transaction.begin();

      try {
        // Kiểm tra hóa đơn tồn tại và chưa được xác nhận
        const invoiceCheck = await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .query(
            `
            SELECT TOP 1 
              hd.MaHoaDon,
              hd.MaKhachHang,
              hd.MaChiNhanh,
              hd.TongTien,
              hd.NhanVienLap
            FROM dbo.HoaDon hd
            WHERE hd.MaHoaDon = @MaHoaDon
          `
          );

        if (invoiceCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy hóa đơn",
          };
        }

        if (invoiceCheck.recordset[0].NhanVienLap) {
          await transaction.rollback();
          return {
            success: false,
            status: 400,
            message: "Hóa đơn đã được xác nhận",
          };
        }

        const invoice = invoiceCheck.recordset[0];
        const maChiNhanh = invoice.MaChiNhanh;

        // Lấy chi tiết sản phẩm để trừ tồn kho
        const productDetails = await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .query(
            `
            SELECT 
              cthd.STT,
              mh.MaSanPham,
              mh.SoLuong
            FROM dbo.CTHD cthd
            INNER JOIN dbo.CTHD_MuaHang mh 
              ON cthd.MaHoaDon = mh.MaHoaDon 
              AND cthd.STT = mh.STT
            WHERE cthd.MaHoaDon = @MaHoaDon
              AND cthd.LoaiDichVu = N'Mua hàng'
          `
          );

        // Trừ tồn kho (kiểm tra tồn kho trước khi trừ)
        for (const product of productDetails.recordset) {
          const { MaSanPham, SoLuong } = product;

          // Kiểm tra tồn kho hiện tại
          const stockCheck = await transaction
            .request()
            .input("MaSanPham", sql.Char(5), MaSanPham)
            .input("MaChiNhanh", sql.Char(4), maChiNhanh)
            .query(
              `
              SELECT TOP 1 SoLuongTon
              FROM dbo.SanPham_TonKho
              WHERE MaSanPham = @MaSanPham
                AND MaChiNhanh = @MaChiNhanh
            `
            );

          if (stockCheck.recordset.length === 0) {
            await transaction.rollback();
            return {
              success: false,
              status: 400,
              message: `Sản phẩm ${MaSanPham} không có trong tồn kho chi nhánh`,
            };
          }

          const soLuongTon = stockCheck.recordset[0].SoLuongTon;
          if (soLuongTon < SoLuong) {
            await transaction.rollback();
            return {
              success: false,
              status: 400,
              message: `Sản phẩm ${MaSanPham} không đủ tồn kho (hiện có: ${soLuongTon}, cần: ${SoLuong})`,
            };
          }

          // Trừ tồn kho
          await transaction
            .request()
            .input("MaSanPham", sql.Char(5), MaSanPham)
            .input("MaChiNhanh", sql.Char(4), maChiNhanh)
            .input("SoLuong", sql.Int, SoLuong)
            .query(
              `
              UPDATE dbo.SanPham_TonKho
              SET SoLuongTon = SoLuongTon - @SoLuong
              WHERE MaSanPham = @MaSanPham
                AND MaChiNhanh = @MaChiNhanh
            `
          );
        }

        // Tính điểm loyalty
        const tongTien = invoice.TongTien;
        const diemLoyalty = Math.floor(tongTien / POINTS_PER_VND);

        // Cộng điểm loyalty cho khách hàng
        if (diemLoyalty > 0) {
          await transaction
            .request()
            .input("MaKhachHang", sql.Char(7), invoice.MaKhachHang)
            .input("DiemLoyalty", sql.Int, diemLoyalty)
            .query(
              `
              UPDATE dbo.KhachHang
              SET DiemLoyalty = DiemLoyalty + @DiemLoyalty
              WHERE MaKhachHang = @MaKhachHang
            `
          );
        }

        // Cập nhật NhanVienLap
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("NhanVienLap", sql.Char(5), maNhanVien)
          .query(
            `
            UPDATE dbo.HoaDon
            SET NhanVienLap = @NhanVienLap
            WHERE MaHoaDon = @MaHoaDon
          `
          );

        await transaction.commit();

        return {
          success: true,
          status: 200,
          message: "Xác nhận hóa đơn thành công",
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
      console.error("Error confirming invoice:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi xác nhận hóa đơn",
        error: error.message,
      };
    }
  }

  /**
   * Lấy chi tiết hóa đơn
   * @param {string} maHoaDon
   */
  async getInvoiceDetails(maHoaDon) {
    try {
      const pool = await poolPromise;

      // Lấy thông tin hóa đơn
      const invoiceResult = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .query(
          `
          SELECT 
            hd.MaHoaDon,
            hd.MaKhachHang,
            kh.HoTen AS TenKhachHang,
            kh.SDT,
            kh.CapHoiVien,
            hd.MaChiNhanh,
            cn.TenChiNhanh,
            hd.NgayLap,
            hd.TongTien,
            hd.NhanVienLap,
            nv.HoTen AS TenNhanVienLap,
            hd.MaKhuyenMai,
            hd.TiLeGiamGia
          FROM dbo.HoaDon hd
          INNER JOIN dbo.KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
          INNER JOIN dbo.ChiNhanh cn ON hd.MaChiNhanh = cn.MaChiNhanh
          LEFT JOIN dbo.NhanVien nv ON hd.NhanVienLap = nv.MaNhanVien
          WHERE hd.MaHoaDon = @MaHoaDon
        `
        );

      if (invoiceResult.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy hóa đơn",
        };
      }

      const invoice = invoiceResult.recordset[0];

      // Lấy chi tiết hóa đơn
      const detailsResult = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .query(
          `
          SELECT 
            cthd.STT,
            cthd.LoaiDichVu,
            cthd.ThanhTien
          FROM dbo.CTHD cthd
          WHERE cthd.MaHoaDon = @MaHoaDon
          ORDER BY cthd.STT ASC
        `
        );

      const details = [];

      for (const detail of detailsResult.recordset) {
        const { STT, LoaiDichVu, ThanhTien } = detail;
        const chiTiet = {
          STT,
          LoaiDichVu,
          ThanhTien,
          LoaiChiTiet: null,
          ChiTiet: {},
        };

        if (LoaiDichVu === "Mua hàng") {
          // Lấy thông tin sản phẩm
          const productInfo = await pool
            .request()
            .input("MaHoaDon", sql.Char(8), maHoaDon)
            .input("STT", sql.Int, STT)
            .query(
              `
              SELECT 
                mh.MaSanPham,
                sp.TenSanPham,
                mh.SoLuong,
                sp.DonGia
              FROM dbo.CTHD_MuaHang mh
              INNER JOIN dbo.SanPham sp ON mh.MaSanPham = sp.MaSanPham
              WHERE mh.MaHoaDon = @MaHoaDon
                AND mh.STT = @STT
            `
            );

          if (productInfo.recordset.length > 0) {
            const product = productInfo.recordset[0];
            chiTiet.LoaiChiTiet = "MuaHang";
            chiTiet.ChiTiet = {
              maSanPham: product.MaSanPham,
              tenSanPham: product.TenSanPham,
              soLuong: product.SoLuong,
              donGia: product.DonGia,
            };
          }
        } else if (LoaiDichVu === "Dịch vụ sức khỏe") {
          // Kiểm tra xem là khám bệnh hay tiêm phòng
          const medicalCheck = await pool
            .request()
            .input("MaHoaDon", sql.Char(8), maHoaDon)
            .input("STT", sql.Int, STT)
            .query(
              `
              SELECT TOP 1 
                kb.MaThuCung,
                kb.TrieuChung,
                kb.ChanDoan,
                kb.ToaThuoc,
                kb.NgayTaiKham,
                kb.BacSi AS MaBacSi,
                nv.HoTen AS TenBacSi
              FROM dbo.CTHD_KhamBenh kb
              LEFT JOIN dbo.NhanVien nv ON kb.BacSi = nv.MaNhanVien
              WHERE kb.MaHoaDon = @MaHoaDon
                AND kb.STT = @STT
            `
            );

          if (medicalCheck.recordset.length > 0) {
            const medical = medicalCheck.recordset[0];
            chiTiet.LoaiChiTiet = "KhamBenh";
            chiTiet.ChiTiet = {
              maThuCung: medical.MaThuCung,
              maBacSi: medical.MaBacSi,
              tenBacSi: medical.TenBacSi,
              trieuChung: medical.TrieuChung,
              chuanDoan: medical.ChanDoan,
              toaThuoc: medical.ToaThuoc,
              ngayTaiKham: medical.NgayTaiKham
                ? medical.NgayTaiKham.toISOString().split("T")[0]
                : null,
            };
          } else {
            // Kiểm tra tiêm phòng
            const vaccinationCheck = await pool
              .request()
              .input("MaHoaDon", sql.Char(8), maHoaDon)
              .input("STT", sql.Int, STT)
              .query(
                `
                SELECT TOP 1 
                  tp.MaThuCung,
                  tp.MaVacXin,
                  vx.TenVacXin,
                  tp.BacSi AS MaBacSi,
                  nv.HoTen AS TenBacSi,
                  tp.MaGoiDK
                FROM dbo.CTHD_TiemPhong tp
                INNER JOIN dbo.VacXin vx ON tp.MaVacXin = vx.MaVacXin
                LEFT JOIN dbo.NhanVien nv ON tp.BacSi = nv.MaNhanVien
                WHERE tp.MaHoaDon = @MaHoaDon
                  AND tp.STT = @STT
              `
              );

            if (vaccinationCheck.recordset.length > 0) {
              const vaccination = vaccinationCheck.recordset[0];
              chiTiet.LoaiChiTiet = "TiemPhong";
              chiTiet.ChiTiet = {
                maThuCung: vaccination.MaThuCung,
                maVacXin: vaccination.MaVacXin,
                tenVacXin: vaccination.TenVacXin,
                maBacSi: vaccination.MaBacSi,
                tenBacSi: vaccination.TenBacSi,
                maGoiDK: vaccination.MaGoiDK,
              };
            }
          }
        }

        details.push(chiTiet);
      }

      return {
        success: true,
        status: 200,
        data: {
          maHoaDon: invoice.MaHoaDon,
          maKhachHang: invoice.MaKhachHang,
          tenKhachHang: invoice.TenKhachHang,
          sdt: invoice.SDT,
          capHoiVien: invoice.CapHoiVien,
          chiNhanh: {
            maChiNhanh: invoice.MaChiNhanh,
            tenChiNhanh: invoice.TenChiNhanh,
          },
          ngayLap: invoice.NgayLap
            ? invoice.NgayLap.toISOString().split("T")[0]
            : null,
          tongTien: invoice.TongTien,
          nhanVienLap: invoice.NhanVienLap
            ? {
                maNhanVien: invoice.NhanVienLap,
                hoTen: invoice.TenNhanVienLap,
              }
            : null,
          maKhuyenMai: invoice.MaKhuyenMai,
          tiLeGiamGia: invoice.TiLeGiamGia || 0,
          trangThai: invoice.NhanVienLap ? "Đã xác nhận" : "Chờ xác nhận",
          chiTiet: details,
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

module.exports = new InvoicesService();

