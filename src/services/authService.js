import axios from 'axios';
import { API_URL } from '../config/api';

console.log('========================================');
console.log('AUTH SERVICE LOADED');
console.log('API_URL:', API_URL);
console.log('========================================');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    console.log('>> REQUEST:', config.method.toUpperCase(), config.baseURL + config.url);
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('>> REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('<< RESPONSE:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('<< RESPONSE ERROR:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

const authService = {
  // Login user
  login: async (credentials) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email/Username:', credentials.emailOrUsername);
    console.log('API Endpoint:', API_URL + '/auth/login');
    
    try {
      const response = await api.post('/auth/login', {
        email_or_username: credentials.emailOrUsername,
        password: credentials.password,
      });

      console.log('=== LOGIN SUCCESS ===');
      console.log('Response:', response.data);

      const accessToken = response.data?.tokens?.access_token;
      const refreshToken = response.data?.tokens?.refresh_token;
      const user = response.data?.user;

      if (accessToken) localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error('=== LOGIN FAILED ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      throw error.response?.data || { detail: 'Login failed. Please try again.' };
    }
  },

  // Register user
  register: async (userData) => {
    console.log('=== REGISTER ATTEMPT ===');
    
    try {
      const response = await api.post('/auth/register', userData);

      console.log('=== REGISTER SUCCESS ===');

      const accessToken = response.data?.tokens?.access_token;
      const refreshToken = response.data?.tokens?.refresh_token;
      const user = response.data?.user;

      if (accessToken) localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error('=== REGISTER FAILED ===');
      console.error('Error:', error);
      throw error.response?.data || { detail: 'Registration failed. Please try again.' };
    }
  },

  logout: () => {
    console.log('=== LOGOUT ===');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      if (user) localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to load user profile.' };
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.data?.access_token) localStorage.setItem('access_token', response.data.access_token);
      if (response.data?.refresh_token) localStorage.setItem('refresh_token', response.data.refresh_token);

      return response.data;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },
};

export default authService;
