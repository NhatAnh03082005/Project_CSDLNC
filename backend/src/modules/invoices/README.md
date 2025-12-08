# Invoices Module

Module quản lý hóa đơn.

## Chức năng

- Tạo hóa đơn (nhân viên)
- Xem chi tiết hóa đơn
- Xem lịch sử hóa đơn
- Cập nhật thanh toán
- In hóa đơn
- Áp dụng khuyến mãi
- Tính điểm loyalty

## Files

- `invoices.routes.js` - API endpoints
- `invoices.controller.js` - Request handlers
- `invoices.service.js` - Business logic (tính toán điểm, giảm giá)
- `invoices.repository.js` - Database queries

## Thuộc tính Hóa đơn

- Ngày lập
- Chi nhánh, nhân viên lập
- Khách hàng
- Danh sách chi tiết (dịch vụ/sản phẩm)
- Tổng tiền
- Khuyến mãi áp dụng
- Hình thức thanh toán
- Điểm loyalty cộng thêm
