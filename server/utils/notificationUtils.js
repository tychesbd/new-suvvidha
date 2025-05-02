const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

/**
 * Create a notification for a specific user
 * @param {string} userId - The ID of the user to send the notification to
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type (info, success, warning, error)
 * @param {string} link - Optional link to navigate to when notification is clicked
 * @returns {Promise<Object>} - The created notification object
 */
const createUserNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Create notification
    const notification = await Notification.create({
      recipient: userId,
      title,
      message,
      type,
      link,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};

/**
 * Create notifications for all users with a specific role
 * @param {string} role - The role of users to send notifications to (admin, vendor, customer)
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type (info, success, warning, error)
 * @param {string} link - Optional link to navigate to when notification is clicked
 * @returns {Promise<Array>} - Array of created notification objects
 */
const createRoleNotifications = async (role, title, message, type = 'info', link = '') => {
  try {
    // Find all users with the specified role
    const users = await User.find({ role, isActive: true });
    
    if (users.length === 0) {
      console.warn(`No active users found with role: ${role}`);
      return [];
    }

    // Create notifications for each user
    const notificationPromises = users.map(user => {
      return Notification.create({
        recipient: user._id,
        title,
        message,
        type,
        link,
        isRead: false,
      });
    });

    const notifications = await Promise.all(notificationPromises);
    return notifications;
  } catch (error) {
    console.error('Error creating role notifications:', error.message);
    throw error;
  }
};

/**
 * Create a notification for all users
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type (info, success, warning, error)
 * @param {string} link - Optional link to navigate to when notification is clicked
 * @returns {Promise<Array>} - Array of created notification objects
 */
const createAllUsersNotification = async (title, message, type = 'info', link = '') => {
  try {
    // Find all active users
    const users = await User.find({ isActive: true });
    
    if (users.length === 0) {
      console.warn('No active users found');
      return [];
    }

    // Create notifications for each user
    const notificationPromises = users.map(user => {
      return Notification.create({
        recipient: user._id,
        title,
        message,
        type,
        link,
        isRead: false,
      });
    });

    const notifications = await Promise.all(notificationPromises);
    return notifications;
  } catch (error) {
    console.error('Error creating notifications for all users:', error.message);
    throw error;
  }
};

module.exports = {
  createUserNotification,
  createRoleNotifications,
  createAllUsersNotification,
};