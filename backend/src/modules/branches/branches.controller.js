const branchesService = require("./branches.service");

class BranchesController {
  async getAllBranches(req, res, next) {
    try {
      const branches = await branchesService.getAllBranches();
      res.json({
        success: true,
        data: branches,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBranchById(req, res, next) {
    try {
      const { id } = req.params;
      const branch = await branchesService.getBranchById(id);

      if (!branch) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy chi nhánh",
        });
      }

      res.json({
        success: true,
        data: branch,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBranch(req, res, next) {
    try {
      const branchData = req.body;
      const newBranch = await branchesService.createBranch(branchData);
      res.status(201).json({
        success: true,
        data: newBranch,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBranch(req, res, next) {
    try {
      const { id } = req.params;
      const branchData = req.body;
      const updatedBranch = await branchesService.updateBranch(id, branchData);
      if (!updatedBranch) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy chi nhánh",
        });
      }
      res.json({
        success: true,
        data: updatedBranch,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductsStockByBranch(req, res, next) {
    try {
      const { id } = req.params;
      const productsStock = await branchesService.getProductsStockByBranch(id);
      res.json({
        success: true,
        data: productsStock,
      });
    } catch (error) {
      next(error);
    }
  }

  async addProductToStock(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const newStock = await branchesService.addProductToStock(id, productData);
      res.status(201).json({
        success: true,
        data: newStock,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProductQty(req, res, next) {
    try {
      const { id, maSanPham } = req.params;
      const { SoLuongTon } = req.body;

      const updated = await branchesService.updateProductQty(id, maSanPham, {
        SoLuongTon,
      });

      res.json({
        success: true,
        data: updated, // bạn muốn trả true hay trả list đều được
      });
    } catch (error) {
      next(error);
    }
  }

  async getVaccinesStockByBranch(req, res, next) {
    try {
      const { id } = req.params;
      const vaccinesStock = await branchesService.getVaccinesStockByBranch(id);
      res.json({
        success: true,
        data: vaccinesStock,
      });
    } catch (error) {
      next(error);
    }
  }

  async addVaccineToStock(req, res, next) {
    try {
      const { id } = req.params;
      const vaccineData = req.body;
      const newStock = await branchesService.addVaccineToStock(id, vaccineData);
      res.status(201).json({
        success: true,
        data: newStock,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVaccineQty(req, res, next) {
    try {
      const { id, maVacXin } = req.params;
      const { SoLuongTon } = req.body;

      const updated = await branchesService.updateVaccineQty(id, maVacXin, {
        SoLuongTon,
      });

      res.json({
        success: true,
        data: updated, // bạn muốn trả true hay trả list đều được
      });
    } catch (error) {
      next(error);
    }
  }

  async getServicesByBranch(req, res, next) {
    try {
      const { id } = req.params;
      const services = await branchesService.getServicesByBranch(id);
      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  async addServiceToBranch(req, res, next) {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const newStock = await branchesService.addServiceToBranch(
        id,
        serviceData
      );
      res.status(201).json({
        success: true,
        data: newStock,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteServiceFromBranch(req, res, next) {
    try {
      const { id, loaiDichVu } = req.params;
      const deleted = await branchesService.deleteServiceFromBranch(
        id,
        loaiDichVu
      );
      res.json({
        success: true,
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployeeTransferHistory(req, res, next) {
    try {
      const { id } = req.params;
      const history = await branchesService.getAllEmployeeTransferHistory(id);
      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BranchesController();
