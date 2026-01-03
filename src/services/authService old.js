// Test if this file is even loading
alert('AUTH SERVICE FILE IS LOADING!');
console.log('AUTH SERVICE FILE IS LOADING!');

import axios from 'axios';
import { API_URL } from '../config/api';

alert('API_URL imported: ' + API_URL);
console.log('API_URL imported:', API_URL);

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
    console.log('Making request to:', config.baseURL + config.url);
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

const authService = {
  // Login user
  login: async (credentials) => {
    console.log('Login attempt starting...');
    console.log('Using API URL:', API_URL);
    
    try {
      const response = await api.post('/auth/login', {
        email_or_username: credentials.emailOrUsername,
        password: credentials.password,
      });

      const accessToken = response.data?.tokens?.access_token;
      const refreshToken = response.data?.tokens?.refresh_token;
      const user = response.data?.user;

      if (accessToken) localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      alert('Login Error: ' + error.message);
      throw error.response?.data || { detail: 'Login failed. Please try again.' };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      const accessToken = response.data?.tokens?.access_token;
      const refreshToken = response.data?.tokens?.refresh_token;
      const user = response.data?.user;

      if (accessToken) localStorage.setItem('access_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Registration failed. Please try again.' };
    }
  },

  logout: () => {
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
