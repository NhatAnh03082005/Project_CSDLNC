# Reports Module

Module báo cáo & thống kê (dành cho Quản trị).

## Chức năng

### Báo cáo Doanh thu
- Doanh thu toàn hệ thống
- Doanh thu theo chi nhánh
- Doanh thu theo dịch vụ
- Doanh thu theo sản phẩm
- Biểu đồ theo thời gian

### Thống kê Khách hàng
- Tổng số khách hàng
- Khách hàng mới theo tháng
- Phân bổ theo hạng thành viên
- Khách hàng tiềm năng

### Thống kê Tiêm phòng
- Số lượng tiêm theo loại vacxin
- Top vacxin được sử dụng nhiều
- Gói tiêm bán chạy

### Hiệu suất Nhân viên
- Doanh thu theo nhân viên
- Số hóa đơn xử lý
- Điểm đánh giá trung bình

### Dashboard
- Tổng quan hệ thống
- Chỉ số KPI
- Biểu đồ xu hướng

## Files

- `reports.routes.js` - API endpoints
- `reports.controller.js` - Request handlers
- `reports.service.js` - Business logic (tính toán, tổng hợp)
- `reports.repository.js` - Database queries (complex queries)
