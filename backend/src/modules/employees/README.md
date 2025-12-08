# Employees Module

Module quản lý nhân viên của hệ thống.

## Chức năng

- Thêm/sửa/xóa nhân viên (QUAN_TRI)
- Xem danh sách nhân viên
- Điều động nhân viên giữa các chi nhánh
- Cập nhật lương
- Xem lịch sử điều động
- Lọc danh sách bác sĩ (để đặt lịch)

## Files

- `employees.routes.js` - API endpoints
- `employees.controller.js` - Request handlers
- `employees.service.js` - Business logic
- `employees.repository.js` - Database queries

## Thuộc tính Nhân viên

- Họ tên, ngày sinh, giới tính
- Chức vụ (BacSi, LeTan, BanHang, QuanTri)
- Chi nhánh hiện tại
- Lương cơ bản
- Lịch sử điều động
