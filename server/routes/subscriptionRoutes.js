const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getVendorSubscription,
  createSubscription,
  updatePaymentProof,
  verifySubscription,
  getSubscriptionPlans,
  getAvailableServices,
  decreaseBookingCount,
} = require('../controllers/subscriptionController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/plans', getSubscriptionPlans);

// Vendor routes
router.route('/')
  .post(protect, vendor, upload.single('screenshot'), createSubscription);

router.get('/vendor', protect, vendor, getVendorSubscription);
router.put('/:id/payment', protect, vendor, updatePaymentProof);
router.get('/available-services', protect, vendor, getAvailableServices);
router.put('/decrease-booking', protect, vendor, decreaseBookingCount);

// Admin routes
router.get('/', protect, admin, getSubscriptions);
router.get('/admin', protect, admin, getSubscriptions); // Add explicit admin endpoint
router.put('/:id/verify', protect, admin, verifySubscription);

module.exports = router;