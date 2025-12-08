# Medical Module

Module quản lý hồ sơ khám bệnh cho thú cưng.

## Chức năng

- Tạo hồ sơ khám bệnh (nhân viên/bác sĩ)
- Cập nhật hồ sơ khám
- Xem lịch sử khám bệnh
- Quản lý toa thuốc
- Lên lịch tái khám

## Files

- `medical.routes.js` - API endpoints
- `medical.controller.js` - Request handlers
- `medical.service.js` - Business logic
- `medical.repository.js` - Database queries

## Thuộc tính Hồ sơ Khám bệnh

- Thú cưng, bác sĩ
- Chi nhánh
- Ngày khám
- Triệu chứng, chuẩn đoán
- Toa thuốc (danh sách thuốc + liều dùng)
- Ngày tái khám
