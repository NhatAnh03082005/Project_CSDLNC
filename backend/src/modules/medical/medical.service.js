const sql = require("mssql");
const { poolPromise } = require("../../config/database");
const { POINTS_PER_VND } = require("../../config/constants");

class MedicalService {
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
   * Tạo hồ sơ khám bệnh (tạo HoaDon + CTHD + CTHD_DVSucKhoe + CTHD_KhamBenh)
   * NhanVienLap = NULL, các trường trong CTHD_KhamBenh = NULL
   * @param {object} recordData - { MaKhachHang, MaChiNhanh, MaThuCung, MaDichVu }
   */
  async createMedicalRecord(recordData) {
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

        // Tạo CTHD_KhamBenh với các trường = NULL
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("STT", sql.Int, 1)
          .input("MaThuCung", sql.Char(5), MaThuCung)
          .query(
            `
            INSERT INTO dbo.CTHD_KhamBenh (MaHoaDon, STT, MaThuCung, BacSi, TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham)
            VALUES (@MaHoaDon, @STT, @MaThuCung, NULL, NULL, NULL, NULL, NULL)
          `
          );

        await transaction.commit();

        return {
          success: true,
          status: 201,
          message: "Tạo hồ sơ khám bệnh thành công",
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
      console.error("Error creating medical record:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi tạo hồ sơ khám bệnh",
        error: error.message,
      };
    }
  }

  /**
   * Cập nhật hồ sơ khám bệnh (triệu chứng, chẩn đoán, toa thuốc, ngày tái khám)
   * Chỉ bác sĩ thú y mới được cập nhật
   * @param {string} maHoaDon
   * @param {string} stt
   * @param {string} maNhanVien
   * @param {object} updateData - { TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham }
   */
  async updateMedicalRecord(maHoaDon, stt, maNhanVien, updateData) {
    const { TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham } = updateData;

    // Kiểm tra nhân viên có phải bác sĩ không
    const isDoctor = await this.checkIsDoctor(maNhanVien);
    if (!isDoctor) {
      return {
        success: false,
        status: 403,
        message: "Chỉ bác sĩ thú y mới được cập nhật hồ sơ khám bệnh",
      };
    }

    try {
      const pool = await poolPromise;

      // Kiểm tra hồ sơ tồn tại
      const recordCheck = await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .input("STT", sql.Int, stt)
        .query(
          `
          SELECT TOP 1 MaHoaDon, STT
          FROM dbo.CTHD_KhamBenh
          WHERE MaHoaDon = @MaHoaDon
            AND STT = @STT
        `
        );

      if (recordCheck.recordset.length === 0) {
        return {
          success: false,
          status: 404,
          message: "Không tìm thấy hồ sơ khám bệnh",
        };
      }

      // Cập nhật hồ sơ
      const updateFields = [];
      const request = pool.request();

      request.input("MaHoaDon", sql.Char(8), maHoaDon);
      request.input("STT", sql.Int, stt);
      request.input("BacSi", sql.Char(5), maNhanVien);

      if (TrieuChung !== undefined) {
        updateFields.push("TrieuChung = @TrieuChung");
        request.input("TrieuChung", sql.NVarChar(sql.MAX), TrieuChung);
      }

      if (ChanDoan !== undefined) {
        updateFields.push("ChanDoan = @ChanDoan");
        request.input("ChanDoan", sql.NVarChar(sql.MAX), ChanDoan);
      }

      if (ToaThuoc !== undefined) {
        updateFields.push("ToaThuoc = @ToaThuoc");
        request.input("ToaThuoc", sql.NVarChar(sql.MAX), ToaThuoc);
      }

      if (NgayTaiKham !== undefined && NgayTaiKham !== null) {
        updateFields.push("NgayTaiKham = @NgayTaiKham");
        request.input("NgayTaiKham", sql.Date, NgayTaiKham);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          status: 400,
          message: "Không có thông tin nào để cập nhật",
        };
      }

      updateFields.push("BacSi = @BacSi");

      await request.query(
        `
        UPDATE dbo.CTHD_KhamBenh
        SET ${updateFields.join(", ")}
        WHERE MaHoaDon = @MaHoaDon
          AND STT = @STT
      `
      );

      return {
        success: true,
        status: 200,
        message: "Cập nhật hồ sơ khám bệnh thành công",
      };
    } catch (error) {
      console.error("Error updating medical record:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi cập nhật hồ sơ khám bệnh",
        error: error.message,
      };
    }
  }

  /**
   * Lấy danh sách hồ sơ khám bệnh chờ cập nhật
   * (lịch hẹn đã xác nhận nhưng chưa có thông tin khám)
   * @param {string} maChiNhanh
   */
  async getPendingMedicalRecords(maChiNhanh) {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("MaChiNhanh", sql.Char(4), maChiNhanh)
        .query(
          `
          SELECT DISTINCT
            kb.MaHoaDon,
            kb.STT,
            kb.MaThuCung,
            tc.TenThuCung,
            kh.MaKhachHang,
            kh.HoTen AS TenKhachHang,
            hd.NgayLap,
            dvsk.MaDichVu,
            dv.TenDichVu,
            lh.ThoiGianHen,
            lh.TrangThai AS TrangThaiLichHen
          FROM dbo.CTHD_KhamBenh kb
          INNER JOIN dbo.CTHD cthd ON kb.MaHoaDon = cthd.MaHoaDon AND kb.STT = cthd.STT
          INNER JOIN dbo.CTHD_DVSucKhoe dvsk ON kb.MaHoaDon = dvsk.MaHoaDon AND kb.STT = dvsk.STT
          INNER JOIN dbo.DichVu dv ON dvsk.MaDichVu = dv.MaDichVu
          INNER JOIN dbo.ThuCung tc ON kb.MaThuCung = tc.MaThuCung
          INNER JOIN dbo.KhachHang kh ON tc.MaKhachHang = kh.MaKhachHang
          INNER JOIN dbo.HoaDon hd ON kb.MaHoaDon = hd.MaHoaDon
          LEFT JOIN dbo.LichHen lh ON lh.MaKhachHang = kh.MaKhachHang
            AND lh.MaThuCung = kb.MaThuCung
            AND lh.LoaiDichVu = N'Khám bệnh'
            AND lh.TrangThai = N'DaXacNhan'
          WHERE hd.MaChiNhanh = @MaChiNhanh
            AND (kb.TrieuChung IS NULL OR kb.ChanDoan IS NULL)
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
      console.error("Error fetching pending medical records:", error);
      return {
        success: false,
        status: 500,
        message: "Lỗi khi lấy danh sách hồ sơ khám bệnh chờ cập nhật",
        error: error.message,
      };
    }
  }
}

module.exports = new MedicalService();

