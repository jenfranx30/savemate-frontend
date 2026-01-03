// src/services/api.js
import axios from 'axios';
import { API_URL } from '../config/api'; // ✅ Import dynamic URL

// Create axios instance with dynamic base URL
const api = axios.create({
  baseURL: API_URL, // ✅ Now uses dynamic URL (localhost on desktop, 192.168.x.x on mobile)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Don't redirect - let components handle it
    }
    return Promise.reject(error);
  }
);

// ========== CATEGORIES API ==========
export const getFeaturedCategories = async () => {
  try {
    const response = await api.get('/categories/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    throw error;
  }
};

export const getAllCategories = async (params = {}) => {
  try {
    const response = await api.get('/categories/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    throw error;
  }
};

// ========== DEALS API ==========
export const getFeaturedDeals = async () => {
  try {
    const response = await api.get('/deals/', {
      params: { is_featured: true, page_size: 12 }
    });
    return response.data.deals || [];
  } catch (error) {
    console.error('Error fetching featured deals:', error);
    throw error;
  }
};

export const getAllDeals = async (params = {}) => {
  try {
    const response = await api.get('/deals/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};

export const getDealsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await api.get('/deals/', {
      params: { category_id: categoryId, ...params }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching deals for category ${categoryId}:`, error);
    throw error;
  }
};

export const searchDeals = async (searchTerm, params = {}) => {
  try {
    const response = await api.get('/deals/', {
      params: { search: searchTerm, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching deals:', error);
    throw error;
  }
};

export default api;
