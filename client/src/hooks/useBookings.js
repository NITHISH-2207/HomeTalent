import { useState, useCallback } from 'react';
import bookingService from '../services/bookingService.js';
import useNotifications from './useNotifications.js';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchNotifications } = useNotifications();

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getIncomingRequests();
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.createBooking(bookingData);
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create booking';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const accept = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.acceptBooking(id);
      // Refresh local list state
      setRequests(prev => prev.map(b => b._id === id ? { ...b, status: 'accepted' } : b));
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to accept booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.rejectBooking(id);
      // Refresh local list state
      setRequests(prev => prev.map(b => b._id === id ? { ...b, status: 'rejected' } : b));
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reject booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const complete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.completeBooking(id);
      // Refresh local list state
      setRequests(prev => prev.map(b => b._id === id ? { ...b, status: 'completed' } : b));
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to complete booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.cancelBooking(id);
      // Refresh local list state
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    requests,
    loading,
    error,
    fetchMyBookings,
    fetchRequests,
    create,
    accept,
    reject,
    complete,
    cancel
  };
};

export default useBookings;
