const productsService = require('./products.service');

class ProductsController {
    /**
     * Lấy danh sách sản phẩm theo chi nhánh
     * GET /api/products/branch/:maChiNhanh
     */
    async getProductsByBranch(req, res, next) {
        try {
            const { maChiNhanh } = req.params;
            const response = await productsService.getProductsByBranch(maChiNhanh);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy chi tiết sản phẩm theo chi nhánh
     * GET /api/products/:maSanPham/branch/:maChiNhanh
     */
    async getProductById(req, res, next) {
        try {
            const { maSanPham, maChiNhanh } = req.params;
            const response = await productsService.getProductById(maSanPham, maChiNhanh);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductsController();
