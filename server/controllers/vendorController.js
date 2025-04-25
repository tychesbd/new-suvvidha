const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');

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