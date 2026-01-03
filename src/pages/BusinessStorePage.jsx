// src/pages/BusinessStorePage.jsx
// Business owner's store page showing all their deals with real-time stats

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BusinessStorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({
    activeDeals: 0,
    totalViews: 0,
    totalFavorites: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setTimeBasedGreeting();
    fetchBusinessProfile();
    fetchBusinessDeals();
  }, [user]);

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

  // Fetch business profile
  const fetchBusinessProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/businesses/owner/me/businesses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const businesses = await response.json();
        if (businesses.length > 0) {
          setBusinessInfo(businesses[0]);
          console.log('✅ Business profile loaded:', businesses[0]);
        } else {
          console.log('⚠️ No business profile found');
        }
      } else {
        console.error('Failed to fetch business profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
    }
  };

  // Fetch business deals
  const fetchBusinessDeals = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch deals from MongoDB
      const response = await fetch('http://localhost:8000/api/v1/deals/user/my-deals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const dealsData = await response.json();
        console.log('📊 Fetched deals:', dealsData);
        
        setDeals(dealsData);
        calculateStats(dealsData);
      } else {
        console.error('Failed to fetch deals:', response.status);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from deals
  const calculateStats = (dealsData) => {
    const activeDeals = dealsData.filter(d => d.status === 'active').length;
    const totalViews = dealsData.reduce((sum, d) => sum + (d.views_count || 0), 0);
    const totalFavorites = dealsData.reduce((sum, d) => sum + (d.saves_count || 0), 0);
    
    // Calculate potential revenue (active deals × discounted price)
    const potentialRevenue = dealsData
      .filter(d => d.status === 'active')
      .reduce((sum, d) => sum + (d.discounted_price || 0), 0);

    setStats({
      activeDeals,
      totalViews,
      totalFavorites,
      revenue: potentialRevenue
    });

    console.log('📊 Stats calculated:', {
      activeDeals,
      totalViews,
      totalFavorites,
      revenue: potentialRevenue
    });
  };

  const formatPrice = (price) => {
    return `${price?.toFixed(2) || '0.00'} zł`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEditDeal = (dealId) => {
    navigate(`/business/edit-deal/${dealId}`);
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/deals/${dealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Deal deleted successfully!');
        fetchBusinessDeals(); // Refresh
      } else {
        alert('Failed to delete deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Error deleting deal');
    }
  };

  const toggleDealStatus = async (dealId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`Deal ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        fetchBusinessDeals(); // Refresh
      } else {
        alert('Failed to update deal status');
      }
    } catch (error) {
      console.error('Error updating deal status:', error);
      alert('Error updating deal status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading your store...</p>
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
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/deals')} className="text-gray-700 hover:text-blue-600 font-medium">
                All Deals
              </button>
              <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </button>
              <button onClick={() => navigate('/business/post-deal')} className="text-green-600 hover:text-green-700 font-semibold">
                Post Deal
              </button>
              <button onClick={() => navigate('/profile')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                My Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Store Header */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
                {businessInfo?.logo_url ? (
                  <img src={businessInfo.logo_url} alt={businessInfo.business_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  '🏪'
                )}
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">
                  {businessInfo?.business_name || businessInfo?.name || 'Your Business'}
                </h1>
                <p className="text-xl text-blue-100 mb-3">
                  {businessInfo?.description || 'Welcome to your business store'}
                </p>
                <div className="flex items-center gap-3">
                  <span className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
                    {businessInfo?.category || 'Business'}
                  </span>
                  {businessInfo?.verified && (
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                  <span className="text-blue-100">
                    📍 {businessInfo?.location?.city || 'Warsaw'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/business/post-deal')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              + Post New Deal
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Store Performance</h2>
            <button
              onClick={fetchBusinessDeals}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">📊</span>
                <span className="text-5xl font-bold">{stats.activeDeals}</span>
              </div>
              <p className="text-lg font-semibold mb-1">Active Deals</p>
              <p className="text-sm opacity-90">{deals.length} total deals</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">👁️</span>
                <span className="text-5xl font-bold">{stats.totalViews}</span>
              </div>
              <p className="text-lg font-semibold mb-1">Total Views</p>
              <p className="text-sm opacity-90">Across all deals</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">⭐</span>
                <span className="text-5xl font-bold">{stats.totalFavorites}</span>
              </div>
              <p className="text-lg font-semibold mb-1">Favorites</p>
              <p className="text-sm opacity-90">People interested</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">💰</span>
                <span className="text-5xl font-bold">{stats.revenue.toFixed(0)}</span>
              </div>
              <p className="text-lg font-semibold mb-1">Revenue (zł)</p>
              <p className="text-sm opacity-90">Potential earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Management Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              My Deals ({deals.length})
            </h2>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg">
                <option>All Deals</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Expired</option>
              </select>
            </div>
          </div>

          {deals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No deals yet</h3>
              <p className="text-gray-600 mb-6">Start by posting your first deal!</p>
              <button
                onClick={() => navigate('/business/post-deal')}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                + Post Your First Deal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {deals.map(deal => (
                <div key={deal.id || deal._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="flex">
                    {/* Deal Image */}
                    <div className="w-64 h-48 flex-shrink-0">
                      <img 
                        src={deal.image_url} 
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Deal Info */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h3>
                          <p className="text-gray-600 mb-3">{deal.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              👁️ {deal.views_count || 0} views
                            </span>
                            <span className="flex items-center gap-1">
                              ⭐ {deal.saves_count || 0} favorites
                            </span>
                            <span className="flex items-center gap-1">
                              📅 Valid until {formatDate(deal.end_date)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold text-green-600">
                              {formatPrice(deal.discounted_price)}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(deal.original_price)}
                            </span>
                          </div>
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -{deal.discount_percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          deal.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {deal.status === 'active' ? '🟢 Active' : '⚫ Inactive'}
                        </span>

                        <button
                          onClick={() => handleEditDeal(deal.id || deal._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>

                        <button
                          onClick={() => toggleDealStatus(deal.id || deal._id, deal.status)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            deal.status === 'active'
                              ? 'bg-gray-600 text-white hover:bg-gray-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {deal.status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
                        </button>

                        <button
                          onClick={() => handleDeleteDeal(deal.id || deal._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            &copy; 2025 SaveMate Business. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white transition-colors">
              Settings
            </button>
            <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">
              Help
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
