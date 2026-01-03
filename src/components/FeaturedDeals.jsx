// src/components/FeaturedDeals.jsx
import { useState, useEffect } from 'react';
import { getFeaturedDeals } from '../services/dealsApi';
import DealCard from './DealCard';
import LoadingSpinner from './LoadingSpinner';

export default function FeaturedDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await getFeaturedDeals();
      setDeals(data);
    } catch (err) {
      console.error('Error loading deals:', err);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">⚠️ Error Loading Deals</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={loadDeals}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-gray-50 rounded-lg p-12 max-w-md mx-auto">
          <p className="text-6xl mb-4">🎁</p>
          <p className="text-gray-600 text-lg font-semibold mb-2">No deals available yet</p>
          <p className="text-gray-500 text-sm">Check back soon for amazing offers!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Deals
          </h2>
          <p className="text-gray-600">
            Don't miss out on these amazing offers
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* View All Button */}
        {deals.length >= 12 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              View All Deals
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
