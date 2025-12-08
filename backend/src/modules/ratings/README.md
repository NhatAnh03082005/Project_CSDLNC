# Ratings Module

Module quản lý đánh giá dịch vụ.

## Chức năng

- Đánh giá dịch vụ sau khi sử dụng (khách hàng)
- Xem đánh giá của chi nhánh
- Xem đánh giá của dịch vụ
- Cập nhật/xóa đánh giá
- Thống kê điểm trung bình

## Files

- `ratings.routes.js` - API endpoints
- `ratings.controller.js` - Request handlers
- `ratings.service.js` - Business logic (tính điểm TB)
- `ratings.repository.js` - Database queries

## Thuộc tính Đánh giá

- Khách hàng
- Chi nhánh/Dịch vụ/Hóa đơn
- Điểm chất lượng dịch vụ (1-5)
- Điểm thái độ nhân viên (1-5)
- Điểm hài lòng tổng thể (1-5)
- Bình luận
- Ngày đánh giá
