# Products Module

Module quản lý sản phẩm và tồn kho.

## Chức năng

- Xem danh sách sản phẩm (filter theo loại)
- Xem chi tiết sản phẩm
- Thêm/sửa/xóa sản phẩm (admin)
- Quản lý tồn kho theo chi nhánh
- Cập nhật tồn kho (nhân viên/admin)

## Files

- `products.routes.js` - API endpoints
- `products.controller.js` - Request handlers
- `products.service.js` - Business logic
- `products.repository.js` - Database queries

## Thuộc tính Sản phẩm

- Tên sản phẩm
- Loại (thức ăn, thuốc, phụ kiện)
- Giá bán
- Số lượng tồn kho (theo chi nhánh)
- Trạng thái kinh doanh
- Mô tả, hình ảnh
