const ratingsService = require('./ratings.service');

class RatingsController {
    /**
     * Tạo hoặc cập nhật đánh giá
     * POST /api/ratings
     */
    async createOrUpdateRating(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await ratingsService.createOrUpdateRating(customerId, req.body);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách dịch vụ có thể đánh giá
     * GET /api/ratings/my-ratings
     */
    async getRateableServices(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await ratingsService.getRateableServices(customerId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật đánh giá
     * PUT /api/ratings/:maHoaDon/:stt
     */
    async updateRating(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;
            const { maHoaDon, stt } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await ratingsService.updateRating(customerId, maHoaDon, parseInt(stt), req.body);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xóa đánh giá
     * DELETE /api/ratings/:maHoaDon/:stt
     */
    async deleteRating(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;
            const { maHoaDon, stt } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await ratingsService.deleteRating(customerId, maHoaDon, parseInt(stt));
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RatingsController();
