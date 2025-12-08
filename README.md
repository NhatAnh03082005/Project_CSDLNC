# 🐾 HỆ THỐNG PETCAREX - QUẢN LÝ CHUỖI TRUNG TÂM CHĂM SÓC THÚ CƯNG

## 📋 Tổng quan dự án

Hệ thống **PetCareX** quản lý chuỗi 10 chi nhánh trung tâm chăm sóc thú cưng tại các thành phố lớn, bao gồm:

- ✅ Dịch vụ khám bệnh & tiêm phòng
- 🛒 Cửa hàng bán thức ăn, phụ kiện, thuốc
- 👥 Quản lý khách hàng & chương trình hội viên
- 📊 Báo cáo & thống kê toàn hệ thống

## 🎯 Các Actor chính

1. **👤 Khách hàng** - Quản lý thú cưng, đặt lịch, mua hàng, tích điểm
2. **👨‍⚕️ Nhân viên** - Lập hóa đơn, cập nhật hồ sơ khám/tiêm, quản lý lịch hẹn
3. **👨‍💼 Quản trị** - Quản lý toàn hệ thống, báo cáo, thống kê

## 🏗️ Cấu trúc dự án

```
Project/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database, JWT, constants
│   │   ├── modules/          # Nghiệp vụ chính (13 modules)
│   │   │   ├── auth/        # Xác thực & phân quyền
│   │   │   ├── customers/   # Quản lý khách hàng
│   │   │   ├── pets/        # Quản lý thú cưng
│   │   │   ├── branches/    # Quản lý chi nhánh
│   │   │   ├── employees/   # Quản lý nhân viên
│   │   │   ├── appointments/# Lịch hẹn
│   │   │   ├── medical/     # Hồ sơ khám bệnh
│   │   │   ├── vaccinations/# Tiêm phòng & gói tiêm
│   │   │   ├── products/    # Sản phẩm & tồn kho
│   │   │   ├── invoices/    # Hóa đơn
│   │   │   ├── membership/  # Hội viên & điểm loyalty
│   │   │   ├── promotions/  # Khuyến mãi
│   │   │   ├── ratings/     # Đánh giá dịch vụ
│   │   │   └── reports/     # Báo cáo & thống kê
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   └── README.md
│
└── frontend/          # React + Vite + Tailwind CSS
    ├── src/
    │   ├── api/              # Axios & API services
    │   ├── components/       # Reusable components
    │   ├── layouts/          # Layout cho từng role
    │   │   ├── CustomerLayout.jsx
    │   │   ├── EmployeeLayout.jsx
    │   │   ├── AdminLayout.jsx
    │   │   └── AuthLayout.jsx
    │   ├── pages/            # Pages theo role
    │   │   ├── auth/        # Login, Register
    │   │   ├── customer/    # 6 pages
    │   │   ├── employee/    # 4 pages
    │   │   └── admin/       # 5 pages
    │   ├── store/           # Zustand state management
    │   ├── utils/           # Helper functions
    │   ├── App.jsx          # Routing & Protected routes
    │   └── main.jsx         # Entry point
    └── README.md
```

## 🚀 Hướng dẫn cài đặt

### Prerequisites

- Node.js >= 16.x
- MySQL >= 8.0
- npm hoặc yarn

### 1. Clone repository

```bash
cd d:\CSDLNC\Project
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 4. Setup Database

Tạo database MySQL:

```sql
CREATE DATABASE petcarex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Chạy migration/seeding (sẽ được tạo sau):

```bash
cd backend
npm run migrate
npm run seed
```

## 📦 Công nghệ sử dụng

### Backend

- **Node.js** + **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **cors** - CORS handling

### Frontend

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## 👥 Phân công công việc (5 members)

### 👨‍💻 Backend Team (3 members)

#### Member 1: Authentication & User Management

**Modules:**

- `auth/` - Đăng ký, đăng nhập, JWT
- `customers/` - CRUD khách hàng
- `employees/` - CRUD nhân viên
- `membership/` - Hội viên, điểm loyalty

**Nhiệm vụ:**

- Implement JWT authentication
- Password hashing với bcrypt
- Role-based authorization middleware
- Customer registration & profile management
- Employee management (CRUD)
- Membership tier calculation
- Loyalty points logic

#### Member 2: Core Services

**Modules:**

- `pets/` - Quản lý thú cưng
- `appointments/` - Đặt lịch hẹn
- `medical/` - Hồ sơ khám bệnh
- `vaccinations/` - Tiêm phòng & gói tiêm
- `ratings/` - Đánh giá dịch vụ

**Nhiệm vụ:**

- Pet CRUD operations
- Appointment booking system
- Available time slots calculation
- Medical record management
- Vaccination tracking
- Vaccination package subscriptions
- Rating system

#### Member 3: Business & Admin

**Modules:**

- `branches/` - Quản lý chi nhánh
- `products/` - Sản phẩm & tồn kho
- `invoices/` - Lập hóa đơn
- `promotions/` - Khuyến mãi
- `reports/` - Báo cáo & thống kê

**Nhiệm vụ:**

- Branch management
- Product & inventory management
- Invoice creation with complex calculations
- Promotion logic & application
- Revenue reports
- Customer statistics
- Employee performance reports
- Dashboard analytics

### 🎨 Frontend Team (2 members)

#### Member 1: Customer & Employee UI

**Layouts:**

- `CustomerLayout.jsx`
- `EmployeeLayout.jsx`

**Pages:**

- `auth/` - Login, Register
- `customer/` - Dashboard, MyPets, Appointments, MedicalHistory, Products, Membership
- `employee/` - Dashboard, Schedule, CreateInvoice, MedicalRecords

**Components:**

- PetCard, PetForm
- AppointmentCard, AppointmentForm
- InvoiceForm, InvoiceTable
- MedicalRecordCard
- ProductCard, ProductList

**Nhiệm vụ:**

- Auth pages với validation
- Customer dashboard & features
- Pet management UI
- Appointment booking flow
- Medical history display
- Product browsing & purchase
- Membership tier display
- Employee schedule view
- Invoice creation form

#### Member 2: Admin & Shared Components

**Layouts:**

- `AdminLayout.jsx`
- `AuthLayout.jsx`

**Pages:**

- `admin/` - Dashboard, BranchManagement, EmployeeManagement, ProductManagement, Reports

**Shared Components:**

- Button, Input, Select, Modal
- Table with sorting/filtering
- Card, Badge, Pagination
- DatePicker, SearchBox
- Charts (Recharts integration)

**Nhiệm vụ:**

- Admin dashboard với charts
- Branch management CRUD
- Employee management CRUD
- Product & inventory management
- Promotion management
- Reports & analytics UI
- Reusable form components
- Data tables with filters
- Charts & visualizations

## 📚 Tài liệu API

### Base URL

```
http://localhost:3000/api
```

### Authentication

Tất cả các protected endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

### Main Endpoints

#### Authentication (`/auth`)

- `POST /register` - Đăng ký khách hàng
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `GET /me` - User hiện tại

#### Customers (`/customers`) - KHACH_HANG

- `GET /profile` - Xem profile
- `PUT /profile` - Cập nhật profile
- `GET /membership` - Thông tin hội viên

#### Pets (`/pets`) - KHACH_HANG

- `GET /` - Danh sách thú cưng
- `POST /` - Thêm thú cưng
- `PUT /:id` - Cập nhật thú cưng
- `DELETE /:id` - Xóa thú cưng

#### Appointments (`/appointments`)

- `GET /` - Danh sách lịch hẹn
- `POST /` - Đặt lịch (KHACH_HANG)
- `PUT /:id/cancel` - Hủy lịch
- `GET /schedule` - Lịch theo chi nhánh (NHAN_VIEN)

#### Invoices (`/invoices`) - NHAN_VIEN

- `POST /` - Lập hóa đơn
- `GET /:id` - Chi tiết hóa đơn
- `GET /` - Danh sách hóa đơn

#### Reports (`/reports`) - QUAN_TRI

- `GET /revenue` - Báo cáo doanh thu
- `GET /customers` - Thống kê khách hàng
- `GET /vaccinations` - Thống kê vacxin
- `GET /employees/performance` - Hiệu suất NV

_(Xem chi tiết trong `backend/README.md`)_

## 🎨 UI/UX Design

### Color Scheme

- **Primary**: Blue (`#0ea5e9`) - Tin cậy, chuyên nghiệp
- **Success**: Green - Hoàn thành, thành công
- **Warning**: Yellow - Cảnh báo
- **Danger**: Red - Lỗi, hủy

### Responsive Design

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Hệ thống phân quyền

### KHACH_HANG

- Quản lý thú cưng cá nhân
- Đặt lịch hẹn
- Xem lịch sử khám/tiêm
- Mua sản phẩm
- Xem điểm & hạng thành viên
- Đánh giá dịch vụ

### NHAN_VIEN

- Xem lịch hẹn chi nhánh
- Lập hóa đơn
- Cập nhật hồ sơ khám/tiêm
- Cập nhật tồn kho

### QUAN_TRI

- Toàn quyền quản lý hệ thống
- Quản lý chi nhánh, nhân viên
- Quản lý sản phẩm, dịch vụ
- Tạo/quản lý khuyến mãi
- Xem báo cáo & thống kê

## 💰 Logic nghiệp vụ quan trọng

### Hạng thành viên

| Hạng       | Tổng tiền/năm | Giảm giá | Điểm/100k VND |
| ---------- | ------------- | -------- | ------------- |
| Cơ Bản     | < 5 triệu     | 0%       | 1 điểm        |
| Thân Thiết | 5-20 triệu    | 5%       | 1 điểm        |
| VIP        | > 20 triệu    | 10%      | 1 điểm        |

### Gói tiêm phòng

- Gói 6 tháng: Ưu đãi 5%
- Gói 12 tháng: Ưu đãi 10%
- Gói 18 tháng: Ưu đãi 15%

### Tính hóa đơn

1. Tính tổng tiền dịch vụ/sản phẩm
2. Áp dụng khuyến mãi (nếu có)
3. Áp dụng giảm giá theo hạng thành viên
4. Tính điểm loyalty cộng thêm

## 📊 Database Schema (Tóm tắt)

### Core Tables

- `KhachHang` - Khách hàng
- `ThuCung` - Thú cưng
- `ChiNhanh` - Chi nhánh
- `NhanVien` - Nhân viên
- `TaiKhoan` - Tài khoản đăng nhập

### Service Tables

- `LichHen` - Lịch hẹn
- `KhamBenh` - Hồ sơ khám
- `TiemPhong` - Lần tiêm
- `GoiTiem` - Gói tiêm phòng

### Business Tables

- `SanPham` - Sản phẩm
- `TonKho` - Tồn kho theo chi nhánh
- `HoaDon` - Hóa đơn
- `ChiTietHoaDon` - Chi tiết hóa đơn

### Other Tables

- `KhuyenMai` - Chương trình khuyến mãi
- `DanhGia` - Đánh giá dịch vụ
- `LichSuDieuDong` - Lịch sử điều động NV
- `LichSuDiem` - Lịch sử tích điểm

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📝 Coding Standards

### Backend

- ESLint + Prettier
- Naming: camelCase cho biến/hàm, PascalCase cho class
- Async/await cho async operations
- Error handling với try-catch
- Validation với express-validator

### Frontend

- ESLint + Prettier
- Function components với hooks
- Props validation với PropTypes
- Naming: PascalCase cho components, camelCase cho functions
- CSS: Tailwind utility classes

## 🐛 Known Issues & TODO

### Backend

- [ ] Implement email notification
- [ ] Add file upload (pet images, reports)
- [ ] Implement real-time notifications (Socket.io)
- [ ] Add unit tests
- [ ] API documentation với Swagger

### Frontend

- [ ] Add loading skeletons
- [ ] Implement image upload preview
- [ ] Add print invoice feature
- [ ] Optimize bundle size
- [ ] Add E2E tests với Cypress

## 📞 Support & Contact

Đây là project đồ án sinh viên cho môn Cơ Sở Dữ Liệu Nâng Cao.

## 📜 License

Dự án này chỉ phục vụ mục đích học tập.

---

**Chúc các bạn code vui vẻ! 🚀🐾**
