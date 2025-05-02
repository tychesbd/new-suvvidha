const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');
const User = require('../models/userModel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { name, phoneNumber, pincode, location, coordinates, serviceId } = req.body;

  if (!name || !phoneNumber || !pincode || !location || !serviceId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Verify service exists
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const booking = await Booking.create({
    customer: {
      name,
      phoneNumber,
      pincode,
      location,
      coordinates,
    },
    service: serviceId,
    serviceName: service.title || service.name,
    user: req.user._id,
  });

  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(400);
    throw new Error('Invalid booking data');
  }
});

// @desc    Get all bookings for admin
// @route   GET /api/bookings/admin
// @access  Private/Admin
const getAdminBookings = asyncHandler(async (req, res) => {
  console.log('Admin bookings request received from:', req.user.name, 'with role:', req.user.role);
  
  try {
    // Check if the URL path ends with /admin to prevent ID parameter confusion
    if (req.originalUrl.endsWith('/admin') || req.originalUrl.includes('/admin?')) {
      // First try to get bookings using the schema structure
      let bookings = await Booking.find({}).sort({ createdAt: -1 })
        .populate('service', 'title name')
        .populate('user', 'name email');
      
      // If no bookings found with the schema structure, try to get all documents from the bookings collection
      if (bookings.length === 0) {
        console.log('No bookings found with schema structure, trying direct collection access');
        
        // Get all documents from the bookings collection regardless of structure
        const db = mongoose.connection.db;
        const bookingsCollection = db.collection('bookings');
        const rawBookings = await bookingsCollection.find({}).toArray();
        
        console.log('Found raw bookings:', rawBookings.length);
        
        // Transform the raw bookings to match the expected structure in the frontend
        bookings = rawBookings.map(booking => {
          return {
            _id: booking._id,
            customer: {
              name: booking.customerName || 'N/A',
              phoneNumber: booking.customerPhone || 'N/A',
              pincode: booking.location ? booking.location.split(',')[1]?.trim() : 'N/A',
              location: booking.location || 'N/A',
            },
            serviceName: booking.serviceId ? `Service ID: ${booking.serviceId}` : 'N/A',
            status: booking.status || 'pending',
            dateTime: booking.scheduledDate || booking.date || new Date(),
            // Add other fields as needed
          };
        });
      }
      
      console.log('Found bookings:', bookings.length);
      
      // Log each booking for debugging
      if (bookings.length > 0) {
        console.log('First booking details:', {
          id: bookings[0]._id,
          customer: bookings[0].customer,
          serviceName: bookings[0].serviceName,
          status: bookings[0].status
        });
      } else {
        console.log('No bookings found in database');
      }
      
      res.json(bookings);
    } else {
      // If the URL doesn't end with /admin, it might be trying to use 'admin' as an ID
      res.status(400).json({ message: 'Invalid admin bookings request' });
    }
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // Check if user is admin or the booking belongs to the user
    if (req.user.role === 'admin' || booking.user.toString() === req.user._id.toString()) {
      res.json(booking);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this booking');
    }
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, statusNote } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = status || booking.status;
    booking.statusNote = statusNote || booking.statusNote;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Assign vendor to booking
// @route   PUT /api/bookings/:id/assign
// @access  Private/Admin
const assignVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.body;

  if (!vendorId) {
    res.status(400);
    throw new Error('Please provide vendor ID');
  }

  // Verify vendor exists and is a vendor
  const vendor = await User.findById(vendorId);
  if (!vendor || vendor.role !== 'vendor') {
    res.status(404);
    throw new Error('Vendor not found');
  }

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.vendor = vendorId;
    booking.status = 'in-progress';

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (booking) {
    // Check if user is admin or the booking belongs to the user
    if (req.user.role === 'admin' || booking.user.toString() === req.user._id.toString()) {
      booking.status = 'cancelled';
      booking.cancelReason = cancelReason || '';

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

module.exports = {
  createBooking,
  getAdminBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  assignVendor,
  cancelBooking,
};