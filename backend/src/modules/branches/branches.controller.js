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
}

module.exports = new BranchesController();
