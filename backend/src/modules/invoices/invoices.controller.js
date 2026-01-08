const invoicesService = require("./invoices.service");
const sql = require("mssql");
const { poolPromise } = require("../../config/database");

class InvoicesController {
  /**
   * Tạo hóa đơn mới
   * POST /api/invoices
   */
  async createInvoice(req, res, next) {
    try {
      const invoiceData = req.body;
      const response = await invoicesService.createInvoice(invoiceData);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách hóa đơn chờ xác nhận
   * GET /api/invoices/pending
   */
  async getPendingInvoices(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      // Lấy chi nhánh từ database
      const { poolPromise } = require("../../config/database");
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(
          `SELECT TOP 1 MaChiNhanh FROM dbo.NhanVien WHERE MaNhanVien = @MaNhanVien`
        );
      
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
        });
      }
      
      const maChiNhanh = result.recordset[0].MaChiNhanh;
      const response = await invoicesService.getPendingInvoices(maChiNhanh);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xác nhận đơn hàng
   * PUT /api/invoices/:id/confirm
   */
  async confirmInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const { hinhThucThanhToan } = req.body;
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const response = await invoicesService.confirmInvoice(id, maNhanVien, hinhThucThanhToan);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết hóa đơn
   * GET /api/invoices/:id
   */
  async getInvoiceDetails(req, res, next) {
    try {
      const { id } = req.params;
      const response = await invoicesService.getInvoiceDetails(id);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm sản phẩm vào hóa đơn
   * POST /api/invoices/:id/products
   */
  async addProductToInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const { products } = req.body;
      const maNhanVien = req.user?.maNhanVien;

      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }

      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("MaNhanVien", sql.Char(5), maNhanVien)
        .query(`SELECT TOP 1 MaChiNhanh FROM dbo.NhanVien WHERE MaNhanVien = @MaNhanVien`);
      
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nhân viên",
        });
      }
      
      const maChiNhanh = result.recordset[0].MaChiNhanh;
      const response = await invoicesService.addProductToInvoice(id, maChiNhanh, products);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoicesController();

