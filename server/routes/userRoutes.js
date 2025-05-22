const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getVendors,
  toggleUserStatus,
  deleteUser,
  createDefaultUsers,
} = require('../controllers/userController');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { registerVendor } = require('../controllers/vendorController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/create-defaults', createDefaultUsers);
router.post('/vendor-register', upload.array('documents', 5), registerVendor);

// Forgot password routes
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP and expiry time in user document
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    
    // Send email with OTP
    // Note: In production, use proper email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user by email
    const user = await User.findOne({ 
      email, 
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // OTP is valid
    res.json({ message: 'OTP verified successfully', email });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('idProofDocument'), updateUserProfile);
router.put('/change-password', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    const { currentPassword, newPassword } = req.body;
    
    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message || 'Server error'
    });
  }
});

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/vendors', protect, getVendors); // Allow all authenticated users to access vendors
router.put('/:id/toggle-status', protect, admin, toggleUserStatus);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;