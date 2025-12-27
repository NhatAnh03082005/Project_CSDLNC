import api from "./axios";

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
};

export const customerAPI = {
  getProfile: () => api.get("/customers/profile"),
  updateProfile: (data) => api.put("/customers/profile", data),
  getMembership: () => api.get("/customers/membership"),
  getInvoices: () => api.get("/customers/invoices"),
};

export const petAPI = {
  getAll: () => api.get("/pets"),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post("/pets", data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  getMedicalHistory: (id) => api.get(`/pets/${id}/medical-history`),
  getVaccinationHistory: (id) => api.get(`/pets/${id}/vaccination-history`),
};

export const appointmentAPI = {
  getAll: () => api.get("/appointments"),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post("/appointments", data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailableSlots: (params) =>
    api.get("/appointments/available-slots", { params }),
};

export const branchAPI = {
  getAll: () => api.get("/branches"),
  getById: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post("/branches", data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`),
  getProductsStock: (id) => api.get(`/branches/${id}/products`),
  addProductToStock: (id, data) => api.post(`/branches/${id}/products`, data),
  updateProductQty: (id, maSanPham, data) =>
    api.put(`/branches/${id}/products/${maSanPham}`, data),
  getVaccinesStock: (id) => api.get(`/branches/${id}/vaccines`),
  addVaccineToStock: (id, data) => api.post(`/branches/${id}/vaccines`, data),
  updateVaccineQty: (id, maVacXin, data) =>
    api.put(`/branches/${id}/vaccines/${maVacXin}`, data),
  getServicesStock: (id) => api.get(`/branches/${id}/services`),
  addServiceToBranch: (id, data) => api.post(`/branches/${id}/services`, data),
  deleteServiceFromBranch: (id, loaiDichVu) =>
    api.delete(`/branches/${id}/services/${loaiDichVu}`),
  getEmployeeTransferHistory: (id) =>
    api.get(`/branches/${id}/transferHistory`),
};

export const productAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const invoiceAPI = {
  create: (data) => api.post("/invoices", data),
  getById: (id) => api.get(`/invoices/${id}`),
  getAll: (params) => api.get("/invoices", { params }),
};

export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const reportAPI = {
  getRevenue: (params) => api.get("/reports/revenue", { params }),
  getCustomers: (params) => api.get("/reports/customers", { params }),
  getVaccinations: (params) => api.get("/reports/vaccinations", { params }),
  getEmployeePerformance: (params) =>
    api.get("/reports/employees/performance", { params }),
  getDashboard: () => api.get("/reports/dashboard"),
};

export const promotionAPI = {
  getAll: () => api.get("/promotions"),
  getById: (id) => api.get(`/promotions/${id}`),
  create: (data) => api.post("/promotions", data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
};

export const vaccinationAPI = {
  getAll: () => api.get("/vaccinations"),
  getById: (id) => api.get(`/vaccinations/${id}`),
  create: (data) => api.post("/vaccinations", data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data),
  delete: (id) => api.delete(`/vaccinations/${id}`),
};

export const serviceAPI = {
  getAll: () => api.get("/services"),
};
