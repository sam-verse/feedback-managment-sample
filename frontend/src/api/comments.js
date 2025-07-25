import api from '../utils/api';

export const commentsAPI = {
  list: (params = {}) => api.get('/comments/', { params }),
  create: (data) => api.post('/comments/', data),
  update: (id, data) => api.patch(`/comments/${id}/`, data),
  delete: (id) => api.delete(`/comments/${id}/`),
};
