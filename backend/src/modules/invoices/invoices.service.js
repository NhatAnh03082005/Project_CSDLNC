const invoiceRepo = require('./invoices.repository');

/**
 * Tạo hóa đơn mới
 * @param {Object} data - Dữ liệu từ body (MaKhachHang, details: [...])
 * @param {Object} user - User đang login (để lấy MaNhanVien lập)
 */
const createInvoice = async (data, user) => {
    // ---  MAP DỮ LIỆU TỪ TOKEN (Robust Mapping) ---
  // Lấy MaNhanVien: Chấp nhận cả key hoa hoặc thường từ token
  const staffId = user.MaNhanVien || user.maNhanVien;
  
  // Lấy MaChiNhanh: Chấp nhận cả key hoa hoặc thường
  const branchId = (user.MaChiNhanh ?? user.maChiNhanh) || "CN02"; //Fallback dùng CN02

  // Validate Token Data
  if (!staffId) {
      throw new Error('Token không hợp lệ: Không tìm thấy Mã nhân viên.');
  }
  if (!branchId) {
      throw new Error('Token không hợp lệ: Không tìm thấy Mã chi nhánh. Vui lòng đăng nhập lại.');
  }

  // 1. Chuẩn bị dữ liệu Header
  const invoiceData = {
    MaKhachHang: data.MaKhachHang,
    NgayLap: data.NgayLap || new Date(),
    HinhThucThanhToan: data.HinhThucThanhToan || 'Tiền mặt',
    NhanVienLap: staffId, // Dùng biến đã map
    MaChiNhanh: branchId, // Dùng biến đã map
    details: data.details
  };

  if (!invoiceData.details || invoiceData.details.length === 0) {
    throw new Error('Hóa đơn phải có ít nhất một dịch vụ/sản phẩm');
  }

  // 2. Gọi Repository để thực hiện Transaction insert
  const newInvoiceId = await invoiceRepo.createInvoiceTransaction(invoiceData);

  // 3. Trả về kết quả (có thể get lại chi tiết vừa tạo để hiển thị tính toán từ Trigger)
  return await invoiceRepo.getInvoiceById(newInvoiceId);
};

const getAllInvoices = async (filters) => {
  return await invoiceRepo.getAll(filters);
};

const getInvoiceDetail = async (id) => {
  const invoice = await invoiceRepo.getInvoiceById(id);
  if (!invoice) throw new Error('Hóa đơn không tồn tại');
  return invoice;
};

const getHistoryByCustomer = async (customerId) => {
  return await invoiceRepo.getByCustomerId(customerId);
};

const updateInvoice = async (id, data) => {
  // Chỉ cho phép update các trường cho phép
  const updateData = {
    NgayLap: data.NgayLap,
    HinhThucThanhToan: data.HinhThucThanhToan,
    NhanVienLap: data.NhanVienLap
  };
  return await invoiceRepo.update(id, updateData);
};

const deleteInvoice = async (id) => {
  // Logic nghiệp vụ: Xóa thẳng, trigger DB lo phần còn lại
  return await invoiceRepo.remove(id);
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceDetail,
  getHistoryByCustomer,
  updateInvoice,
  deleteInvoice
};