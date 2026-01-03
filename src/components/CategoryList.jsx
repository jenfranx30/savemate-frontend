// src/components/CategoryList.jsx
// Updated to show actual categories from BusinessDeals.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [dealCounts, setDealCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Top 3 most popular categories from BusinessDeals.jsx
  const topCategories = [
    {
      _id: 'grocery',
      name: 'Grocery & Food',
      icon: '🛒',
      query: 'Grocery & Food',
      color: 'from-green-400 to-green-600'
    },
    {
      _id: 'food-dining',
      name: 'Food & Dining',
      icon: '🍕',
      query: 'Food & Dining',
      color: 'from-orange-400 to-red-600'
    },
    {
      _id: 'household',
      name: 'Household Items',
      icon: '🧼',
      subCategory: 'Household',
      color: 'from-sky-500 to-blue-600'
    }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch deal counts from API
      const response = await fetch('http://localhost:8000/api/v1/deals/');
      
      if (response.ok) {
        const data = await response.json();
        const deals = data.deals || [];
        
        // Count deals by category
        const counts = {};
        deals.forEach(deal => {
          if (deal.category) {
            counts[deal.category] = (counts[deal.category] || 0) + 1;
          }
          if (deal.tags && Array.isArray(deal.tags)) {
            deal.tags.forEach(tag => {
              const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
              counts[formattedTag] = (counts[formattedTag] || 0) + 1;
            });
          }
        });
        
        console.log('📊 Category counts:', counts);
        setDealCounts(counts);
      } else {
        // Fallback counts
        setDealCounts({
          'Grocery & Food': 50,
          'Food & Dining': 6,
          'Household': 5
        });
      }
      
      setCategories(topCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use fallback data
      setCategories(topCategories);
      setDealCounts({
        'Grocery & Food': 50,
        'Food & Dining': 6,
        'Household': 5
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.query) {
      navigate(`/deals?category=${encodeURIComponent(category.query)}`);
    } else if (category.subCategory) {
      navigate(`/deals?subCategory=${encodeURIComponent(category.subCategory)}`);
    } else {
      navigate(`/deals?category=${category._id}`);
    }
  };

  const handleViewAllCategories = () => {
    navigate('/categories');
  };

  const getDealCount = (category) => {
    const key = category.query || category.subCategory;
    return dealCounts[key] || 0;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-lg text-gray-600">Loading categories...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-8 animate-pulse">
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 w-3/4 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded-full w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore curated categories and discover exclusive deals tailored to your interests
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories.map((category) => {
            const dealCount = getDealCount(category);
            
            return (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
              >
                {/* Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${category.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `}></div>
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <div className={`
                      w-20 h-20 mx-auto bg-gradient-to-br ${category.color} 
                      rounded-2xl flex items-center justify-center shadow-lg
                    `}>
                      <span className="text-5xl">{category.icon || '🎁'}</span>
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>

                  {/* Deal Count Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                      {loading ? '...' : dealCount} Active Deals
                    </span>
                  </div>

                  {/* Arrow Icon */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center transform group-hover:translate-x-1 transition-all duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={handleViewAllCategories}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <span>Explore All Categories</span>
            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
