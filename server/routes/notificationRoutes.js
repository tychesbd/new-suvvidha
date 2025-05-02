const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes for all authenticated users
router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markNotificationAsRead);
router.put('/read-all', protect, markAllNotificationsAsRead);
router.delete('/:id', protect, deleteNotification);

// Admin only routes
router.post('/', protect, admin, createNotification);

module.exports = router;