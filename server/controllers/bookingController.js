import Booking from '../models/Booking.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { createNotification } from '../utils/createNotification.js';

/**
 * @desc    Create a booking request
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = async (req, res, next) => {
  try {
    const { providerId, skillId, message, preferredDate, budget } = req.body;

    if (!providerId || !skillId || !preferredDate || !budget) {
      res.status(400);
      throw new Error('Please fill in all required booking fields');
    }

    // Verify provider profile exists
    const provider = await ProviderProfile.findById(providerId).populate('userId', 'name');
    if (!provider) {
      res.status(404);
      throw new Error('Provider not found');
    }

    // Check if customer is booking themselves
    if (provider.userId._id.toString() === req.user.id) {
      res.status(400);
      throw new Error('You cannot book your own services');
    }

    // Create booking
    const booking = new Booking({
      customerId: req.user.id,
      providerId,
      skillId,
      message: message || '',
      preferredDate,
      budget,
      status: 'pending'
    });

    const savedBooking = await booking.save();

    // Fetch customer details and skill details for notification message
    const customer = await User.findById(req.user.id).select('name');
    const skill = await Skill.findById(skillId).select('name');

    // Trigger Notification: notify Provider
    const notifTitle = 'New Booking Request';
    const notifMessage = `You have a new booking request from ${customer.name} for ${skill.name}.`;
    await createNotification(provider.userId._id, notifTitle, notifMessage, 'booking_request');

    res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get customer's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate({
        path: 'providerId',
        populate: { path: 'userId', select: 'name phone location profileImage' }
      })
      .populate('skillId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get provider's incoming bookings
 * @route   GET /api/bookings/requests
 * @access  Private (Provider only)
 */
export const getIncomingRequests = async (req, res, next) => {
  try {
    // Find provider profile of logged in user
    const provider = await ProviderProfile.findOne({ userId: req.user.id });
    if (!provider) {
      res.status(404);
      throw new Error('Provider profile not found');
    }

    const bookings = await Booking.find({ providerId: provider._id })
      .populate('customerId', 'name phone location profileImage')
      .populate('skillId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept booking request
 * @route   PUT /api/bookings/:id/accept
 * @access  Private (Provider only)
 */
export const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('skillId');
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify booking belongs to logged in provider
    const provider = await ProviderProfile.findOne({ userId: req.user.id });
    if (!provider || booking.providerId.toString() !== provider._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to manage this booking');
    }

    if (booking.status !== 'pending') {
      res.status(400);
      throw new Error(`Cannot accept booking in current status: ${booking.status}`);
    }

    booking.status = 'accepted';
    await booking.save();

    // Fetch provider name for notification
    const providerUser = await User.findById(req.user.id).select('name');

    // Trigger Notification: notify Customer
    await createNotification(
      booking.customerId,
      'Booking Request Accepted',
      `Your booking request for ${booking.skillId.name} has been accepted by ${providerUser.name}.`,
      'booking_accepted'
    );

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject booking request
 * @route   PUT /api/bookings/:id/reject
 * @access  Private (Provider only)
 */
export const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('skillId');
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify booking belongs to provider
    const provider = await ProviderProfile.findOne({ userId: req.user.id });
    if (!provider || booking.providerId.toString() !== provider._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to manage this booking');
    }

    if (booking.status !== 'pending') {
      res.status(400);
      throw new Error(`Cannot reject booking in current status: ${booking.status}`);
    }

    booking.status = 'rejected';
    await booking.save();

    const providerUser = await User.findById(req.user.id).select('name');

    // Trigger Notification: notify Customer
    await createNotification(
      booking.customerId,
      'Booking Request Rejected',
      `Your booking request for ${booking.skillId.name} has been rejected by ${providerUser.name}.`,
      'booking_rejected'
    );

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark booking completed
 * @route   PUT /api/bookings/:id/complete
 * @access  Private (Provider only)
 */
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('skillId');
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify booking belongs to provider
    const provider = await ProviderProfile.findOne({ userId: req.user.id });
    if (!provider || booking.providerId.toString() !== provider._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to manage this booking');
    }

    if (booking.status !== 'accepted') {
      res.status(400);
      throw new Error(`Cannot complete booking in current status: ${booking.status}`);
    }

    booking.status = 'completed';
    await booking.save();

    // Increment completed booking counter for Provider
    provider.completedBookings += 1;
    await provider.save();

    const providerUser = await User.findById(req.user.id).select('name');

    // Trigger Notification: notify Customer
    await createNotification(
      booking.customerId,
      'Booking Completed',
      `Your booking for ${booking.skillId.name} has been marked completed by ${providerUser.name}. Please leave a review!`,
      'booking_completed'
    );

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel booking (Customer action)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify booking belongs to customer
    if (booking.customerId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== 'pending') {
      res.status(400);
      throw new Error(`Cannot cancel a booking that is ${booking.status}`);
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    next(error);
  }
};
