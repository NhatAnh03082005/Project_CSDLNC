const vaccinationsService = require("./vaccinations.service");

class VaccinationsController {
  async getAllVaccines(req, res, next) {
    try {
      const vaccines = await vaccinationsService.getAllVaccines();
      res.json({
        success: true,
        data: vaccines,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVaccineById(req, res, next) {
    try {
      const { id } = req.params;
      const vaccine = await vaccinationsService.getVaccineById(id);

      if (!vaccine) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy vắc-xin",
        });
      }

      res.json({
        success: true,
        data: vaccine,
      });
    } catch (error) {
      next(error);
    }
  }

  async createVaccine(req, res, next) {
    try {
      const vaccineData = req.body;
      const newVaccine = await vaccinationsService.createVaccine(vaccineData);

      res.status(201).json({
        success: true,
        message: "Thêm vắc-xin thành công",
        data: newVaccine,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVaccine(req, res, next) {
    try {
      const { id } = req.params;
      const vaccineData = req.body;

      const updatedVaccine = await vaccinationsService.updateVaccine(
        id,
        vaccineData
      );

      if (!updatedVaccine) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy vắc-xin",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thông tin vắc-xin thành công",
        data: updatedVaccine,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VaccinationsController();
