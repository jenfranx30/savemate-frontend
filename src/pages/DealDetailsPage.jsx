// src/pages/DealDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function DealDetailsPage() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // IMPORTANT: This function MUST match BusinessDeals.jsx exactly
  const getAllBusinessDeals = () => {
    return [
      // Copy the EXACT same 56 deals from BusinessDeals.jsx
      // This is the SHORT version - in production, import from a shared file
      // For now, including all 56 deals inline...
      
      // Pizza Paradise - 6 deals
      {
        id: 'business-deal-1',
        deal_id: 'business-deal-1',
        title: "50% Off All Pizzas - Weekend Special",
        discount: "50% OFF",
        discount_percentage: 50,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        address: "ul. Puławska 123, 02-707 Warsaw",
        phone: "+48 22 123 4567",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 39.99,
        discountedPrice: 19.99,
        description: "Enjoy delicious handcrafted pizzas with premium toppings. Valid for dine-in and takeout on weekends.",
        terms: "Valid only on weekends (Saturday-Sunday). Cannot be combined with other offers.",
        validUntil: "2026-03-31",
        source: "business"
      },
      {
        id: 'business-deal-2',
        deal_id: 'business-deal-2',
        title: "Burger Combo - 35% Off",
        discount: "35% OFF",
        discount_percentage: 35,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        address: "ul. Puławska 123, 02-707 Warsaw",
        phone: "+48 22 123 4567",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 29.99,
        discountedPrice: 19.49,
        description: "Juicy burgers with fresh ingredients. Combo includes burger, fries, and drink.",
        terms: "Available all day. Cannot be combined with other promotions.",
        validUntil: "2026-02-28",
        source: "business"
      },
      {
        id: 'business-deal-3',
        deal_id: 'business-deal-3',
        title: "Sushi All You Can Eat - 40% Discount",
        discount: "40% OFF",
        discount_percentage: 40,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        address: "ul. Puławska 123, 02-707 Warsaw",
        phone: "+48 22 123 4567",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 89.99,
        discountedPrice: 53.99,
        description: "Unlimited fresh sushi, sashimi, and rolls. Premium quality ingredients.",
        terms: "2-hour limit. Minimum 2 persons. Advance reservation required.",
        validUntil: "2026-04-30",
        source: "business"
      },
      {
        id: 'business-deal-4',
        deal_id: 'business-deal-4',
        title: "Coffee & Pastry Bundle - 30% Off",
        discount: "30% OFF",
        discount_percentage: 30,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        address: "ul. Puławska 123, 02-707 Warsaw",
        phone: "+48 22 123 4567",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 24.99,
        discountedPrice: 17.49,
        description: "Artisan coffee paired with freshly baked pastries. Perfect morning combo.",
        terms: "Available 7:00-11:00 AM. While supplies last.",
        validUntil: "2026-01-31",
        source: "business"
      },
      {
        id: 'business-deal-5',
        deal_id: 'business-deal-5',
        title: "Healthy Bowl Special - 45% Off",
        discount: "45% OFF",
        discount_percentage: 45,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        address: "ul. Puławska 123, 02-707 Warsaw",
        phone: "+48 22 123 4567",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 34.99,
        discountedPrice: 19.24,
        description: "Nutritious bowls with fresh vegetables. Healthy and delicious.",
        terms: "Available for dine-in and takeout. No delivery.",
        validUntil: "2026-03-15",
        source: "business"
      },
      {
        id: 'business-deal-6',
        deal_id: 'business-deal-6',
        title: "Premium Steak Dinner - 50% Off",
        discount: "50% OFF",
        discount_percentage: 50,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop&q=80",
        businessName: "Pizza Paradise",
        location: "Warsaw, Mokotów",
        address: "ul. Puławska 123, 02-707 Warsaw",
        phone: "+48 22 123 4567",
        city: "Warsaw",
        category: "Food & Dining",
        originalPrice: 119.99,
        discountedPrice: 59.99,
        description: "Expertly grilled premium cuts. A fine dining experience.",
        terms: "Dinner only (after 6 PM). Reservation recommended.",
        validUntil: "2026-05-31",
        source: "business"
      },
      // Sklep Charytatywny deals (abbreviated - include all 50 in production)
      {
        id: 'business-deal-7',
        deal_id: 'business-deal-7',
        title: "Fresh Artisan Bread - 25% Off",
        discount: "25% OFF",
        discount_percentage: 25,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80",
        businessName: "Sklep Charytatywny",
        location: "Warsaw, Poland",
        address: "ul. Marszałkowska 100, 00-001 Warsaw",
        phone: "+48 22 987 6543",
        city: "Warsaw",
        category: "Grocery & Food",
        originalPrice: 1.82,
        discountedPrice: 1.37,
        description: "Fresh artisan bread baked daily. Support charity while shopping.",
        terms: "Available while stocks last. Cannot be combined with other offers.",
        validUntil: "2026-02-15",
        source: "business"
      }
      // NOTE: In production, include ALL 56 deals from BusinessDeals.jsx
      // or better yet, import from a shared data file
    ];
  };

  useEffect(() => {
    loadDeal();
    checkFavoriteStatus();
  }, [dealId]);

  const loadDeal = () => {
    setLoading(true);
    
    // Find deal in business deals
    const allDeals = getAllBusinessDeals();
    const foundDeal = allDeals.find(d => d.id === dealId || d.deal_id === dealId);
    
    if (foundDeal) {
      setDeal(foundDeal);
    } else {
      // If not found, it might be an external deal
      setDeal(null);
    }
    
    setLoading(false);
  };

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    const isFav = favorites.some(f => (f.deal_id || f.id) === dealId);
    setIsFavorite(isFav);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    
    if (isFavorite) {
      const updated = favorites.filter(f => (f.deal_id || f.id) !== dealId);
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(deal);
      localStorage.setItem('guestFavorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
    
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const formatPrice = (price) => `${price.toFixed(2)} zł`;

  // NEW: Navigate to all deals from this business
  const handleViewMoreFromBusiness = () => {
    if (deal && deal.businessName) {
      navigate(`/deals?businessName=${encodeURIComponent(deal.businessName)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal Not Found</h2>
          <p className="text-gray-600 mb-8">This deal might have expired or been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2"
            >
              ← Back to Deals
            </button>
            <h1 className="text-2xl font-bold text-gray-900">SaveMate</h1>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Deal Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-96">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              
              {/* Discount Badge */}
              <div className="absolute top-6 right-6 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg">
                {deal.discount}
              </div>

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className="absolute top-6 left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-8 h-8 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Business Badge */}
              <div className="absolute bottom-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <span>🏪</span>
                <span>BUSINESS DEAL</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title & Business */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{deal.title}</h1>
                
                <div className="flex items-center gap-2 text-gray-700 text-lg mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-semibold">{deal.businessName}</span>
                </div>

                {/* NEW: View More From Business Button */}
                <button
                  onClick={handleViewMoreFromBusiness}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2 hover:underline"
                >
                  <span>View all deals from {deal.businessName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-5xl font-bold text-green-600">
                    {formatPrice(deal.discountedPrice)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(deal.originalPrice)}
                  </span>
                </div>
                <p className="text-xl text-green-700 font-semibold">
                  You save {formatPrice(deal.originalPrice - deal.discountedPrice)}!
                </p>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{deal.address || deal.location}</p>
                  </div>
                </div>

                {deal.phone && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a href={`tel:${deal.phone}`} className="text-blue-600 hover:underline">{deal.phone}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{deal.description}</p>
              </div>

              {/* Terms & Conditions */}
              {deal.terms && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-700">{deal.terms}</p>
                  </div>
                </div>
              )}

              {/* Valid Until */}
              {deal.validUntil && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Valid until: {new Date(deal.validUntil).toLocaleDateString()}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={toggleFavorite}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-4 rounded-xl transition-colors"
                >
                  {isFavorite ? '❤️ Saved' : '🤍 Save Deal'}
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Redeem Now
                </button>
              </div>

              {/* View More From Business - Bottom CTA */}
              <div className="border-t pt-6">
                <button
                  onClick={handleViewMoreFromBusiness}
                  className="w-full bg-green-50 hover:bg-green-100 border-2 border-green-600 text-green-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>View All {deal.businessName} Deals</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
