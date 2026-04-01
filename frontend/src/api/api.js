import axios from 'axios';

const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('st_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (payload) => axiosInstance.post('/auth/register', payload),
  login: (payload) => axiosInstance.post('/auth/login', payload),
  googleLogin: (tokenId) => axiosInstance.post('/auth/google', { tokenId }),
  guestLogin: () => axiosInstance.post('/auth/guest'),
  me: () => axiosInstance.get('/auth/me')
};

export const tripsAPI = {
  all: () => axiosInstance.get('/trips'),
  recommended: () => axiosInstance.get('/trips/recommended'),
  mine: () => axiosInstance.get('/trips/mine'),
  details: (id) => axiosInstance.get(`/trips/${id}`),
  create: (payload) => axiosInstance.post('/trips', payload),
  requestJoin: (id) => axiosInstance.post(`/trips/${id}/request`),
  updateRequest: (tripId, requestId, action) => axiosInstance.put(`/trips/${tripId}/requests/${requestId}/${action}`)
};

export const userAPI = {
  suggested: () => axiosInstance.get('/users/suggested'),
  update: (payload) => axiosInstance.put('/users/update', payload)
};

export const chatAPI = {
  load: (tripId) => axiosInstance.get(`/chat/${tripId}`),
  send: (tripId, payload) => axiosInstance.post(`/chat/${tripId}`, payload)
};
