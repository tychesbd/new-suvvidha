const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message, type, link } = req.body;

  // Validate required fields
  if (!recipient || !title || !message) {
    res.status(400);
    throw new Error('Please provide recipient, title and message');
  }

  // Check if recipient exists
  const recipientExists = await User.findById(recipient);
  if (!recipientExists) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  // Create notification
  const notification = await Notification.create({
    recipient,
    title,
    message,
    type: type || 'info',
    link: link || '',
    isRead: false,
  });

  if (notification) {
    res.status(201).json(notification);
  } else {
    res.status(400);
    throw new Error('Invalid notification data');
  }
});

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 }); // Sort by newest first

  res.json(notifications);
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check if the notification belongs to the user
  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this notification');
  }

  notification.isRead = true;
  const updatedNotification = await notification.save();

  res.json(updatedNotification);
});

// @desc    Mark all notifications as read for a user
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check if the notification belongs to the user
  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this notification');
  }

  await notification.deleteOne();
  res.json({ message: 'Notification removed' });
});

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};