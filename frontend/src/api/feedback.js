import api from '../utils/api';
export const feedbackAPI = {
  list: (params = {}
) => api.get('/feedback/', { params }),
  create: (data) => api.post('/feedback/', data),
  retrieve: (id) => api.get(`/feedback/${id}/`),
  update: (id, data) => api.patch(`/feedback/${id}/`, data),
  delete: (id) => api.delete(`/feedback/${id}/`),
  upvote: (id) => api.post(`/feedback/${id}/upvote/`),
  summary: (params = {}) => api.get('/feedback/summary/', { params }),
};
