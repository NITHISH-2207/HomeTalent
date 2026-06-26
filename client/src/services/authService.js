import api from './api.js';

export const register = async (name, phone, password, city, area) => {
  const response = await api.post('/auth/register', {
    name,
    phone,
    password,
    location: { city, area }
  });
  return response.data;
};

export const login = async (phone, password) => {
  const response = await api.post('/auth/login', { phone, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const authService = {
  register,
  login,
  getCurrentUser
};

export default authService;
