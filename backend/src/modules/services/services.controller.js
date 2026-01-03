const servicesService = require("./services.service");

class ServicesController {
  async getAllServices(req, res, next) {
    try {
      const services = await servicesService.getAllServices();
      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ServicesController();
