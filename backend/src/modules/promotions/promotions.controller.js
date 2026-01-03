const promotionsService = require("./promotions.service");

class PromotionsController {
  async getAllPromotions(req, res, next) {
    try {
      const promotions = await promotionsService.getAllPromotions();
      res.json({
        success: true,
        data: promotions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy khuyến mãi đang hoạt động (theo ngày hiện tại)
   */
  async getActivePromotion(req, res, next) {
    try {
      const promotion = await promotionsService.getActivePromotion();
      res.json({
        success: true,
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPromotionById(req, res, next) {
    try {
      const { id } = req.params;
      const promotion = await promotionsService.getPromotionById(id);

      if (!promotion) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khuyến mãi",
        });
      }

      res.json({
        success: true,
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo khuyến mãi mới
   */
  async createPromotion(req, res, next) {
    try {
      const promotionData = req.body;
      const newPromotion = await promotionsService.createPromotion(
        promotionData
      );

      res.status(201).json({
        success: true,
        message: "Thêm khuyến mãi thành công",
        data: newPromotion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thông tin khuyến mãi
   */
  async updatePromotion(req, res, next) {
    try {
      const { id } = req.params;
      const promotionData = req.body;

      const updatedPromotion = await promotionsService.updatePromotion(
        id,
        promotionData
      );

      if (!updatedPromotion) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khuyến mãi",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thông tin khuyến mãi thành công",
        data: updatedPromotion,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new PromotionsController();
