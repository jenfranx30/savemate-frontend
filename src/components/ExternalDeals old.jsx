// src/components/ExternalDeals.jsx
import { useState, useEffect } from 'react';

export default function ExternalDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState('all');

  useEffect(() => {
    fetchExternalDeals();
  }, [activeSource]);

  const fetchExternalDeals = async () => {
    setLoading(true);
    try {
      let endpoint;
      
      // Map to your backend endpoints
      switch(activeSource) {
        case 'groupon':
          endpoint = 'http://localhost:8000/api/v1/external/deals/groupon';
          break;
        case 'slickdeals':
          endpoint = 'http://localhost:8000/api/v1/external/deals/slickdeals';
          break;
        case 'rapidapi':
          endpoint = 'http://localhost:8000/api/v1/external/deals/rapidapi';
          break;
        case 'coupons':
          endpoint = 'http://localhost:8000/api/v1/external/deals/coupons';
          break;
        default:
          endpoint = 'http://localhost:8000/api/v1/external/deals/slickdeals'; // Use Slickdeals for "All" as fallback
      }
      
      console.log('Fetching from:', endpoint);
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        
        // If not Slickdeals and it fails, try Slickdeals as fallback
        if (activeSource !== 'slickdeals') {
          console.log('Falling back to Slickdeals...');
          const fallbackResponse = await fetch('http://localhost:8000/api/v1/external/deals/slickdeals');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const dealsArray = extractDealsArray(fallbackData);
            setDeals(dealsArray.slice(0, 6));
            setLoading(false);
            return;
          }
        }
        
        setDeals([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('API Response for', activeSource, ':', data);
      
      const dealsArray = extractDealsArray(data);
      console.log('Parsed deals array:', dealsArray);
      
      // If empty and not Slickdeals, fallback to Slickdeals
      if (dealsArray.length === 0 && activeSource !== 'slickdeals' && activeSource !== 'all') {
        console.log('No deals found, falling back to Slickdeals...');
        const fallbackResponse = await fetch('http://localhost:8000/api/v1/external/deals/slickdeals');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackDeals = extractDealsArray(fallbackData);
          setDeals(fallbackDeals.slice(0, 6));
        } else {
          setDeals([]);
        }
      } else {
        setDeals(dealsArray.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching external deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to extract deals array from different response structures
  const extractDealsArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data.deals && Array.isArray(data.deals)) {
      return data.deals;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  };

  const getSourceBadge = (source) => {
    const badges = {
      groupon: { bg: 'bg-green-600', text: 'GROUPON', icon: '🎟️' },
      slickdeals: { bg: 'bg-blue-600', text: 'SLICKDEALS', icon: '🔥' },
      rapidapi: { bg: 'bg-purple-600', text: 'RAPIDAPI', icon: '⚡' },
      coupons: { bg: 'bg-orange-500', text: 'COUPONS', icon: '🎫' },
      coupon: { bg: 'bg-orange-500', text: 'COUPON', icon: '🎫' }
    };
    const sourceLower = source?.toLowerCase() || '';
    return badges[sourceLower] || { bg: 'bg-gray-500', text: source?.toUpperCase() || 'DEAL', icon: '🏷️' };
  };

  // CORS proxy helper for images
  const getProxiedImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If image is already a data URL or relative path, return as is
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // Use backend proxy to bypass CORS
    return `http://localhost:8000/api/v1/external/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (typeof price === 'number') return `$${price.toFixed(2)}`;
    return price;
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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
            onClick={() => setActiveSource('rapidapi')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeSource === 'rapidapi'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚡ RapidAPI
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        )}

        {/* Deals Grid */}
        {!loading && deals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => {
              // Extract source
              const dealSource = deal.source || deal.store || deal.merchant || deal.retailer || 'deal';
              const badge = getSourceBadge(dealSource);
              
              // Map fields from different API responses with extensive fallbacks
              const dealTitle = deal.title || deal.name || deal.deal_title || deal.product_name || 
                               deal.dealTitle || deal.headline || deal.productName || 
                               deal.item_name || deal.itemName || 'Special Deal';
              
              const dealDescription = deal.description || deal.summary || deal.excerpt || 
                                     deal.short_description || deal.details || deal.text || '';
              
              const dealImage = deal.image_url || deal.image || deal.thumbnail || deal.photo_url || 
                               deal.imageUrl || deal.img || deal.photo || deal.picture || 
                               deal.thumbnailImage || deal.grid_image_url || deal.largeImage || 
                               deal.image_large || deal.images?.[0] || deal.media?.[0];
              
              const dealUrl = deal.url || deal.deal_url || deal.link || deal.dealUrl || 
                             deal.href || deal.link_url || deal.product_url || deal.productUrl || 
                             deal.web_url || deal.permalink || '#';
              
              const dealPrice = deal.price || deal.current_price || deal.salePrice || 
                               deal.deal_price || deal.discountPrice || deal.finalPrice || 
                               deal.sale_price || deal.discounted_price;
              
              const originalPrice = deal.original_price || deal.originalPrice || deal.list_price || 
                                   deal.retailPrice || deal.msrp || deal.regularPrice || 
                                   deal.regular_price || deal.listPrice;
              
              const discount = deal.discount_percentage || deal.discount || deal.savings_percentage || 
                              deal.discountPercentage || deal.percentOff || deal.percent_off || 
                              deal.savingsPercentage;
              
              const shippingInfo = deal.shipping || deal.shipping_info || deal.shippingInfo || 
                                  deal.delivery || deal.shippingCost || 'Check shipping';
              
              // Debug log for troubleshooting
              if (index === 0) {
                console.log('First deal mapping:', {
                  source: dealSource,
                  title: dealTitle,
                  image: dealImage,
                  url: dealUrl,
                  price: dealPrice,
                  originalDeal: deal
                });
              }
              
              return (
                <a
                  key={deal.id || deal._id || deal.deal_id || deal.dealId || index}
                  href={dealUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-56">
                    {dealImage ? (
                      <img
                        src={getProxiedImageUrl(dealImage)}
                        alt={dealTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.log('Image failed to load:', dealImage);
                          // Remove the failed image and show placeholder
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                        loading="lazy"
                      />
                    ) : null}
                    
                    {/* Fallback Placeholder - Always rendered but hidden by default */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
                      style={{ display: dealImage ? 'none' : 'flex' }}
                    >
                      <span className="text-7xl mb-3">{badge.icon}</span>
                      <span className="text-gray-700 font-bold text-lg">{badge.text}</span>
                      <span className="text-gray-500 text-sm mt-2">Deal Available</span>
                    </div>
                    
                    {/* Source Badge */}
                    <div className={`absolute top-4 left-4 ${badge.bg} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2`}>
                      <span>{badge.icon}</span>
                      <span>{badge.text}</span>
                    </div>

                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {truncateText(dealTitle, 80)}
                    </h3>

                    {/* Description */}
                    {dealDescription && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {truncateText(dealDescription, 100)}
                      </p>
                    )}

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-2">
                        {originalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                        {dealPrice && (
                          <span className="text-3xl font-bold text-blue-600">
                            {formatPrice(dealPrice)}
                          </span>
                        )}
                        {!dealPrice && !originalPrice && (
                          <span className="text-xl font-bold text-blue-600">
                            View Deal
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Deal Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {shippingInfo}
                      </span>
                      <button className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        <span>View Deal</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* No Deals State */}
        {!loading && deals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No deals available</h3>
            <p className="text-gray-600">
              We're fetching the latest deals. Check back soon!
            </p>
          </div>
        )}

        {/* View More Button */}
        {!loading && deals.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => window.location.href = '/deals'}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>View All Deals</span>
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
