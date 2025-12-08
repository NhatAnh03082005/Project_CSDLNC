# Promotions Module

Module quản lý chương trình khuyến mãi.

## Chức năng

- Tạo/sửa/xóa chương trình khuyến mãi (admin)
- Xem danh sách khuyến mãi
- Lọc khuyến mãi đang hoạt động
- Kiểm tra khuyến mãi áp dụng cho đơn hàng
- Áp dụng khuyến mãi khi lập hóa đơn

## Files

- `promotions.routes.js` - API endpoints
- `promotions.controller.js` - Request handlers
- `promotions.service.js` - Business logic (logic áp dụng)
- `promotions.repository.js` - Database queries

## Loại khuyến mãi

- Giảm giá theo % hoặc số tiền cố định
- Áp dụng cho dịch vụ cụ thể
- Áp dụng cho sản phẩm cụ thể
- Áp dụng cho gói tiêm
- Áp dụng theo hạng thành viên
- Thời gian áp dụng
- Số lượng giới hạn
