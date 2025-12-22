const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PetCareX API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      pets: '/api/pets',
      branches: '/api/branches',
      employees: '/api/employees',
      appointments: '/api/appointments',
      medical: '/api/medical',
      vaccinations: '/api/vaccinations',
      products: '/api/products',
      invoices: '/api/invoices',
      membership: '/api/membership',
      promotions: '/api/promotions',
      ratings: '/api/ratings',
      reports: '/api/reports'
    }
  });
});

// API Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/customers', require('./modules/customers/customers.routes'));
app.use('/api/pets', require('./modules/pets/pets.routes'));
app.use('/api/branches', require('./modules/branches/branches.routes'));
app.use('/api/employees', require('./modules/employees/employees.routes'));
app.use('/api/appointments', require('./modules/appointments/appointments.routes'));
app.use('/api/medical', require('./modules/medical/medical.routes'));
app.use('/api/vaccinations', require('./modules/vaccinations/vaccinations.routes'));
app.use('/api/products', require('./modules/products/products.routes'));
app.use('/api/invoices', require('./modules/invoices/invoices.routes'));
app.use('/api/membership', require('./modules/membership/membership.routes'));
app.use('/api/promotions', require('./modules/promotions/promotions.routes'));
app.use('/api/ratings', require('./modules/ratings/ratings.routes'));
app.use('/api/reports', require('./modules/reports/reports.routes'));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ðŸš€ PetCareX API running on port ${PORT}`);
  console.log(`ðŸ“ API URL: http://localhost:${PORT}`);
  console.log(`ðŸŒ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
 
