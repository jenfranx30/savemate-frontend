// src/components/BusinessDashboard.jsx - NEW BUSINESS DASHBOARD

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    setTimeBasedGreeting();
    getUserInfo();
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

  const getUserInfo = () => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || 'Business Owner');
      setBusinessName(user.businessName || 'Your Business');
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setFirstName(storedUser.firstName || storedUser.name?.split(' ')[0] || 'Business Owner');
      setBusinessName(storedUser.businessName || 'Your Business');
    }
  };

  const stats = [
    { label: 'Active Deals', value: '12', icon: '📊', color: 'from-blue-500 to-blue-600', change: '+3 this week' },
    { label: 'Total Views', value: '1,458', icon: '👁️', color: 'from-green-500 to-green-600', change: '+24%' },
    { label: 'Favorites', value: '289', icon: '⭐', color: 'from-purple-500 to-purple-600', change: '+12%' },
    { label: 'Redeemed', value: '134', icon: '🎯', color: 'from-orange-500 to-orange-600', change: '+8%' }
  ];

  const recentActivity = [
    { action: 'New deal posted', deal: 'Summer Sale - 50% Off', time: '2 hours ago', icon: '✨' },
    { action: 'Deal favorited', deal: 'Weekend Special', time: '4 hours ago', icon: '⭐' },
    { action: 'Deal redeemed', deal: 'Coffee Bundle', time: '6 hours ago', icon: '🎉' },
    { action: 'Deal viewed', deal: 'Lunch Combo', time: '8 hours ago', icon: '👁️' }
  ];

  const quickActions = [
    { 
      label: 'Post New Deal', 
      icon: '➕', 
      color: 'from-green-600 to-blue-600', 
      action: () => navigate('/business/post-deal')
    },
    { 
      label: 'View My Deals', 
      icon: '📋', 
      color: 'from-blue-600 to-purple-600', 
      action: () => navigate('/deals')
    },
    { 
      label: 'Analytics', 
      icon: '📈', 
      color: 'from-purple-600 to-pink-600', 
      action: () => alert('Analytics coming soon!')
    },
    { 
      label: 'Settings', 
      icon: '⚙️', 
      color: 'from-gray-600 to-gray-700', 
      action: () => navigate('/profile')
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
              <button onClick={() => navigate('/deals')} className="text-gray-700 hover:text-blue-600 font-medium">
                All Deals
              </button>
              <button onClick={() => navigate('/favorites')} className="text-gray-700 hover:text-blue-600 font-medium">
                Favorites
              </button>
              <button onClick={() => navigate('/business/post-deal')} className="text-green-600 hover:text-green-700 font-semibold">
                Post Deal
              </button>
              <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                Back to Home
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
                Ready to manage your deals today?
              </p>
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

      {/* Stats Grid */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl font-bold text-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3`}
              >
                <span className="text-3xl">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{activity.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.deal}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Tips */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Business Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Optimize Your Deals</h3>
              <p className="text-gray-700">
                Deals with clear images and descriptions get 3x more views. Make sure your deals stand out!
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">⏰ Post Regularly</h3>
              <p className="text-gray-700">
                Businesses that post weekly get 5x more engagement. Keep your deals fresh and exciting!
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">💰 Pricing Strategy</h3>
              <p className="text-gray-700">
                Discounts between 30-50% perform best. Balance attractive pricing with profitability.
              </p>
            </div>
          </div>
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
