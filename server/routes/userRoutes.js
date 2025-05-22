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
const { registerVendor } = require('../controllers/vendorController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/create-defaults', createDefaultUsers);
router.post('/vendor-register', upload.array('documents', 5), registerVendor);

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