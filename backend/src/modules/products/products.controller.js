const productsService = require("./products.service");

class ProductsController {
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

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
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
