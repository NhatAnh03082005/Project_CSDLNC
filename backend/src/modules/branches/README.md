# Branches Module

Module quản lý chi nhánh của hệ thống PetCareX.

## Chức năng

- Xem danh sách chi nhánh (filter theo thành phố, dịch vụ)
- Xem chi tiết chi nhánh
- Tạo/sửa/xóa chi nhánh (QUAN_TRI)
- Quản lý dịch vụ tại chi nhánh
- Xem danh sách nhân viên tại chi nhánh

## Files

- `branches.routes.js` - API endpoints
- `branches.controller.js` - Request handlers
- `branches.service.js` - Business logic
- `branches.repository.js` - Database queries

## Thuộc tính Chi nhánh

- Tên chi nhánh
- Địa chỉ, số điện thoại
- Giờ mở cửa, đóng cửa
- Danh sách dịch vụ cung cấp
