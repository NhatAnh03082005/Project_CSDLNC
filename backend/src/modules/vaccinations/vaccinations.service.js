const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class VaccinationsService {
  // =====================================================================
  // LOGIC QUẢN LÝ DANH MỤC VẮC-XIN (ADMIN - feature/admin)
  // =====================================================================

  async getAllVaccines() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
          SELECT 
            MaVacXin,
            TenVacXin,
            GiaTien
          FROM VacXin
          ORDER BY MaVacXin
        `);

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getVaccineById(maVacXin) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaVacXin", sql.NVarChar, maVacXin).query(`
          SELECT 
            MaVacXin,
            TenVacXin,
            GiaTien
          FROM VacXin
          WHERE MaVacXin = @MaVacXin
        `);

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  async createVaccine(vaccineData) {
    try {
      const pool = await poolPromise;
      const { TenVacXin, GiaTien } = vaccineData;

      if (!TenVacXin || !GiaTien) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      await pool
        .request()
        .input("TenVacXin", sql.NVarChar, TenVacXin)
        .input("GiaTien", sql.Int, GiaTien).query(`
          INSERT INTO VacXin (TenVacXin, GiaTien)
          VALUES (@TenVacXin, @GiaTien);
        `);

      return { success: true };
    } catch (error) {
      console.error("Error in createVaccine:", error);
      throw error;
    }
  }

  async updateVaccine(maVacXin, vaccineData) {
    try {
      const pool = await poolPromise;
      const { TenVacXin, GiaTien } = vaccineData;

      await pool
        .request()
        .input("MaVacXin", sql.NVarChar, maVacXin)
        .input("TenVacXin", sql.NVarChar, TenVacXin)
        .input("GiaTien", sql.Int, GiaTien).query(`
          UPDATE VacXin
          SET 
            TenVacXin = @TenVacXin,
            GiaTien = @GiaTien
          WHERE MaVacXin = @MaVacXin
        `);

      return await this.getVaccineById(maVacXin);
    } catch (error) {
      console.error("Error in updateVaccine:", error);
      throw error;
    }
  }

  // =====================================================================
  // LOGIC GÓI TIÊM PHÒNG (CUSTOMER - HEAD)
  // =====================================================================

  /**
   * Lấy danh sách tất cả các loại gói tiêm phòng
   */
  async getVaccinationPackages() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(
        `
        SELECT 
          LoaiGoi,
          ThoiHan,
          UuDai
        FROM dbo.GoiTiemPhong
        ORDER BY ThoiHan ASC, LoaiGoi ASC
      `
      );

      const packages = result.recordset.map((pkg) => ({
        LoaiGoi: pkg.LoaiGoi,
        ThoiHan: pkg.ThoiHan,
        UuDai: pkg.UuDai,
      }));

      return {
        success: true,
        status: 200,
        count: packages.length,
        data: packages,
      };
    } catch (error) {
      console.error("Error fetching vaccination packages:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách gói tiêm phòng",
        error: error.message,
      };
    }
  }

  /**
   * Đăng ký gói tiêm phòng cho khách hàng
   */
  async subscribeToPackage(customerId, subscriptionData) {
    const { LoaiGoi, vaccines } = subscriptionData;

    if (!LoaiGoi) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: LoaiGoi",
      };
    }

    if (!vaccines || !Array.isArray(vaccines) || vaccines.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Vui lòng chọn ít nhất một vaccine",
      };
    }

    try {
      const pool = await poolPromise;
      const packageCheck = await pool
        .request()
        .input("LoaiGoi", sql.Char(7), LoaiGoi)
        .query(
          `SELECT TOP 1 LoaiGoi, ThoiHan, UuDai FROM dbo.GoiTiemPhong WHERE LoaiGoi = @LoaiGoi`
        );

      if (packageCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy gói tiêm phòng",
        };
      }

      const packageInfo = packageCheck.recordset[0];
      const thoiHan = packageInfo.ThoiHan;
      const uuDai = packageInfo.UuDai;

      // Kiểm tra số lượng vaccine có khớp với thời hạn không
      if (vaccines.length !== thoiHan) {
        return {
          success: false,
          status: 400,
          message: `Gói ${thoiHan} tháng cần chọn đúng ${thoiHan} vaccine`,
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endDate = new Date(today);
      endDate.setMonth(endDate.getMonth() + thoiHan);

      await pool
        .request()
        .input("ThoiGianBatDau", sql.Date, today)
        .input("ThoiGianKetThuc", sql.Date, endDate)
        .input("LoaiGoi", sql.Char(7), LoaiGoi)
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          INSERT INTO dbo.DK_GoiTiemPhong (ThoiGianBatDau, ThoiGianKetThuc, LoaiGoi, MaKhachHang)
          VALUES (@ThoiGianBatDau, @ThoiGianKetThuc, @LoaiGoi, @MaKhachHang)
        `
        );

      const newSubscription = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .input("LoaiGoi", sql.Char(7), LoaiGoi)
        .input("ThoiGianBatDau", sql.Date, today)
        .query(
          `
          SELECT TOP 1 dk.MaGoiDK, dk.MaKhachHang, dk.LoaiGoi, dk.ThoiGianBatDau, dk.ThoiGianKetThuc, gtp.ThoiHan, gtp.UuDai
          FROM dbo.DK_GoiTiemPhong dk
          INNER JOIN dbo.GoiTiemPhong gtp ON dk.LoaiGoi = gtp.LoaiGoi
          WHERE dk.MaKhachHang = @MaKhachHang AND dk.LoaiGoi = @LoaiGoi AND dk.ThoiGianBatDau = @ThoiGianBatDau
          ORDER BY dk.ThoiGianBatDau DESC
        `
        );

      const maGoiDK = newSubscription.recordset[0].MaGoiDK;

      // Thêm các vaccine vào bảng VacXin_GoiDK
      for (const maVacXin of vaccines) {
        // Lấy giá gốc của vaccine
        const vaccinePrice = await pool
          .request()
          .input("MaVacXin", sql.NVarChar, maVacXin)
          .query(`SELECT GiaTien FROM dbo.VacXin WHERE MaVacXin = @MaVacXin`);

        if (vaccinePrice.recordset.length > 0) {
          const giaGoc = vaccinePrice.recordset[0].GiaTien;
          const giaSauUuDai = Math.round(giaGoc * (1 - uuDai / 100));

          await pool
            .request()
            .input("MaGoiDK", sql.Char(6), maGoiDK)
            .input("MaVacXin", sql.NVarChar, maVacXin)
            .input("GiaSauUuDai", sql.Int, giaSauUuDai)
            .query(
              `
              INSERT INTO dbo.VacXin_GoiDK (MaGoiDK, MaVacXin, GiaSauUuDai)
              VALUES (@MaGoiDK, @MaVacXin, @GiaSauUuDai)
            `
            );
        }
      }

      return {
        success: true,
        status: 201,
        message: "Đăng ký gói tiêm phòng thành công",
        data: {
          ...newSubscription.recordset[0],
          vaccinesCount: vaccines.length,
        },
      };
    } catch (error) {
      console.error("Error subscribing to vaccination package:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi đăng ký gói tiêm phòng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách gói tiêm đang đăng ký của khách hàng
   */
  async getCustomerSubscriptions(customerId) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT dk.MaGoiDK, dk.MaKhachHang, dk.LoaiGoi, dk.ThoiGianBatDau, dk.ThoiGianKetThuc, gtp.ThoiHan, gtp.UuDai,
            CASE WHEN dk.ThoiGianKetThuc >= CAST(GETDATE() AS DATE) THEN N'Đang hoạt động' ELSE N'Đã hết hạn' END AS TrangThai
          FROM dbo.DK_GoiTiemPhong dk
          INNER JOIN dbo.GoiTiemPhong gtp ON dk.LoaiGoi = gtp.LoaiGoi
          WHERE dk.MaKhachHang = @MaKhachHang
          ORDER BY dk.ThoiGianBatDau DESC, dk.MaGoiDK DESC
        `
        );

      return {
        success: true,
        status: 200,
        count: result.recordset.length,
        data: result.recordset,
      };
    } catch (error) {
      console.error("Error fetching customer subscriptions:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách gói đăng ký của khách hàng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy chi tiết gói tiêm đã đăng ký (bao gồm danh sách vaccine)
   */
  async getSubscriptionDetails(customerId, maGoiDK) {
    try {
      const pool = await poolPromise;
      const subscriptionCheck = await pool
        .request()
        .input("MaGoiDK", sql.Char(6), maGoiDK)
        .input("MaKhachHang", sql.Char(7), customerId)
        .query(
          `
          SELECT TOP 1 dk.MaGoiDK, dk.MaKhachHang, dk.LoaiGoi, dk.ThoiGianBatDau, dk.ThoiGianKetThuc, gtp.ThoiHan, gtp.UuDai
          FROM dbo.DK_GoiTiemPhong dk
          INNER JOIN dbo.GoiTiemPhong gtp ON dk.LoaiGoi = gtp.LoaiGoi
          WHERE dk.MaGoiDK = @MaGoiDK AND dk.MaKhachHang = @MaKhachHang
        `
        );

      if (subscriptionCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy gói đăng ký",
        };
      }

      const vaccinesResult = await pool
        .request()
        .input("MaGoiDK", sql.Char(6), maGoiDK)
        .query(
          `
          SELECT vxgd.MaVacXin, vx.TenVacXin, vx.GiaTien AS GiaGoc, vxgd.GiaSauUuDai
          FROM dbo.VacXin_GoiDK vxgd
          INNER JOIN dbo.VacXin vx ON vxgd.MaVacXin = vx.MaVacXin
          WHERE vxgd.MaGoiDK = @MaGoiDK
        `
        );

      const sub = subscriptionCheck.recordset[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return {
        success: true,
        status: 200,
        data: {
          ...sub,
          TrangThai:
            new Date(sub.ThoiGianKetThuc) >= today
              ? "Đang hoạt động"
              : "Đã hết hạn",
          SoLuongVacXin: vaccinesResult.recordset.length,
          VacXin: vaccinesResult.recordset,
        },
      };
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi Server",
        error: error.message,
      };
    }
  }

  // =====================================================================
  // LOGIC HỒ SƠ TIÊM PHÒNG CHO NHÂN VIÊN
  // =====================================================================

  /**
   * Kiểm tra nhân viên có phải bác sĩ thú y không
   * @param {string} maNhanVien
   */
  async checkIsDoctor(maNhanVien) {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `
          SELECT TOP 1 MaNhanVien, ViTri
          FROM dbo.NhanVien
          WHERE MaNhanVien = @MaNhanVien
            AND TrangThai = 0
        `
        );

      if (result.recordset.length === 0) {
        return false;
      }

      return result.recordset[0].ViTri === "Bác sĩ thú y";
    } catch (error) {
      console.error("Error checking doctor:", error);
      return false;
    }
  }

  /**
   * Ghi nhận tiêm phòng (tạo HoaDon + CTHD + CTHD_DVSucKhoe + CTHD_TiemPhong)
   * NhanVienLap = NULL, các trường trong CTHD_TiemPhong = NULL (trừ MaThuCung)
   * @param {object} recordData - { MaKhachHang, MaChiNhanh, MaThuCung, MaDichVu }
   */
  async createVaccinationRecord(recordData) {
    const { MaKhachHang, MaChiNhanh, MaThuCung, MaDichVu } = recordData;

    if (!MaKhachHang || !MaChiNhanh || !MaThuCung || !MaDichVu) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: MaKhachHang, MaChiNhanh, MaThuCung, MaDichVu",
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
            `SELECT TOP 1 MaKhachHang FROM dbo.KhachHang WHERE MaKhachHang = @MaKhachHang`
          );

        if (customerCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy khách hàng",
          };
        }

        // Kiểm tra thú cưng
        const petCheck = await transaction
          .request()
          .input("MaThuCung", sql.Char(5), MaThuCung)
          .input("MaKhachHang", sql.Char(7), MaKhachHang)
          .query(
            `
            SELECT TOP 1 MaThuCung
            FROM dbo.ThuCung
            WHERE MaThuCung = @MaThuCung
              AND MaKhachHang = @MaKhachHang
          `
          );

        if (petCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy thú cưng hoặc thú cưng không thuộc khách hàng này",
          };
        }

        // Kiểm tra dịch vụ
        const serviceCheck = await transaction
          .request()
          .input("MaDichVu", sql.Char(5), MaDichVu)
          .query(
            `SELECT TOP 1 MaDichVu, GiaTien FROM dbo.DichVu WHERE MaDichVu = @MaDichVu`
          );

        if (serviceCheck.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 404,
            message: "Không tìm thấy dịch vụ",
          };
        }

        const giaTien = parseFloat(serviceCheck.recordset[0].GiaTien || 0);

        // Tạo hóa đơn với NhanVienLap = NULL
        await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), MaKhachHang)
          .input("MaChiNhanh", sql.Char(4), MaChiNhanh)
          .input("TongTien", sql.Int, Math.round(giaTien))
          .query(
            `
            INSERT INTO dbo.HoaDon (MaKhachHang, MaChiNhanh, TongTien, NhanVienLap, MaKhuyenMai, TiLeGiamGia)
            VALUES (@MaKhachHang, @MaChiNhanh, @TongTien, NULL, NULL, 0)
          `
          );

        // Lấy MaHoaDon vừa tạo (trigger tự động tạo MaHoaDon)
        const invoiceResult = await transaction
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

        if (invoiceResult.recordset.length === 0) {
          await transaction.rollback();
          return {
            success: false,
            status: 500,
            message: "Lỗi khi tạo hóa đơn: Không thể lấy mã hóa đơn",
          };
        }

        const maHoaDon = invoiceResult.recordset[0].MaHoaDon;

        // Tạo CTHD
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("STT", sql.Int, 1)
          .input("LoaiDichVu", sql.NVarChar(50), "Dịch vụ sức khỏe")
          .input("ThanhTien", sql.Int, Math.round(giaTien))
          .query(
            `
            INSERT INTO dbo.CTHD (MaHoaDon, STT, LoaiDichVu, ThanhTien)
            VALUES (@MaHoaDon, @STT, @LoaiDichVu, @ThanhTien)
          `
          );

        // Tạo CTHD_DVSucKhoe
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("STT", sql.Int, 1)
          .input("MaDichVu", sql.Char(5), MaDichVu)
          .input("MaThuCung", sql.Char(5), MaThuCung)
          .query(
            `
            INSERT INTO dbo.CTHD_DVSucKhoe (MaHoaDon, STT, MaDichVu, MaThuCung)
            VALUES (@MaHoaDon, @STT, @MaDichVu, @MaThuCung)
          `
          );

        // Tạo CTHD_TiemPhong với các trường = NULL (trừ MaThuCung)
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("STT", sql.Int, 1)
          .input("MaThuCung", sql.Char(5), MaThuCung)
          .query(
            `
            INSERT INTO dbo.CTHD_TiemPhong (MaHoaDon, STT, MaThuCung, BacSi, MaVacXin, MaGoiDK)
            VALUES (@MaHoaDon, @STT, @MaThuCung, NULL, NULL, NULL)
          `
          );

        await transaction.commit();

        return {
          success: true,
          status: 201,
          message: "Ghi nhận tiêm phòng thành công",
          data: {
            maHoaDon,
            maThuCung: MaThuCung,
            trangThai: "Chờ cập nhật",
          },
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error creating vaccination record:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi ghi nhận tiêm phòng",
        error: error.message,
      };
    }
  }

  /**
   * Cập nhật hồ sơ tiêm phòng (chọn vaccine, bác sĩ)
   * Chỉ bác sĩ thú y mới được cập nhật
   * @param {string} maHoaDon
   * @param {string} stt
   * @param {string} maNhanVien
   * @param {object} updateData - { MaVacXin, MaGoiDK? }
   */
  async updateVaccinationRecord(maHoaDon, stt, maNhanVien, updateData) {
    const { MaVacXin, MaGoiDK } = updateData;

    // Kiểm tra nhân viên có phải bác sĩ không
    const isDoctor = await this.checkIsDoctor(maNhanVien);
    if (!isDoctor) {
      return {
        success: false,
        status: 403,
        message: "Chỉ bác sĩ thú y mới được cập nhật hồ sơ tiêm phòng",
      };
    }

    if (!MaVacXin) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: MaVacXin",
      };
    }

    try {
      const pool = await poolPromise;

      // Kiểm tra vaccine tồn tại
      const vaccineCheck = await pool
        .request()
        .input("MaVacXin", sql.NVarChar, MaVacXin)
        .query(
          `SELECT TOP 1 MaVacXin FROM dbo.VacXin WHERE MaVacXin = @MaVacXin`
        );

      if (vaccineCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy vaccine",
        };
      }

      // Kiểm tra hồ sơ tồn tại
      const recordCheck = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .input("STT", sql.Int, stt)
        .query(
          `
          SELECT TOP 1 MaHoaDon, STT
          FROM dbo.CTHD_TiemPhong
          WHERE MaHoaDon = @MaHoaDon
            AND STT = @STT
        `
        );

      if (recordCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy hồ sơ tiêm phòng",
        };
      }

      // Cập nhật hồ sơ
      const updateFields = [];
      const request = pool.request();

      request.input("MaHoaDon", sql.Char(8), maHoaDon);
      request.input("STT", sql.Int, stt);
      request.input("BacSi", sql.Char(5), maNhanVien);
      request.input("MaVacXin", sql.NVarChar, MaVacXin);

      updateFields.push("BacSi = @BacSi");
      updateFields.push("MaVacXin = @MaVacXin");

      if (MaGoiDK !== undefined && MaGoiDK !== null) {
        updateFields.push("MaGoiDK = @MaGoiDK");
        request.input("MaGoiDK", sql.Char(6), MaGoiDK);
      }

      await request.query(
        `
        UPDATE dbo.CTHD_TiemPhong
        SET ${updateFields.join(", ")}
        WHERE MaHoaDon = @MaHoaDon
          AND STT = @STT
      `
      );

      return {
        success: true,
        status: 200,
        message: "Cập nhật hồ sơ tiêm phòng thành công",
      };
    } catch (error) {
      console.error("Error updating vaccination record:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi cập nhật hồ sơ tiêm phòng",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách hồ sơ tiêm phòng chờ cập nhật
   * (lịch hẹn đã xác nhận nhưng chưa chọn vaccine)
   * @param {string} maChiNhanh
   */
  async getPendingVaccinationRecords(maChiNhanh) {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanh)
        .query(
          `
          SELECT DISTINCT
            tp.MaHoaDon,
            tp.STT,
            tp.MaThuCung,
            tc.TenThuCung,
            kh.MaKhachHang,
            kh.HoTen AS TenKhachHang,
            hd.NgayLap,
            dvsk.MaDichVu,
            dv.TenDichVu,
            lh.ThoiGianHen,
            lh.TrangThai AS TrangThaiLichHen
          FROM dbo.CTHD_TiemPhong tp
          INNER JOIN dbo.CTHD cthd ON tp.MaHoaDon = cthd.MaHoaDon AND tp.STT = cthd.STT
          INNER JOIN dbo.CTHD_DVSucKhoe dvsk ON tp.MaHoaDon = dvsk.MaHoaDon AND tp.STT = dvsk.STT
          INNER JOIN dbo.DichVu dv ON dvsk.MaDichVu = dv.MaDichVu
          INNER JOIN dbo.ThuCung tc ON tp.MaThuCung = tc.MaThuCung
          INNER JOIN dbo.KhachHang kh ON tc.MaKhachHang = kh.MaKhachHang
          INNER JOIN dbo.HoaDon hd ON tp.MaHoaDon = hd.MaHoaDon
          LEFT JOIN dbo.LichHen lh ON lh.MaKhachHang = kh.MaKhachHang
            AND lh.MaThuCung = tp.MaThuCung
            AND lh.LoaiDichVu = N'Tiêm phòng'
            AND lh.TrangThai = N'DaXacNhan'
          WHERE hd.MaChiNhanh = @MaChiNhanh
            AND tp.MaVacXin IS NULL
            AND hd.NhanVienLap IS NULL
          ORDER BY hd.NgayLap DESC, lh.ThoiGianHen ASC
        `
        );

      const records = result.recordset.map((record) => ({
        maHoaDon: record.MaHoaDon,
        stt: record.STT,
        maThuCung: record.MaThuCung,
        tenThuCung: record.TenThuCung,
        khachHang: {
          maKhachHang: record.MaKhachHang,
          tenKhachHang: record.TenKhachHang,
        },
        dichVu: {
          maDichVu: record.MaDichVu,
          tenDichVu: record.TenDichVu,
        },
        ngayLap: record.NgayLap
          ? record.NgayLap.toISOString().split("T")[0]
          : null,
        thoiGianHen: record.ThoiGianHen
          ? record.ThoiGianHen.toISOString()
          : null,
        trangThai: "Chờ cập nhật",
      }));

      return {
        success: true,
        status: 200,
        count: records.length,
        data: records,
      };
    } catch (error) {
      console.error("Error fetching pending vaccination records:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách hồ sơ tiêm phòng chờ cập nhật",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách vaccine có tồn kho > 0 tại chi nhánh
   * @param {string} maChiNhanh
   */
  async getAvailableVaccines(maChiNhanh) {
    try {
      const pool = await poolPromise;

      if (!maChiNhanh) {
        return {
          success: false,
          status: 400,
          message: "Mã chi nhánh không được để trống",
        };
      }

      const maChiNhanhFormatted = String(maChiNhanh).trim();

      const branchCheck = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
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
          message: `Không tìm thấy chi nhánh với mã: ${maChiNhanh}`,
        };
      }

      const result = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanhFormatted)
        .query(
          `
          SELECT 
            vx.MaVacXin,
            vx.TenVacXin,
            vx.GiaTien,
            tk.SoLuongTon AS SoLuongTonKho
          FROM dbo.VacXin vx
          INNER JOIN dbo.VacXin_TonKho tk 
            ON vx.MaVacXin = tk.MaVacXin AND tk.MaChiNhanh = @MaChiNhanh
          WHERE tk.SoLuongTon > 0
          ORDER BY vx.TenVacXin ASC
        `
        );

      const vaccines = result.recordset.map((item) => ({
        maVacXin: item.MaVacXin,
        tenVacXin: item.TenVacXin,
        giaTien: parseFloat(item.GiaTien),
        soLuongTonKho: item.SoLuongTonKho || 0,
      }));

      return {
        success: true,
        status: 200,
        data: {
          chiNhanh: {
            maChiNhanh: branchCheck.recordset[0].MaChiNhanh,
            tenChiNhanh: branchCheck.recordset[0].TenChiNhanh,
          },
          vaccines,
        },
      };
    } catch (error) {
      console.error("Error fetching available vaccines:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách vaccine",
        error: error.message,
      };
    }
  }
}

module.exports = new VaccinationsService();
