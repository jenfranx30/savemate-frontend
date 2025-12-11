// src/components/HomePage.jsx - WITH MY FAVORITES
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import FeaturedDeals from './FeaturedDeals'; // Removed - showing empty state
import ExternalDeals from './ExternalDeals';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
    
    // Listen for localStorage changes (when favorites are added/removed)
    const handleStorageChange = (e) => {
      if (e.key === 'guestFavorites' || !e.key) {
        console.log('Favorites changed, refreshing...');
        fetchFavorites();
      }
    };
    
    // Listen for custom event (for same-window changes)
    const handleFavoritesChange = () => {
      console.log('Favorites updated via custom event');
      fetchFavorites();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesChanged', handleFavoritesChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, []);

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      
      if (token) {
        // Logged in: Fetch from API
        const response = await fetch('http://localhost:8000/api/v1/favorites/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data.slice(0, 6));
        } else {
          // API error, fall back to localStorage
          const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
          setFavorites(localFavorites.slice(0, 6));
        }
      } else {
        // Not logged in: Use localStorage (guest favorites)
        const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
        setFavorites(localFavorites.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Fall back to localStorage on error
      const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      setFavorites(localFavorites.slice(0, 6));
    } finally {
      setLoadingFavorites(false);
    }
  };

  const removeFavorite = async (dealId) => {
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

        if (response.ok) {
          setFavorites(favorites.filter(f => f.deal_id !== dealId));
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    } else {
      // Not logged in: Remove from localStorage
      const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      const updated = localFavorites.filter(f => f.deal_id !== dealId);
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      setFavorites(updated.slice(0, 6));
    }
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      // Fetch from both Slickdeals and Reddit
      const [slickdealsRes, redditRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/external/deals/slickdeals'),
        fetch('http://localhost:8000/api/v1/external/deals/rapidapi')
      ]);

      const slickdealsData = slickdealsRes.ok ? await slickdealsRes.json() : { deals: [] };
      const redditData = redditRes.ok ? await redditRes.json() : { deals: [] };

      // Extract deals arrays
      const extractDeals = (data) => {
        if (Array.isArray(data)) return data;
        if (data.deals && Array.isArray(data.deals)) return data.deals;
        return [];
      };

      const allDeals = [
        ...extractDeals(slickdealsData),
        ...extractDeals(redditData)
      ];

      // Filter by search query
      const query = searchQuery.toLowerCase();
      const filtered = allDeals.filter(deal => 
        deal.title?.toLowerCase().includes(query) ||
        deal.description?.toLowerCase().includes(query)
      );

      console.log(`Search for "${searchQuery}": Found ${filtered.length} deals`);
      setSearchResults(filtered);

      // Scroll to search results
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                SaveMate
              </h1>
            </div>

            {/* Sign In Button */}
            <div>
              <button 
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to SaveMate
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing local deals and save money on your favorite products and services.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for deals, restaurants, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                  🔍
                </span>
              </div>
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SEARCH RESULTS SECTION */}
      {isSearching && searchResults.length > 0 && (
        <section id="search-results" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                🔍 Search Results
              </h2>
              <p className="text-lg text-gray-600">
                Found {searchResults.length} deals matching "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsSearching(false);
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                ✕ Clear Search
              </button>
            </div>

            {/* Search Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {searchResults.map((deal, index) => {
                const getSourceBadge = (source) => {
                  const badges = {
                    slickdeals: { bg: 'bg-blue-600', text: 'SLICKDEALS', icon: '🔥' },
                    reddit: { bg: 'bg-orange-600', text: 'REDDIT', icon: '🤖' }
                  };
                  const sourceLower = source?.toLowerCase() || '';
                  return badges[sourceLower] || { bg: 'bg-gray-500', text: 'DEAL', icon: '🏷️' };
                };

                const badge = getSourceBadge(deal.source);

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden"
                  >
                    {/* Deal Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <span className="text-7xl">{badge.icon}</span>
                    </div>

                    {/* Deal Info */}
                    <div className="p-6">
                      {/* Source Badge */}
                      <div className={`${badge.bg} text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-3`}>
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[56px]">
                        {deal.title}
                      </h3>

                      {/* Price & Discount */}
                      <div className="mb-4">
                        {deal.discounted_price && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-green-600">
                              ${typeof deal.discounted_price === 'number' ? deal.discounted_price.toFixed(2) : deal.discounted_price}
                            </span>
                            {deal.original_price && deal.original_price > deal.discounted_price && (
                              <span className="text-sm text-gray-400 line-through">
                                ${typeof deal.original_price === 'number' ? deal.original_price.toFixed(2) : deal.original_price}
                              </span>
                            )}
                          </div>
                        )}
                        {deal.discount_percentage && (
                          <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                            {deal.discount_percentage}% OFF
                          </div>
                        )}
                      </div>

                      {/* View Deal Button */}
                      <a
                        href={deal.deal_url || deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View Deal →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Browsing Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsSearching(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Browse All Deals
              </button>
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {isSearching && searchResults.length === 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No deals found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-8">
              Try different keywords or browse all deals below
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setIsSearching(false);
              }}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </section>
      )}

      {/* MY FAVORITES SECTION - REPLACES CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ⭐ My Favorites
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your saved deals in one place
            </p>
          </div>

          {/* Loading State */}
          {loadingFavorites && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* No Favorites State - Show for everyone */}
          {!loadingFavorites && favorites.length === 0 && (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-12">
                <div className="text-6xl mb-6">❤️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No Favorites Yet
                </h3>
                <p className="text-gray-600 mb-8">
                  Start exploring deals below and save your favorites by clicking the heart icon
                </p>
                <button
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Explore Deals Below
                </button>
              </div>
            </div>
          )}

          {/* Favorites Grid - Show for everyone (logged in or not) */}
          {!loadingFavorites && favorites.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {favorites.map((favorite) => {
                  // Get source badge
                  const getSourceBadge = (source) => {
                    const badges = {
                      slickdeals: { bg: 'bg-blue-600', text: 'SLICKDEALS', icon: '🔥' },
                      reddit: { bg: 'bg-orange-600', text: 'REDDIT', icon: '🤖' }
                    };
                    const sourceLower = source?.toLowerCase() || '';
                    return badges[sourceLower] || { bg: 'bg-purple-600', text: 'DEAL', icon: '❤️' };
                  };
                  
                  const badge = getSourceBadge(favorite.source);
                  
                  return (
                    <div
                      key={favorite.id || favorite.deal_id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group"
                    >
                      {/* Deal Image */}
                      <div className={`relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center`}>
                        <span className="text-7xl">{badge.icon}</span>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFavorite(favorite.deal_id)}
                          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors"
                          title="Remove from favorites"
                        >
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      {/* Deal Info */}
                      <div className="p-6">
                        {/* Source Badge */}
                        <div className={`${badge.bg} text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-3`}>
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[56px]">
                          {favorite.title || 'Saved Deal'}
                        </h3>

                        {/* Price & Discount */}
                        {favorite.price && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-bold text-green-600">
                                ${typeof favorite.price === 'number' ? favorite.price.toFixed(2) : favorite.price}
                              </span>
                            </div>
                            {favorite.discount && (
                              <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                {favorite.discount}% OFF
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* View Deal Button */}
                        {favorite.url ? (
                          <a
                            href={favorite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            View Deal →
                          </a>
                        ) : (
                          <button
                            onClick={() => navigate('/deals')}
                            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            View Deal →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Favorites Button */}
              <div className="text-center">
                <button
                  onClick={() => navigate('/favorites')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                >
                  View All Favorites
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Deals Section - REMOVED (showing empty state) */}
      {/* <FeaturedDeals /> */}

      {/* External Deals Section */}
      <ExternalDeals />

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start saving?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of savvy shoppers finding the best deals every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/register?type=individual')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors duration-200 min-w-[280px]"
            >
              Sign Up (Individual)
              <span className="block text-sm font-normal mt-1">View deals and buy</span>
            </button>
            <button 
              onClick={() => navigate('/register?type=business')}
              className="bg-purple-700 text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-800 transition-colors duration-200 min-w-[280px]"
            >
              Sign Up (Business)
              <span className="block text-sm font-normal mt-1">Add or list deals and sell</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">SaveMate</h3>
              <p className="text-gray-400">
                Your trusted platform for discovering local deals and saving money.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* For Business */}
            <div>
              <h3 className="text-lg font-bold mb-4">For Business</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    List Your Business
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Advertise
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Business Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.open('https://facebook.com', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  📘
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  🦅
                </button>
                <button 
                  onClick={() => window.open('https://instagram.com', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  📸
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SaveMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}