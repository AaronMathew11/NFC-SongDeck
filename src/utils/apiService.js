import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api-m2ugc4x7ma-uc.a.run.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const publishRequestAPI = {
  // Submit a new publish request
  submitPublishRequest: async (publishRequestData) => {
    console.log('apiService - about to send:', publishRequestData);
    console.log('apiService - selectedVideos details:', JSON.stringify(publishRequestData.selectedVideos, null, 2));
    const response = await api.post('/submitPublishRequest', publishRequestData);
    return response.data;
  },

  // Get all publish requests (for worship heads)
  getAllPublishRequests: async () => {
    const response = await api.get('/getAllPublishRequests');
    return response.data;
  },

  // Get my publish requests
  getMyPublishRequests: async () => {
    const response = await api.get('/getMyPublishRequests');
    return response.data;
  },

  // Update publish request status (approve/reject)
  updatePublishRequestStatus: async (requestId, status, reviewComment = '') => {
    const response = await api.put(`/updatePublishRequestStatus/${requestId}`, {
      status,
      reviewComment,
    });
    return response.data;
  },

  // Get pending requests count
  getPendingRequestsCount: async () => {
    const response = await api.get('/getPendingRequestsCount');
    return response.data;
  },
};

export default api;