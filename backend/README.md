# PetCareX Backend API

Backend API cho hệ thống quản lý chuỗi trung tâm chăm sóc thú cưng.

## Công nghệ sử dụng

- **Node.js** với **Express.js**
- **MySQL** (Database)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)

## Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/              # Cấu hình database, JWT, constants
│   ├── modules/             # Các module nghiệp vụ
│   │   ├── auth/           # Xác thực & phân quyền
│   │   ├── customers/      # Quản lý khách hàng
│   │   ├── pets/           # Quản lý thú cưng
│   │   ├── branches/       # Quản lý chi nhánh
│   │   ├── employees/      # Quản lý nhân viên
│   │   ├── appointments/   # Quản lý lịch hẹn
│   │   ├── medical/        # Quản lý khám bệnh
│   │   ├── vaccinations/   # Quản lý tiêm phòng & gói tiêm
│   │   ├── products/       # Quản lý sản phẩm & tồn kho
│   │   ├── invoices/       # Quản lý hóa đơn
│   │   ├── membership/     # Quản lý hội viên & điểm loyalty
│   │   ├── promotions/     # Quản lý khuyến mãi
│   │   ├── ratings/        # Quản lý đánh giá
│   │   └── reports/        # Báo cáo & thống kê
│   ├── middlewares/        # Middlewares (auth, validation, error)
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── tests/                  # Unit tests & integration tests
├── .env.example           # Environment variables template
├── package.json
└── README.md
```

## Cài đặt

```bash
npm install
cp .env.example .env
# Cấu hình database trong .env
npm run dev
```

## API Routes

### Authentication (`/api/auth`)
- POST `/register` - Đăng ký khách hàng
- POST `/login` - Đăng nhập
- POST `/logout` - Đăng xuất
- GET `/me` - Lấy thông tin user hiện tại

### Customers (`/api/customers`) - KHACH_HANG role
- GET `/profile` - Xem thông tin cá nhân
- PUT `/profile` - Cập nhật thông tin
- GET `/membership` - Xem hạng thành viên & điểm

### Pets (`/api/pets`) - KHACH_HANG role
- GET `/` - Danh sách thú cưng của khách
- POST `/` - Thêm thú cưng mới
- PUT `/:id` - Cập nhật thông tin thú cưng
- DELETE `/:id` - Xóa thú cưng

### Branches (`/api/branches`) - Public/All roles
- GET `/` - Danh sách chi nhánh (có filter)
- GET `/:id` - Chi tiết chi nhánh
- POST `/` - Tạo chi nhánh (QUAN_TRI)
- PUT `/:id` - Cập nhật (QUAN_TRI)

### Appointments (`/api/appointments`)
- GET `/` - Danh sách lịch hẹn
- POST `/` - Đặt lịch hẹn (KHACH_HANG)
- PUT `/:id/cancel` - Hủy lịch hẹn
- GET `/schedule` - Lịch theo chi nhánh/bác sĩ (NHAN_VIEN)

### Medical (`/api/medical`) - NHAN_VIEN role
- POST `/records` - Tạo hồ sơ khám bệnh
- GET `/records/:petId` - Lịch sử khám của thú cưng
- PUT `/records/:id` - Cập nhật hồ sơ

### Vaccinations (`/api/vaccinations`)
- POST `/records` - Ghi nhận tiêm phòng (NHAN_VIEN)
- GET `/packages` - Danh sách gói tiêm
- POST `/packages/subscribe` - Đăng ký gói tiêm (KHACH_HANG)

### Products (`/api/products`)
- GET `/` - Danh sách sản phẩm
- GET `/:id` - Chi tiết sản phẩm
- POST `/` - Thêm sản phẩm (QUAN_TRI)
- PUT `/:id/stock` - Cập nhật tồn kho (NHAN_VIEN/QUAN_TRI)

### Invoices (`/api/invoices`)
- POST `/` - Tạo hóa đơn (NHAN_VIEN)
- GET `/:id` - Chi tiết hóa đơn
- GET `/history` - Lịch sử hóa đơn

### Promotions (`/api/promotions`) - QUAN_TRI role
- GET `/` - Danh sách khuyến mãi
- POST `/` - Tạo chương trình khuyến mãi
- PUT `/:id` - Cập nhật
- DELETE `/:id` - Xóa/Dừng chương trình

### Ratings (`/api/ratings`)
- POST `/` - Đánh giá dịch vụ (KHACH_HANG)
- GET `/branch/:branchId` - Đánh giá của chi nhánh

### Reports (`/api/reports`) - QUAN_TRI role
- GET `/revenue` - Báo cáo doanh thu
- GET `/customers` - Thống kê khách hàng
- GET `/vaccinations` - Thống kê vacxin
- GET `/employees` - Hiệu suất nhân viên

### Employees (`/api/employees`) - QUAN_TRI role
- GET `/` - Danh sách nhân viên
- POST `/` - Thêm nhân viên
- PUT `/:id` - Cập nhật thông tin
- POST `/:id/transfer` - Điều động chi nhánh

## Phân quyền

- **KHACH_HANG**: Quản lý thú cưng, đặt lịch, mua hàng, xem điểm
- **NHAN_VIEN**: Lập hóa đơn, cập nhật hồ sơ khám/tiêm, xem lịch hẹn
- **QUAN_TRI**: Toàn quyền quản lý hệ thống

## Phân công công việc (3 members)

### Backend Member 1: Authentication & User Management
- `modules/auth/`
- `modules/customers/`
- `modules/employees/`
- `modules/membership/`
- `middlewares/auth.js`

### Backend Member 2: Core Services
- `modules/pets/`
- `modules/appointments/`
- `modules/medical/`
- `modules/vaccinations/`
- `modules/ratings/`

### Backend Member 3: Business & Admin
- `modules/branches/`
- `modules/products/`
- `modules/invoices/`
- `modules/promotions/`
- `modules/reports/`
