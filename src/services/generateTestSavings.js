// src/utils/generateTestSavings.js
// Generate test savings data for demo purposes

import { trackMoneySaved } from './moneySavedTracker';

/**
 * Generate random test savings for demo
 * This simulates users claiming deals over the past month
 */
export const generateTestSavings = () => {
  const testDeals = [
    {
      id: 'test-1',
      title: '50% Off Pizza - Weekend Special',
      original_price: 39.99,
      discounted_price: 19.99
    },
    {
      id: 'test-2',
      title: 'Burger Combo - 35% Off',
      original_price: 29.99,
      discounted_price: 19.49
    },
    {
      id: 'test-3',
      title: 'Coffee & Pastry Bundle',
      original_price: 24.99,
      discounted_price: 17.49
    },
    {
      id: 'test-4',
      title: 'Sushi All You Can Eat',
      original_price: 89.99,
      discounted_price: 53.99
    },
    {
      id: 'test-5',
      title: 'Fresh Artisan Bread',
      original_price: 1.82,
      discounted_price: 1.37
    },
    {
      id: 'test-6',
      title: 'Premium Coffee Beans',
      original_price: 5.10,
      discounted_price: 3.88
    },
    {
      id: 'test-7',
      title: 'Organic Tomatoes',
      original_price: 5.93,
      discounted_price: 4.45
    },
    {
      id: 'test-8',
      title: 'Greek Yogurt Pack',
      original_price: 5.68,
      discounted_price: 4.26
    }
  ];

  console.log('🎯 Generating test savings data...');
  
  // Track each deal
  testDeals.forEach(deal => {
    trackMoneySaved(deal);
  });

  const totalSavings = testDeals.reduce((sum, deal) => 
    sum + (deal.original_price - deal.discounted_price), 0
  );

  console.log(`✅ Generated test savings: ${totalSavings.toFixed(2)} zł from ${testDeals.length} deals`);
  
  return {
    dealsCount: testDeals.length,
    totalSavings: totalSavings
  };
};

/**
 * Add a single test saving (for quick testing)
 */
export const addSingleTestSaving = () => {
  const deal = {
    id: `test-${Date.now()}`,
    title: 'Test Deal - 50% Off',
    original_price: 100.00,
    discounted_price: 50.00
  };
  
  trackMoneySaved(deal);
  console.log('✅ Added single test saving: 50.00 zł');
  
  return 50.00;
};
