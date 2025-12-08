// src/components/DealDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function DealDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchDeal();
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
    expiry_date: '2024-12-15',
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
    setIsFavorite(!isFavorite);
    // TODO: Call API to save/remove favorite
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                  {deal.discount_percentage}% OFF
                </div>
                {isExpired && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">EXPIRED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Deal Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {deal.title}
                  </h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2">
                    🏢 {deal.business_name}
                  </p>
                </div>
                <button
                  onClick={handleFavoriteToggle}
                  className="bg-white border-2 border-gray-300 rounded-full p-3 hover:border-red-500 transition-colors"
                >
                  <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
                </button>
              </div>

              {/* Price Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 line-through">
                      Original: {deal.original_price} PLN
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {deal.discounted_price} PLN
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">You save</p>
                    <p className="text-2xl font-bold text-green-600">
                      {deal.original_price - deal.discounted_price} PLN
                    </p>
                  </div>
                </div>
              </div>

              {/* Expiry Warning */}
              {!isExpired && daysRemaining <= 3 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <p className="text-orange-800 font-semibold flex items-center gap-2">
                    ⚠️ Hurry! This deal expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Deal</h2>
                <p className="text-gray-700 leading-relaxed">{deal.description}</p>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Terms & Conditions</h2>
                <ul className="space-y-2">
                  {deal.terms.map((term, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
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
