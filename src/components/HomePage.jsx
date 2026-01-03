// src/components/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import ExternalDeals from './ExternalDeals';
import BusinessDeals from './BusinessDeals';
import NotificationBell from './NotificationBell';
import Navbar from './Navbar';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { user: authUser } = useAuth();
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const { openLogin, openSignup } = useAuthModal();

  useEffect(() => {
    checkAuthStatus();
    setTimeBasedGreeting();
    fetchFavorites();
    
    const handleStorageChange = (e) => {
      if (e.key === 'guestFavorites' || e.key === 'user' || !e.key) {
        console.log('Storage changed, refreshing...');
        checkAuthStatus();
        fetchFavorites();
      }
    };
    
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
  }, [authUser]);

  // Check authentication status
  const checkAuthStatus = () => {
    if (authUser) {
      setUserInfo(authUser);
    } else {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email) {
        setUserInfo(user);
      } else {
        setUserInfo(null);
      }
    }
  };

  // Set time-based greeting
  const setTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
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
          const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
          setFavorites(localFavorites.slice(0, 6));
        }
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
        setFavorites(localFavorites.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      setFavorites(localFavorites.slice(0, 6));
    } finally {
      setLoadingFavorites(false);
    }
  };

  const removeFavorite = async (dealId) => {
    const token = localStorage.getItem('token');
    
    if (token) {
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
      const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      const updated = localFavorites.filter(f => f.deal_id !== dealId);
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      setFavorites(updated.slice(0, 6));
      
      window.dispatchEvent(new Event('favoritesChanged'));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      alert('Please enter a search term');
      return;
    }

    console.log(`Navigating to search page with query: "${searchQuery}"`);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSignIn = () => {
    openLogin();
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setUserInfo(null);
    window.location.reload();
  };

  const getSourceBadge = (source) => {
    const badges = {
      slickdeals: { bg: 'bg-blue-600', text: 'SLICKDEALS', icon: '🔥' },
      reddit: { bg: 'bg-orange-600', text: 'REDDIT', icon: '🤖' },
      business: { bg: 'bg-purple-600', text: 'BUSINESS', icon: '🏪' }
    };
    const sourceLower = source?.toLowerCase() || '';
    return badges[sourceLower] || { bg: 'bg-gray-500', text: 'DEAL', icon: '🏷️' };
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return `${Number(price).toFixed(2)} zł`;
  };

  // Check if user is authenticated
  const isAuthenticated = !!authUser;
  const isBusinessAccount = authUser?.is_business_owner === true;
  const firstName = authUser?.full_name?.split(' ')?.[0] || authUser?.username || 'User';

  // ============================================================================
  // AUTHENTICATED USER VIEW - ONLY SHOWN WHEN LOGGED IN
  // ============================================================================
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Welcome Banner - Authenticated */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">👋</span>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {greeting}, {firstName}!
                </h1>
              </div>
              
              {isBusinessAccount ? (
                <div className="space-y-3">
                  <p className="text-2xl text-blue-100">
                    Welcome to your Business Dashboard
                  </p>
                  <p className="text-lg text-blue-200">
                    Manage your deals, track performance, and grow your business
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => navigate('/business/post-deal')}
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      + Post New Deal
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-2xl text-blue-100">
                    Discover Amazing Local Deals
                  </p>
                  <p className="text-lg text-blue-200">
                    Save money while supporting your favorite local businesses
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => navigate('/deals')}
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Browse All Deals
                    </button>
                    <button
                      onClick={() => navigate('/favorites')}
                      className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors"
                    >
                      My Favorites
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Rest of authenticated content - same sections as guest */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ⭐ My Favorites
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your saved deals in one place
              </p>
            </div>

            {loadingFavorites ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your favorites...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12 bg-gray-100 rounded-xl">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start saving deals to see them here
                </p>
                <button
                  onClick={() => navigate('/deals')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Deals
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {favorites.map((favorite) => {
                    const isBusinessDeal = favorite.source === 'business';
                    const badge = getSourceBadge(favorite.source);

                    return (
                      <div
                        key={favorite.deal_id || favorite.id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer relative"
                        onClick={() => navigate(favorite.url || favorite.deal_url || '/deals')}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(favorite.deal_id || favorite.id);
                          }}
                          className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                          title="Remove from favorites"
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>

                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={favorite.image_url || favorite.image}
                            alt={favorite.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Deal';
                            }}
                          />
                          
                          <div className={`absolute top-4 left-4 ${badge.bg} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                            <span>{badge.icon}</span>
                            <span>{badge.text}</span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                            {favorite.title}
                          </h3>

                          {isBusinessDeal && (
                            <div className="flex items-center gap-2 mb-3 text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="text-sm font-medium">{favorite.businessName}</span>
                            </div>
                          )}

                          {isBusinessDeal && favorite.discountedPrice ? (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-green-600">
                                  {formatPrice(favorite.discountedPrice)}
                                </span>
                                {favorite.originalPrice && favorite.originalPrice > favorite.discountedPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(favorite.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-green-600 font-semibold">
                                Save {formatPrice(favorite.originalPrice - favorite.discountedPrice)}
                              </p>
                            </div>
                          ) : favorite.price && (
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

                          {isBusinessDeal && favorite.location && (
                            <div className="flex items-center gap-2 mb-4 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm">{favorite.location}</span>
                            </div>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(favorite.url || favorite.deal_url || '/deals');
                            }}
                            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          >
                            View Deal →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-8">
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

        {/* External Deals Section */}
        <ExternalDeals />

        {/* Business Deals Section */}
        <BusinessDeals />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">SaveMate</h3>
                <p className="text-gray-400">
                  Your trusted platform for discovering local deals and saving money.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => navigate('/deals')} className="text-gray-400 hover:text-white transition-colors">
                      Browse Deals
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/favorites')} className="text-gray-400 hover:text-white transition-colors">
                      My Favorites
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/categories')} className="text-gray-400 hover:text-white transition-colors">
                      Categories
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/top-10-stores')} className="text-gray-400 hover:text-white transition-colors">
                      🏆 Top 10 Online Stores in Poland
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">For Business</h3>
                <ul className="space-y-2">
                  {isBusinessAccount ? (
                    <>
                      <li>
                        <button onClick={() => navigate('/business/post-deal')} className="text-gray-400 hover:text-white transition-colors">
                          Post Deal
                        </button>
                      </li>
                      <li>
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
                          Dashboard
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button onClick={() => openSignup('business')} className="text-gray-400 hover:text-white transition-colors">
                        Become a Partner
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Account</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white transition-colors">
                      Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors">
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button onClick={handleSignOut} className="text-gray-400 hover:text-white transition-colors">
                      Sign Out
                    </button>
                  </li>
                </ul>
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

  // ============================================================================
  // GUEST HOMEPAGE
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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

      {/* MY FAVORITES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ⭐ My Favorites
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your saved deals in one place
            </p>
          </div>

          {loadingFavorites ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 rounded-xl">
              <div className="text-6xl mb-4">💝</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start saving deals to see them here
              </p>
              <button
                onClick={() => navigate('/deals')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Deals
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {favorites.map((favorite) => {
                  const isBusinessDeal = favorite.source === 'business';
                  const badge = getSourceBadge(favorite.source);

                  return (
                    <div
                      key={favorite.deal_id || favorite.id}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer relative"
                      onClick={() => navigate(favorite.url || favorite.deal_url || '/deals')}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(favorite.deal_id || favorite.id);
                        }}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
                        title="Remove from favorites"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>

                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={favorite.image_url || favorite.image}
                          alt={favorite.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Deal';
                          }}
                        />
                        
                        <div className={`absolute top-4 left-4 ${badge.bg} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {favorite.title}
                        </h3>

                        {isBusinessDeal && (
                          <div className="flex items-center gap-2 mb-3 text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-sm font-medium">{favorite.businessName}</span>
                          </div>
                        )}

                        {isBusinessDeal && favorite.discountedPrice ? (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-bold text-green-600">
                                {formatPrice(favorite.discountedPrice)}
                              </span>
                              {favorite.originalPrice && favorite.originalPrice > favorite.discountedPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(favorite.originalPrice)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-green-600 font-semibold">
                              Save {formatPrice(favorite.originalPrice - favorite.discountedPrice)}
                            </p>
                          </div>
                        ) : favorite.price && (
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

                        {isBusinessDeal && favorite.location && (
                          <div className="flex items-center gap-2 mb-4 text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm">{favorite.location}</span>
                          </div>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(favorite.url || favorite.deal_url || '/deals');
                          }}
                          className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Deal →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-8">
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

      {/* External Deals Section */}
      <ExternalDeals />

      {/* Business Deals Section */}
      <BusinessDeals />

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
              onClick={() => openSignup('individual')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors duration-200 min-w-[280px]"
            >
              Sign Up (Individual)
              <span className="block text-sm font-normal mt-1">View deals and buy</span>
            </button>
            <button 
              onClick={() => openSignup('business')}
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
            <div>
              <h3 className="text-lg font-bold mb-4">SaveMate</h3>
              <p className="text-gray-400">
                Your trusted platform for discovering local deals and saving money.
              </p>
            </div>

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
                <li>
                  <button 
                    onClick={() => navigate('/top-10-stores')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    🏆 Top 10 Online Stores in Poland
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">For Business</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => openSignup('business')} 
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
                    onClick={() => openLogin()} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Business Portal
                  </button>
                </li>
              </ul>
            </div>

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
