import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CustomerHome from "./pages/customer/CustomerHome.jsx"; // Trang chủ (/)
import ServicesPage from "./pages/services/ServicesPage.jsx"; // Dịch vụ (/services)
import ProductsPage from "./pages/products/ProductsPage.jsx"; // Sản phẩm (/products)
import AboutPage from "./pages/about/AboutPage.jsx"; // Về chúng tôi (/about)
import BranchesPage from "./pages/branches/BranchesPage.jsx"; // Chọn chi nhánh (/branches)
import ProductsListContent from "./pages/products-list/ProductsListContent.jsx"; // Danh sách sản phẩm (/products-list)
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx"; // Thanh toán (/checkout)
import AppointmentsPage from "./pages/appointments/AppointmentsPage.jsx"; // Quản lý lịch hẹn (/appointments)
import PetsPage from "./pages/pets/PetsPage.jsx"; // Hồ sơ thú cưng (/pets)
import ProfilePage from "./pages/profile/ProfilePage.jsx"; // Hồ sơ cá nhân (/profile)
import ReviewsPage from "./pages/reviews/ReviewPage.jsx"; // Lịch sử đánh giá (/reviews)
import VaccinationPackagesPage from "./pages/vaccination-packages/VaccinationPackagesPage.jsx"; // Gói tiêm phòng (/vaccination-packages)

// =========================================================
// 2. IMPORT CÁC COMPONENT KHU VỰC NHÂN VIÊN & ADMIN
// =========================================================
// Auth
import LoginPage from "./pages/login/LoginPage.jsx"; // Đăng nhập (/auth/login)
import RegisterPage from "./pages/register/RegisterPage.jsx"; // Đăng ký (/auth/register)

// Staff
import StaffDemoPage from "./pages/staff/demo/StaffDemoPage.jsx"; // Dashboard nhân viên (/staff/demo)
import CreateRecordPage from "./pages/staff/create-record/CreateRecordPage.jsx"; // Tạo hồ sơ (/staff/create-record)
import InvoicePage from "./pages/staff/invoice/InvoicePage.jsx"; // Lập hóa đơn (/staff/invoice)
import WorkSchedulePage from "./pages/staff/work-schedule/WorkSchedulePage.jsx"; // Lịch làm việc (/staff/work-schedule)
import MedicalRecordsPage from "./pages/staff/medical-records/MedicalRecordsPage.jsx"; // Cập nhật hồ sơ khám bệnh (/staff/medical-records)
import VaccinationRecordsPage from "./pages/staff/vaccination-records/VaccinationRecordsPage.jsx"; // Cập nhật hồ sơ tiêm phòng (/staff/vaccination-records)

// Admin
import AdminDemo from "./pages/admin/demo/AdminDemo.jsx"; // Dashboard Admin (/admin/demo)
import ManagementPage from "./pages/admin/management/ManagementPage.jsx"; // Quản lý (/admin/management)
import StatisticsPage from "./pages/admin/statistics/StatisticsPage.jsx"; // Thống kê (/admin/statistics)

// Admin Management Components
import BranchManagement from "./pages/admin/management/components/BranchManagement.jsx"; // Quản lý chi nhánh
import EmployeeManagement from "./pages/admin/management/components/EmployeeManagement.jsx"; // Quản lý nhân viên
import EmployeeTransferHistory from "./pages/admin/management/components/EmployeeTransferHistory.jsx"; // Lịch sử điều động
import ProductManagement from "./pages/admin/management/components/ProductManagement.jsx"; // Quản lý sản phẩm
import ProductstockManagement from "./pages/admin/management/components/ProductstockManagement.jsx"; // Quản lý kho sản phẩm
import PromotionManagement from "./pages/admin/management/components/PromotionManagement.jsx"; // Quản lý khuyến mãi
import ServiceManagement from "./pages/admin/management/components/ServiceManagement.jsx"; // Quản lý dịch vụ
import VaccineManagement from "./pages/admin/management/components/VaccineManagement.jsx"; // Quản lý vắc-xin
import VaccinestockManagement from "./pages/admin/management/components/VaccinestockManagement.jsx"; // Quản lý kho vắc-xin

// Admin Statistics Components
import RevenueStats from "./pages/admin/statistics/components/RevenueStats.jsx"; // Thống kê doanh thu
import ProductStats from "./pages/admin/statistics/components/ProductStats.jsx"; // Thống kê sản phẩm
import VaccineStats from "./pages/admin/statistics/components/VaccineStats.jsx"; // Thống kê vắc-xin
import ServiceStats from "./pages/admin/statistics/components/ServiceStats.jsx"; // Thống kê dịch vụ
import CustomerStats from "./pages/admin/statistics/components/CustomerStats.jsx"; // Thống kê khách hàng
import PerformanceStats from "./pages/admin/statistics/components/PerformanceStats.jsx"; // Thống kê hiệu suất

// =========================================================
// 3. ĐỊNH TUYẾN CHÍNH
// =========================================================
function App() {
  return (
    <Router>
      <Routes>
        {/* === PHÂN KHU KHÁCH HÀNG (CUSTOMER) === */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* CÔNG CỤ */}
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/products-list" element={<ProductsListContent />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />

        {/* HỒ SƠ NGƯỜI DÙNG */}
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route
          path="/vaccination-packages"
          element={<VaccinationPackagesPage />}
        />

        {/* === PHÂN KHU XÁC THỰC (AUTH) === */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        {/* Định tuyến tiện lợi (cho Link đơn giản): */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* === PHÂN KHU NHÂN VIÊN (STAFF) === */}
        <Route path="/staff/demo" element={<StaffDemoPage />} />
        <Route path="/staff/create-record" element={<CreateRecordPage />} />
        <Route path="/staff/invoice" element={<InvoicePage />} />
        <Route path="/staff/work-schedule" element={<WorkSchedulePage />} />
        <Route path="/staff/medical-records" element={<MedicalRecordsPage />} />
        <Route
          path="/staff/vaccination-records"
          element={<VaccinationRecordsPage />}
        />

        {/* === PHÂN KHU QUẢN TRỊ (ADMIN) === */}
        <Route path="/admin/demo" element={<AdminDemo />} />
        <Route path="/admin/management" element={<ManagementPage />} />

        {/* Admin Management Routes */}
        <Route path="/admin/management/branch" element={<BranchManagement />} />
        <Route
          path="/admin/management/employee"
          element={<EmployeeManagement />}
        />
        <Route
          path="/admin/management/transfer"
          element={<EmployeeTransferHistory />}
        />
        <Route
          path="/admin/management/product"
          element={<ProductManagement />}
        />
        <Route
          path="/admin/management/products-stock"
          element={<ProductstockManagement />}
        />
        <Route
          path="/admin/management/promotion"
          element={<PromotionManagement />}
        />
        <Route
          path="/admin/management/service"
          element={<ServiceManagement />}
        />
        <Route
          path="/admin/management/vaccine"
          element={<VaccineManagement />}
        />
        <Route
          path="/admin/management/vaccines-stock"
          element={<VaccinestockManagement />}
        />

        <Route path="/admin/statistics" element={<StatisticsPage />} />

        {/* Admin Statistics Routes */}
        <Route path="/admin/statistics/revenue" element={<RevenueStats />} />
        <Route path="/admin/statistics/product" element={<ProductStats />} />
        <Route path="/admin/statistics/vaccine" element={<VaccineStats />} />
        <Route path="/admin/statistics/service" element={<ServiceStats />} />
        <Route path="/admin/statistics/customer" element={<CustomerStats />} />
        <Route
          path="/admin/statistics/performance"
          element={<PerformanceStats />}
        />

        {/* === 404 NOT FOUND (Có thể thêm một component riêng cho 404) === */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
