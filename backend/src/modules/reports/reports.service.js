const sql = require("mssql");
const { poolPromise } = require("../../config/database");
const employeesService = require("../employees/employees.service");

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

      // Lấy thống kê theo chi nhánh từ stored procedure
      const branchResult = await pool
        .request()
        .execute("dbo.sp_ThongKeKhachHang_TheoChiNhanh");

      const branches = branchResult.recordset;

      // Lấy tất cả khách hàng từ employeesService.getAllCustomers
      // Sử dụng limit lớn để lấy tất cả
      const allCustomersResponse = await employeesService.getAllCustomers({
        page: 1,
        limit: 999999,
      });

      // Đếm tổng số khách hàng unique bằng length
      const totalCustomers = allCustomersResponse.success
        ? allCustomersResponse.data.customers.length
        : 0;

      // Đếm khách hàng mới (có hóa đơn trong 30 ngày gần đây và không có hóa đơn trước đó)
      const newCustomersResult = await pool.request().query(`
          SELECT COUNT(DISTINCT hd.MaKhachHang) AS NewCustomers
          FROM dbo.HoaDon hd
          WHERE hd.NgayLap >= DATEADD(DAY, -30, GETDATE())
          AND hd.MaKhachHang NOT IN (
            SELECT DISTINCT MaKhachHang 
            FROM dbo.HoaDon 
            WHERE NgayLap < DATEADD(DAY, -30, GETDATE())
          )
        `);

      const totalNewCustomers = newCustomersResult.recordset[0].NewCustomers;

      // Đếm khách hàng lâu chưa quay lại (không có hóa đơn trong 90 ngày)
      const inactiveCustomersResult = await pool.request().query(`
          SELECT COUNT(DISTINCT kh.MaKhachHang) AS InactiveCustomers
          FROM dbo.KhachHang kh
          WHERE EXISTS (
            SELECT 1 FROM dbo.HoaDon hd 
            WHERE hd.MaKhachHang = kh.MaKhachHang
          )
          AND NOT EXISTS (
            SELECT 1 FROM dbo.HoaDon hd 
            WHERE hd.MaKhachHang = kh.MaKhachHang
            AND hd.NgayLap >= DATEADD(DAY, -90, GETDATE())
          )
        `);

      const totalInactiveCustomers =
        inactiveCustomersResult.recordset[0].InactiveCustomers;

      return {
        branches: branches,
        totalCustomers: totalCustomers,
        totalNewCustomers: totalNewCustomers,
        totalInactiveCustomers: totalInactiveCustomers,
      };
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
