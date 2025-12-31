import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import CustomerHome from './pages/customer/CustomerHome.jsx';
import ServicesPage from './pages/services/ServicesPage.jsx';
import ProductsPage from './pages/products/ProductsPage.jsx';
import AboutPage from './pages/about/AboutPage.jsx';
import BranchesPage from './pages/branches/BranchesPage.jsx';
import ProductsListContent from './pages/products-list/ProductsListContent.jsx';
import ProductDetailPage from './pages/product-detail/ProductDetailPage.jsx';
import CheckoutPage from './pages/checkout/CheckoutPage.jsx';
import AppointmentsPage from './pages/appointments/AppointmentsPage.jsx';
import PetsPage from './pages/pets/PetsPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import ReviewsPage from './pages/reviews/ReviewPage.jsx';
import VaccinationPackagesPage from './pages/vaccination-packages/VaccinationPackagesPage.jsx';

import LoginPage from './pages/login/LoginPage.jsx';
import RegisterPage from './pages/register/RegisterPage.jsx';

import StaffDemoPage from './pages/staff/demo/StaffDemoPage.jsx';
import CreateRecordPage from './pages/staff/create-record/CreateRecordPage.jsx';
import InvoicePage from './pages/staff/invoice/InvoicePage.jsx';
import WorkSchedulePage from './pages/staff/work-schedule/WorkSchedulePage.jsx';
import MedicalRecordsPage from './pages/staff/medical-records/MedicalRecordsPage.jsx';
import VaccinationRecordsPage from './pages/staff/vaccination-records/VaccinationRecordsPage.jsx';

import AdminDemo from './pages/admin/demo/AdminDemo.jsx';
import ManagementPage from './pages/admin/management/ManagementPage.jsx';
import StatisticsPage from './pages/admin/statistics/StatisticsPage.jsx';
import MainLayout from './components/layout/mainlayout.jsx';
import InvoiceDetailPage from './pages/invoicesDetailPage/InvoicesDetailPage.jsx';
import CustomerInvoicesPage from './pages/CustomerInvoicesPage/CustomerInvoicesPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/vaccination-packages" element={<VaccinationPackagesPage />} />
        <Route path="/pets" element={<PetsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/invoices" element={<CustomerInvoicesPage/>} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage/>} />
        </Route>
        
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/products-list" element={<ProductsListContent />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        
       <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
       <Route path="/login" element={<LoginPage />} />

        <Route path="/staff/demo" element={<StaffDemoPage />} />
        <Route path="/staff/create-record" element={<CreateRecordPage />} />
        <Route path="/staff/invoice" element={<InvoicePage />} />
        <Route path="/staff/work-schedule" element={<WorkSchedulePage />} />
        <Route path="/staff/medical-records" element={<MedicalRecordsPage />} />
        <Route path="/staff/vaccination-records" element={<VaccinationRecordsPage />} />

        <Route path="/admin/demo" element={<AdminDemo />} />
        <Route path="/admin/management" element={<ManagementPage />} />
        <Route path="/admin/statistics" element={<StatisticsPage />} />
        
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;