const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getVendorDashboardStats,
  getCustomerDashboardStats
} = require('../controllers/dashboardController');
const { protect, admin, vendor, customer } = require('../middleware/authMiddleware');

// Admin dashboard route
router.get('/admin', protect, admin, getAdminDashboardStats);

// Vendor dashboard route
router.get('/vendor', protect, vendor, getVendorDashboardStats);

// Customer dashboard route
router.get('/customer', protect, customer, getCustomerDashboardStats);

module.exports = router;