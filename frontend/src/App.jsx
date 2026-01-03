import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./components/layout/mainlayout.jsx";

// Customer & Public Pages
import CustomerHome from "./pages/customer/CustomerHome.jsx";
import ServicesPage from "./pages/services/ServicesPage.jsx";
import ProductsPage from "./pages/products/ProductsPage.jsx";
import AboutPage from "./pages/about/AboutPage.jsx";
import BranchesPage from "./pages/branches/BranchesPage.jsx";
import ProductsListContent from "./pages/products-list/ProductsListContent.jsx";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage.jsx";
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";
import AppointmentsPage from "./pages/appointments/AppointmentsPage.jsx";
import PetsPage from "./pages/pets/PetsPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ReviewsPage from "./pages/reviews/ReviewPage.jsx";
import VaccinationPackagesPage from "./pages/vaccination-packages/VaccinationPackagesPage.jsx";
import InvoiceDetailPage from "./pages/invoicesDetailPage/InvoicesDetailPage.jsx";
import CustomerInvoicesPage from "./pages/CustomerInvoicesPage/CustomerInvoicesPage.jsx";
import CustomerOrdersPage from "./pages/orders/CustomerOrdersPage.jsx";
import OrderDetailPage from "./pages/orders/OrderDetailPage.jsx";

// Auth Pages
import LoginPage from "./pages/login/LoginPage.jsx";
import RegisterPage from "./pages/register/RegisterPage.jsx";

// Staff Pages
import StaffDemoPage from "./pages/staff/demo/StaffDemoPage.jsx";
import CreateRecordPage from "./pages/staff/create-record/CreateRecordPage.jsx";
import PendingOrdersPage from "./pages/staff/orders/PendingOrdersPage.jsx";
import InvoicePage from "./pages/staff/invoice/InvoicePage.jsx";
import WorkSchedulePage from "./pages/staff/work-schedule/WorkSchedulePage.jsx";
import MedicalRecordsPage from "./pages/staff/medical-records/MedicalRecordsPage.jsx";
import VaccinationRecordsPage from "./pages/staff/vaccination-records/VaccinationRecordsPage.jsx";

// Admin Base Pages
import AdminDemo from "./pages/admin/demo/AdminDemo.jsx";
import ManagementPage from "./pages/admin/management/ManagementPage.jsx";
import StatisticsPage from "./pages/admin/statistics/StatisticsPage.jsx";

// Admin Management Components (from feature/admin)
import BranchManagement from "./pages/admin/management/components/BranchManagement.jsx";
import EmployeeManagement from "./pages/admin/management/components/EmployeeManagement.jsx";
import EmployeeTransferHistory from "./pages/admin/management/components/EmployeeTransferHistory.jsx";
import ProductManagement from "./pages/admin/management/components/ProductManagement.jsx";
import ProductstockManagement from "./pages/admin/management/components/ProductstockManagement.jsx";
import PromotionManagement from "./pages/admin/management/components/PromotionManagement.jsx";
import ServiceManagement from "./pages/admin/management/components/ServiceManagement.jsx";
import VaccineManagement from "./pages/admin/management/components/VaccineManagement.jsx";
import VaccinestockManagement from "./pages/admin/management/components/VaccinestockManagement.jsx";

// Admin Statistics Components (from feature/admin)
import RevenueStats from "./pages/admin/statistics/components/RevenueStats.jsx";
import ProductStats from "./pages/admin/statistics/components/ProductStats.jsx";
import VaccineStats from "./pages/admin/statistics/components/VaccineStats.jsx";
import ServiceStats from "./pages/admin/statistics/components/ServiceStats.jsx";
import CustomerStats from "./pages/admin/statistics/components/CustomerStats.jsx";
import PerformanceStats from "./pages/admin/statistics/components/PerformanceStats.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* === PHÂN KHU NGƯỜI DÙNG CÓ LAYOUT CHUNG === */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<CustomerHome />} />
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route
            path="/vaccination-packages"
            element={<VaccinationPackagesPage />}
          />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/invoices" element={<CustomerInvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/orders" element={<CustomerOrdersPage />} />
          <Route path="/orders/:maHoaDon" element={<OrderDetailPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>

        {/* === CÁC TRANG PUBLIC KHÔNG LAYOUT HOẶC LAYOUT RIÊNG === */}
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/products-list" element={<ProductsListContent />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* === PHÂN KHU XÁC THỰC (AUTH) === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* === PHÂN KHU NHÂN VIÊN (STAFF) === */}
        <Route path="/staff/demo" element={<StaffDemoPage />} />
        <Route path="/staff/create-record" element={<CreateRecordPage />} />
        <Route path="/staff/orders" element={<PendingOrdersPage />} />
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

        {/* Admin Management Detail Routes */}
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
        {/* Admin Statistics Detail Routes */}
        <Route path="/admin/statistics/revenue" element={<RevenueStats />} />
        <Route path="/admin/statistics/product" element={<ProductStats />} />
        <Route path="/admin/statistics/vaccine" element={<VaccineStats />} />
        <Route path="/admin/statistics/service" element={<ServiceStats />} />
        <Route path="/admin/statistics/customer" element={<CustomerStats />} />
        <Route
          path="/admin/statistics/performance"
          element={<PerformanceStats />}
        />

        {/* === 404 NOT FOUND === */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
