import express from 'express';
import { leaveReview, getProviderReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get reviews of a provider
router.get('/provider/:providerId', getProviderReviews);

// Protected: Leave review on completed booking
router.post('/', protect, leaveReview);

export default router;
