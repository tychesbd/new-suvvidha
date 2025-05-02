const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { createUserNotification, createRoleNotifications } = require('../utils/notificationUtils');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'customer',
    isActive: true, // Set default status to active
  });

  if (user) {
    // Create welcome notification for the new user
    await createUserNotification(
      user._id,
      'Welcome to Suvvidha!',
      `Hello ${user.name}, welcome to Suvvidha. We're glad to have you on board.`,
      'success',
      `/${user.role}/dashboard`
    );
    
    // Notify admins about new user registration
    if (user.role !== 'admin') {
      await createRoleNotifications(
        'admin',
        'New User Registration',
        `A new user (${user.name}) has registered with the role of ${user.role}.`,
        'info',
        '/admin/users'
      );
    }
    
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Check if user is active
    if (!user.isActive) {
      res.status(401);
      throw new Error('Your account has been blocked. Please contact support.');
    }
    
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
      isActive: user.isActive,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.pincode = req.body.pincode || user.pincode;
    user.profileImage = req.body.profileImage || user.profileImage;
    
    // Update vendor-specific fields if user is a vendor
    if (user.role === 'vendor') {
      // Handle ID proof document if uploaded
      if (req.file) {
        console.log('File received:', req.file);
        user.idProofDocument = `/uploads/${req.file.filename}`;
      } else {
        console.log('No file received in request');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
      }
      
      // Update years of experience if provided
      if (req.body.yearsOfExperience) {
        user.yearsOfExperience = req.body.yearsOfExperience;
      }
      
      // Update service expertise if provided
      if (req.body.serviceExpertise) {
        // If it's a string, convert to array (for handling form data)
        if (typeof req.body.serviceExpertise === 'string') {
          user.serviceExpertise = req.body.serviceExpertise.split(',');
        } else {
          user.serviceExpertise = req.body.serviceExpertise;
        }
      }
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    // Create notification for the user about profile update
    await createUserNotification(
      user._id,
      'Profile Updated',
      'Your profile information has been successfully updated.',
      'success',
      `/${user.role}/profile`
    );

    // Prepare response object with common fields
    const responseObj = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      pincode: updatedUser.pincode,
      profileImage: updatedUser.profileImage,
      isActive: updatedUser.isActive,
      token: generateToken(updatedUser._id),
    };
    
    // Add vendor-specific fields to response if user is a vendor
    if (updatedUser.role === 'vendor') {
      responseObj.idProofDocument = updatedUser.idProofDocument;
      responseObj.yearsOfExperience = updatedUser.yearsOfExperience;
      responseObj.serviceExpertise = updatedUser.serviceExpertise;
    }
    
    res.json(responseObj);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Create default users (admin, vendor, customer)
// @route   POST /api/users/create-defaults
// @access  Public (should be secured in production)
const createDefaultUsers = asyncHandler(async (req, res) => {
  // Check if default users already exist
  const adminExists = await User.findOne({ email: 'admin@suvvidha.com' });
  const vendorExists = await User.findOne({ email: 'vendor@suvvidha.com' });
  const customerExists = await User.findOne({ email: 'customer@suvvidha.com' });

  if (adminExists && vendorExists && customerExists) {
    return res.status(400).json({ message: 'Default users already exist' });
  }

  const users = [];

  // Create admin if doesn't exist
  if (!adminExists) {
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@suvvidha.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });
    users.push({ name: admin.name, email: admin.email, role: admin.role });
  }

  // Create vendor if doesn't exist
  if (!vendorExists) {
    const vendor = await User.create({
      name: 'Vendor User',
      email: 'vendor@suvvidha.com',
      password: 'vendor123',
      role: 'vendor',
      isActive: true,
    });
    users.push({ name: vendor.name, email: vendor.email, role: vendor.role });
  }

  // Create customer if doesn't exist
  if (!customerExists) {
    const customer = await User.create({
      name: 'Customer User',
      email: 'customer@suvvidha.com',
      password: 'customer123',
      role: 'customer',
      isActive: true,
    });
    users.push({ name: customer.name, email: customer.email, role: customer.role });
  }

  res.status(201).json({
    message: 'Default users created successfully',
    users,
  });
});

// @desc    Toggle user active status (block/unblock)
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from blocking themselves
  if (user._id.toString() === req.user._id.toString() && user.role === 'admin') {
    res.status(400);
    throw new Error('Admin cannot block themselves');
  }

  // Toggle the isActive status
  user.isActive = !user.isActive;
  
  const updatedUser = await user.save();

  // Create notification for the user about their account status
  await createUserNotification(
    user._id,
    user.isActive ? 'Account Activated' : 'Account Deactivated',
    user.isActive 
      ? 'Your account has been activated. You can now access all features.'
      : 'Your account has been deactivated. Please contact support for assistance.',
    user.isActive ? 'success' : 'error'
  );

  // Notify admins about the status change
  if (req.user._id.toString() !== user._id.toString()) {
    await createRoleNotifications(
      'admin',
      `User ${user.isActive ? 'Unblocked' : 'Blocked'}`,
      `${user.name} (${user.email}) has been ${user.isActive ? 'unblocked' : 'blocked'} by ${req.user.name}.`,
      'info',
      '/admin/users'
    );
  }

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isActive: updatedUser.isActive,
    message: `User ${updatedUser.isActive ? 'unblocked' : 'blocked'} successfully`,
  });
});

// @desc    Get vendors by pincode
// @route   GET /api/users/vendors
// @access  Private/Admin
const getVendors = asyncHandler(async (req, res) => {
  const { pincode } = req.query;
  
  let query = { role: 'vendor', isActive: true };
  
  // If pincode is provided, filter by pincode
  if (pincode) {
    query.pincode = pincode;
  }
  
  const vendors = await User.find(query).select('-password');
  
  // Format the response to match the expected structure in the frontend
  const formattedVendors = vendors.map(vendor => ({
    _id: vendor._id,
    name: vendor.name,
    rating: vendor.yearsOfExperience ? (3 + vendor.yearsOfExperience / 10).toFixed(1) : 4.0, // Mock rating based on experience
    reviews: Math.floor(Math.random() * 30) + 5, // Mock reviews count
    pincode: vendor.pincode || '400001',
    distance: `${(Math.random() * 5 + 1).toFixed(1)} km`, // Mock distance
    phone: vendor.phone || '9876543210',
    isActive: vendor.isActive // Include isActive status
  }));
  
  res.json(formattedVendors);
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getVendors,
  toggleUserStatus,
  createDefaultUsers,
};