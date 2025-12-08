# Appointments Module

Module quản lý lịch hẹn khám bệnh và tiêm phòng.

## Chức năng

- Đặt lịch hẹn (khách hàng)
- Xem/tra cứu lịch hẹn
- Hủy lịch hẹn
- Xác nhận lịch hẹn (nhân viên)
- Hoàn thành lịch hẹn
- Xem lịch theo chi nhánh/bác sĩ/ngày
- Kiểm tra khung giờ còn trống

## Files

- `appointments.routes.js` - API endpoints
- `appointments.controller.js` - Request handlers
- `appointments.service.js` - Business logic
- `appointments.repository.js` - Database queries

## Thuộc tính Lịch hẹn

- Khách hàng, thú cưng
- Chi nhánh, bác sĩ
- Loại dịch vụ (khám bệnh/tiêm phòng)
- Ngày giờ hẹn
- Trạng thái (chờ xác nhận, đã xác nhận, hoàn thành, đã hủy)
