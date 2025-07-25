import api from '../utils/api';

export const boardsAPI = {
  list: () => api.get('/boards/'),
  create: (data) => api.post('/boards/', data),
  retrieve: (id) => api.get(`/boards/${id}/`),
  update: (id, data) => api.patch(`/boards/${id}/`, data),
  delete: (id) => api.delete(`/boards/${id}/`),
};
