// src/services/externalDealsService.js
import axios from 'axios';
import { API_URL } from '../config/api'; // ✅ Import dynamic URL

const API_BASE_URL = `${API_URL}/external`; // ✅ Now builds URL dynamically

/**
 * Get user's location from their IP address
 */
export const getLocationFromIP = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/location-from-ip`);
    return response.data;
  } catch (error) {
    console.error('Error getting location from IP:', error);
    // Fallback to Warsaw coordinates
    return {
      latitude: 52.2297,
      longitude: 21.0122,
      city: 'Warsaw',
      country: 'Poland'
    };
  }
};

/**
 * Get nearby places using Google Places API
 */
export const getNearbyPlaces = async (latitude, longitude, radius = 5000, type = 'restaurant') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/nearby-places`, {
      latitude,
      longitude,
      radius,
      type
    });
    return response.data;
  } catch (error) {
    console.error('Error getting nearby places:', error);
    return [];
  }
};

/**
 * Get deals from RapidAPI
 */
export const getRapidAPIDeals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/rapidapi`);
    return response.data;
  } catch (error) {
    console.error('Error getting RapidAPI deals:', error);
    return [];
  }
};

/**
 * Get deals from Groupon
 */
export const getGrouponDeals = async (location = 'warsaw') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/groupon`, {
      params: { location }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting Groupon deals:', error);
    return [];
  }
};

/**
 * Get deals from Slickdeals
 */
export const getSlickdeals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/slickdeals`);
    return response.data;
  } catch (error) {
    console.error('Error getting Slickdeals:', error);
    return [];
  }
};

/**
 * Get coupon codes
 */
export const getCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/coupons`);
    return response.data;
  } catch (error) {
    console.error('Error getting coupons:', error);
    return [];
  }
};

/**
 * Get all external deals from multiple sources
 */
export const getAllExternalDeals = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals/all`);
    return response.data;
  } catch (error) {
    console.error('Error getting all external deals:', error);
    return [];
  }
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = async (lat1, lon1, lat2, lon2) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate-distance`, {
      origin: { latitude: lat1, longitude: lon1 },
      destination: { latitude: lat2, longitude: lon2 }
    });
    return response.data.distance;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
};

/**
 * Geocode an address to coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/geocode`, {
      address
    });
    return response.data;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reverse-geocode`, {
      latitude,
      longitude
    });
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};
