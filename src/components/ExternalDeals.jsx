// src/components/ExternalDeals.jsx
import { useState, useEffect } from 'react';

export default function ExternalDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState('all');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchExternalDeals();
    loadFavorites();
  }, [activeSource]);

  const loadFavorites = () => {
    // Load favorites from localStorage
    const localFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    setFavorites(localFavorites);
  };

  const fetchExternalDeals = async () => {
    setLoading(true);
    try {
      let endpoint;
      
      switch(activeSource) {
        case 'all':
          // Fetch from BOTH sources
          try {
            const [slickdealsRes, redditRes] = await Promise.all([
              fetch('http://localhost:8000/api/v1/external/deals/slickdeals'),
              fetch('http://localhost:8000/api/v1/external/deals/rapidapi')
            ]);
            
            const slickdealsData = slickdealsRes.ok ? await slickdealsRes.json() : { deals: [] };
            const redditData = redditRes.ok ? await redditRes.json() : { deals: [] };
            
            const slickdeals = extractDealsArray(slickdealsData);
            const reddit = extractDealsArray(redditData);
            
            // Combine: 3 Slickdeals + 3 Reddit
            const combined = [
              ...slickdeals.slice(0, 3),
              ...reddit.slice(0, 3)
            ];
            
            setDeals(combined);
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error fetching all deals:', error);
            endpoint = 'http://localhost:8000/api/v1/external/deals/slickdeals';
          }
          break;
        case 'slickdeals':
          endpoint = 'http://localhost:8000/api/v1/external/deals/slickdeals';
          break;
        case 'dealnews':
        case 'reddit':
          endpoint = 'http://localhost:8000/api/v1/external/deals/rapidapi';
          break;
        default:
          endpoint = 'http://localhost:8000/api/v1/external/deals/slickdeals';
      }
      
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        const dealsArray = extractDealsArray(data);
        setDeals(dealsArray.slice(0, 6));
      } else {
        setDeals([]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const extractDealsArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data.deals && Array.isArray(data.deals)) return data.deals;
    if (data.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const getSourceBadge = (source) => {
    const badges = {
      slickdeals: { bg: 'bg-blue-600', text: 'SLICKDEALS', icon: '🔥' },
      reddit: { bg: 'bg-orange-600', text: 'REDDIT', icon: '🤖' }
    };
    const sourceLower = source?.toLowerCase() || '';
    return badges[sourceLower] || { bg: 'bg-gray-500', text: source?.toUpperCase() || 'DEAL', icon: '🏷️' };
  };

  const isFavorite = (deal) => {
    return favorites.some(f => 
      (f.deal_id || f.id) === (deal.id || deal.deal_id || deal.title)
    );
  };

  const handleToggleFavorite = (deal) => {
    const dealId = deal.id || deal.deal_id || deal.title;
    
    if (isFavorite(deal)) {
      // Remove from favorites
      const updated = favorites.filter(f => 
        (f.deal_id || f.id) !== dealId
      );
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      setFavorites(updated);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('favoritesChanged'));
      console.log('Removed from favorites:', deal.title);
    } else {
      // Add to favorites
      const newFavorite = {
        id: Date.now(),
        deal_id: dealId,
        title: deal.title,
        price: deal.discounted_price || deal.price,
        discount: deal.discount_percentage,
        source: deal.source,
        url: deal.deal_url || deal.url,
        created_at: new Date().toISOString()
      };
      const updated = [...favorites, newFavorite];
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      setFavorites(updated);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('favoritesChanged'));
      console.log('Added to favorites:', deal.title);
    }
  };

  const getVisitButtons = () => {
    if (activeSource === 'all') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {/* Slickdeals Button */}
          <a
            href="https://slickdeals.net"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔥</span>
            <span>Visit Slickdeals</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Reddit Button */}
          <a
            href="https://www.reddit.com/r/deals"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🤖</span>
            <span>Visit Reddit</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Coupons Button */}
          <a
            href="https://www.coupons.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🎟️</span>
            <span>Visit Coupons</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Groupon Button */}
          <a
            href="https://www.groupon.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">💰</span>
            <span>Visit Groupon</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      );
    } else if (activeSource === 'slickdeals') {
      return (
        <a
          href="https://slickdeals.net"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-2 mx-auto"
        >
          🔥 View More on Slickdeals
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    } else {
      return (
        <a
          href="https://www.reddit.com/r/deals"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 inline-flex items-center gap-2 mx-auto"
        >
          🤖 View More on Reddit
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hot Deals from Around the Web
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated deals from top retailers updated in real-time
          </p>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          <button
            onClick={() => setActiveSource('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeSource === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌐 All Deals
          </button>
          <button
            onClick={() => setActiveSource('slickdeals')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeSource === 'slickdeals'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔥 Slickdeals
          </button>
          <button
            onClick={() => setActiveSource('reddit')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeSource === 'reddit'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🤖 Reddit
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Deals Grid */}
        {!loading && deals.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {deals.map((deal, index) => {
                const badge = getSourceBadge(deal.source);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden group"
                  >
                    {/* Deal Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <span className="text-7xl mb-3">{badge.icon}</span>
                    </div>

                    {/* Deal Info */}
                    <div className="p-6">
                      {/* Source Badge & Heart */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`${badge.bg} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>
                        
                        {/* Heart Icon */}
                        <button
                          onClick={() => handleToggleFavorite(deal)}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            isFavorite(deal) 
                              ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
                          }`}
                          title={isFavorite(deal) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className="w-5 h-5" fill={isFavorite(deal) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
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
                        {!deal.discounted_price && !deal.discount_percentage && (
                          <div className="text-gray-500 text-sm italic">
                            Check deal for pricing
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

            {/* Visit Website Buttons - NOW WITH 4 BUTTONS */}
            <div className="mb-8">
              {getVisitButtons()}
            </div>

            {/* Description Text Below Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-center text-sm text-gray-600">
              <div>
                <p className="font-semibold text-blue-600 mb-1">Slickdeals</p>
                <p>Community-driven deals and discounts</p>
              </div>
              <div>
                <p className="font-semibold text-orange-600 mb-1">Reddit</p>
                <p>Real user-shared deals from r/deals</p>
              </div>
              <div>
                <p className="font-semibold text-green-600 mb-1">Coupons</p>
                <p>Promo codes and cashback for December 2025</p>
              </div>
              <div>
                <p className="font-semibold text-purple-600 mb-1">Groupon</p>
                <p>Save up to 70% on experiences and products</p>
              </div>
            </div>
          </>
        )}

        {/* No Deals State */}
        {!loading && deals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No deals available
            </h3>
            <p className="text-gray-600">
              Check back soon for amazing offers!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
