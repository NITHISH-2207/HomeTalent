import api from './api.js';

export const leaveReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getProviderReviews = async (providerId) => {
  const response = await api.get(`/reviews/provider/${providerId}`);
  return response.data;
};

const reviewService = {
  leaveReview,
  getProviderReviews
};

export default reviewService;
