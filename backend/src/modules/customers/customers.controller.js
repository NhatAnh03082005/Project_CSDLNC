const customersService = require('./customers.service');

class CustomersController {
    /**
     * Lấy thông tin hồ sơ khách hàng
     * GET /api/customers/profile
     */
    async getProfile(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.getProfile(customerId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cập nhật thông tin hồ sơ khách hàng
     * PUT /api/customers/profile
     */
    async updateProfile(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.updateProfile(customerId, req.body);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách lịch hẹn của khách hàng
     * GET /api/customers/appointments
     */
    async getAppointments(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.getAppointments(customerId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách hóa đơn của khách hàng
     * GET /api/customers/invoices
     */
    async getInvoices(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.getInvoices(customerId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy chi tiết hóa đơn
     * GET /api/customers/invoices/:maHoaDon
     */
    async getInvoiceDetails(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;
            const { maHoaDon } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.getInvoiceDetails(customerId, maHoaDon);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Tạo đơn hàng mới
     * POST /api/customers/orders
     */
    async createOrder(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.createOrder(customerId, req.body);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách đơn hàng của khách hàng
     * GET /api/customers/orders
     */
    async getOrders(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.getOrders(customerId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy chi tiết đơn hàng của khách hàng
     * GET /api/customers/orders/:maHoaDon
     */
    async getOrderDetails(req, res, next) {
        try {
            const customerId = req.user.maKhachHang;
            const { maHoaDon } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã khách hàng trong token',
                });
            }

            const response = await customersService.getOrderDetails(customerId, maHoaDon);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách đơn hàng chờ xác nhận (cho nhân viên)
     * GET /api/customers/orders/pending
     */
    async getPendingOrders(req, res, next) {
        try {
            const { maChiNhanh } = req.query;
            const response = await customersService.getPendingOrders(maChiNhanh);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Xác nhận đơn hàng (cho nhân viên)
     * PUT /api/customers/orders/:maHoaDon/confirm
     */
    async confirmOrder(req, res, next) {
        try {
            const { maHoaDon } = req.params;
            const nhanVienId = req.user.maNhanVien;

            if (!nhanVienId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy mã nhân viên trong token',
                });
            }

            const response = await customersService.confirmOrder(maHoaDon, nhanVienId);
            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
    /**
     * Lấy danh sách khách hàng (có phân trang, tìm kiếm)
     * GET /api/customers?page=1&limit=10&search=abc&capHoiVien=VIP
     */
    async getAll(req, res, next) {
        try {
            const { page, limit, search, capHoiVien } = req.query;

            const response = await customersService.getAllCustomers({ 
                page, 
                limit, 
                search, 
                capHoiVien 
            });

            return res.status(response.status || 200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CustomersController();
