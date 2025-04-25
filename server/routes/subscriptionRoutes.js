const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getVendorSubscription,
  createSubscription,
  updatePaymentProof,
  verifySubscription,
  getSubscriptionPlans,
} = require('../controllers/subscriptionController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

// Public routes
router.get('/plans', getSubscriptionPlans);

// Vendor routes
router.route('/')
  .post(protect, vendor, createSubscription);

router.get('/vendor', protect, vendor, getVendorSubscription);
router.put('/:id/payment', protect, vendor, updatePaymentProof);

// Admin routes
router.get('/', protect, admin, getSubscriptions);
router.put('/:id/verify', protect, admin, verifySubscription);

module.exports = router;