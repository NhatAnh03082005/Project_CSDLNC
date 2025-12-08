# Vaccinations Module

Module quản lý tiêm phòng và gói tiêm.

## Chức năng

- Ghi nhận tiêm phòng (nhân viên)
- Xem lịch sử tiêm phòng
- Quản lý gói tiêm (admin)
- Đăng ký gói tiêm (khách hàng)
- Theo dõi lịch tiêm trong gói

## Files

- `vaccinations.routes.js` - API endpoints
- `vaccinations.controller.js` - Request handlers
- `vaccinations.service.js` - Business logic
- `vaccinations.repository.js` - Database queries

## Gói tiêm

- Tên gói (6 tháng, 12 tháng)
- Thời hạn
- Danh sách mũi tiêm (loại vacxin + thời điểm)
- Mức ưu đãi (5-15%)

## Lần tiêm

- Thú cưng, bác sĩ
- Chi nhánh
- Loại vacxin, liều lượng
- Ngày tiêm
- Liên kết gói tiêm (nếu có)
