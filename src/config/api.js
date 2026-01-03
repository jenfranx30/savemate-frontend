// src/config/api.js
// Smart API configuration that works for both desktop and mobile

/**
 * Automatically determines the correct API URL based on current hostname
 * - Desktop (localhost): http://localhost:8000
 * - Mobile (network IP): http://192.168.8.125:8000
 */
function getApiBaseUrl() {
  const hostname = window.location.hostname;
  
  // Check if we're on localhost (desktop)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('Mode: Desktop');
    console.log('API: http://localhost:8000');
    return 'http://localhost:8000';
  }
  
  // We're on network IP (mobile)
  const apiUrl = `http://${hostname}:8000`;
  console.log('Mode: Mobile');
  console.log('API:', apiUrl);
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
const currentHostname = window.location.hostname;
console.log('=== API Configuration loaded ===');
console.log('Base URL:', API_BASE_URL);
console.log('Environment:', currentHostname === 'localhost' || currentHostname === '127.0.0.1' ? 'Development' : 'Mobile');

export default {
  API_BASE_URL,
  API_V1_PREFIX,
  API_URL,
  ENDPOINTS,
};
