const express = require('express');
const router = express.Router();
const {
  getSubscriptionPlans,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require('../controllers/subscriptionPlanController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getSubscriptionPlans);

// Admin routes
router.route('/admin')
  .get(protect, admin, getAllSubscriptionPlans)
  .post(protect, admin, createSubscriptionPlan);

router.route('/admin/:id')
  .get(protect, admin, getSubscriptionPlanById)
  .put(protect, admin, updateSubscriptionPlan)
  .delete(protect, admin, deleteSubscriptionPlan);

module.exports = router;