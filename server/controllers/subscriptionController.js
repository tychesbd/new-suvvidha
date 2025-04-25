const asyncHandler = require('express-async-handler');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private/Admin
const getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({})
    .populate('vendor', 'name email phone pincode isActive')
    .sort({ createdAt: -1 });

  res.json(subscriptions);
});

// @desc    Get vendor subscription
// @route   GET /api/subscriptions/vendor
// @access  Private/Vendor
const getVendorSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ vendor: req.user._id })
    .sort({ createdAt: -1 });

  if (subscription) {
    res.json(subscription);
  } else {
    res.status(404);
    throw new Error('No subscription found');
  }
});

// @desc    Create a subscription
// @route   POST /api/subscriptions
// @access  Private/Vendor
const createSubscription = asyncHandler(async (req, res) => {
  const { plan, upiId } = req.body;

  // Set plan details based on selected plan
  let price, features, durationDays;
  
  switch (plan) {
    case 'basic':
      price = 999;
      features = ['Basic service listing', 'Customer support', '30 days validity'];
      durationDays = 30;
      break;
    case 'standard':
      price = 2499;
      features = ['Featured service listing', 'Priority customer support', 'Analytics dashboard', '90 days validity'];
      durationDays = 90;
      break;
    case 'premium':
      price = 4999;
      features = ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'];
      durationDays = 180;
      break;
    default:
      res.status(400);
      throw new Error('Invalid plan selected');
  }

  // Calculate end date
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);

  // Check if vendor already has an active subscription
  const existingSubscription = await Subscription.findOne({
    vendor: req.user._id,
    status: 'active',
  });

  if (existingSubscription) {
    res.status(400);
    throw new Error('You already have an active subscription');
  }

  const subscription = await Subscription.create({
    vendor: req.user._id,
    plan,
    price,
    startDate,
    endDate,
    upiId,
    features,
    status: 'pending',
    paymentStatus: 'pending',
  });

  if (subscription) {
    res.status(201).json(subscription);
  } else {
    res.status(400);
    throw new Error('Invalid subscription data');
  }
});

// @desc    Update subscription payment proof
// @route   PUT /api/subscriptions/:id/payment
// @access  Private/Vendor
const updatePaymentProof = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }

  // Check if the subscription belongs to the logged-in vendor
  if (subscription.vendor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this subscription');
  }

  // Update payment proof
  subscription.paymentProof = req.body.paymentProof;
  subscription.paymentDate = new Date();
  subscription.paymentStatus = 'pending'; // Admin will verify and change to 'paid'

  const updatedSubscription = await subscription.save();

  res.json(updatedSubscription);
});

// @desc    Verify subscription payment
// @route   PUT /api/subscriptions/:id/verify
// @access  Private/Admin
const verifySubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id);

  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }

  // Update subscription status
  subscription.paymentStatus = req.body.paymentStatus;
  
  if (req.body.paymentStatus === 'paid') {
    subscription.status = 'active';
  }

  const updatedSubscription = await subscription.save();

  res.json(updatedSubscription);
});

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
const getSubscriptionPlans = asyncHandler(async (req, res) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 999,
      duration: '30 days',
      features: ['Basic service listing', 'Customer support', '30 days validity'],
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 2499,
      duration: '90 days',
      features: ['Featured service listing', 'Priority customer support', 'Analytics dashboard', '90 days validity'],
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 4999,
      duration: '180 days',
      features: ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'],
    },
  ];

  res.json(plans);
});

module.exports = {
  getSubscriptions,
  getVendorSubscription,
  createSubscription,
  updatePaymentProof,
  verifySubscription,
  getSubscriptionPlans,
};