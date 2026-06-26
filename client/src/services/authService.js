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
  const localEdits = localStorage.getItem('user_profile_edits');
  if (localEdits) {
    const parsed = JSON.parse(localEdits);
    return {
      ...response.data,
      ...parsed,
      location: {
        city: parsed.city !== undefined ? parsed.city : response.data.location?.city,
        area: parsed.area !== undefined ? parsed.area : response.data.location?.area
      }
    };
  }
  return response.data;
};

const authService = {
  register,
  login,
  getCurrentUser
};

export default authService;
