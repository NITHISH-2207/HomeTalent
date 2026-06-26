import api from './api.js';

export const getProviders = async (filters = {}) => {
  const response = await api.get('/providers', { params: filters });
  return response.data;
};

export const getProviderById = async (id) => {
  const response = await api.get(`/providers/${id}`);
  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await api.post('/providers/profile', profileData);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/providers/profile', profileData);
  return response.data;
};

export const uploadPortfolio = async (formData) => {
  const response = await api.post('/providers/portfolio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

const providerService = {
  getProviders,
  getProviderById,
  createProfile,
  updateProfile,
  uploadPortfolio,
  getSkills
};

export default providerService;
