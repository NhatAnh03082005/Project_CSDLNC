const vaccinationsService = require('./vaccinations.service');

class VaccinationsController {
    /**
     * Lấy danh sách gói tiêm phòng
     * GET /api/vaccinations/packages
     */
    async getVaccinationPackages(req, res, next) {
        try {
            const response = await vaccinationsService.getVaccinationPackages();
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Đăng ký gói tiêm cho thú cưng
     * POST /api/vaccinations/packages/subscribe
     */
    async subscribeToPackage(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await vaccinationsService.subscribeToPackage(customerId, req.body);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách gói tiêm đang đăng ký
     * GET /api/vaccinations/subscriptions
     */
    async getCustomerSubscriptions(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await vaccinationsService.getCustomerSubscriptions(customerId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy chi tiết gói tiêm đã đăng ký
     * GET /api/vaccinations/subscriptions/:maGoiDK
     */
    async getSubscriptionDetails(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;
            const { maGoiDK } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            if (!maGoiDK) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu mã gói đăng ký',
                });
            }

            const response = await vaccinationsService.getSubscriptionDetails(customerId, maGoiDK);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VaccinationsController();
