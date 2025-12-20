// src/services/dealService.js - UNIFIED DEAL MANAGEMENT SERVICE

/**
 * This service manages all deals across the application
 * It merges business-posted deals (from localStorage) with static deals
 */

// Get all deals (business + static)
export const getAllDeals = () => {
  // Get business deals from localStorage
  const businessDeals = JSON.parse(localStorage.getItem('businessDeals') || '[]');
  
  console.log(`📊 Loaded ${businessDeals.length} business deals from localStorage`);
  
  // You can add static deals here if you want default deals
  const staticDeals = [];
  
  // Merge and return all deals
  const allDeals = [...businessDeals, ...staticDeals];
  console.log(`✅ Total deals: ${allDeals.length}`);
  
  return allDeals;
};

// Get deals by category
export const getDealsByCategory = (category) => {
  const allDeals = getAllDeals();
  return allDeals.filter(deal => deal.category === category);
};

// Get deals by business name
export const getDealsByBusiness = (businessName) => {
  const allDeals = getAllDeals();
  return allDeals.filter(deal => 
    deal.businessName === businessName || 
    deal.business_name === businessName
  );
};

// Get single deal by ID
export const getDealById = (id) => {
  const allDeals = getAllDeals();
  return allDeals.find(deal => 
    deal.id === id || 
    deal.deal_id === id
  );
};

// Get user's posted deals
export const getUserDeals = (userId) => {
  const businessDeals = JSON.parse(localStorage.getItem('businessDeals') || '[]');
  return businessDeals.filter(deal => deal.businessId === userId);
};

// Save new deal
export const saveDeal = (dealData) => {
  console.log('💾 Saving new deal:', dealData.title);
  
  const existingDeals = JSON.parse(localStorage.getItem('businessDeals') || '[]');
  existingDeals.push(dealData);
  localStorage.setItem('businessDeals', JSON.stringify(existingDeals));
  
  console.log(`✅ Deal saved! Total deals: ${existingDeals.length}`);
  
  // Trigger storage event so other components update
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('dealsUpdated', { detail: dealData }));
  
  return dealData;
};

// Delete deal
export const deleteDeal = (dealId) => {
  console.log('🗑️ Deleting deal:', dealId);
  
  const existingDeals = JSON.parse(localStorage.getItem('businessDeals') || '[]');
  const filteredDeals = existingDeals.filter(deal => 
    deal.id !== dealId && deal.deal_id !== dealId
  );
  
  localStorage.setItem('businessDeals', JSON.stringify(filteredDeals));
  
  console.log(`✅ Deal deleted! Remaining deals: ${filteredDeals.length}`);
  
  // Trigger storage event
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('dealsUpdated', { detail: { deleted: dealId } }));
  
  return true;
};

// Update deal
export const updateDeal = (dealId, updatedData) => {
  console.log('✏️ Updating deal:', dealId);
  
  const existingDeals = JSON.parse(localStorage.getItem('businessDeals') || '[]');
  const dealIndex = existingDeals.findIndex(deal => 
    deal.id === dealId || deal.deal_id === dealId
  );
  
  if (dealIndex !== -1) {
    existingDeals[dealIndex] = {
      ...existingDeals[dealIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('businessDeals', JSON.stringify(existingDeals));
    
    console.log('✅ Deal updated successfully');
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('dealsUpdated', { detail: existingDeals[dealIndex] }));
    
    return existingDeals[dealIndex];
  }
  
  console.error('❌ Deal not found');
  return null;
};

// Get deal statistics
export const getDealStats = (userId = null) => {
  const deals = userId ? getUserDeals(userId) : getAllDeals();
  
  const now = new Date();
  const activeDeals = deals.filter(deal => {
    const validUntil = new Date(deal.validUntil || deal.valid_until);
    return validUntil > now;
  });
  
  const expiredDeals = deals.length - activeDeals.length;
  
  const totalViews = deals.reduce((sum, deal) => sum + (deal.views || 0), 0);
  const totalFavorites = deals.reduce((sum, deal) => sum + (deal.favorites || 0), 0);
  
  return {
    total: deals.length,
    active: activeDeals.length,
    expired: expiredDeals,
    views: totalViews,
    favorites: totalFavorites
  };
};

// Export default object with all functions
export default {
  getAllDeals,
  getDealsByCategory,
  getDealsByBusiness,
  getDealById,
  getUserDeals,
  saveDeal,
  deleteDeal,
  updateDeal,
  getDealStats
};
