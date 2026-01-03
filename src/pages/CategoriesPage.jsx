// src/components/CategoriesPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import Navbar from './Navbar';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const [dealCounts, setDealCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      id: 1,
      name: 'Food & Dining',
      icon: '🍕',
      description: 'Restaurants, cafes, and dining experiences',
      color: 'from-orange-400 to-red-600',
      category: 'Food & Dining',
      expected: 6
    },
    {
      id: 2,
      name: 'Grocery & Food',
      icon: '🛒',
      description: 'Supermarkets, fresh produce, and groceries',
      color: 'from-green-400 to-green-600',
      category: 'Grocery & Food',
      expected: 50
    },
    {
      id: 3,
      name: 'Breads & Bakery',
      icon: '🍞',
      description: 'Fresh bread, pastries, and baked goods',
      color: 'from-yellow-500 to-orange-500',
      tag: 'breads',
      expected: 5
    },
    {
      id: 4,
      name: 'Frozen Foods',
      icon: '🧊',
      description: 'Frozen meals, vegetables, and convenience foods',
      color: 'from-blue-400 to-cyan-500',
      tag: 'frozen foods',
      expected: 5
    },
    {
      id: 5,
      name: 'Snacks',
      icon: '🍿',
      description: 'Chips, nuts, popcorn, and treats',
      color: 'from-pink-400 to-rose-500',
      tag: 'snacks',
      expected: 5
    },
    {
      id: 6,
      name: 'Dairy Products',
      icon: '🥛',
      description: 'Milk, cheese, yogurt, and dairy',
      color: 'from-blue-500 to-indigo-500',
      tag: 'dairy',
      expected: 5
    },
    {
      id: 7,
      name: 'Fresh Vegetables',
      icon: '🥬',
      description: 'Fresh vegetables and produce',
      color: 'from-green-500 to-lime-500',
      tag: 'vegetables',
      expected: 5
    },
    {
      id: 8,
      name: 'Beverages',
      icon: '🧃',
      description: 'Drinks, juices, coffee, and tea',
      color: 'from-purple-400 to-pink-500',
      tag: 'beverages',
      expected: 5
    },
    {
      id: 9,
      name: 'Cereals',
      icon: '🥣',
      description: 'Breakfast cereals, oatmeal, and granola',
      color: 'from-amber-500 to-orange-600',
      tag: 'cereals',
      expected: 5
    },
    {
      id: 10,
      name: 'Household Items',
      icon: '🧼',
      description: 'Cleaning supplies and household products',
      color: 'from-sky-500 to-blue-600',
      tag: 'household',
      expected: 5
    },
    {
      id: 11,
      name: 'Packaged Food',
      icon: '📦',
      description: 'Ready meals, instant food, and packaged items',
      color: 'from-orange-500 to-amber-600',
      tag: 'packaged food',
      expected: 5
    },
    {
      id: 12,
      name: 'Confectionery',
      icon: '🍬',
      description: 'Chocolate, candy, and sweets',
      color: 'from-pink-500 to-fuchsia-600',
      tag: 'confectionery',
      expected: 5
    }
  ];

  useEffect(() => {
    fetchDealCounts();
  }, []);

  const fetchDealCounts = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/deals/?page_size=100');
      
      if (response.ok) {
        const data = await response.json();
        const allDeals = data.deals || [];
        
        // ✅ FILTER: Only count business deals
        const businessDeals = allDeals.filter(deal => 
          deal.source === 'business' || 
          deal.business_name === 'Pizza Paradise' || 
          deal.business_name === 'Sklep Charytatywny'
        );
        
        console.log('📊 Total deals from API:', allDeals.length);
        console.log('📊 Business deals filtered:', businessDeals.length);
        console.log('📊 Sample business deal:', businessDeals[0]);
        
        // Count categories
        const counts = {};
        
        businessDeals.forEach(deal => {
          // Count by main category
          if (deal.category) {
            counts[deal.category] = (counts[deal.category] || 0) + 1;
          }
          
          // Count by tags
          if (deal.tags && Array.isArray(deal.tags)) {
            deal.tags.forEach(tag => {
              counts[tag] = (counts[tag] || 0) + 1;
            });
          }
        });
        
        console.log('📊 Category counts:', counts);
        setDealCounts(counts);
      } else {
        console.error('❌ API response not OK:', response.status);
        useFallbackCounts();
      }
    } catch (error) {
      console.error('❌ Error fetching deal counts:', error);
      useFallbackCounts();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackCounts = () => {
    const fallbackCounts = {
      'Food & Dining': 6,
      'Grocery & Food': 50,
      'breads': 5,
      'frozen foods': 5,
      'snacks': 5,
      'dairy': 5,
      'vegetables': 5,
      'beverages': 5,
      'cereals': 5,
      'household': 5,
      'packaged food': 5,
      'confectionery': 5
    };
    setDealCounts(fallbackCounts);
    console.log('📊 Using fallback counts');
  };

  const handleCategoryClick = (category) => {
    if (category.category) {
      navigate(`/deals?category=${encodeURIComponent(category.category)}`);
    } else if (category.tag) {
      navigate(`/deals?tag=${encodeURIComponent(category.tag)}`);
    }
  };

  const getDealCount = (category) => {
    const key = category.category || category.tag;
    return dealCounts[key] || 0;
  };

  const totalDeals = Object.values(dealCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📂</div>
          <h1 className="text-5xl font-bold mb-4">Browse by Category</h1>
          <p className="text-xl text-blue-100 mb-2">
            Explore {categories.length} categories with {loading ? '...' : totalDeals} amazing deals
          </p>
          <p className="text-lg text-blue-200">
            Find exactly what you're looking for
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Categories</h2>
            <p className="text-gray-600">
              {loading ? 'Loading categories...' : `${totalDeals} total deals across ${categories.length} categories`}
            </p>
          </div>
          <button
            onClick={fetchDealCounts}
            disabled={loading}
            className={`flex items-center gap-2 font-semibold ${
              loading ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(category => {
            const dealCount = getDealCount(category);
            
            return (
              <div
                key={category.id}
                onClick={() => dealCount > 0 && handleCategoryClick(category)}
                className={`
                  bg-white rounded-xl shadow-lg overflow-hidden 
                  transform transition-all duration-300 
                  ${dealCount > 0 ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : 'opacity-50 cursor-not-allowed'}
                `}
              >
                {/* Category Header with Gradient */}
                <div className={`bg-gradient-to-br ${category.color} p-8 text-center relative overflow-hidden`}>
                  {/* Background Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="text-9xl">{category.icon}</div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-3">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Category Details */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 text-center min-h-[48px]">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className={`text-center ${dealCount > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                      <span className="text-3xl font-bold">
                        {loading ? '...' : dealCount}
                      </span>
                      <p className="text-sm font-semibold">
                        {dealCount === 1 ? 'deal' : 'deals'} available
                      </p>
                    </div>
                    {dealCount > 0 && (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Categories Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔥 Most Popular Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Grocery & Food */}
            <div 
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all"
              onClick={() => handleCategoryClick(categories[1])}
            >
              <div className="text-center">
                <div className="text-7xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Grocery & Food</h3>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {loading ? '...' : (dealCounts['Grocery & Food'] || 0)}
                </p>
                <p className="text-gray-600 text-sm">deals available</p>
              </div>
            </div>

            {/* Food & Dining */}
            <div 
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all"
              onClick={() => handleCategoryClick(categories[0])}
            >
              <div className="text-center">
                <div className="text-7xl mb-4">🍕</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Food & Dining</h3>
                <p className="text-4xl font-bold text-orange-600 mb-2">
                  {loading ? '...' : (dealCounts['Food & Dining'] || 0)}
                </p>
                <p className="text-gray-600 text-sm">deals available</p>
              </div>
            </div>

            {/* Household */}
            <div 
              className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all"
              onClick={() => handleCategoryClick(categories[9])}
            >
              <div className="text-center">
                <div className="text-7xl mb-4">🧼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Household Items</h3>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {loading ? '...' : (dealCounts['household'] || 0)}
                </p>
                <p className="text-gray-600 text-sm">deals available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-4">💡</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Try browsing all deals or use our search feature
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/deals')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse All Deals
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
