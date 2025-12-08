# Membership Module

Module quản lý hội viên, hạng thành viên và điểm loyalty.

## Chức năng

- Xem hạng thành viên & quyền lợi
- Xem điểm loyalty hiện tại
- Xem lịch sử tích/tiêu điểm
- Tính toán & cập nhật hạng (định kỳ/admin)
- Áp dụng giảm giá theo hạng

## Files

- `membership.routes.js` - API endpoints
- `membership.controller.js` - Request handlers
- `membership.service.js` - Business logic (tính hạng, điểm)
- `membership.repository.js` - Database queries

## Hạng thành viên

### Cơ Bản
- Tổng tiền năm: < 5 triệu
- Giảm giá: 0%
- Điểm: 1 điểm/100,000 VND

### Thân Thiết
- Tổng tiền năm: 5-20 triệu
- Giảm giá: 5%
- Điểm: 1 điểm/100,000 VND

### VIP
- Tổng tiền năm: > 20 triệu
- Giảm giá: 10%
- Điểm: 1 điểm/100,000 VND
- Ưu tiên đặt lịch
