module.exports = {
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // Server
  PORT: process.env.PORT || 3000,

  // Roles
  ROLES: { //Dương có sửa ở đây để làm đúng giá trị
    CUSTOMER: "customer"  ,
    EMPLOYEE: "staff",
    ADMIN: "admin"
  },

  // Membership Tiers
  MEMBERSHIP_TIERS: {
    BASIC: 'CoBan',
    LOYAL: 'ThanThiet',
    VIP: 'VIP'
  },

  // Tier Thresholds (VND in last year)
  TIER_THRESHOLDS: {
    LOYAL: parseInt(process.env.LOYAL_TIER_THRESHOLD) || 5000000,
    VIP: parseInt(process.env.VIP_TIER_THRESHOLD) || 20000000
  },

  // Loyalty Points: 1 point per X VND
  POINTS_PER_VND: parseInt(process.env.POINTS_PER_VND) || 100,

  // Discounts by tier (%)
  TIER_DISCOUNTS: {
    CoBan: 0,
    ThanThiet: 5,
    VIP: 10
  },

  // Service Types
  SERVICE_TYPES: {
    MEDICAL: 'Khám bệnh',// Dương đã sửa ở SERVICE_TYPES để đúng với giá trị trong DB
    VACCINATION: 'Tiêm phòng'
  },

  // Product Categories
  PRODUCT_CATEGORIES: {
    FOOD: 'ThucAn',
    MEDICINE: 'Thuoc',
    ACCESSORY: 'PhuKien'
  },

  // Pet Types
  PET_TYPES: {
    DOG: 'Cho',
    CAT: 'Meo',
    BIRD: 'Chim',
    RABBIT: 'Tho',
    OTHER: 'Khac'
  },

  // Gender
  GENDER: {
    MALE: 'Nam',
    FEMALE: 'Nu',
    OTHER: 'Khac'
  },

  // Account Status
  ACCOUNT_STATUS: {
    ACTIVE: 'HoatDong',
    INACTIVE: 'KhongHoatDong',
    LOCKED: 'BiKhoa'
  },

  // Appointment Status
  APPOINTMENT_STATUS: {
    PENDING: 'ChoXacNhan',
    CONFIRMED: 'DaXacNhan',
    COMPLETED: 'HoanThanh',
    CANCELLED: 'DaHuy'
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CASH: 'TienMat',
    CARD: 'TheNganHang',
    TRANSFER: 'ChuyenKhoan',
    EWALLET: 'ViDienTu'
  }
};
