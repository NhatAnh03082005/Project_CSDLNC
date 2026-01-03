const invoiceService = require('./invoices.service');

const createInvoice = async (req, res, next) => {
  try {
    // req.user lấy từ middleware authenticate để biết ai là người lập
    // Cần MaNhanVien và MaChiNhanh từ user đang đăng nhập
    const result = await invoiceService.createInvoice(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: 'Tạo hóa đơn thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.getAllInvoices(req.query);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await invoiceService.getInvoiceDetail(id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerInvoices = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const result = await invoiceService.getHistoryByCustomer(customerId);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await invoiceService.updateInvoice(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật hóa đơn thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id);
    return res.status(200).json({
      success: true,
      message: 'Xóa hóa đơn thành công'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  getCustomerInvoices,
  updateInvoice,
  deleteInvoice
};