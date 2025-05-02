const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Subscription = require('../models/subscriptionModel');

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

module.exports = {
  getVendorBookings,
  updateBookingStatusByVendor,
};