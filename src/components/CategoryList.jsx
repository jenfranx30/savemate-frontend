// src/components/CategoryList.jsx
import { useState, useEffect } from 'react';
import { getFeaturedCategories } from '../services/dealsApi';
import CategoryCard from './CategoryCard';
import LoadingSpinner from './LoadingSpinner';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // TODO: Navigate to category page or filter deals
    // For now, we'll just log it
  };

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        {error}
      </div>
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
