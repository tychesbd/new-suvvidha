const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAdminBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  assignVendor,
  cancelBooking,
} = require('../controllers/bookingController');
const {
  getVendorBookings,
  updateBookingStatusByVendor,
} = require('../controllers/vendorController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

// Admin routes - placing these first to ensure they match before the ID routes
router.route('/admin')
  .get(protect, admin, getAdminBookings);

// Vendor routes
router.route('/vendor')
  .get(protect, vendor, getVendorBookings);

router.route('/:id/vendor-status')
  .put(protect, vendor, updateBookingStatusByVendor);

// User routes
router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

router.route('/:id/status')
  .put(protect, admin, updateBookingStatus);

router.route('/:id/assign')
  .put(protect, admin, assignVendor);

module.exports = router;