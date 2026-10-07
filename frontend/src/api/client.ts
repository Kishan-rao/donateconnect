import axios from 'axios';
import { Capacitor } from '@capacitor/core';

const getBaseUrl = (): string => {
  let url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    if (Capacitor.isNativePlatform()) {
      url = 'http://192.168.29.227:8080/api';
    } else {
      url = '/api';
    }
  }

  // Normalize: trim whitespace and trailing slashes
  url = url.trim().replace(/\/+$/, '');

  // Ensure /api suffix exists so relative paths like /auth/register or /health route correctly
  if (!url.endsWith('/api') && url !== '/api') {
    url = `${url}/api`;
  }

  return url;
};

const BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

let inMemoryToken: string | null = localStorage.getItem('dc-token');
let logoutCallback: (() => void) | null = null;

export const setAuthTokenInMemory = (token: string | null) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem('dc-token', token);
  } else {
    localStorage.removeItem('dc-token');
  }
};

export const registerLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

// Request Interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use((config) => {
  const activeToken = inMemoryToken || localStorage.getItem('dc-token');
  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  }
  return config;
});

// Response Interceptor: Catch 401 Unauthorized errors on protected requests
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isPublicEndpoint = requestUrl.includes('/health') || requestUrl.includes('/auth/');
    const hasToken = inMemoryToken || localStorage.getItem('dc-token');

    // Only trigger logout callback if an authenticated session received 401
    // (Never logout merely because a public health check or login attempt returned 401)
    if (error.response?.status === 401 && !isPublicEndpoint && hasToken && logoutCallback) {
      logoutCallback();
    }

    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const err = new Error(message) as any;
    err.response = error.response;
    err.status = error.response?.status;
    return Promise.reject(err);
  }
);
