const asyncHandler = require('express-async-handler');
const SubscriptionPlan = require('../models/subscriptionPlanModel');

// @desc    Get all subscription plans
// @route   GET /api/subscription-plans
// @access  Public
const getSubscriptionPlans = asyncHandler(async (req, res) => {
  const subscriptionPlans = await SubscriptionPlan.find({ isActive: true });
  res.json(subscriptionPlans);
});

// @desc    Get all subscription plans (including inactive)
// @route   GET /api/subscription-plans/admin
// @access  Private/Admin
const getAllSubscriptionPlans = asyncHandler(async (req, res) => {
  const subscriptionPlans = await SubscriptionPlan.find({});
  res.json(subscriptionPlans);
});

// @desc    Get subscription plan by ID
// @route   GET /api/subscription-plans/:id
// @access  Private/Admin
const getSubscriptionPlanById = asyncHandler(async (req, res) => {
  const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);

  if (subscriptionPlan) {
    res.json(subscriptionPlan);
  } else {
    res.status(404);
    throw new Error('Subscription plan not found');
  }
});

// @desc    Create a subscription plan
// @route   POST /api/subscription-plans
// @access  Private/Admin
const createSubscriptionPlan = asyncHandler(async (req, res) => {
  const { name, price, description, bookingLimit, validityPeriod } = req.body;

  const subscriptionPlan = await SubscriptionPlan.create({
    name,
    price,
    description,
    bookingLimit,
    validityPeriod,
  });

  if (subscriptionPlan) {
    res.status(201).json(subscriptionPlan);
  } else {
    res.status(400);
    throw new Error('Invalid subscription plan data');
  }
});

// @desc    Update a subscription plan
// @route   PUT /api/subscription-plans/:id
// @access  Private/Admin
const updateSubscriptionPlan = asyncHandler(async (req, res) => {
  const { name, price, description, bookingLimit, validityPeriod, isActive } = req.body;

  const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);

  if (subscriptionPlan) {
    subscriptionPlan.name = name || subscriptionPlan.name;
    subscriptionPlan.price = price || subscriptionPlan.price;
    subscriptionPlan.description = description || subscriptionPlan.description;
    subscriptionPlan.bookingLimit = bookingLimit || subscriptionPlan.bookingLimit;
    subscriptionPlan.validityPeriod = validityPeriod || subscriptionPlan.validityPeriod;
    subscriptionPlan.isActive = isActive !== undefined ? isActive : subscriptionPlan.isActive;

    const updatedSubscriptionPlan = await subscriptionPlan.save();
    res.json(updatedSubscriptionPlan);
  } else {
    res.status(404);
    throw new Error('Subscription plan not found');
  }
});

// @desc    Delete a subscription plan
// @route   DELETE /api/subscription-plans/:id
// @access  Private/Admin
const deleteSubscriptionPlan = asyncHandler(async (req, res) => {
  const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);

  if (subscriptionPlan) {
    await subscriptionPlan.deleteOne();
    res.json({ message: 'Subscription plan removed' });
  } else {
    res.status(404);
    throw new Error('Subscription plan not found');
  }
});

module.exports = {
  getSubscriptionPlans,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};