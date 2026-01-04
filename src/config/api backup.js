// src/config/api.js
// Smart API configuration that works for development, mobile, and production

/**
 * Automatically determines the correct API URL
 * Priority:
 * 1. Environment variable (production/Vercel)
 * 2. Network detection (mobile testing)
 * 3. Localhost (development)
 */
function getApiBaseUrl() {
  // 1. Check for environment variable (PRODUCTION)
  if (import.meta.env.VITE_API_URL) {
    console.log('🚀 Mode: Production');
    console.log('🌐 API:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. Fallback to hostname detection (DEVELOPMENT/MOBILE)
  const hostname = window.location.hostname;
  
  // Check if we're on localhost (desktop development)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('💻 Mode: Desktop Development');
    console.log('🌐 API: http://localhost:8000');
    return 'http://localhost:8000';
  }
  
  // We're on network IP (mobile testing)
  const apiUrl = `http://${hostname}:8000`;
  console.log('📱 Mode: Mobile Testing');
  console.log('🌐 API:', apiUrl);
  return apiUrl;
}

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

// Export API v1 prefix
export const API_V1_PREFIX = '/api/v1';

// Full API URL with prefix
export const API_URL = `${API_BASE_URL}${API_V1_PREFIX}`;

// Export endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    REFRESH: `${API_URL}/auth/refresh`,
    LOGOUT: `${API_URL}/auth/logout`,
  },
  DEALS: {
    LIST: `${API_URL}/deals`,
    DETAILS: (id) => `${API_URL}/deals/${id}`,
    CREATE: `${API_URL}/deals`,
    UPDATE: (id) => `${API_URL}/deals/${id}`,
    DELETE: (id) => `${API_URL}/deals/${id}`,
  },
  BUSINESSES: {
    LIST: `${API_URL}/businesses`,
    DETAILS: (id) => `${API_URL}/businesses/${id}`,
  },
  CATEGORIES: {
    LIST: `${API_URL}/categories`,
  },
  FAVORITES: {
    LIST: `${API_URL}/favorites`,
    ADD: `${API_URL}/favorites`,
    REMOVE: (id) => `${API_URL}/favorites/${id}`,
  },
  USERS: {
    PROFILE: `${API_URL}/users/me`,
    UPDATE: `${API_URL}/users/me`,
  },
  UPLOAD: {
    IMAGE: `${API_URL}/upload/image`,
  },
};

// Log configuration on startup
console.log('=== 🎯 API Configuration Loaded ===');
console.log('📍 Base URL:', API_BASE_URL);
console.log('🔧 Full API URL:', API_URL);
console.log('===============================');

export default {
  API_BASE_URL,
  API_V1_PREFIX,
  API_URL,
  ENDPOINTS,
};
