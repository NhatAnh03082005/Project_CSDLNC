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
   * @param {object} recordData - { MaKhachHang, MaChiNhanh, MaThuCung }
   */
  async createMedicalRecord(recordData) {
    console.log('[createMedicalRecord] recordData:', recordData);
    
    const { MaKhachHang, MaChiNhanh, MaThuCung } = recordData;  // MaThuCung là INT

    if (!MaKhachHang || !MaChiNhanh || MaThuCung === undefined || MaThuCung === null) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: MaKhachHang, MaChiNhanh, MaThuCung",
      };
    }

    // Đảm bảo các giá trị đúng kiểu
    const maKhachHangStr = String(MaKhachHang).trim();
    const maChiNhanhStr = String(MaChiNhanh).trim();
    const maThuCungInt = parseInt(MaThuCung, 10);

    const LoaiDichVu = "Khám bệnh"; // Loại dịch vụ cố định cho khám bệnh

    try {
      const pool = await poolPromise;
      const transaction = new sql.Transaction(pool);

      await transaction.begin();

      try {
        // Kiểm tra khách hàng
        const customerCheck = await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), maKhachHangStr)
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

        // Kiểm tra thú cưng bằng (MaKhachHang, MaThuCung)
        const petCheck = await transaction
          .request()
          .input("MaThuCung", sql.Int, maThuCungInt)
          .input("MaKhachHang", sql.Char(7), maKhachHangStr)
          .query(
            `
            SELECT TOP 1 MaThuCung, TenThuCung
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

        // Tạo hóa đơn với NhanVienLap = NULL (trigger TRG_AUTO_MaHoaDon sẽ tự động sinh MaHoaDon)
        // Lưu ý: trigger yêu cầu NhanVienLap để lấy MaChiNhanh, nhưng ta set NULL
        // Do đó cần insert trực tiếp với MaChiNhanh
        await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), maKhachHangStr)
          .input("MaChiNhanh", sql.Char(4), maChiNhanhStr)
          .query(
            `
            DECLARE @MaxID INT;
            SELECT @MaxID = ISNULL(MAX(CAST(RIGHT(MaHoaDon, 6) AS INT)), 0) FROM HoaDon;
            
            INSERT INTO dbo.HoaDon (MaHoaDon, MaKhachHang, NgayLap, TongTien, HinhThucThanhToan, MaKhuyenMai, NhanVienLap, MaChiNhanh)
            VALUES ('HD' + RIGHT('000000' + CAST(@MaxID + 1 AS VARCHAR(6)), 6), @MaKhachHang, GETDATE(), 0, NULL, NULL, NULL, @MaChiNhanh)
          `
          );

        // Lấy MaHoaDon vừa tạo
        const invoiceResult = await transaction
          .request()
          .input("MaKhachHang", sql.Char(7), maKhachHangStr)
          .input("MaChiNhanh", sql.Char(4), maChiNhanhStr)
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

        // Tạo CTHD (trigger TRG_AUTO_STT_CTHD sẽ tự động sinh STT)
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("LoaiDichVu", sql.NVarChar(20), LoaiDichVu)
          .query(
            `
            DECLARE @MaxSTT INT;
            SELECT @MaxSTT = ISNULL(MAX(STT), 0) FROM CTHD WHERE MaHoaDon = @MaHoaDon;
            
            INSERT INTO dbo.CTHD (MaHoaDon, STT, LoaiDichVu, ThanhTien)
            VALUES (@MaHoaDon, @MaxSTT + 1, @LoaiDichVu, 0)
          `
          );

        // Lấy STT vừa tạo
        const sttResult = await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .query(`SELECT MAX(STT) AS STT FROM dbo.CTHD WHERE MaHoaDon = @MaHoaDon`);
        
        const stt = sttResult.recordset[0].STT;

        // Tạo CTHD_DVSucKhoe (BacSi = NULL ban đầu, sẽ được cập nhật sau)
        // Schema: (MaHoaDon, STT, MaKhachHang, MaThuCung, BacSi, LoaiDichVuSK)
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("STT", sql.Int, stt)
          .input("MaKhachHang", sql.Char(7), maKhachHangStr)
          .input("MaThuCung", sql.Int, maThuCungInt)
          .input("LoaiDichVuSK", sql.NVarChar(20), LoaiDichVu)
          .query(
            `
            INSERT INTO dbo.CTHD_DVSucKhoe (MaHoaDon, STT, MaKhachHang, MaThuCung, BacSi, LoaiDichVuSK)
            VALUES (@MaHoaDon, @STT, @MaKhachHang, @MaThuCung, NULL, @LoaiDichVuSK)
          `
          );

        // Tạo CTHD_KhamBenh với các trường = NULL
        // Schema: (MaHoaDon, STT, TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham)
        await transaction
          .request()
          .input("MaHoaDon", sql.Char(8), maHoaDon)
          .input("STT", sql.Int, stt)
          .query(
            `
            INSERT INTO dbo.CTHD_KhamBenh (MaHoaDon, STT, TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham)
            VALUES (@MaHoaDon, @STT, NULL, NULL, NULL, NULL)
          `
          );

        await transaction.commit();

        return {
          success: true,
          status: 201,
          message: "Tạo hồ sơ khám bệnh thành công",
          data: {
            maHoaDon,
            maThuCung: maThuCungInt,
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

      if (TrieuChung !== undefined) {
        updateFields.push("TrieuChung = @TrieuChung");
        request.input("TrieuChung", sql.NVarChar(50), TrieuChung);
      }

      if (ChanDoan !== undefined) {
        updateFields.push("ChanDoan = @ChanDoan");
        request.input("ChanDoan", sql.NVarChar(50), ChanDoan);
      }

      if (ToaThuoc !== undefined) {
        updateFields.push("ToaThuoc = @ToaThuoc");
        request.input("ToaThuoc", sql.NVarChar(30), ToaThuoc);
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

      // Cập nhật CTHD_KhamBenh (TrieuChung, ChanDoan, ToaThuoc, NgayTaiKham)
      await request.query(
        `
        UPDATE dbo.CTHD_KhamBenh
        SET ${updateFields.join(", ")}
        WHERE MaHoaDon = @MaHoaDon
          AND STT = @STT
      `
      );

      // Cập nhật BacSi trong CTHD_DVSucKhoe (theo schema, BacSi nằm ở đây)
      await pool
        .request()
        .input("MaHoaDon", sql.Char(8), maHoaDon)
        .input("STT", sql.Int, stt)
        .input("BacSi", sql.Char(5), maNhanVien)
        .query(
          `
          UPDATE dbo.CTHD_DVSucKhoe
          SET BacSi = @BacSi
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
   * (hồ sơ đã tạo nhưng chưa có thông tin khám - TrieuChung/ChanDoan = NULL)
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
            dvsk.MaKhachHang,
            dvsk.MaThuCung,
            tc.TenThuCung,
            tc.Loai AS LoaiThuCung,
            tc.Giong AS GiongThuCung,
            kh.HoTen AS TenKhachHang,
            kh.SDT AS SDTKhachHang,
            hd.NgayLap,
            dvsk.LoaiDichVuSK AS LoaiDichVu
          FROM dbo.CTHD_KhamBenh kb
          INNER JOIN dbo.CTHD_DVSucKhoe dvsk ON kb.MaHoaDon = dvsk.MaHoaDon AND kb.STT = dvsk.STT
          INNER JOIN dbo.ThuCung tc ON dvsk.MaKhachHang = tc.MaKhachHang AND dvsk.MaThuCung = tc.MaThuCung
          INNER JOIN dbo.KhachHang kh ON dvsk.MaKhachHang = kh.MaKhachHang
          INNER JOIN dbo.HoaDon hd ON kb.MaHoaDon = hd.MaHoaDon
          WHERE hd.MaChiNhanh = @MaChiNhanh
            AND (kb.TrieuChung IS NULL OR kb.ChanDoan IS NULL)
          ORDER BY hd.NgayLap DESC
        `
        );

      const records = result.recordset.map((record) => ({
        maHoaDon: record.MaHoaDon?.trim(),
        stt: record.STT,
        maKhachHang: record.MaKhachHang?.trim(),
        maThuCung: record.MaThuCung,
        tenThuCung: record.TenThuCung?.trim(),
        loaiThuCung: record.LoaiThuCung?.trim(),
        giongThuCung: record.GiongThuCung?.trim(),
        tenKhachHang: record.TenKhachHang?.trim(),
        sdtKhachHang: record.SDTKhachHang?.trim(),
        ngayLap: record.NgayLap
          ? record.NgayLap.toISOString().split("T")[0]
          : null,
        loaiDichVu: record.LoaiDichVu?.trim(),
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

