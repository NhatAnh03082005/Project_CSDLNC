const reportsService = require("./reports.service");

class ReportsController {
  async getRevenueStats(req, res) {
    try {
      const { timeUnit, timeValue } = req.query;
      const data = await reportsService.getRevenueStats(timeUnit, timeValue);
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductStats(req, res) {
    try {
      const { timeUnit, timeValue } = req.query;
      const data = await reportsService.getProductStats(timeUnit, timeValue);
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getVaccineStats(req, res) {
    try {
      const { timeUnit, timeValue } = req.query;
      const data = await reportsService.getVaccineStats(timeUnit, timeValue);
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getServiceStats(req, res) {
    try {
      const { timeUnit, timeValue } = req.query;
      const data = await reportsService.getServiceStats(timeUnit, timeValue);
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCustomerStats(req, res) {
    try {
      const { timeUnit, timeValue } = req.query;
      const data = await reportsService.getCustomerStats(timeUnit, timeValue);
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPerformanceStats(req, res) {
    try {
      const { timeUnit, timeValue } = req.query;
      const data = await reportsService.getPerformanceStats(
        timeUnit,
        timeValue
      );
      res.json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ReportsController();
