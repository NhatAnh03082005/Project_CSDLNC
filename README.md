# 🐾 HỆ THỐNG QUẢN LÝ CHUỖI TRUNG TÂM CHĂM SÓC THÚ CƯNG - PETCAREX

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-red.svg)](https://www.microsoft.com/sql-server)

## 📋 Giới thiệu

**PetCareX** là hệ thống quản lý toàn diện cho chuỗi trung tâm chăm sóc thú cưng với 10 chi nhánh trên toàn quốc. Hệ thống cung cấp giải pháp tích hợp đầy đủ cho việc quản lý dịch vụ y tế thú cưng, bán hàng trực tuyến và chương trình khách hàng thân thiết.

### ✨ Tính năng chính

- 🏥 **Dịch vụ Y Tế**: Khám bệnh, tiêm phòng, theo dõi lịch sử y tế
- 🛒 **Thương Mại Điện Tử**: Bán thức ăn, phụ kiện, thuốc thú cưng
- 📅 **Đặt Lịch Hẹn**: Hệ thống booking thông minh theo chi nhánh
- 💎 **Chương Trình Thành Viên**: Tích điểm, hạng thành viên, ưu đãi
- 📊 **Báo Cáo Thống Kê**: Dashboard phân tích doanh thu, hiệu suất
- 🎁 **Quản Lý Khuyến Mãi**: Tạo và áp dụng chương trình ưu đãi

### 👥 Vai trò người dùng

| Vai trò              | Quyền hạn                                                                |
| -------------------- | ------------------------------------------------------------------------ |
| **👤 Khách hàng**    | Đăng ký thú cưng, đặt lịch khám, mua sắm, tích điểm, đánh giá dịch vụ    |
| **👨‍⚕️ Nhân viên**     | Quản lý lịch hẹn, lập hóa đơn, cập nhật hồ sơ y tế, quản lý tồn kho      |
| **👨‍💼 Quản trị viên** | Quản lý chi nhánh, nhân viên, sản phẩm, khuyến mãi, xem báo cáo tổng hợp |

---

## 🏗️ Kiến trúc hệ thống

### Tech Stack

#### Backend

- **Framework**: Node.js 16+ với Express.js 4.18
- **Database**: Microsoft SQL Server 2019+
- **ORM**: mssql (SQL Server driver)
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Security**: bcryptjs (password hashing)
- **Validation**: express-validator 7.0
- **CORS**: Hỗ trợ cross-origin requests

#### Frontend

- **Library**: React 18.2
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI (shadcn/ui)
- **Routing**: React Router v6
- **State Management**: Zustand 4.3
- **HTTP Client**: Axios 1.4
- **Charts**: Recharts 2.6
- **Icons**: Lucide React
- **Date Handling**: date-fns 2.30

### Cấu trúc thư mục

```
Project_CSDLNC/
├── 📁 backend/                    # Backend API Server
│   ├── package.json              # Dependencies: express, mssql, jwt, bcryptjs
│   ├── test-db-connection.js     # Database connection tester
│   └── src/
│       ├── server.js             # Entry point, Express app setup
│       ├── config/
│       │   ├── constants.js      # System constants
│       │   └── database.js       # MSSQL connection pool config
│       ├── middlewares/
│       │   ├── auth.js          # JWT authentication middleware
│       │   ├── errorHandler.js  # Global error handling
│       │   └── validate.js      # Request validation middleware
│       └── modules/              # Business logic modules (14 modules)
│           ├── auth/            # Authentication & Authorization
│           ├── customers/       # Customer management
│           ├── pets/            # Pet registration & management
│           ├── branches/        # Branch management
│           ├── employees/       # Employee management
│           ├── appointments/    # Appointment scheduling
│           ├── medical/         # Medical records
│           ├── vaccinations/    # Vaccination tracking
│           ├── products/        # Product catalog
│           ├── invoices/        # Invoice & billing
│           ├── promotions/      # Promotions & discounts
│           ├── ratings/         # Service ratings
│           ├── reports/         # Analytics & reports
│           └── services/        # Service definitions
│
├── 📁 frontend/                   # React SPA
│   ├── package.json              # Dependencies: react, vite, tailwind
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Root component, routing
│       ├── index.css             # Global styles
│       ├── api/
│       │   ├── axios.js         # Axios instance with interceptors
│       │   └── services.js      # API service functions
│       ├── components/
│       │   ├── layout/          # Header, Sidebar, Footer
│       │   ├── staff/           # Staff-specific components
│       │   └── ui/              # Reusable UI components (shadcn/ui)
│       ├── context/
│       │   └── AuthContext.jsx  # Authentication context
│       ├── lib/
│       │   ├── toast.js         # Toast notifications
│       │   └── utils.ts         # Utility functions (cn, etc.)
│       ├── pages/               # Route pages (21+ pages)
│       │   ├── login/           # Login page
│       │   ├── register/        # Registration page
│       │   ├── customer/        # Customer dashboard & features
│       │   ├── staff/           # Staff pages (invoices, schedule)
│       │   ├── admin/           # Admin panel
│       │   ├── appointments/    # Booking appointments
│       │   ├── pets/            # Pet management
│       │   ├── products/        # Product catalog
│       │   ├── services/        # Service listings
│       │   └── ...              # Other feature pages
│       └── store/
│           ├── authStore.js     # Auth state (Zustand)
│           ├── cartStore.js     # Shopping cart state
│           └── toastStore.js    # Toast notification state
│
└── README.md                     # This file
```

### Mô hình Module (Backend)

Mỗi module trong `backend/src/modules/` tuân theo cấu trúc MVC:

```
module-name/
├── {module}.controller.js    # HTTP request handlers
├── {module}.service.js       # Business logic
├── {module}.routes.js        # Express routes
└── README.md                 # Module documentation
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js**: >= 16.x
- **npm**: >= 7.x hoặc yarn
- **SQL Server**: 2019+ hoặc Azure SQL Database
- **OS**: Windows, macOS, hoặc Linux

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd Project_CSDLNC
```

````

### 2️⃣ Cấu hình Database

#### Tạo Database SQL Server

```sql
CREATE DATABASE PetCareX;
GO

USE PetCareX;
GO
````

Chạy các script tạo bảng và dữ liệu mẫu (nếu có trong thư mục `database/`).

### 3️⃣ Cài đặt Backend

```bash
cd backend
npm install
```

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backend/`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_NAME=PetCareX
DB_USER=sa
DB_PASSWORD=your_password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERT=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Kiểm tra kết nối database

```bash
node test-db-connection.js
```

#### Khởi chạy server

```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:3000**

### 4️⃣ Cài đặt Frontend

```bash
cd frontend
npm install
```

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Khởi chạy ứng dụng

```bash
# Development mode
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

Frontend sẽ chạy tại: **http://localhost:5173**

---

## 📚 Tài liệu API

### Base URL

```
http://localhost:3000/api
```

### Authentication

Hầu hết các endpoint yêu cầu JWT token trong header:

```http
Authorization: Bearer <your-jwt-token>
```

### Danh sách Endpoints chính

#### 🔐 Authentication (`/api/auth`)

| Method | Endpoint           | Mô tả                        | Auth |
| ------ | ------------------ | ---------------------------- | ---- |
| POST   | `/register`        | Đăng ký tài khoản khách hàng | ❌   |
| POST   | `/login`           | Đăng nhập                    | ❌   |
| POST   | `/logout`          | Đăng xuất                    | ✅   |
| GET    | `/me`              | Thông tin user hiện tại      | ✅   |
| PUT    | `/change-password` | Đổi mật khẩu                 | ✅   |

#### 👤 Customers (`/api/customers`)

| Method | Endpoint      | Mô tả                | Role         |
| ------ | ------------- | -------------------- | ------------ |
| GET    | `/`           | Danh sách khách hàng | ADMIN, STAFF |
| GET    | `/:id`        | Chi tiết khách hàng  | ADMIN, STAFF |
| GET    | `/profile`    | Profile của tôi      | CUSTOMER     |
| PUT    | `/profile`    | Cập nhật profile     | CUSTOMER     |
| GET    | `/membership` | Thông tin hội viên   | CUSTOMER     |

#### 🐾 Pets (`/api/pets`)

| Method | Endpoint | Mô tả                | Role     |
| ------ | -------- | -------------------- | -------- |
| GET    | `/`      | Danh sách thú cưng   | CUSTOMER |
| POST   | `/`      | Đăng ký thú cưng mới | CUSTOMER |
| GET    | `/:id`   | Chi tiết thú cưng    | CUSTOMER |
| PUT    | `/:id`   | Cập nhật thông tin   | CUSTOMER |
| DELETE | `/:id`   | Xóa thú cưng         | CUSTOMER |

#### 📅 Appointments (`/api/appointments`)

| Method | Endpoint            | Mô tả                   | Role     |
| ------ | ------------------- | ----------------------- | -------- |
| GET    | `/`                 | Lịch hẹn của tôi        | CUSTOMER |
| POST   | `/`                 | Đặt lịch hẹn            | CUSTOMER |
| GET    | `/:id`              | Chi tiết lịch hẹn       | ALL      |
| PUT    | `/:id/cancel`       | Hủy lịch hẹn            | CUSTOMER |
| GET    | `/branch/:branchId` | Lịch hẹn theo chi nhánh | STAFF    |
| PUT    | `/:id/status`       | Cập nhật trạng thái     | STAFF    |

#### 🏥 Medical Records (`/api/medical`)

| Method | Endpoint      | Mô tả                   | Role            |
| ------ | ------------- | ----------------------- | --------------- |
| GET    | `/pet/:petId` | Hồ sơ y tế của thú cưng | CUSTOMER, STAFF |
| POST   | `/`           | Tạo hồ sơ khám bệnh     | STAFF           |
| GET    | `/:id`        | Chi tiết hồ sơ          | CUSTOMER, STAFF |
| PUT    | `/:id`        | Cập nhật hồ sơ          | STAFF           |

#### 💉 Vaccinations (`/api/vaccinations`)

| Method | Endpoint              | Mô tả                     | Role            |
| ------ | --------------------- | ------------------------- | --------------- |
| GET    | `/pet/:petId`         | Lịch sử tiêm của thú cưng | CUSTOMER, STAFF |
| POST   | `/`                   | Tạo lần tiêm mới          | STAFF           |
| GET    | `/packages`           | Danh sách gói tiêm        | ALL             |
| POST   | `/packages/subscribe` | Đăng ký gói tiêm          | CUSTOMER        |

#### 🛍️ Products (`/api/products`)

| Method | Endpoint               | Mô tả                  | Role         |
| ------ | ---------------------- | ---------------------- | ------------ |
| GET    | `/`                    | Danh sách sản phẩm     | ALL          |
| GET    | `/:id`                 | Chi tiết sản phẩm      | ALL          |
| POST   | `/`                    | Thêm sản phẩm mới      | ADMIN        |
| PUT    | `/:id`                 | Cập nhật sản phẩm      | ADMIN        |
| DELETE | `/:id`                 | Xóa sản phẩm           | ADMIN        |
| GET    | `/inventory/:branchId` | Tồn kho theo chi nhánh | STAFF, ADMIN |

#### 🧾 Invoices (`/api/invoices`)

| Method | Endpoint            | Mô tả               | Role            |
| ------ | ------------------- | ------------------- | --------------- |
| GET    | `/`                 | Danh sách hóa đơn   | CUSTOMER        |
| GET    | `/:id`              | Chi tiết hóa đơn    | CUSTOMER, STAFF |
| POST   | `/`                 | Tạo hóa đơn         | STAFF           |
| PUT    | `/:id/payment`      | Xác nhận thanh toán | STAFF           |
| GET    | `/branch/:branchId` | HĐ theo chi nhánh   | STAFF           |

#### 🎁 Promotions (`/api/promotions`)

| Method | Endpoint  | Mô tả                | Role  |
| ------ | --------- | -------------------- | ----- |
| GET    | `/`       | Danh sách khuyến mãi | ALL   |
| GET    | `/active` | KM đang hoạt động    | ALL   |
| POST   | `/`       | Tạo khuyến mãi       | ADMIN |
| PUT    | `/:id`    | Cập nhật khuyến mãi  | ADMIN |
| DELETE | `/:id`    | Xóa khuyến mãi       | ADMIN |

#### ⭐ Ratings (`/api/ratings`)

| Method | Endpoint              | Mô tả                | Role     |
| ------ | --------------------- | -------------------- | -------- |
| GET    | `/service/:serviceId` | Đánh giá của dịch vụ | ALL      |
| POST   | `/`                   | Gửi đánh giá         | CUSTOMER |
| PUT    | `/:id`                | Cập nhật đánh giá    | CUSTOMER |
| DELETE | `/:id`                | Xóa đánh giá         | CUSTOMER |

#### 📊 Reports (`/api/reports`)

| Method | Endpoint                   | Mô tả               | Role  |
| ------ | -------------------------- | ------------------- | ----- |
| GET    | `/revenue`                 | Báo cáo doanh thu   | ADMIN |
| GET    | `/customers/statistics`    | Thống kê khách hàng | ADMIN |
| GET    | `/employees/performance`   | Hiệu suất nhân viên | ADMIN |
| GET    | `/products/top-selling`    | Sản phẩm bán chạy   | ADMIN |
| GET    | `/vaccinations/statistics` | Thống kê tiêm phòng | ADMIN |

#### 🏢 Branches (`/api/branches`)

| Method | Endpoint | Mô tả               | Role  |
| ------ | -------- | ------------------- | ----- |
| GET    | `/`      | Danh sách chi nhánh | ALL   |
| GET    | `/:id`   | Chi tiết chi nhánh  | ALL   |
| POST   | `/`      | Tạo chi nhánh       | ADMIN |
| PUT    | `/:id`   | Cập nhật chi nhánh  | ADMIN |

#### 👨‍⚕️ Employees (`/api/employees`)

| Method | Endpoint            | Mô tả               | Role         |
| ------ | ------------------- | ------------------- | ------------ |
| GET    | `/`                 | Danh sách nhân viên | ADMIN        |
| GET    | `/:id`              | Chi tiết nhân viên  | ADMIN        |
| POST   | `/`                 | Thêm nhân viên      | ADMIN        |
| PUT    | `/:id`              | Cập nhật nhân viên  | ADMIN        |
| DELETE | `/:id`              | Xóa nhân viên       | ADMIN        |
| GET    | `/branch/:branchId` | NV theo chi nhánh   | ADMIN, STAFF |

#### 🧰 Services (`/api/services`)

| Method | Endpoint | Mô tả             | Role  |
| ------ | -------- | ----------------- | ----- |
| GET    | `/`      | Danh sách dịch vụ | ALL   |
| GET    | `/:id`   | Chi tiết dịch vụ  | ALL   |
| POST   | `/`      | Thêm dịch vụ      | ADMIN |
| PUT    | `/:id`   | Cập nhật dịch vụ  | ADMIN |

---

## 💼 Logic Nghiệp Vụ Quan Trọng

### 🏆 Hệ thống Hạng Thành Viên

| Hạng              | Điều kiện                  | Giảm giá | Điểm tích lũy |
| ----------------- | -------------------------- | -------- | ------------- |
| 🥉 **Cơ Bản**     | < 5,000,000 VND/năm        | 0%       | 1 điểm/100k   |
| 🥈 **Thân Thiết** | 5,000,000 - 20,000,000 VND | 5%       | 1 điểm/100k   |
| 🥇 **VIP**        | > 20,000,000 VND           | 10%      | 1 điểm/100k   |

- Hạng thành viên được tính dựa trên **tổng chi tiêu 12 tháng gần nhất**
- Điểm tích lũy: **1 điểm cho mỗi 100,000 VND**
- Điểm có thể đổi thưởng, giảm giá cho lần mua sau

### 💉 Gói Tiêm Phòng

| Loại gói     | Thời hạn | Ưu đãi | Lợi ích                 |
| ------------ | -------- | ------ | ----------------------- |
| Gói 6 tháng  | 6 tháng  | 5%     | Nhắc lịch tiêm tự động  |
| Gói 12 tháng | 12 tháng | 10%    | + Tư vấn miễn phí       |
| Gói 18 tháng | 18 tháng | 15%    | + Khám định kỳ miễn phí |

### 🧾 Quy trình Tính Hóa Đơn

1. **Tính tổng giá trị**: Dịch vụ + Sản phẩm
2. **Áp dụng khuyến mãi**: Giảm giá theo chương trình (nếu có)
3. **Giảm giá hội viên**: Theo hạng thành viên
4. **Tính điểm tích lũy**: 1 điểm/100k VND
5. **Thanh toán**: Tiền mặt/Chuyển khoản/Online

**Công thức:**

```
Tổng tiền = (Giá dịch vụ + Giá sản phẩm) × (1 - Giảm giá KM) × (1 - Giảm giá Hội viên)
Điểm = floor(Tổng tiền / 100000)
```

### 📅 Đặt Lịch Hẹn

- Thời gian làm việc: **8:00 - 18:00** (Thứ 2 - Chủ Nhật)
- Mỗi slot: **30 phút**
- Đặt trước tối thiểu: **2 giờ**
- Hủy lịch: Trước **4 giờ** để không bị phạt

---

## 🎨 Giao Diện & UX

### Màu Sắc Chính

```css
/* Tailwind Config */
Primary: Blue (#0ea5e9)      /* sky-500 - Tin cậy, chuyên nghiệp */
Success: Green (#10b981)     /* emerald-500 - Thành công */
Warning: Amber (#f59e0b)     /* amber-500 - Cảnh báo */
Danger: Red (#ef4444)        /* red-500 - Lỗi, hủy */
Neutral: Gray (#6b7280)      /* gray-500 - Văn bản phụ */
```

### Responsive Breakpoints

```javascript
// Tailwind Breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet portrait
lg: '1024px'  // Tablet landscape
xl: '1280px'  // Desktop
2xl: '1536px' // Large desktop
```

### Component Library

Sử dụng **shadcn/ui** với Radix UI primitives:

- Button, Input, Select, Textarea
- Dialog, AlertDialog, Sheet
- Dropdown Menu, Context Menu
- Card, Badge, Avatar
- Table, Pagination
- Toast notifications
- Progress bars

---

## 🔐 Bảo Mật

### Authentication Flow

1. User login → Server xác thực
2. Server tạo JWT token (expire: 7 days)
3. Client lưu token vào localStorage
4. Mỗi request đính kèm token trong header
5. Server verify token qua middleware
6. Grant/Deny access dựa trên role

### Password Security

- Hash với **bcryptjs** (salt rounds: 10)
- Độ dài tối thiểu: 6 ký tự
- Không lưu plaintext password

### Authorization

```javascript
// Middleware examples
requireAuth(); // Yêu cầu đăng nhập
requireRole("ADMIN"); // Chỉ admin
requireRole(["ADMIN", "NHAN_VIEN"]); // Admin hoặc Staff
```

---

## 📊 Database Schema

### Core Tables

```sql
-- Users & Auth
TaiKhoan (MaTK, TenDangNhap, MatKhau, LoaiTK, TrangThai)
KhachHang (MaKH, MaTK, HoTen, SDT, Email, DiaChi, NgaySinh)
NhanVien (MaNV, MaTK, MaCN, HoTen, SDT, ChucVu, Luong)

-- Pet Management
ThuCung (MaTC, MaKH, TenTC, Loai, Giong, GioiTinh, NgaySinh, MoTa)

-- Services
ChiNhanh (MaCN, TenCN, DiaChi, SDT, GioMoCua, GioDongCua)
DichVu (MaDV, TenDV, LoaiDV, Gia, MoTa)
LichHen (MaLH, MaKH, MaTC, MaCN, MaDV, NgayHen, GioHen, TrangThai)

-- Medical
KhamBenh (MaKB, MaTC, MaNV, MaCN, NgayKham, ChanDoan, DieuTri, GhiChu)
TiemPhong (MaTiem, MaTC, MaNV, MaCN, NgayTiem, LoaiVacxin, LieuLuong)
GoiTiem (MaGoi, TenGoi, MoTa, ThoiHan, GiamGia)

-- Products & Inventory
SanPham (MaSP, TenSP, LoaiSP, DonGia, MoTa, HinhAnh)
TonKho (MaCN, MaSP, SoLuong, NgayCapNhat)

-- Billing
HoaDon (MaHD, MaKH, MaNV, MaCN, NgayLap, TongTien, PhuongThuc, TrangThai)
ChiTietHoaDon (MaHD, MaSP/MaDV, SoLuong, DonGia, ThanhTien)

-- Loyalty & Marketing
HangThanhVien (MaHang, TenHang, DieuKien, GiamGia)
DiemTichLuy (MaKH, TongDiem, NgayCapNhat)
KhuyenMai (MaKM, TenKM, LoaiKM, GiaTri, NgayBD, NgayKT)

-- Feedback
DanhGia (MaDG, MaKH, MaDV, DiemSo, BinhLuan, NgayDG)
```

### Relationships

- 1 Khách hàng → N Thú cưng
- 1 Thú cưng → N Lịch hẹn/Khám bệnh/Tiêm phòng
- 1 Chi nhánh → N Nhân viên, Tồn kho, Lịch hẹn
- 1 Hóa đơn → N Chi tiết hóa đơn

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm run lint          # ESLint checking
npm run build         # Test production build
```

---

## 📝 Coding Standards

### Backend (Node.js)

```javascript
// Naming Conventions
- Variables/Functions: camelCase (getUserById, totalAmount)
- Classes: PascalCase (InvoiceService, AuthController)
- Constants: UPPER_SNAKE_CASE (JWT_SECRET, MAX_UPLOAD_SIZE)
- Files: kebab-case (auth.controller.js, invoice.service.js)

// Async/Await
const getUser = async (userId) => {
  try {
    const user = await UserService.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

// Error Handling
- Use try-catch for async operations
- Throw meaningful errors
- Use express-validator for input validation
```

### Frontend (React)

```javascript
// Component Structure
- Functional components with hooks
- Props destructuring
- PropTypes for type checking (if needed)

// Naming Conventions
- Components: PascalCase (UserProfile.jsx, ProductCard.jsx)
- Files: PascalCase for components, camelCase for utils
- Functions: camelCase (handleSubmit, fetchUserData)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)

// Hooks
- useState for local state
- useEffect for side effects
- Custom hooks: useAuth, useCart, useToast

// Styling
- Tailwind utility classes
- Component-scoped CSS modules (if needed)
- Responsive: mobile-first approach
```

---

## 🚧 Tính Năng Dự Kiến (Roadmap)

### Version 2.0

- [ ] 📧 **Email Notifications**: Gửi email xác nhận đặt lịch, hóa đơn
- [ ] 📱 **SMS Reminders**: Nhắc lịch hẹn qua SMS
- [ ] 🔔 **Real-time Notifications**: WebSocket/Socket.io
- [ ] 📄 **Invoice PDF Export**: Xuất hóa đơn PDF
- [ ] 📸 **Image Upload**: Upload ảnh thú cưng, sản phẩm
- [ ] 💳 **Payment Gateway**: Tích hợp VNPay, Momo
- [ ] 📊 **Advanced Analytics**: Dashboard với nhiều biểu đồ hơn
- [ ] 🌐 **Multi-language**: Hỗ trợ tiếng Anh

### Version 3.0

- [ ] 📱 **Mobile App**: React Native app
- [ ] 🤖 **Chatbot**: Tư vấn tự động
- [ ] 🗓️ **Calendar Integration**: Đồng bộ Google Calendar
- [ ] 📦 **Inventory Alerts**: Cảnh báo tồn kho thấp
- [ ] 🎯 **Marketing Automation**: Email campaigns
- [ ] 📈 **Predictive Analytics**: Dự đoán xu hướng

---

## 🐛 Known Issues

### Backend

- ⚠️ File upload chưa được implement
- ⚠️ Email service chưa có
- ⚠️ Thiếu unit tests
- ⚠️ API documentation (Swagger) chưa hoàn thiện

### Frontend

- ⚠️ Loading states chưa đồng nhất
- ⚠️ Error boundaries chưa đầy đủ
- ⚠️ Image lazy loading chưa optimize
- ⚠️ Bundle size có thể tối ưu hơn
- ⚠️ Accessibility (a11y) cần cải thiện

---

## 🤝 Đóng Góp

### Quy trình Contribution

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Commit Message Convention

```
feat: Thêm tính năng mới
fix: Sửa lỗi
docs: Cập nhật documentation
style: Format code, không ảnh hưởng logic
refactor: Refactor code
test: Thêm tests
chore: Cập nhật dependencies, config
```

---

## 📞 Liên Hệ & Hỗ Trợ

**Dự án đồ án môn**: Cơ Sở Dữ Liệu Nâng Cao  
**Năm học**: 2024-2025

### Team Members

- 👨‍💻 Backend Developer 1 - Auth & User Management
- 👨‍💻 Backend Developer 2 - Core Services
- 👨‍💻 Backend Developer 3 - Business & Admin
- 🎨 Frontend Developer 1 - Customer & Staff UI
- 🎨 Frontend Developer 2 - Admin & Shared Components

---

## 📜 License

Dự án này được phát triển cho mục đích **học tập và nghiên cứu**.  
Không dùng cho mục đích thương mại.

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives
- [Recharts](https://recharts.org/) - Chart library
- [Lucide Icons](https://lucide.dev/) - Icon library

---

<div align="center">

**Made with ❤️ by CSDLNC Team**

⭐ Nếu project hữu ích, hãy cho chúng tôi một star!
