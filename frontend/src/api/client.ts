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
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    // auth 엔드포인트는 인터셉터에서 처리하지 않음 (각 페이지에서 직접 처리)
    if (url.startsWith('/auth/')) {
      return Promise.reject(error);
    }

    if (status === 401 || status === 403) {
      const { role } = useAuthStore.getState();

      if (role === 'TABLE') {
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
          }
        }
        useAuthStore.getState().logout();
        window.location.href = '/customer/setup';
      } else {
        // ADMIN 또는 미인증 상태: 로그인 페이지로 리다이렉트
        useAuthStore.getState().logout();
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
