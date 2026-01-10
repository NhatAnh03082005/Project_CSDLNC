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
  getInvoiceDetails: (id) => api.get(`/customers/invoices/${id}`),
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
  getAll: (params) => api.get("/appointments", { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post("/appointments", data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailableSlots: (params) =>
    api.get("/appointments/available-slots", { params }),
  getAvailableDoctors: (params) =>
    api.get("/appointments/available-doctors", { params }),
  getToday: (maChiNhanh, date) =>
    api.get("/appointments/today", {
      params: { MaChiNhanh: maChiNhanh, date },
    }),
  getSchedule: (params) => api.get("/appointments/schedule", { params }),
  getDoctorAppointments: (date) =>
    api.get("/appointments/doctor", { params: { date } }),
};

export const branchAPI = {
  getAll: (params) => api.get("/branches", { params }),
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
  getMedicinesInventory: (id) => api.get(`/branches/${id}/inventory/medicines`),
};

export const productAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  getByBranch: (maChiNhanh) => api.get(`/products/branch/${maChiNhanh}`),
  getProductDetail: (maSanPham, maChiNhanh) =>
    api.get(`/products/${maSanPham}/branch/${maChiNhanh}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
};

export const invoiceAPI = {
  create: (data) => api.post("/invoices", data),
  getById: (id) => api.get(`/invoices/${id}`),
  getAll: (params) => api.get("/invoices", { params }),
  getPending: () => api.get("/invoices/pending"),
  addProducts: (id, products) =>
    api.post(`/invoices/${id}/products`, { products }),
  confirm: (id, data) => api.put(`/invoices/${id}/confirm`, data),
};

export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  // Profile & Branch
  getBranch: () => api.get("/employees/branch"),
  // Work Schedule APIs
  getWorkSchedule: () => api.get("/employees/work-schedule"),
  createWorkSchedule: (data) => api.post("/employees/work-schedule", data),
  deleteWorkSchedule: (data) =>
    api.delete("/employees/work-schedule", { data }),
};

export const reportAPI = {
  getRevenue: (params) => api.get("/reports/revenue", { params }),
  getProducts: (params) => api.get("/reports/products", { params }),
  getVaccines: (params) => api.get("/reports/vaccines", { params }),
  getServices: (params) => api.get("/reports/services", { params }),
  getCustomers: () => api.get("/reports/customers"),
  getPerformance: () => api.get("/reports/performance"),
};

export const promotionAPI = {
  getAll: () => api.get("/promotions"),
  getActive: () => api.get("/promotions/active"),
  getById: (id) => api.get(`/promotions/${id}`),
  create: (data) => api.post("/promotions", data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
};

export const vaccinationAPI = {
  // Logic Admin
  getAll: () => api.get("/vaccinations"),
  getById: (id) => api.get(`/vaccinations/${id}`),
  create: (data) => api.post("/vaccinations", data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data),

  // Logic Customer
  getPackages: () => api.get("/vaccinations/packages"),
  subscribe: (data) => api.post("/vaccinations/packages/subscribe", data),
  getSubscriptions: () => api.get("/vaccinations/subscriptions"),
  getSubscriptionDetails: (maGoiDK) =>
    api.get(`/vaccinations/subscriptions/${maGoiDK}`),
};

export const serviceAPI = {
  getAll: () => api.get("/services"),
};

export const ratingAPI = {
  getMyRatings: () => api.get("/ratings/my-ratings"),
  createOrUpdate: (data) => api.post("/ratings", data),
  update: (maHoaDon, stt, data) => api.put(`/ratings/${maHoaDon}/${stt}`, data),
  delete: (maHoaDon, stt) => api.delete(`/ratings/${maHoaDon}/${stt}`),
};

export const orderAPI = {
  create: (data) => api.post("/customers/orders", data),
  getAll: () => api.get("/customers/orders"),
  getById: (maHoaDon) => api.get(`/customers/orders/${maHoaDon}`),
  getPending: (maChiNhanh) =>
    api.get("/customers/orders/pending", { params: { maChiNhanh } }),
  confirm: (maHoaDon) => api.put(`/customers/orders/${maHoaDon}/confirm`),
};
