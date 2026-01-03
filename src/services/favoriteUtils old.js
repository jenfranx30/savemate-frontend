// src/utils/favoriteUtils.js
// Utility functions for managing favorites (works with or without login)

/**
 * Add a deal to favorites
 * @param {Object} deal - The deal object to add
 * @returns {boolean} - Success status
 */
export const addToFavorites = async (deal) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Logged in: Save to API
    try {
      const response = await fetch('http://localhost:8000/api/v1/favorites/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal_id: deal.id || deal.deal_id,
          deal: {
            id: deal.id || deal.deal_id,
            title: deal.title,
            image_url: deal.image_url,
            price: deal.price,
            original_price: deal.original_price,
            discount: deal.discount,
            category: deal.category,
            source: deal.source,
            location: deal.location,
            valid_until: deal.valid_until,
            business_name: deal.business_name
          }
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  } else {
    // Not logged in: Save to localStorage
    try {
      const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      
      // Check if already exists
      const exists = guestFavorites.some(f => 
        (f.deal_id || f.id) === (deal.id || deal.deal_id)
      );
      
      if (!exists) {
        guestFavorites.push({
          id: Date.now(), // Generate temporary ID
          deal_id: deal.id || deal.deal_id,
          title: deal.title,
          created_at: new Date().toISOString()
        });
        
        localStorage.setItem('guestFavorites', JSON.stringify(guestFavorites));
      }
      
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
};

/**
 * Remove a deal from favorites
 * @param {number} dealId - The deal ID to remove
 * @returns {boolean} - Success status
 */
export const removeFromFavorites = async (dealId) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Logged in: Remove from API
    try {
      const response = await fetch(`http://localhost:8000/api/v1/favorites/${dealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  } else {
    // Not logged in: Remove from localStorage
    try {
      const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      const updated = guestFavorites.filter(f => f.deal_id !== dealId);
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

/**
 * Check if a deal is in favorites
 * @param {number} dealId - The deal ID to check
 * @returns {boolean} - Whether the deal is favorited
 */
export const isFavorited = async (dealId) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Logged in: Check API
    try {
      const response = await fetch('http://localhost:8000/api/v1/favorites/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const favorites = Array.isArray(data) ? data : (data.favorites || []);
        return favorites.some(f => f.deal_id === dealId);
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  }
  
  // Not logged in or API failed: Check localStorage
  const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
  return guestFavorites.some(f => f.deal_id === dealId);
};

/**
 * Get all favorites
 * @returns {Array} - Array of favorite deals
 */
export const getAllFavorites = async () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Logged in: Fetch from API
    try {
      const response = await fetch('http://localhost:8000/api/v1/favorites/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : (data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }
  
  // Not logged in or API failed: Get from localStorage
  return JSON.parse(localStorage.getItem('guestFavorites') || '[]');
};

/**
 * Sync guest favorites to user account when they log in
 * Call this after successful login
 */
export const syncGuestFavoritesToAccount = async (token) => {
  const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
  
  if (guestFavorites.length === 0) return;
  
  // Upload each guest favorite to the API
  for (const favorite of guestFavorites) {
    try {
      await fetch('http://localhost:8000/api/v1/favorites/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deal_id: favorite.deal_id,
          deal: favorite
        })
      });
    } catch (error) {
      console.error('Error syncing favorite:', error);
    }
  }
  
  // Clear guest favorites after syncing
  localStorage.removeItem('guestFavorites');
};
