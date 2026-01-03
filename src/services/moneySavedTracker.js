// src/utils/moneySavedTracker.js
// Utility to track money saved from deals

/**
 * Track money saved when user claims a deal
 * @param {Object} deal - Deal object with prices
 * @param {number} deal.original_price - Original price
 * @param {number} deal.discounted_price - Discounted price
 * @param {string} deal.id - Deal ID
 * @param {string} deal.title - Deal title
 * @returns {number} Amount saved
 */
export const trackMoneySaved = (deal) => {
  try {
    const savings = deal.original_price - deal.discounted_price;
    
    // Get existing savings history
    const savedDeals = JSON.parse(localStorage.getItem('savedDealsHistory') || '[]');
    
    // Create savings record
    const savingsRecord = {
      dealId: deal.id || deal.deal_id,
      dealTitle: deal.title,
      originalPrice: deal.original_price,
      discountedPrice: deal.discounted_price,
      savings: savings,
      currency: 'zł',
      claimedAt: new Date().toISOString(),
      month: new Date().toISOString().slice(0, 7) // YYYY-MM format
    };
    
    // Add to history
    savedDeals.push(savingsRecord);
    
    // Save back to localStorage
    localStorage.setItem('savedDealsHistory', JSON.stringify(savedDeals));
    
    console.log(`💰 Saved ${savings.toFixed(2)} zł on "${deal.title}"`);
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new Event('moneySavedUpdated'));
    
    return savings;
  } catch (error) {
    console.error('Error tracking money saved:', error);
    return 0;
  }
};

/**
 * Get total money saved for current month
 * @returns {number} Total savings in current month
 */
export const getMonthlyMoneySaved = () => {
  try {
    const savedDeals = JSON.parse(localStorage.getItem('savedDealsHistory') || '[]');
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const monthlySavings = savedDeals
      .filter(deal => deal.month === currentMonth)
      .reduce((total, deal) => total + deal.savings, 0);
    
    return monthlySavings;
  } catch (error) {
    console.error('Error calculating monthly savings:', error);
    return 0;
  }
};

/**
 * Get total money saved all time
 * @returns {number} Total savings
 */
export const getTotalMoneySaved = () => {
  try {
    const savedDeals = JSON.parse(localStorage.getItem('savedDealsHistory') || '[]');
    
    const totalSavings = savedDeals.reduce((total, deal) => total + deal.savings, 0);
    
    return totalSavings;
  } catch (error) {
    console.error('Error calculating total savings:', error);
    return 0;
  }
};

/**
 * Get savings history
 * @param {number} limit - Number of records to return
 * @returns {Array} Array of savings records
 */
export const getSavingsHistory = (limit = 10) => {
  try {
    const savedDeals = JSON.parse(localStorage.getItem('savedDealsHistory') || '[]');
    
    // Sort by date, most recent first
    const sorted = savedDeals.sort((a, b) => 
      new Date(b.claimedAt) - new Date(a.claimedAt)
    );
    
    return limit ? sorted.slice(0, limit) : sorted;
  } catch (error) {
    console.error('Error getting savings history:', error);
    return [];
  }
};

/**
 * Clear savings history (for testing or reset)
 */
export const clearSavingsHistory = () => {
  localStorage.removeItem('savedDealsHistory');
  window.dispatchEvent(new Event('moneySavedUpdated'));
  console.log('💰 Savings history cleared');
};

/**
 * Get savings by month
 * @returns {Object} Savings grouped by month
 */
export const getSavingsByMonth = () => {
  try {
    const savedDeals = JSON.parse(localStorage.getItem('savedDealsHistory') || '[]');
    
    const byMonth = savedDeals.reduce((acc, deal) => {
      const month = deal.month;
      if (!acc[month]) {
        acc[month] = {
          month: month,
          totalSavings: 0,
          dealCount: 0,
          deals: []
        };
      }
      acc[month].totalSavings += deal.savings;
      acc[month].dealCount += 1;
      acc[month].deals.push(deal);
      return acc;
    }, {});
    
    return byMonth;
  } catch (error) {
    console.error('Error getting savings by month:', error);
    return {};
  }
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount) => {
  return `${amount.toFixed(2)} zł`;
};
