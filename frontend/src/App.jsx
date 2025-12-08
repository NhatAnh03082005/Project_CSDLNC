import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import MyPets from './pages/customer/MyPets';
import Appointments from './pages/customer/Appointments';
import MedicalHistory from './pages/customer/MedicalHistory';
import Products from './pages/customer/Products';
import Membership from './pages/customer/Membership';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import Schedule from './pages/employee/Schedule';
import CreateInvoice from './pages/employee/CreateInvoice';
import MedicalRecords from './pages/employee/MedicalRecords';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import BranchManagement from './pages/admin/BranchManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import ProductManagement from './pages/admin/ProductManagement';
import Reports from './pages/admin/Reports';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Customer Routes */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRoles={['KHACH_HANG']}>
              <CustomerLayout>
                <Routes>
                  <Route index element={<CustomerDashboard />} />
                  <Route path="pets" element={<MyPets />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="medical-history" element={<MedicalHistory />} />
                  <Route path="products" element={<Products />} />
                  <Route path="membership" element={<Membership />} />
                </Routes>
              </CustomerLayout>
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRoles={['NHAN_VIEN']}>
              <EmployeeLayout>
                <Routes>
                  <Route index element={<EmployeeDashboard />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="invoice" element={<CreateInvoice />} />
                  <Route path="medical" element={<MedicalRecords />} />
                </Routes>
              </EmployeeLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['QUAN_TRI']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="branches" element={<BranchManagement />} />
                  <Route path="employees" element={<EmployeeManagement />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="reports" element={<Reports />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
