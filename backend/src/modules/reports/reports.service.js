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
        .input("startDate", sql.Date, startDate)
        .execute("dbo.sp_ThongKeDoanhThu_TheoChiNhanh");

      // Convert bigint values to numbers safely
      const data = result.recordset.map((row) => ({
        ...row,
        revenue: Number(row.revenue) || 0,
        salesRevenue: Number(row.salesRevenue) || 0,
        medicalRevenue: Number(row.medicalRevenue) || 0,
        vaccineRevenue: Number(row.vaccineRevenue) || 0,
      }));

      return data;
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
        .input("startDate", sql.Date, startDate)
        .execute("dbo.sp_ThongKeSanPham_TheoChiNhanh");

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
        .input("startDate", sql.Date, startDate)
        .execute("dbo.sp_ThongKeVacXin_TheoChiNhanh");

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
        .input("startDate", sql.Date, startDate)
        .execute("dbo.sp_ThongKeDichVu_TheoChiNhanh");

      return result.recordset;
    } catch (error) {
      console.error("Error in getServiceStats:", error);
      throw error;
    }
  }

  async getCustomerStats() {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .execute("dbo.sp_ThongKeKhachHang_TheoChiNhanh");

      return result.recordset;
    } catch (error) {
      console.error("Error in getCustomerStats:", error);
      throw error;
    }
  }

  async getPerformanceStats() {
    try {
      const pool = await poolPromise;

      const result = await pool
        .request()
        .execute("dbo.sp_ThongKeHieuSuatNhanVien");

      return result.recordset;
    } catch (error) {
      console.error("Error in getPerformanceStats:", error);
      throw error;
    }
  }
}

module.exports = new ReportsService();
