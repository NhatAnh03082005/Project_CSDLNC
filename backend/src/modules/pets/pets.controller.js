const petsService = require("./pets.service");

class PetsController {
  /**
   * Lấy danh sách thú cưng của khách hàng
   * GET /api/pets
   */
  async getCustomerPets(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.getCustomerPets(customerId);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm thú cưng mới
   * POST /api/pets
   */
  async createPet(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.createPet(customerId, req.body);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thông tin thú cưng
   * PUT /api/pets/:id
   */
  async updatePet(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;
      const { id: petId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.updatePet(customerId, petId, req.body);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa thú cưng
   * DELETE /api/pets/:id
   */
  async deletePet(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;
      const { id: petId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.deletePet(customerId, petId);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy chi tiết thú cưng
   * GET /api/pets/:id
   */
  async getPetDetails(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;
      const { id: petId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.getPetDetails(customerId, petId);
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy lịch sử khám bệnh
   * GET /api/pets/:id/medical-history
   */
  async getPetMedicalHistory(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;
      const { id: petId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.getPetMedicalHistory(
        customerId,
        petId
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy lịch sử tiêm phòng
   * GET /api/pets/:id/vaccination-history
   */
  async getPetVaccinationHistory(req, res, next) {
    try {
      const customerId = req.user.maKhachHang;
      const { id: petId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy mã khách hàng trong token",
        });
      }

      const response = await petsService.getPetVaccinationHistory(
        customerId,
        petId
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Staff: Lấy lịch sử khám bệnh của thú cưng (dùng cho lịch sử khám bệnh page)
   * GET /api/pets/staff/:customerId/:petId/medical-history
   * @param {string} customerId - Mã khách hàng
   * @param {string} petId - Mã thú cưng
   */
  async getStaffPetMedicalHistory(req, res, next) {
    try {
      const { customerId, petId } = req.params;

      if (!customerId || !petId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu mã khách hàng hoặc mã thú cưng",
        });
      }

      const response = await petsService.getPetMedicalHistory(
        customerId,
        petId
      );
      return res.status(response.status || 200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PetsController();
