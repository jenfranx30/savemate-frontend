// src/pages/DealDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import notificationService from '../services/notificationService';

export default function DealDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchDeal();
    checkExpiration();
  }, [id]);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/v1/deals/${id}`);
      setDeal(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deal:', err);
      // Use mock data for demo
      setDeal(getMockDeal());
      setLoading(false);
    }
  };

  const checkExpiration = () => {
    if (!deal || !deal.expiry_date) return;
    
    const daysLeft = getDaysRemaining(deal.expiry_date);
    
    // Check if already notified today
    const lastNotified = localStorage.getItem(`expiry_notified_${id}`);
    const today = new Date().toDateString();
    
    if (daysLeft > 0 && daysLeft <= 3 && lastNotified !== today) {
      // Send expiration notification
      notificationService.createExpiringDealNotification(deal.title, daysLeft);
      localStorage.setItem(`expiry_notified_${id}`, today);
    }
  };

  const getMockDeal = () => ({
    _id: id,
    title: '50% Off All Pizzas - Weekend Special',
    business_name: 'Pizza Paradise',
    description: 'Enjoy our delicious wood-fired pizzas at half price this weekend! All sizes, all toppings included. Perfect for family gatherings or a cozy night in. Our pizzas are made with fresh, locally-sourced ingredients and baked to perfection in our traditional wood-fired oven.',
    location: 'Warsaw, Mokotów',
    address: 'ul. Puławska 123, 02-707 Warsaw',
    phone: '+48 22 123 4567',
    website: 'www.pizzaparadise.pl',
    discount_percentage: 50,
    original_price: 50,
    discounted_price: 25,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    expiry_date: '2025-12-31',
    category: 'food',
    terms: [
      'Valid only on weekends (Saturday & Sunday)',
      'Not combinable with other offers',
      'Dine-in and takeaway only',
      'Show this deal at checkout'
    ],
    business_hours: {
      monday: '11:00 - 22:00',
      tuesday: '11:00 - 22:00',
      wednesday: '11:00 - 22:00',
      thursday: '11:00 - 22:00',
      friday: '11:00 - 23:00',
      saturday: '11:00 - 23:00',
      sunday: '11:00 - 22:00'
    }
  });

  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Save to favorites
    if (newFavoriteState) {
      const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      guestFavorites.push({
        deal_id: id,
        id: id,
        title: deal.title,
        validUntil: deal.expiry_date,
        ...deal
      });
      localStorage.setItem('guestFavorites', JSON.stringify(guestFavorites));
      
      // Send notifications
      notificationService.createDealSavedNotification(deal.title);
      notificationService.createFavoriteNotification(deal.title, 'guest');
      
      window.dispatchEvent(new Event('favoritesChanged'));
    } else {
      // Remove from favorites
      const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
      const updated = guestFavorites.filter(f => (f.deal_id || f.id) !== id);
      localStorage.setItem('guestFavorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favoritesChanged'));
    }
  };

  const handleGetDirections = () => {
    if (deal) {
      const query = encodeURIComponent(deal.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal Not Found</h2>
          <button
            onClick={() => navigate('/deals')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(deal.expiry_date);
  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-gray-900 cursor-pointer" 
                onClick={() => navigate('/')}
              >
                SaveMate
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/deals')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Deals
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Categories
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </button>
            </div>
            <div>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Deal Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/deals')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          ← Back to Deals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className={`w-full h-full object-cover ${isExpired ? 'grayscale' : ''}`}
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  {deal.discount_percentage}% OFF
                </div>
                
                {/* Expiring Soon Badge */}
                {isExpiringSoon && !isExpired && (
                  <div className="absolute top-20 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                    {daysRemaining === 1 ? 'Last Day!' : `${daysRemaining} Days Left`}
                  </div>
                )}

                {/* ✅ FIXED: Replaced "EXPIRED" with "Deal Ended" */}
                {isExpired && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-2xl">
                      <span className="text-3xl font-bold">Deal Ended</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className={`text-3xl font-bold mb-2 ${isExpired ? 'text-gray-500' : 'text-gray-900'}`}>
                    {deal.title}
                  </h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2">
                    🏢 {deal.business_name}
                  </p>
                </div>
                {!isExpired && (
                  <button
                    onClick={handleFavoriteToggle}
                    className="bg-white border-2 border-gray-300 rounded-full p-3 hover:border-red-500 transition-colors"
                  >
                    <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
                  </button>
                )}
              </div>

              {/* ✅ NEW: Expiration Date Display */}
              <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                isExpired ? 'bg-red-50 border border-red-200' : 
                isExpiringSoon ? 'bg-orange-50 border border-orange-200' : 
                'bg-blue-50 border border-blue-200'
              }`}>
                <span className="text-2xl">
                  {isExpired ? '🔴' : isExpiringSoon ? '⏰' : '📅'}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    isExpired ? 'text-red-800' : 
                    isExpiringSoon ? 'text-orange-800' : 
                    'text-blue-800'
                  }`}>
                    {isExpired ? 'Deal Expired' : isExpiringSoon ? 'Expiring Soon!' : 'Valid Until'}
                  </p>
                  <p className={`text-lg font-bold ${
                    isExpired ? 'text-red-900' : 
                    isExpiringSoon ? 'text-orange-900' : 
                    'text-blue-900'
                  }`}>
                    {formatExpiryDate(deal.expiry_date)}
                    {!isExpired && daysRemaining <= 7 && (
                      <span className="text-sm ml-2">
                        ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Price Info */}
              <div className={`rounded-lg p-4 mb-6 ${
                isExpired ? 'bg-gray-50' : 'bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm line-through ${
                      isExpired ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Original: {deal.original_price} PLN
                    </p>
                    <p className={`text-3xl font-bold ${
                      isExpired ? 'text-gray-400' : 'text-blue-600'
                    }`}>
                      {deal.discounted_price} PLN
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      isExpired ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      You save
                    </p>
                    <p className={`text-2xl font-bold ${
                      isExpired ? 'text-gray-400' : 'text-green-600'
                    }`}>
                      {deal.original_price - deal.discounted_price} PLN
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Deal</h2>
                <p className={`leading-relaxed ${isExpired ? 'text-gray-500' : 'text-gray-700'}`}>
                  {deal.description}
                </p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
                <ul className="space-y-2">
                  {deal.terms.map((term, index) => (
                    <li key={index} className={`flex items-start gap-2 ${
                      isExpired ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      <span className={isExpired ? 'text-gray-400' : 'text-blue-600'}>✓</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                {!isExpired && (
                  <>
                    <button
                      onClick={() => handleFavoriteToggle()}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                      {isFavorite ? '❤️ Saved' : '🤍 Save Deal'}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                      🎫 Redeem Now
                    </button>
                  </>
                )}
                {isExpired && (
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 py-4 rounded-lg font-bold text-lg cursor-not-allowed"
                  >
                    Deal Ended
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
              
              <div className="space-y-4">
                {/* Location */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">📍 Location</p>
                  <p className="text-gray-900">{deal.location}</p>
                  <p className="text-sm text-gray-600">{deal.address}</p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">📞 Phone</p>
                  <a 
                    href={`tel:${deal.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {deal.phone}
                  </a>
                </div>

                {/* Website */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">🌐 Website</p>
                  <a 
                    href={`https://${deal.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {deal.website}
                  </a>
                </div>

                {/* Get Directions Button */}
                <button
                  onClick={handleGetDirections}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  🗺️ Get Directions
                </button>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h2>
              <div className="space-y-2">
                {Object.entries(deal.business_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 capitalize">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Deal</h2>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  📘 Facebook
                </button>
                <button className="flex-1 bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  🐦 Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
