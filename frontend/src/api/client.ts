import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { role } = useAuthStore.getState();

      if (role === 'ADMIN') {
        useAuthStore.getState().setShowReLoginModal(true);
      } else if (role === 'TABLE') {
        const credentials = localStorage.getItem('table_credentials');
        if (credentials) {
          try {
            const cred = JSON.parse(credentials);
            const res = await axios.post('/api/v1/auth/table/login', cred);
            useAuthStore.getState().loginTable(res.data);

            error.config.headers.Authorization = `Bearer ${res.data.token}`;
            return apiClient(error.config);
          } catch {
            localStorage.removeItem('table_credentials');
            useAuthStore.getState().logout();
            window.location.href = '/customer/setup';
          }
        } else {
          useAuthStore.getState().logout();
          window.location.href = '/customer/setup';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
