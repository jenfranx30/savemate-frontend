// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      searchDeals(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchDeals = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8000/api/v1/external/deals/slickdeals?limit=20`
      );
      const data = await response.json();

      const filteredDeals = (data.deals || []).filter(deal =>
        deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setDeals(filteredDeals);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
                onClick={() => navigate('/')}
              >
                SaveMate
              </h1>
              <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </nav>
        <div className="py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-600 mb-8">
          Found {deals.length} deals
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {deals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No deals found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse all deals
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                    HOT DEAL 🔥
                  </span>
                  <span className="text-xs text-gray-500">
                    {deal.source}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-3 line-clamp-2">
                  {deal.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {deal.description}
                </p>

                <a
                  href={deal.deal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Deal →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
