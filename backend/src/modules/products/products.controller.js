const productsService = require("./products.service");

class ProductsController {
  /**
   * Lấy danh sách toàn bộ sản phẩm (Admin)
   * GET /api/products
   */
  async getAllProducts(req, res, next) {
    try {
      const products = await productsService.getAllProducts();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách sản phẩm theo chi nhánh (Client/Public)
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
   * Lấy chi tiết sản phẩm
   * Gộp logic: hỗ trợ cả theo ID đơn thuần (Admin) và theo chi nhánh (Client)
   */
  async getProductById(req, res, next) {
    try {
      const { id, maSanPham, maChiNhanh } = req.params;

      // Ưu tiên logic tìm kiếm sản phẩm tại chi nhánh cụ thể nếu có maChiNhanh
      if (maChiNhanh || maSanPham) {
        const response = await productsService.getProductById(
          maSanPham || id,
          maChiNhanh
        );
        return res.status(response.status || 200).json(response);
      }

      // Logic tìm kiếm sản phẩm chung theo ID (Admin)
      const product = await productsService.getProductById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm sản phẩm mới (Admin)
   * POST /api/products
   */
  async createProduct(req, res, next) {
    try {
      const productData = req.body;
      const newProduct = await productsService.createProduct(productData);

      res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thông tin sản phẩm (Admin)
   * PUT /api/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productData = req.body;

      const updatedProduct = await productsService.updateProduct(
        id,
        productData
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật thông tin sản phẩm thành công",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductsController();
