import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize errors so UI can show consistent message.
    const res = error?.response;
    if (res?.data) {
      return Promise.reject(res.data);
    }
    return Promise.reject({
      error: 'NETWORK_ERROR',
      message: error?.message || 'Network error',
      timestamp: new Date().toISOString(),
    });
  }
);

export default apiClient;

