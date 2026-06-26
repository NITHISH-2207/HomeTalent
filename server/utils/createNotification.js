import Notification from '../models/Notification.js';

/**
 * Creates and saves a new notification for a user.
 * @param {string} userId - The target user's ObjectId
 * @param {string} title - Title of the notification
 * @param {string} message - Content of the notification
 * @param {string} type - Notification event type enum
 * @returns {Promise<object>} The saved notification document
 */
export const createNotification = async (userId, title, message, type) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};
