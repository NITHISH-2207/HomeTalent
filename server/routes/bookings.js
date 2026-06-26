import express from 'express';
import {
  createBooking,
  getMyBookings,
  getIncomingRequests,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireProvider } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply auth protection middleware to all booking routes
router.use(protect);

// Customer bookings routes
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);

// Provider incoming requests and action routes
router.get('/requests', requireProvider, getIncomingRequests);
router.put('/:id/accept', requireProvider, acceptBooking);
router.put('/:id/reject', requireProvider, rejectBooking);
router.put('/:id/complete', requireProvider, completeBooking);

export default router;
