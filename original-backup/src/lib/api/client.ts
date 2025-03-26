import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// Create base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();
    
    if (session) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${session.user.id}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/auth/signin';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 