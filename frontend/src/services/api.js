// src/services/api.js
// Axios instance and all API call functions

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kato_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kato_token');
      localStorage.removeItem('kato_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
};

// ─── URL ──────────────────────────────────────────────────────────────────
export const urlAPI = {
  create: (data) => api.post('/api/url/create', data),
  getAll: (params) => api.get('/api/url', { params }),
  getById: (id) => api.get(`/api/url/${id}`),
  update: (id, data) => api.put(`/api/url/${id}`, data),
  delete: (id) => api.delete(`/api/url/${id}`),
  bulkUpload: (formData) =>
    api.post('/api/url/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ─── Analytics ────────────────────────────────────────────────────────────
export const analyticsAPI = {
  get: (id) => api.get(`/api/analytics/${id}`),
};

// ─── Public ───────────────────────────────────────────────────────────────
export const publicAPI = {
  getStats: (shortCode) => api.get(`/api/public/stats/${shortCode}`),
};

export default api;
