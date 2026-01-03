// src/components/NotificationSettings.jsx
// Notification Settings Page for Individual Users
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [browserPermission, setBrowserPermission] = useState('default');
  const [loading, setLoading] = useState(false);
  
  // Notification preferences state
  const [preferences, setPreferences] = useState({
    dealExpiring: true,
    newDeals: true,
    priceDrops: true,
    favoriteUpdates: false,
    dailyDigest: false,
    weeklyReport: false
  });

  // Category preferences
  const [categoryPreferences, setCategoryPreferences] = useState({
    'Food & Dining': true,
    'Grocery & Food': true,
    'Breads & Bakery': false,
    'Frozen Foods': false,
    'Snacks': false,
    'Dairy Products': false,
    'Fresh Vegetables': false,
    'Beverages': false,
    'Cereals': false,
    'Household Items': false,
    'Packaged Food': false,
    'Confectionery': false
  });

  useEffect(() => {
    checkBrowserPermission();
    loadPreferences();
  }, []);

  const checkBrowserPermission = () => {
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  };

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem('notification_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }

      const storedCategories = localStorage.getItem('notification_categories');
      if (storedCategories) {
        setCategoryPreferences(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = (newPrefs) => {
    try {
      localStorage.setItem('notification_preferences', JSON.stringify(newPrefs));
      setPreferences(newPrefs);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const saveCategoryPreferences = (newCategoryPrefs) => {
    try {
      localStorage.setItem('notification_categories', JSON.stringify(newCategoryPrefs));
      setCategoryPreferences(newCategoryPrefs);
    } catch (error) {
      console.error('Error saving category preferences:', error);
    }
  };

  const handleEnableBrowserNotifications = async () => {
    setLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      
      if (granted) {
        setBrowserPermission('granted');
        
        // Show success notification
        notificationService.addNotification({
          type: 'success',
          title: '✅ Notifications Enabled!',
          message: 'You will now receive alerts for your favorite deals',
          category: 'system',
          icon: '✅'
        });
      } else {
        alert('Notification permission denied. Please enable notifications in your browser settings.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert('Failed to enable notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreference = (key) => {
    const newPrefs = {
      ...preferences,
      [key]: !preferences[key]
    };
    savePreferences(newPrefs);
  };

  const handleToggleCategory = (category) => {
    const newCategoryPrefs = {
      ...categoryPreferences,
      [category]: !categoryPreferences[category]
    };
    saveCategoryPreferences(newCategoryPrefs);
  };

  const handleEnableAll = () => {
    const allEnabled = {
      dealExpiring: true,
      newDeals: true,
      priceDrops: true,
      favoriteUpdates: true,
      dailyDigest: true,
      weeklyReport: true
    };
    savePreferences(allEnabled);
  };

  const handleDisableAll = () => {
    const allDisabled = {
      dealExpiring: false,
      newDeals: false,
      priceDrops: false,
      favoriteUpdates: false,
      dailyDigest: false,
      weeklyReport: false
    };
    savePreferences(allDisabled);
  };

  const handleTestNotification = () => {
    notificationService.addNotification({
      type: 'test',
      title: '🔔 Test Notification',
      message: 'This is what your notifications will look like!',
      category: 'system',
      icon: '🔔'
    });
  };

  const notificationTypes = [
    {
      key: 'dealExpiring',
      title: 'Deals Expiring Soon',
      description: 'Get alerts 3 days before your favorited deals expire',
      icon: '⏰',
      color: 'from-orange-500 to-red-500'
    },
    {
      key: 'newDeals',
      title: 'New Deals Available',
      description: 'Notify me when new deals are posted in my favorite categories',
      icon: '🆕',
      color: 'from-blue-500 to-purple-500'
    },
    {
      key: 'priceDrops',
      title: 'Price Drop Alerts',
      description: 'Get notified when deals you\'re watching have price reductions',
      icon: '💰',
      color: 'from-green-500 to-teal-500'
    },
    {
      key: 'favoriteUpdates',
      title: 'Favorite Updates',
      description: 'Updates about deals you\'ve saved to favorites',
      icon: '❤️',
      color: 'from-red-500 to-pink-500'
    },
    {
      key: 'dailyDigest',
      title: 'Daily Digest',
      description: 'Daily summary of new deals matching your interests',
      icon: '📧',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      key: 'weeklyReport',
      title: 'Weekly Report',
      description: 'Weekly summary of your savings and favorite deals',
      icon: '📊',
      color: 'from-purple-500 to-pink-500'
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
                Deals
              </button>
              <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </button>
              <button onClick={() => navigate('/dashboard')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h1 className="text-5xl font-bold mb-4">Notification Settings</h1>
          <p className="text-xl text-blue-100">
            Customize how and when you receive deal alerts
          </p>
        </div>
      </section>

      {/* Browser Notifications */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`bg-gradient-to-br ${
            browserPermission === 'granted' 
              ? 'from-green-50 to-blue-50 border-green-200' 
              : 'from-orange-50 to-red-50 border-orange-200'
          } p-8 rounded-2xl border-2 mb-8`}>
            <div className="flex items-start gap-6">
              <div className="text-6xl">
                {browserPermission === 'granted' ? '✅' : '🔔'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Browser Notifications
                </h2>
                <p className="text-gray-700 mb-4">
                  {browserPermission === 'granted' 
                    ? 'Browser notifications are enabled! You\'ll receive alerts even when SaveMate is closed.'
                    : 'Enable browser notifications to receive alerts even when SaveMate is closed.'
                  }
                </p>
                <div className="flex gap-4">
                  {browserPermission !== 'granted' && (
                    <button
                      onClick={handleEnableBrowserNotifications}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Enabling...' : 'Enable Notifications'}
                    </button>
                  )}
                  <button
                    onClick={handleTestNotification}
                    className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                  >
                    Send Test Notification
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleEnableAll}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              ✅ Enable All
            </button>
            <button
              onClick={handleDisableAll}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              ❌ Disable All
            </button>
          </div>
        </div>
      </section>

      {/* Notification Types */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Notification Types</h2>
          
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div
                key={type.key}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl bg-gradient-to-br ${type.color} p-4 rounded-xl text-white`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{type.title}</h3>
                      <button
                        onClick={() => handleTogglePreference(type.key)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                          preferences[type.key] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            preferences[type.key] ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Preferences */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Category Preferences</h2>
          <p className="text-gray-600 mb-8">
            Choose which categories you want to receive notifications for
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryPreferences).map(([category, enabled]) => (
              <div
                key={category}
                className={`bg-white border-2 rounded-xl p-4 transition-all cursor-pointer ${
                  enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleToggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      enabled ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                      {enabled && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`font-semibold ${enabled ? 'text-blue-900' : 'text-gray-700'}`}>
                      {category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Save Button */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border-2 border-green-200">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your preferences are saved automatically
            </h3>
            <p className="text-gray-700 mb-6">
              All changes are applied immediately
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            &copy; 2025 SaveMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
