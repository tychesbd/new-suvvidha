const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const { createUserNotification, createRoleNotifications } = require('../utils/notificationUtils');

// @desc    Get vendor's assigned bookings
// @route   GET /api/bookings/vendor
// @access  Private/Vendor
const getVendorBookings = asyncHandler(async (req, res) => {
  // Find bookings assigned to this vendor
  const bookings = await Booking.find({ vendor: req.user._id })
    .sort({ createdAt: -1 })
    .populate('service', 'title name')
    .populate('user', 'name email');

  res.json(bookings);
});

// @desc    Update booking status by vendor
// @route   PUT /api/bookings/:id/vendor-status
// @access  Private/Vendor
const updateBookingStatusByVendor = asyncHandler(async (req, res) => {
  const { status, statusNote } = req.body;

  // Validate status
  if (!status || !['in-progress', 'completed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the booking is assigned to this vendor
  if (booking.vendor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }
  
  // If status is changing to in-progress, check subscription booking limit
  if (status === 'in-progress' && booking.status !== 'in-progress') {
    // Get vendor's active subscription
    const subscription = await Subscription.findOne({
      vendor: req.user._id,
      status: 'active',
    });
    
    if (!subscription) {
      res.status(400);
      throw new Error('You need an active subscription to accept bookings');
    }
    
    if (subscription.bookingsLeft <= 0) {
      res.status(400);
      throw new Error('You have reached your booking limit. Please upgrade your subscription.');
    }
    
    // Decrease booking count
    subscription.bookingsLeft -= 1;
    await subscription.save();
  }

  // Update booking status
  booking.status = status;
  booking.statusNote = statusNote || booking.statusNote;

  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

// @desc    Register a new vendor
// @route   POST /api/users/vendor-register
// @access  Public
const registerVendor = asyncHandler(async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    phone, 
    address, 
    pincode, 
    yearsOfExperience, 
    serviceExpertise 
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Handle ID proof document if uploaded
  let idProofDocument = '';
  if (req.file) {
    idProofDocument = `/uploads/${req.file.filename}`;
  } else {
    res.status(400);
    throw new Error('ID proof document is required');
  }

  // Parse service expertise if it's a string
  let parsedServiceExpertise = [];
  if (serviceExpertise) {
    parsedServiceExpertise = typeof serviceExpertise === 'string' 
      ? serviceExpertise.split(',') 
      : serviceExpertise;
  }

  // Create vendor user
  const vendor = await User.create({
    name,
    email,
    password,
    role: 'vendor',
    phone,
    address,
    pincode,
    idProofDocument,
    yearsOfExperience: Number(yearsOfExperience) || 0,
    serviceExpertise: parsedServiceExpertise,
    isActive: true, // Set default status to active
  });

  if (vendor) {
    // Create welcome notification for the new vendor
    await createUserNotification(
      vendor._id,
      'Welcome to Suvvidha!',
      `Hello ${vendor.name}, welcome to Suvvidha as a vendor. Your account is pending approval.`,
      'success',
      `/vendor/dashboard`
    );
    
    // Notify admins about new vendor registration
    await createRoleNotifications(
      'admin',
      'New Vendor Registration',
      `A new vendor (${vendor.name}) has registered and is pending approval.`,
      'info',
      '/admin/users'
    );
    
    res.status(201).json({
      _id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      role: vendor.role,
      isActive: vendor.isActive,
      message: 'Vendor registration successful. Your account is pending approval.'
    });
  } else {
    res.status(400);
    throw new Error('Invalid vendor data');
  }
});

module.exports = {
  getVendorBookings,
  updateBookingStatusByVendor,
  registerVendor,
};