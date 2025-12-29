const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class ReportsService {
  /**
   * Helper to get date filter based on time unit and value
   */
  getDateFilter(timeUnit, timeValue) {
    let date = new Date();
    const value = parseInt(timeValue) || 1;

    switch (timeUnit) {
      case "month":
        date.setMonth(date.getMonth() - value);
        break;
      case "quarter":
        date.setMonth(date.getMonth() - value * 3);
        break;
      case "year":
        date.setFullYear(date.getFullYear() - value);
        break;
      default:
        date.setMonth(date.getMonth() - 1);
    }
    return date;
  }

  async getRevenueStats(timeUnit, timeValue) {
    try {
      const pool = await poolPromise;
      const startDate = this.getDateFilter(timeUnit, timeValue);

      const result = await pool
        .request()
        .input("startDate", sql.Date, startDate).query(`
          SELECT 
            cn.MaChiNhanh,
            cn.TenChiNhanh, 
            cn.SoNha,
            cn.TenDuong,
            cn.Phuong,
            cn.ThanhPho,
            SUM(cthd.ThanhTien) as revenue,
            SUM(CASE WHEN cthd.LoaiDichVu = N'Mua hàng' THEN cthd.ThanhTien ELSE 0 END) as salesRevenue,
            SUM(CASE WHEN cthd.LoaiDichVu = N'Khám bệnh' THEN cthd.ThanhTien ELSE 0 END) as medicalRevenue,
            SUM(CASE WHEN cthd.LoaiDichVu = N'Tiêm phòng' THEN cthd.ThanhTien ELSE 0 END) as vaccineRevenue
          FROM ChiNhanh cn
          LEFT JOIN HoaDon hd ON cn.MaChiNhanh = hd.MaChiNhanh AND hd.NgayLap >= @startDate
          LEFT JOIN CTHD cthd ON hd.MaHoaDon = cthd.MaHoaDon
          GROUP BY cn.MaChiNhanh, cn.TenChiNhanh, cn.SoNha, cn.TenDuong, cn.Phuong, cn.ThanhPho
          ORDER BY revenue DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error("Error in getRevenueStats:", error);
      throw error;
    }
  }

  async getProductStats(timeUnit, timeValue) {
    try {
      const pool = await poolPromise;
      const startDate = this.getDateFilter(timeUnit, timeValue);

      const result = await pool
        .request()
        .input("startDate", sql.Date, startDate).query(`
          WITH ProductUsage AS (
            SELECT 
              hd.MaChiNhanh,
              cthd.MaSanPham,
              SUM(cthd.SoLuong) as usage_count
            FROM CTHD_MuaHang cthd
            JOIN HoaDon hd ON cthd.MaHoaDon = hd.MaHoaDon
            WHERE hd.NgayLap >= @startDate
            GROUP BY hd.MaChiNhanh, cthd.MaSanPham
          ),
          RankedUsage AS (
            SELECT 
              pu.*,
              sp.TenSanPham,
              ROW_NUMBER() OVER(PARTITION BY pu.MaChiNhanh ORDER BY pu.usage_count DESC) as rank_desc,
              ROW_NUMBER() OVER(PARTITION BY pu.MaChiNhanh ORDER BY pu.usage_count ASC) as rank_asc
            FROM ProductUsage pu
            JOIN SanPham sp ON pu.MaSanPham = sp.MaSanPham
          )
          SELECT 
            cn.MaChiNhanh,
            cn.TenChiNhanh, 
            cn.SoNha,
            cn.TenDuong,
            cn.Phuong,
            cn.ThanhPho,
            cn.TenChiNhanh,
            m.TenSanPham as mostUsed,
            m.usage_count as count,
            l.TenSanPham as leastUsed,
            l.usage_count as leastCount
          FROM ChiNhanh cn
          LEFT JOIN RankedUsage m ON cn.MaChiNhanh = m.MaChiNhanh AND m.rank_desc = 1
          LEFT JOIN RankedUsage l ON cn.MaChiNhanh = l.MaChiNhanh AND l.rank_asc = 1
        `);

      return result.recordset;
    } catch (error) {
      console.error("Error in getProductStats:", error);
      throw error;
    }
  }

  async getVaccineStats(timeUnit, timeValue) {
    try {
      const pool = await poolPromise;
      const startDate = this.getDateFilter(timeUnit, timeValue);

      // Get most used vaccine per branch
      const mostUsed = await pool
        .request()
        .input("startDate", sql.Date, startDate).query(`
          WITH VaccineUsage AS (
            SELECT 
              MaChiNhanh,
              MaVacXin,
              COUNT(*) as usage_count
            FROM CTHD_TiemPhong cthd_tp
            JOIN HoaDon hd ON cthd_tp.MaHoaDon = hd.MaHoaDon
            WHERE NgayLap >= @startDate
            GROUP BY MaChiNhanh, MaVacXin
          ),
          RankedUsage AS (
            SELECT 
              vu.*,
              vx.TenVacXin,
              ROW_NUMBER() OVER(PARTITION BY vu.MaChiNhanh ORDER BY vu.usage_count DESC) as rank_desc,
              ROW_NUMBER() OVER(PARTITION BY vu.MaChiNhanh ORDER BY vu.usage_count ASC) as rank_asc
            FROM VaccineUsage vu
            JOIN VacXin vx ON vu.MaVacXin = vx.MaVacXin
          )
          SELECT 
            cn.MaChiNhanh,
            cn.TenChiNhanh, 
            cn.SoNha,
            cn.TenDuong,
            cn.Phuong,
            cn.ThanhPho,
            cn.TenChiNhanh,
            m.TenVacXin as mostUsed,
            m.usage_count as count,
            l.TenVacXin as leastUsed,
            l.usage_count as leastCount
          FROM ChiNhanh cn
          LEFT JOIN RankedUsage m ON cn.MaChiNhanh = m.MaChiNhanh AND m.rank_desc = 1
          LEFT JOIN RankedUsage l ON cn.MaChiNhanh = l.MaChiNhanh AND l.rank_asc = 1
        `);

      return mostUsed.recordset;
    } catch (error) {
      console.error("Error in getVaccineStats:", error);
      throw error;
    }
  }

  async getServiceStats(timeUnit, timeValue) {
    try {
      const pool = await poolPromise;
      const startDate = this.getDateFilter(timeUnit, timeValue);

      // Get most used service per branch (from KhamBenh)
      const result = await pool
        .request()
        .input("startDate", sql.Date, startDate).query(`
          WITH ServiceUsage AS (
            SELECT 
              hd.MaChiNhanh,
              CTHD.LoaiDichVu,
              COUNT(*) as usage_count
            FROM CTHD 
            JOIN HoaDon hd ON CTHD.MaHoaDon = hd.MaHoaDon
            WHERE NgayLap >= @startDate
            GROUP BY hd.MaChiNhanh, CTHD.LoaiDichVu
          ),
          RankedUsage AS (
            SELECT *,
              ROW_NUMBER() OVER(PARTITION BY MaChiNhanh ORDER BY usage_count DESC) as rank_desc,
              ROW_NUMBER() OVER(PARTITION BY MaChiNhanh ORDER BY usage_count ASC) as rank_asc
            FROM ServiceUsage
          )
          SELECT 
            cn.MaChiNhanh,
            cn.TenChiNhanh, 
            cn.SoNha,
            cn.TenDuong,
            cn.Phuong,
            cn.ThanhPho,
            cn.TenChiNhanh,
            m.LoaiDichVu as mostUsed,
            m.usage_count as count,
            l.LoaiDichVu as leastUsed,
            l.usage_count as leastCount
          FROM ChiNhanh cn
          LEFT JOIN RankedUsage m ON cn.MaChiNhanh = m.MaChiNhanh AND m.rank_desc = 1
          LEFT JOIN RankedUsage l ON cn.MaChiNhanh = l.MaChiNhanh AND l.rank_asc = 1
        `);

      return result.recordset;
    } catch (error) {
      console.error("Error in getServiceStats:", error);
      throw error;
    }
  }

  async getCustomerStats() {
    try {
      const pool = await poolPromise;

      const result = await pool.request().query(`

        DECLARE @FromDate DATE = DATEADD(DAY, -30, CAST(GETDATE() AS DATE));  -- 30 ngày gần nhất

        ;WITH CustomerActivity AS (
            SELECT
                hd.MaChiNhanh,
                hd.MaKhachHang,
                MIN(hd.NgayLap) AS FirstVisitDate,
                MAX(hd.NgayLap) AS LastVisitDate
            FROM HoaDon hd
            WHERE hd.MaKhachHang IS NOT NULL
              AND hd.MaChiNhanh IS NOT NULL
            GROUP BY hd.MaChiNhanh, hd.MaKhachHang
        ),
        CustomersInLast30Days AS (
            SELECT DISTINCT
                hd.MaChiNhanh,
                hd.MaKhachHang
            FROM HoaDon hd
            WHERE hd.NgayLap >= @FromDate
              AND hd.MaKhachHang IS NOT NULL
              AND hd.MaChiNhanh IS NOT NULL
        )
        SELECT
            cn.MaChiNhanh,
            cn.TenChiNhanh,

            -- Tổng KH của chi nhánh (từ hóa đơn)
            COUNT(ca.MaKhachHang) AS TongSoKhachHang,

            -- KH chưa quay lại 30 ngày (lần cuối < hôm nay - 30)
            SUM(CASE
                WHEN ca.LastVisitDate < @FromDate THEN 1 ELSE 0
            END) AS TongKhachHangLauChuaQuayLai,

            -- KH mới trong 30 ngày (lần đầu >= hôm nay - 30)
            SUM(CASE
                WHEN ca.FirstVisitDate >= @FromDate THEN 1 ELSE 0
            END) AS TongKhachHangMoi

        FROM ChiNhanh cn
        LEFT JOIN CustomerActivity ca
              ON ca.MaChiNhanh = cn.MaChiNhanh
        LEFT JOIN CustomersInLast30Days c30
              ON c30.MaChiNhanh = cn.MaChiNhanh
              AND c30.MaKhachHang = ca.MaKhachHang

        GROUP BY cn.MaChiNhanh, cn.TenChiNhanh
        ORDER BY cn.MaChiNhanh;
      `);

      return result.recordset;
    } catch (error) {
      console.error("Error in getCustomerStats:", error);
      throw error;
    }
  }

  async getPerformanceStats() {
    try {
      const pool = await poolPromise;

      const result = await pool.request().query(`
        SELECT
          bs.MaNhanVien,
          bs.HoTen,
          ISNULL(SUM(CASE WHEN ct.LoaiDichVuSK = N'Khám bệnh' THEN 1 ELSE 0 END), 0) AS SoLuotKham,
          ISNULL(SUM(CASE WHEN ct.LoaiDichVuSK = N'Tiêm phòng' THEN 1 ELSE 0 END), 0) AS SoLuotTiem,
          ISNULL(COUNT(ct.MaHoaDon), 0) AS TongSoLuotLamViec,
          CAST(ISNULL(AVG(CAST(dg.DiemTongThe AS FLOAT)), 0) AS DECIMAL(5,2)) AS DiemTongTheTB
        FROM NhanVien bs
        LEFT JOIN CTHD_DVSucKhoe ct ON ct.BacSi = bs.MaNhanVien
        LEFT JOIN DanhGia dg ON dg.MaHoaDon = ct.MaHoaDon 
                                AND dg.STT = ct.STT
        WHERE bs.ViTri = N'Bác sĩ thú y'
        GROUP BY bs.MaNhanVien, bs.HoTen
        ORDER BY TongSoLuotLamViec DESC, DiemTongTheTB DESC, bs.MaNhanVien;
      `);

      return result.recordset;
    } catch (error) {
      console.error("Error in getPerformanceStats:", error);
      throw error;
    }
  }
}

module.exports = new ReportsService();
