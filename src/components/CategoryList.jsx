// src/components/CategoryList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import LoadingSpinner from './LoadingSpinner';

export default function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock categories data (fallback if API fails)
  const mockCategories = [
    {
      id: 1,
      name: 'Food & Dining',
      icon: '🍔',
      slug: 'food',
      dealCount: 145,
      color: 'bg-red-400'
    },
    {
      id: 2,
      name: 'Shopping',
      icon: '🛍️',
      slug: 'shopping',
      dealCount: 230,
      color: 'bg-purple-400'
    },
    {
      id: 3,
      name: 'Entertainment',
      icon: '🎬',
      slug: 'entertainment',
      dealCount: 89,
      color: 'bg-pink-400'
    },
    {
      id: 4,
      name: 'Health & Beauty',
      icon: '💆',
      slug: 'health',
      dealCount: 67,
      color: 'bg-green-400'
    },
    {
      id: 5,
      name: 'Travel',
      icon: '✈️',
      slug: 'travel',
      dealCount: 112,
      color: 'bg-blue-400'
    },
    {
      id: 6,
      name: 'Services',
      icon: '🔧',
      slug: 'services',
      dealCount: 93,
      color: 'bg-orange-400'
    }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API if getFeaturedCategories exists
      try {
        const { getFeaturedCategories } = await import('../services/dealsApi');
        const data = await getFeaturedCategories();
        setCategories(data);
      } catch (apiError) {
        // If API import or call fails, use mock data
        console.log('Using mock categories data');
        setCategories(mockCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      // Use mock data as fallback
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    // Navigate to deals page with category filter
    navigate(`/deals?category=${category.slug}`);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-600">
            Find deals in your favorite categories
          </p>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>

        {/* View All Categories Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Categories
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
