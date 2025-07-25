import api from '../utils/api';

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  me: () => api.get('/auth/me/'),
};
