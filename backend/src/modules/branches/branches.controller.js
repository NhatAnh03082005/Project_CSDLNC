const branchesService = require("./branches.service");

class BranchesController {
  // Merge logic: Hỗ trợ cả phân trang (HEAD) và lấy tất cả (admin)
  async getBranches(req, res, next) {
    try {
      const { page, limit, search, service } = req.query;

      // Nếu không có tham số phân trang, có thể coi là yêu cầu lấy tất cả (cho admin)
      if (!page && !limit && !search && !service) {
        const branches = await branchesService.getAllBranches();
        return res.json({ success: true, data: branches });
      }

      // Logic filter từ HEAD
      let serviceFilter = null;
      if (service === "exam") serviceFilter = "Khám bệnh";
      else if (service === "vaccination") serviceFilter = "Tiêm phòng";
      else if (service === "products") serviceFilter = "Mua hàng";
      else if (service) serviceFilter = service;

      const response = await branchesService.getBranches({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 6,
        search,
        service: serviceFilter,
      });

      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getBranchById(req, res, next) {
    try {
      const { id } = req.params;
      const response = await branchesService.getBranchById(id);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // Các phương thức Admin giữ nguyên từ origin/feature/admin
  async createBranch(req, res, next) {
    try {
      const branchData = req.body;
      const newBranch = await branchesService.createBranch(branchData);
      res.status(201).json({ success: true, data: newBranch });
    } catch (error) {
      next(error);
    }
  }

  async updateBranch(req, res, next) {
    try {
      const { id } = req.params;
      const updatedBranch = await branchesService.updateBranch(id, req.body);
      res.json({ success: true, data: updatedBranch });
    } catch (error) {
      next(error);
    }
  }

  // ... (Giữ lại các hàm getProductsStockByBranch, addProductToStock, v.v. từ bản admin)
  async getProductsStockByBranch(req, res, next) {
    try {
      const { id } = req.params;
      const productsStock = await branchesService.getProductsStockByBranch(id);
      res.json({ success: true, data: productsStock });
    } catch (error) {
      next(error);
    }
  }

  async addProductToStock(req, res, next) {
    try {
      const { id } = req.params;
      const newStock = await branchesService.addProductToStock(id, req.body);
      res.status(201).json({ success: true, data: newStock });
    } catch (error) {
      next(error);
    }
  }

  async updateProductQty(req, res, next) {
    try {
      const { id, maSanPham } = req.params;
      const updated = await branchesService.updateProductQty(
        id,
        maSanPham,
        req.body
      );
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async getVaccinesStockByBranch(req, res, next) {
    try {
      const { id } = req.params;
      const vaccinesStock = await branchesService.getVaccinesStockByBranch(id);
      res.json({ success: true, data: vaccinesStock });
    } catch (error) {
      next(error);
    }
  }

  async addVaccineToStock(req, res, next) {
    try {
      const { id } = req.params;
      const newStock = await branchesService.addVaccineToStock(id, req.body);
      res.status(201).json({ success: true, data: newStock });
    } catch (error) {
      next(error);
    }
  }

  async updateVaccineQty(req, res, next) {
    try {
      const { id, maVacXin } = req.params;
      const updated = await branchesService.updateVaccineQty(
        id,
        maVacXin,
        req.body
      );
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async getServicesByBranch(req, res, next) {
    try {
      const services = await branchesService.getServicesByBranch(req.params.id);
      res.json({ success: true, data: services });
    } catch (error) {
      next(error);
    }
  }

  async addServiceToBranch(req, res, next) {
    try {
      const newService = await branchesService.addServiceToBranch(
        req.params.id,
        req.body
      );
      res.status(201).json({ success: true, data: newService });
    } catch (error) {
      next(error);
    }
  }

  async deleteServiceFromBranch(req, res, next) {
    try {
      const deleted = await branchesService.deleteServiceFromBranch(
        req.params.id,
        req.params.loaiDichVu
      );
      res.json({ success: true, data: deleted });
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployeeTransferHistory(req, res, next) {
    try {
      const history = await branchesService.getAllEmployeeTransferHistory(
        req.params.id
      );
      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách thuốc tồn kho (loại sản phẩm là "Thuốc")
   * GET /api/branches/inventory/medicines
   */
  async getMedicinesInventory(req, res, next) {
    try {
      const maNhanVien = req.user.maNhanVien;
      if (!maNhanVien) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin nhân viên",
        });
      }
      const response = await branchesService.getMedicinesInventory(maNhanVien);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BranchesController();
