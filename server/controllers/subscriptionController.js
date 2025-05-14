const asyncHandler = require('express-async-handler');
const Subscription = require('../models/subscriptionModel');
const SubscriptionPlan = require('../models/subscriptionPlanModel');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private/Admin
const getSubscriptions = asyncHandler(async (req, res) => {
  const { status, plan, search } = req.query;
  
  let query = {};
  
  // Filter by status if provided
  if (status) {
    query.status = status;
  }
  
  // Filter by plan if provided
  if (plan) {
    query.plan = plan;
  }
  
  // Search by vendor name or phone if provided
  if (search) {
    // First find vendors matching the search term
    const vendors = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    
    // Get vendor IDs
    const vendorIds = vendors.map(vendor => vendor._id);
    
    // Add vendor IDs to query
    if (vendorIds.length > 0) {
      query.vendor = { $in: vendorIds };
    } else {
      // If no vendors match, return empty array
      return res.json([]);
    }
  }
  
  const subscriptions = await Subscription.find(query)
    .populate('vendor', 'name email phone pincode isActive')
    .populate('subscriptionPlan')
    .populate('selectedServices', 'name category price')
    .sort({ createdAt: -1 });

  res.json(subscriptions);
});

// @desc    Get vendor subscription
// @route   GET /api/subscriptions/vendor
// @access  Private/Vendor
const getVendorSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ 
    vendor: req.user._id,
    $or: [
      { status: 'active' },
      { status: 'pending' }
    ]
  })
  .populate('subscriptionPlan')
  .populate('selectedServices', 'name category price')
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
  // Handle form data - parse JSON strings if needed
  const planId = req.body.planId;
  const selectedServiceIds = req.body.services ? JSON.parse(req.body.services) : [];
  const transactionId = req.body.transactionId;
  
  // Get the uploaded screenshot file path if it exists
  const paymentProof = req.file ? req.file.path : null;

  // Validate subscription plan
  const subscriptionPlan = await SubscriptionPlan.findById(planId);
  if (!subscriptionPlan) {
    res.status(404);
    throw new Error('Subscription plan not found');
  }

  // Validate selected services
  if (!selectedServiceIds || selectedServiceIds.length === 0) {
    res.status(400);
    throw new Error('Please select at least one service');
  }

  if (selectedServiceIds.length > 10) {
    res.status(400);
    throw new Error('You can select up to 10 services only');
  }

  // Verify all services exist
  const services = await Service.find({ _id: { $in: selectedServiceIds } });
  if (services.length !== selectedServiceIds.length) {
    res.status(400);
    throw new Error('One or more selected services are invalid');
  }

  // Check if vendor already has an active or pending subscription
  const existingSubscription = await Subscription.findOne({
    vendor: req.user._id,
    $or: [
      { status: 'active' },
      { status: 'pending' }
    ],
  });

  if (existingSubscription) {
    res.status(400);
    throw new Error('You already have an active or pending subscription');
  }

  // Calculate end date based on validity period
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + subscriptionPlan.validityPeriod);

  // Map plan type from subscription plan name
  let planType = 'basic';
  if (subscriptionPlan.name.toLowerCase().includes('standard')) {
    planType = 'standard';
  } else if (subscriptionPlan.name.toLowerCase().includes('premium')) {
    planType = 'premium';
  }

  const subscription = await Subscription.create({
    vendor: req.user._id,
    subscriptionPlan: subscriptionPlan._id,
    plan: planType,
    price: subscriptionPlan.price,
    startDate,
    endDate,
    selectedServices: selectedServiceIds,
    features: [subscriptionPlan.description, `${subscriptionPlan.bookingLimit} bookings allowed`, `${subscriptionPlan.validityPeriod} days validity`],
    status: 'pending',
    paymentStatus: 'pending',
    paymentProof: paymentProof,
    transactionId: transactionId,
    paymentDate: new Date(),
    bookingsLeft: 0, // Will be set when approved
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

  // Update payment proof and transaction ID
  subscription.paymentProof = req.body.paymentProof;
  subscription.transactionId = req.body.transactionId;
  subscription.paymentDate = new Date();
  subscription.paymentStatus = 'pending'; // Admin will verify and change to 'paid'

  const updatedSubscription = await subscription.save();

  res.json(updatedSubscription);
});

// @desc    Verify subscription payment
// @route   PUT /api/subscriptions/:id/verify
// @access  Private/Admin
const verifySubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findById(req.params.id)
    .populate('subscriptionPlan');

  if (!subscription) {
    res.status(404);
    throw new Error('Subscription not found');
  }

  // Update subscription status
  subscription.paymentStatus = req.body.paymentStatus;
  
  if (req.body.paymentStatus === 'paid') {
    subscription.status = 'active';
    
    // Set booking limit from subscription plan
    if (subscription.subscriptionPlan && subscription.subscriptionPlan.bookingLimit) {
      subscription.bookingsLeft = subscription.subscriptionPlan.bookingLimit;
    } else {
      // Fallback if subscription plan is not found
      let bookingLimit = 10; // Default basic plan
      if (subscription.plan === 'standard') {
        bookingLimit = 25;
      } else if (subscription.plan === 'premium') {
        bookingLimit = 50;
      }
      subscription.bookingsLeft = bookingLimit;
    }
  } else if (req.body.paymentStatus === 'failed') {
    subscription.status = 'cancelled';
  }

  const updatedSubscription = await subscription.save();

  res.json(updatedSubscription);
});

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
const getSubscriptionPlans = asyncHandler(async (req, res) => {
  // Get plans from the database instead of hardcoded values
  const subscriptionPlans = await SubscriptionPlan.find({ isActive: true });
  
  // Format plans for frontend
  const plans = subscriptionPlans.map(plan => ({
    id: plan._id,
    name: plan.name,
    price: plan.price,
    duration: `${plan.validityPeriod} days`,
    bookingLimit: plan.bookingLimit,
    features: [
      plan.description,
      `${plan.bookingLimit} bookings allowed`,
      `${plan.validityPeriod} days validity`
    ],
  }));

  res.json(plans);
});

// @desc    Get available services for subscription
// @route   GET /api/subscriptions/available-services
// @access  Private/Vendor
const getAvailableServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true })
    .select('_id name category price description')
    .sort({ category: 1, name: 1 });

  res.json(services);
});

// @desc    Decrease booking count when a booking is made
// @route   PUT /api/subscriptions/decrease-booking
// @access  Private/Vendor
const decreaseBookingCount = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({
    vendor: req.user._id,
    status: 'active',
  });

  if (!subscription) {
    res.status(404);
    throw new Error('No active subscription found');
  }

  if (subscription.bookingsLeft <= 0) {
    res.status(400);
    throw new Error('You have reached your booking limit');
  }

  subscription.bookingsLeft -= 1;
  await subscription.save();

  res.json({ success: true, bookingsLeft: subscription.bookingsLeft });
});

module.exports = {
  getSubscriptions,
  getVendorSubscription,
  createSubscription,
  updatePaymentProof,
  verifySubscription,
  getSubscriptionPlans,
  getAvailableServices,
  decreaseBookingCount,
};