const branchesService = require('./branches.service');

class BranchesController {
    /**
     * Lấy danh sách chi nhánh
     * GET /api/branches
     */
    async getBranches(req, res, next) {
        try {
            const { page, limit, search, service } = req.query;

            let serviceFilter = null;
            if (service === 'exam') {
                serviceFilter = 'Khám bệnh';
            } else if (service === 'vaccination') {
                serviceFilter = 'Tiêm phòng';
            } else if (service === 'products') {
                serviceFilter = 'Mua hàng';
            } else if (service) {
                serviceFilter = service;
            }

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

    /**
     * Lấy chi tiết chi nhánh
     * GET /api/branches/:id
     */
    async getBranchById(req, res, next) {
        try {
            const { id } = req.params;
            const response = await branchesService.getBranchById(id);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BranchesController();
