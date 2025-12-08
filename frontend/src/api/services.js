import api from './axios';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const customerAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  getMembership: () => api.get('/customers/membership'),
  getInvoices: () => api.get('/customers/invoices'),
};

export const petAPI = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  getMedicalHistory: (id) => api.get(`/pets/${id}/medical-history`),
  getVaccinationHistory: (id) => api.get(`/pets/${id}/vaccination-history`),
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailableSlots: (params) => api.get('/appointments/available-slots', { params }),
};

export const branchAPI = {
  getAll: (params) => api.get('/branches', { params }),
  getById: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const invoiceAPI = {
  create: (data) => api.post('/invoices', data),
  getById: (id) => api.get(`/invoices/${id}`),
  getAll: (params) => api.get('/invoices', { params }),
};

export const reportAPI = {
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getCustomers: (params) => api.get('/reports/customers', { params }),
  getVaccinations: (params) => api.get('/reports/vaccinations', { params }),
  getEmployeePerformance: (params) => api.get('/reports/employees/performance', { params }),
  getDashboard: () => api.get('/reports/dashboard'),
};
