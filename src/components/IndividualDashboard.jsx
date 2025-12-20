// src/components/IndividualDashboard.jsx - INDIVIDUAL USER DASHBOARD

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function IndividualDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [firstName, setFirstName] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setTimeBasedGreeting();
    getUserInfo();
    loadFavorites();
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
      setFirstName(user.firstName || user.name?.split(' ')[0] || 'User');
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setFirstName(storedUser.firstName || storedUser.name?.split(' ')[0] || 'User');
    }
  };

  const loadFavorites = () => {
    const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    setFavorites(guestFavorites);
  };

  const stats = [
    { label: 'Favorite Deals', value: favorites.length.toString(), icon: '❤️', color: 'from-red-500 to-pink-600' },
    { label: 'Available Deals', value: '500+', icon: '🎁', color: 'from-blue-500 to-purple-600' },
    { label: 'Reviews Written', value: '0', icon: '⭐', color: 'from-yellow-500 to-orange-600', badge: 'Coming Soon' }
  ];

  const quickActions = [
    { label: 'Browse Deals', icon: '🔍', action: () => navigate('/deals'), color: 'from-blue-600 to-purple-600' },
    { label: 'My Favorites', icon: '❤️', action: () => navigate('/favorites'), color: 'from-red-600 to-pink-600' },
    { label: 'Categories', icon: '📂', action: () => navigate('/categories'), color: 'from-green-600 to-blue-600' },
    { label: 'Profile', icon: '👤', action: () => navigate('/profile'), color: 'from-gray-600 to-gray-700' }
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
                Deals
              </button>
              <button onClick={() => navigate('/favorites')} className="text-gray-700 hover:text-blue-600 font-medium">
                Favorites
              </button>
              <button onClick={() => navigate('/categories')} className="text-gray-700 hover:text-blue-600 font-medium">
                Categories
              </button>
              <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">👋</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            {greeting}, {firstName}!
          </h1>
          <p className="text-2xl text-blue-100 mb-8">
            Ready to discover amazing deals today?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/deals')}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              Browse All Deals
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg"
            >
              My Favorites
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your SaveMate Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all relative`}
              >
                {stat.badge && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    {stat.badge}
                  </div>
                )}
                <div className="text-center">
                  <div className="text-6xl mb-4">{stat.icon}</div>
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xl font-semibold opacity-90">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`bg-gradient-to-r ${action.color} text-white p-8 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col items-center gap-4`}
              >
                <span className="text-5xl">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Favorites */}
      {favorites.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recent Favorites</h2>
              <button
                onClick={() => navigate('/favorites')}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {favorites.slice(0, 3).map((fav, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer"
                  onClick={() => navigate(fav.url || '/deals')}
                >
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {fav.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Saved {new Date(fav.savedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Personalized Tips */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">💡 Tips for Saving More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
              <div className="text-5xl mb-4">🔔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enable Notifications</h3>
              <p className="text-gray-700 mb-4">
                Get alerts when your favorite deals are about to expire
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Turn On →
              </button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border-2 border-green-200">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Save Your Favorites</h3>
              <p className="text-gray-700 mb-4">
                Heart deals to save them and get notified before they expire
              </p>
              <button onClick={() => navigate('/deals')} className="text-green-600 hover:text-green-700 font-semibold">
                Browse Deals →
              </button>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Check Daily</h3>
              <p className="text-gray-700 mb-4">
                New deals are added every day - check back often!
              </p>
              <button onClick={() => navigate('/deals')} className="text-orange-600 hover:text-orange-700 font-semibold">
                See Today's Deals →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            &copy; 2025 SaveMate. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white transition-colors">
              Profile
            </button>
            <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
