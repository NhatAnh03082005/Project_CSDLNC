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
      const { TenVacXin, HangSanXuat, GiaTien } = vaccineData;

      if (!TenVacXin || !HangSanXuat || !GiaTien) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const insertResult = await pool
        .request()
        .input("TenVacXin", sql.NVarChar, TenVacXin)
        .input("GiaTien", sql.Int, GiaTien).query(`
          INSERT INTO VacXin (TenVacXin, GiaTien)
          VALUES (@TenVacXin, @GiaTien);
          SELECT SCOPE_IDENTITY() AS MaVacXin;
        `);

      const maVacXin = insertResult.recordset[0].MaVacXin;
      return await this.getVaccineById(maVacXin);
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
    const { LoaiGoi } = subscriptionData;

    if (!LoaiGoi) {
      return {
        success: false,
        status: 400,
        message: "Thiếu thông tin bắt buộc: LoaiGoi",
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

      return {
        success: true,
        status: 201,
        message: "Đăng ký gói tiêm phòng thành công",
        data: newSubscription.recordset[0],
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
}

module.exports = new VaccinationsService();
