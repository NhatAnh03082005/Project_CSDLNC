# PetCareX Frontend

Frontend web application cho hệ thống quản lý chuỗi trung tâm chăm sóc thú cưng.

## Công nghệ sử dụng

- **React 18** - UI Library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── api/                # API client & services
│   │   ├── axios.js       # Axios instance với interceptors
│   │   └── services.js    # API endpoints
│   ├── components/        # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── forms/         # Form components
│   │   └── modals/        # Modal dialogs
│   ├── layouts/           # Layout components
│   │   ├── CustomerLayout.jsx    # Layout cho khách hàng
│   │   ├── EmployeeLayout.jsx    # Layout cho nhân viên
│   │   ├── AdminLayout.jsx       # Layout cho quản trị
│   │   └── AuthLayout.jsx        # Layout cho auth pages
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── customer/      # Customer pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyPets.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── MedicalHistory.jsx
│   │   │   ├── Products.jsx
│   │   │   └── Membership.jsx
│   │   ├── employee/      # Employee pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── CreateInvoice.jsx
│   │   │   └── MedicalRecords.jsx
│   │   └── admin/         # Admin pages
│   │       ├── Dashboard.jsx
│   │       ├── BranchManagement.jsx
│   │       ├── EmployeeManagement.jsx
│   │       ├── ProductManagement.jsx
│   │       └── Reports.jsx
│   ├── store/             # State management
│   │   └── authStore.js   # Auth state (Zustand)
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component với routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## Cài đặt

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App sẽ chạy tại: `http://localhost:5173`

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## Phân quyền & Routing

### Khách hàng (`/customer/*`)
- Dashboard
- Quản lý thú cưng
- Đặt lịch hẹn
- Xem lịch sử khám/tiêm
- Mua sản phẩm
- Xem điểm & hạng thành viên

### Nhân viên (`/employee/*`)
- Dashboard
- Xem lịch hẹn
- Lập hóa đơn
- Cập nhật hồ sơ khám/tiêm
- Quản lý tồn kho

### Quản trị (`/admin/*`)
- Dashboard & Analytics
- Quản lý chi nhánh
- Quản lý nhân viên
- Quản lý sản phẩm & dịch vụ
- Quản lý khuyến mãi
- Báo cáo & thống kê

## State Management

Sử dụng **Zustand** cho quản lý state:

- `authStore` - User authentication & authorization
- Có thể mở rộng thêm các stores khác khi cần

## API Integration

File `src/api/services.js` chứa tất cả API endpoints được nhóm theo module:

- `authAPI` - Authentication
- `customerAPI` - Customer operations
- `petAPI` - Pet management
- `appointmentAPI` - Appointments
- `branchAPI` - Branch management
- `productAPI` - Product management
- `invoiceAPI` - Invoice operations
- `reportAPI` - Reports & statistics

## Styling với Tailwind CSS

Các utility classes được định nghĩa trong `src/index.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input` - Input field

## Phân công công việc (2 members)

### Frontend Member 1: Customer & Employee Features
- Layouts: `CustomerLayout`, `EmployeeLayout`
- Pages: `customer/*`, `employee/*`
- Components: Pet management, Appointments, Medical records
- Forms: Add pet, Book appointment, Create invoice

### Frontend Member 2: Admin & Shared Components
- Layouts: `AdminLayout`, `AuthLayout`
- Pages: `auth/*`, `admin/*`
- Components: Tables, Charts, Filters
- Forms: Branch, Employee, Product management
- Reports & Analytics

## Components cần phát triển thêm

### Common Components
- `Button` - Reusable button component
- `Input` - Form input with validation
- `Select` - Dropdown select
- `Modal` - Dialog modal
- `Table` - Data table with sorting/filtering
- `Card` - Content card
- `Badge` - Status badge
- `Pagination` - List pagination
- `DatePicker` - Date selection
- `SearchBox` - Search input with autocomplete

### Form Components
- `PetForm` - Add/Edit pet
- `AppointmentForm` - Book appointment
- `InvoiceForm` - Create invoice
- `BranchForm` - Add/Edit branch
- `EmployeeForm` - Add/Edit employee
- `ProductForm` - Add/Edit product

### Feature Components
- `PetCard` - Display pet info
- `AppointmentCard` - Display appointment
- `InvoiceTable` - Invoice list
- `RevenueChart` - Revenue chart (Recharts)
- `CustomerStats` - Customer statistics
- `VaccinationSchedule` - Vaccination timeline

## Best Practices

1. **Component Structure**: Function components với hooks
2. **Styling**: Tailwind CSS utility classes
3. **State**: Zustand cho global state, useState/useReducer cho local
4. **Forms**: React Hook Form cho validation
5. **API Calls**: Async/await trong try-catch
6. **Error Handling**: Display user-friendly error messages
7. **Loading States**: Show loading indicators
8. **Protected Routes**: Check authentication & authorization
9. **Code Splitting**: Lazy load routes khi cần
10. **Responsive**: Mobile-first design
