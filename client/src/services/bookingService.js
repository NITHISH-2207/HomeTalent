import api from './api.js';

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

export const getIncomingRequests = async () => {
  const response = await api.get('/bookings/requests');
  return response.data;
};

export const acceptBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/accept`);
  return response.data;
};

export const rejectBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/reject`);
  return response.data;
};

export const completeBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/complete`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

const bookingService = {
  createBooking,
  getMyBookings,
  getIncomingRequests,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking
};

export default bookingService;
