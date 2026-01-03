// src/components/BusinessDashboard.jsx
// Complete Business Dashboard with Deals Management Table and Performance Charts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DealsManagementTable from './DealsManagementTable';
import VerificationStatusBanner from './VerificationStatusBanner';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [businessName, setBusinessName] = useState('Your Business');
  const [firstName, setFirstName] = useState('');
  const [businessInfo, setBusinessInfo] = useState(null);
  
  const [myDeals, setMyDeals] = useState([]);
  const [stats, setStats] = useState({
    activeDeals: 0,
    totalViews: 0,
    totalFavorites: 0,
    totalRedeemed: 0
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Chart data
  const [chartData, setChartData] = useState({
    viewsOverTime: [],
    topPerformingDeals: []
  });

  useEffect(() => {
    setTimeBasedGreeting();
    getUserInfo();
    fetchBusinessProfile();
    fetchBusinessData();
  }, [user]);

  const setTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const getUserInfo = () => {
    if (user) {
      setFirstName(user.full_name?.split(' ')[0] || user.username || 'Business Owner');
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setFirstName(storedUser.full_name?.split(' ')[0] || storedUser.username || 'Business Owner');
    }
  };

  const fetchBusinessProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/v1/businesses/owner/me/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const businesses = await response.json();
        if (businesses.length > 0) {
          const business = businesses[0];
          setBusinessInfo(business);
          setBusinessName(business.business_name || business.name || 'Your Business');
        }
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
    }
  };

  const fetchBusinessData = async () => {
    setLoading(true);
    setApiError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setApiError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/deals/user/my-deals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const deals = await response.json();
        setMyDeals(deals);
        
        const activeDeals = deals.filter(d => d.status === 'active').length;
        const totalViews = deals.reduce((sum, d) => sum + (d.views_count || 0), 0);
        const totalFavorites = deals.reduce((sum, d) => sum + (d.saves_count || 0), 0);
        
        setStats({
          activeDeals,
          totalViews,
          totalFavorites,
          totalRedeemed: 0
        });

        // Generate chart data
        generateChartData(deals);
        
        if (deals.length === 0) {
          setApiError('No deals found');
        }
      } else {
        const errorText = await response.text();
        setApiError(`API Error: ${response.status}`);
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (deals) => {
    // Simulated views over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.floor(Math.random() * 50) + deals.reduce((sum, d) => sum + (d.views_count || 0), 0) / 7
      };
    });

    // Top performing deals
    const topDeals = [...deals]
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 5)
      .map(deal => ({
        title: deal.title?.substring(0, 30) + (deal.title?.length > 30 ? '...' : ''),
        views: deal.views_count || 0,
        saves: deal.saves_count || 0
      }));

    setChartData({
      viewsOverTime: last7Days,
      topPerformingDeals: topDeals
    });
  };

  const handleExportReport = () => {
    if (myDeals.length === 0) {
      alert('📊 No deals to export! Create some deals first.');
      return;
    }

    // Generate CSV report
    const csvContent = [
      ['Deal Title', 'Category', 'Original Price', 'Discounted Price', 'Discount %', 'Views', 'Saves', 'Status', 'Created Date'],
      ...myDeals.map(deal => [
        `"${deal.title || ''}"`,
        deal.category || '',
        deal.original_price || 0,
        deal.discounted_price || 0,
        deal.discount_percentage || 0,
        deal.views_count || 0,
        deal.saves_count || 0,
        deal.status || '',
        new Date(deal.created_at).toLocaleDateString() || ''
      ])
    ].map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savemate-deals-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('✅ Report downloaded successfully!');
  };

  const handleViewAnalytics = () => {
    if (myDeals.length === 0) {
      alert('📊 Analytics available when you have active deals! Create your first deal to see performance metrics.');
      return;
    }
    
    // Scroll to analytics section
    const analyticsSection = document.getElementById('performance-analytics');
    if (analyticsSection) {
      analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const statsDisplay = [
    { 
      label: 'Active Deals', 
      value: loading ? '...' : stats.activeDeals.toString(), 
      icon: '📊', 
      color: 'from-blue-500 to-blue-600', 
      change: myDeals.length > 0 ? `${myDeals.length} total` : apiError || 'No deals yet'
    },
    { 
      label: 'Total Views', 
      value: loading ? '...' : stats.totalViews.toLocaleString(), 
      icon: '👁️', 
      color: 'from-green-500 to-green-600', 
      change: stats.totalViews > 0 ? 'Across all deals' : 'Post deals to get views'
    },
    { 
      label: 'Favorites', 
      value: loading ? '...' : stats.totalFavorites.toString(), 
      icon: '⭐', 
      color: 'from-purple-500 to-purple-600', 
      change: stats.totalFavorites > 0 ? 'People interested' : 'Create deals to get favorites'
    },
    { 
      label: 'Revenue', 
      value: loading ? '...' : '0 zł', 
      icon: '💰', 
      color: 'from-orange-500 to-orange-600', 
      change: 'Track coming soon'
    }
  ];

  const quickActions = [
    { 
      label: 'My Store', 
      icon: '🏪', 
      color: 'from-green-600 to-blue-600', 
      action: () => navigate('/business/my-store'),
      description: 'View your store page'
    },
    { 
      label: 'Post New Deal', 
      icon: '➕', 
      color: 'from-blue-600 to-purple-600', 
      action: () => navigate('/business/post-deal'),
      description: 'Create a new deal'
    },
    { 
      label: 'View My Deals', 
      icon: '📋', 
      color: 'from-purple-600 to-pink-600', 
      action: () => navigate('/deals'),
      badge: myDeals.length > 0 ? myDeals.length.toString() : null,
      description: 'See all deals'
    },
    { 
      label: 'View Analytics', 
      icon: '📈', 
      color: 'from-indigo-600 to-purple-600', 
      action: handleViewAnalytics,
      description: 'View performance analytics'
    },
    { 
      label: 'Export Reports', 
      icon: '📥', 
      color: 'from-teal-600 to-cyan-600', 
      action: handleExportReport,
      description: 'Download deals report (CSV)'
    },
    { 
      label: 'Settings', 
      icon: '⚙️', 
      color: 'from-gray-600 to-gray-700', 
      action: () => navigate('/business/settings'),
      description: 'Business settings & notifications'
    }
  ];

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
              <button onClick={() => navigate('/deals')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                All Deals
              </button>
              <button 
                onClick={() => navigate('/business/my-store')} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
              >
                <span>🏪</span> My Store
              </button>
              <button onClick={() => navigate('/favorites')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Favorites
              </button>
              <button onClick={() => navigate('/business/post-deal')} className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                Post Deal
              </button>
              <button onClick={() => navigate('/profile')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                My Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl mb-2">🏪 {businessName}</p>
              <h1 className="text-4xl font-bold mb-2">
                {greeting}, {firstName}!
              </h1>
              <p className="text-xl text-blue-100">
                {loading ? 'Loading your dashboard...' : `Managing ${stats.activeDeals} active deals`}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/business/my-store')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>🏪</span> View My Store
              </button>
              <button
                onClick={() => navigate('/business/post-deal')}
                className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
              >
                + Post New Deal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Verification Status Banner */}
          <VerificationStatusBanner />
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
            <button
              onClick={fetchBusinessData}
              disabled={loading}
              className={`flex items-center gap-2 font-semibold transition-colors ${
                loading ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{stat.icon}</span>
                  <span className="text-5xl font-bold">{stat.value}</span>
                </div>
                <p className="text-lg font-semibold mb-1">{stat.label}</p>
                <p className="text-sm opacity-90">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Charts */}
      {myDeals.length > 0 && (
        <section id="performance-analytics" className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time (Last 7 Days)</h3>
                <div className="h-64">
                  <div className="flex items-end justify-between h-full gap-2">
                    {chartData.viewsOverTime.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400 relative group"
                          style={{ height: `${Math.max((day.views / Math.max(...chartData.viewsOverTime.map(d => d.views))) * 100, 5)}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {Math.round(day.views)} views
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{day.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performing Deals */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Deals</h3>
                <div className="space-y-3">
                  {chartData.topPerformingDeals.length > 0 ? (
                    chartData.topPerformingDeals.map((deal, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{deal.title}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>👁️ {deal.views} views</span>
                            <span>⭐ {deal.saves} saves</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.max((deal.views / chartData.topPerformingDeals[0].views) * 100, 10)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No data available yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl font-bold text-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-2 relative`}
                title={action.description}
              >
                {action.badge && (
                  <span className="absolute top-2 right-2 bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {action.badge}
                  </span>
                )}
                <span className="text-4xl">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Management Table */}
      {myDeals.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <DealsManagementTable deals={myDeals} onRefresh={fetchBusinessData} />
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && myDeals.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Deals Yet</h3>
              <p className="text-gray-600 mb-6">Start by creating your first deal to attract customers!</p>
              <button
                onClick={() => navigate('/business/post-deal')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold inline-flex items-center gap-2"
              >
                <span>+</span> Create Your First Deal
              </button>
            </div>
          </div>
        </section>
      )}

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
            <button onClick={() => navigate('/business/settings')} className="text-gray-400 hover:text-white transition-colors">
              Business Profile
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
