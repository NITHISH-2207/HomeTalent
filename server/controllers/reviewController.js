import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import ProviderProfile from '../models/ProviderProfile.js';
import User from '../models/User.js';
import { createNotification } from '../utils/createNotification.js';

/**
 * @desc    Leave a review for a completed booking
 * @route   POST /api/reviews
 * @access  Private
 */
export const leaveReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      res.status(400);
      throw new Error('Please provide both booking ID and rating (1-5)');
    }

    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Rating must be an integer between 1 and 5');
    }

    // Verify booking details
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify client is the booking customer
    if (booking.customerId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('You are not authorized to review this booking');
    }

    // Enforce booking status is 'completed'
    if (booking.status !== 'completed') {
      res.status(400);
      throw new Error('You can only review completed bookings');
    }

    // Enforce one booking = one review
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already submitted a review for this booking');
    }

    // Create review
    const review = new Review({
      bookingId,
      customerId: req.user.id,
      providerId: booking.providerId,
      rating: Number(rating),
      comment: comment || ''
    });

    const savedReview = await review.save();

    // Recalculate provider profile stats
    const providerId = booking.providerId;
    const providerReviews = await Review.find({ providerId });
    
    const totalReviews = providerReviews.length;
    const ratingSum = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : 0;

    const provider = await ProviderProfile.findById(providerId);
    if (provider) {
      provider.totalReviews = totalReviews;
      provider.averageRating = Number(averageRating);
      await provider.save();
    }

    // Fetch customer and provider info for notification
    const customer = await User.findById(req.user.id).select('name');
    if (provider && provider.userId) {
      // Trigger Notification: notify Provider
      await createNotification(
        provider.userId,
        'New Review Received',
        `${customer.name} left you a ${rating}-star review.`,
        'new_review'
      );
    }

    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get provider's reviews
 * @route   GET /api/reviews/provider/:providerId
 * @access  Public
 */
export const getProviderReviews = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    // Verify provider profile exists
    const provider = await ProviderProfile.findById(providerId);
    if (!provider) {
      res.status(404);
      throw new Error('Provider not found');
    }

    const reviews = await Review.find({ providerId })
      .populate('customerId', 'name profileImage location')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
