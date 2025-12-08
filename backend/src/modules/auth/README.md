# Auth Module

Module xác thực và phân quyền cho hệ thống PetCareX.

## Chức năng

- Đăng ký tài khoản khách hàng
- Đăng nhập (khách hàng, nhân viên, quản trị)
- Đăng xuất
- Xác thực JWT token
- Phân quyền theo role

## Files

- `auth.routes.js` - Định nghĩa các API endpoints
- `auth.controller.js` - Xử lý request/response
- `auth.service.js` - Business logic
- `auth.repository.js` - Truy vấn database
- `auth.validator.js` - Validation rules

## API Endpoints

- `POST /api/auth/register` - Đăng ký (public)
- `POST /api/auth/login` - Đăng nhập (public)
- `POST /api/auth/logout` - Đăng xuất (private)
- `GET /api/auth/me` - Lấy thông tin user hiện tại (private)
