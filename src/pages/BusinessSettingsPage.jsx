// src/pages/BusinessSettingsPage.jsx
// Business Settings with Account, Notifications, and System Settings

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BusinessSettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [businessInfo, setBusinessInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailDeals: true,
    emailOrders: true,
    emailReviews: true,
    pushDeals: false,
    pushOrders: true,
    pushReviews: true,
    smsOrders: false
  });
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    language: 'en',
    timezone: 'Europe/Warsaw',
    currency: 'PLN',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserInfo(user);

      // Fetch business profile
      const response = await fetch('http://localhost:8000/api/v1/businesses/owner/me/businesses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const businesses = await response.json();
        if (businesses.length > 0) {
          setBusinessInfo(businesses[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    // Save to backend
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'account', label: 'Business Account', icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'system', label: 'System Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate('/')}
            >
              SaveMate
            </h1>
            
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-blue-600 font-medium">
                ← Back to Dashboard
              </button>
              <button onClick={() => navigate('/profile')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold">
                My Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Business Settings</h1>
          <p className="text-blue-100">Manage your business account, notifications, and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Business Account</h2>
                  
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input
                          type="text"
                          value={businessInfo?.business_name || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={userInfo?.email || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                          type="text"
                          value={userInfo?.username || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          readOnly
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                          ✓ Business Owner Account
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={() => navigate('/business/edit-profile')}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Edit Business Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'emailDeals', label: 'New deals posted', desc: 'Get notified when you post a new deal' },
                          { key: 'emailOrders', label: 'Deal redemptions', desc: 'When customers redeem your deals' },
                          { key: 'emailReviews', label: 'New reviews', desc: 'When customers leave reviews' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications[item.key]}
                              onChange={() => handleNotificationChange(item.key)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'pushDeals', label: 'Deal activity', desc: 'Views, saves, and interactions' },
                          { key: 'pushOrders', label: 'Redemptions', desc: 'Real-time order notifications' },
                          { key: 'pushReviews', label: 'Reviews', desc: 'New customer reviews' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications[item.key]}
                              onChange={() => handleNotificationChange(item.key)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">SMS Notifications</h3>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Order SMS alerts</p>
                          <p className="text-sm text-gray-500">Urgent order notifications via SMS</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.smsOrders}
                          onChange={() => handleNotificationChange('smsOrders')}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </label>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={saveSettings}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Save Notification Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings Tab */}
              {activeTab === 'system' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">System Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={systemSettings.language}
                        onChange={(e) => handleSystemSettingChange('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="pl">Polski</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => handleSystemSettingChange('timezone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Europe/Warsaw">Warsaw (GMT+1)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="Europe/Berlin">Berlin (GMT+1)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={systemSettings.currency}
                        onChange={(e) => handleSystemSettingChange('currency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="PLN">PLN (zł)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select
                        value={systemSettings.dateFormat}
                        onChange={(e) => handleSystemSettingChange('dateFormat', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <select
                        value={systemSettings.theme}
                        onChange={(e) => handleSystemSettingChange('theme', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={saveSettings}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Save System Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
