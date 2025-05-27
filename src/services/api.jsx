/* eslint-disable no-unused-vars */
import axios from 'axios';
import { getAccessTokenFromLocalStorage } from '../utils/authUtils';

export const domain = `http://localhost:8000/api`;

const api = axios.create({
  baseURL: domain,
  timeout: 1000000,
});

// Biến để theo dõi trạng thái làm mới token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor để thêm access_token vào header
api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token available in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response.data.error_code;
      console.log('Error response from server:', error.response.data);

      const token = getAccessTokenFromLocalStorage();
      if (!token) {
        console.log('No token available, redirecting to login');
        localStorage.removeItem('authData');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Chỉ làm mới token nếu không phải là request đến /refresh-token
      if (errorCode === 'EXPIRED_TOKEN' && error.config.url !== `${domain}/refresh-token`) {
        const originalRequest = error.config;

        if (isRefreshing) {
          // Nếu đang làm mới token, đưa request vào hàng đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        isRefreshing = true;

        try {
          console.log('Attempting to refresh token...');
          const response = await api.post('/refresh-token');
          const newToken = response.data.access_token;
          const authData = JSON.parse(localStorage.getItem('authData'));
          authData.access_token = newToken;
          localStorage.setItem('authData', JSON.stringify(authData));

          // Xử lý hàng đợi với token mới
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError.response?.data);
          processQueue(refreshError);
          localStorage.removeItem('authData');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        console.log('ERROR CODE:', errorCode);
        localStorage.removeItem('authData');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;