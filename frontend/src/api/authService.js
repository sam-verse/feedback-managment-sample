import apiClient from './config';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/token/', credentials);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post('/auth/token/refresh/', {
      refresh: refreshToken
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};
