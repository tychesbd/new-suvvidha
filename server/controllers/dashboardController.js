const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Count total users by role
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    
    // Count total bookings
    const totalBookings = await Booking.countDocuments();
    
    // Count total services
    const totalServices = await Service.countDocuments();
    
    // Count active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const totalSubscriptions = await Subscription.countDocuments();
    
    // Calculate total revenue
    const bookings = await Booking.find({ status: 'completed' });
    const revenue = bookings.reduce((total, booking) => {
      return total + (booking.amount || 0);
    }, 0);
    
    res.json({
      users: totalUsers,
      vendors: totalVendors,
      bookings: totalBookings,
      services: totalServices,
      activeSubscriptions,
      subscriptions: totalSubscriptions,
      revenue
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get vendor dashboard statistics
// @route   GET /api/vendor/dashboard
// @access  Private/Vendor
const getVendorDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get vendor ID from authenticated user
    const vendorId = req.user._id;
    
    // Count bookings by status
    const totalBookings = await Booking.countDocuments({ vendor: vendorId });
    const activeBookings = await Booking.countDocuments({ 
      vendor: vendorId, 
      status: { $in: ['pending', 'in-progress'] } 
    });
    const completedBookings = await Booking.countDocuments({ 
      vendor: vendorId, 
      status: 'completed' 
    });
    
    // Calculate revenue from completed bookings
    const bookings = await Booking.find({ 
      vendor: vendorId, 
      status: 'completed' 
    });
    const revenue = bookings.reduce((total, booking) => {
      return total + (booking.amount || 0);
    }, 0);
    
    // Get recent bookings
    const recentBookings = await Booking.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('service', 'title name')
      .populate('user', 'name email');
    
    // Get service statistics
    const services = await Service.find({ vendor: vendorId });
    const totalServices = services.length;
    const activeServices = services.filter(service => service.isActive).length;
    
    // Calculate average rating
    let avgRating = 0;
    let reviewCount = 0;
    
    if (bookings.length > 0) {
      const totalRating = bookings.reduce((sum, booking) => {
        if (booking.rating) {
          reviewCount++;
          return sum + booking.rating;
        }
        return sum;
      }, 0);
      
      avgRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;
    }
    
    res.json({
      totalBookings,
      activeBookings,
      completedBookings,
      revenue,
      totalServices,
      activeServices,
      avgRating,
      reviewCount,
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching vendor dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get customer dashboard statistics
// @route   GET /api/customer/dashboard
// @access  Private/Customer
const getCustomerDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get customer ID from authenticated user
    const customerId = req.user._id;
    
    // Count bookings by status
    const totalBookings = await Booking.countDocuments({ user: customerId });
    const activeBookings = await Booking.countDocuments({ 
      user: customerId, 
      status: { $in: ['pending', 'in-progress'] } 
    });
    const completedBookings = await Booking.countDocuments({ 
      user: customerId, 
      status: 'completed' 
    });
    const cancelledBookings = await Booking.countDocuments({ 
      user: customerId, 
      status: 'cancelled' 
    });
    
    // Calculate total spent
    const bookings = await Booking.find({ 
      user: customerId, 
      status: 'completed' 
    });
    const totalSpent = bookings.reduce((total, booking) => {
      return total + (booking.amount || 0);
    }, 0);
    
    // Get recent bookings
    const recentBookings = await Booking.find({ user: customerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('service', 'title name image')
      .populate('vendor', 'name');
    
    res.json({
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      totalSpent,
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching customer dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  getAdminDashboardStats,
  getVendorDashboardStats,
  getCustomerDashboardStats
};