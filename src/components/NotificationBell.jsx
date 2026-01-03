// src/components/NotificationBell.jsx - WITH SETTINGS
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    browserNotifications: false,
    sound: false,
    dealSaved: true,
    dealFavorited: true,
    expiringDeals: true,
    priceDrops: true,
    newDeals: true,
    milestones: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    loadSettings();

    const unsubscribe = notificationService.subscribe(loadNotifications);

    return () => unsubscribe();
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getAll();
    const unread = notificationService.getUnreadCount();
    
    setNotifications(allNotifications.slice(0, 5));
    setUnreadCount(unread);
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notification_settings', JSON.stringify(newSettings));
  };

  const handleSettingToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleNotificationClick = (notification) => {
    notificationService.markAsRead(notification.id);
    
    switch (notification.action) {
      case 'view_favorites':
        navigate('/favorites');
        break;
      case 'view_deal':
        navigate('/deals');
        break;
      case 'view_analytics':
        navigate('/business/analytics');
        break;
      case 'explore_deals':
        navigate('/deals');
        break;
      default:
        break;
    }
    
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      notificationService.clearAll();
      loadNotifications();
    }
  };

  const requestBrowserPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      const newSettings = { ...settings, browserNotifications: true };
      saveSettings(newSettings);
      alert('Browser notifications enabled!');
    } else {
      alert('Browser notification permission denied');
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowSettings(false);
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                  
                  {/* Settings Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(!showSettings);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Notification settings"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {!showSettings && notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Mark all read
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Settings Panel */}
            {showSettings ? (
              <div className="overflow-y-auto flex-1 p-4">
                <h4 className="font-bold text-gray-900 mb-4">Notification Settings</h4>
                
                {/* Master Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Enable Notifications</p>
                    <p className="text-xs text-gray-600">Turn all notifications on/off</p>
                  </div>
                  <button
                    onClick={() => handleSettingToggle('enabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Browser Notifications */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">Browser Notifications</p>
                    <p className="text-xs text-gray-600">Show desktop notifications</p>
                  </div>
                  {settings.browserNotifications ? (
                    <button
                      onClick={() => handleSettingToggle('browserNotifications')}
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                  ) : (
                    <button
                      onClick={requestBrowserPermission}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Enable
                    </button>
                  )}
                </div>

                {/* Notification Types */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Notification Types</p>
                  
                  {[
                    { key: 'dealSaved', label: '❤️ Deal Saved', desc: 'When you favorite a deal' },
                    { key: 'dealFavorited', label: '⭐ Deal Favorited', desc: 'When your deal is favorited' },
                    { key: 'expiringDeals', label: '⏰ Expiring Deals', desc: 'When deals are about to expire' },
                    { key: 'priceDrops', label: '💰 Price Drops', desc: 'When prices decrease' },
                    { key: 'newDeals', label: '🆕 New Deals', desc: 'New deals in your categories' },
                    { key: 'milestones', label: '🎉 Milestones', desc: 'When deals reach milestones' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                      <button
                        onClick={() => handleSettingToggle(key)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings[key] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings[key] ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
                >
                  ← Back to Notifications
                </button>
              </div>
            ) : (
              /* Notifications List */
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <p className="text-gray-500 font-medium">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      We'll notify you when something happens
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-2xl flex-shrink-0 ${
                            notification.priority === 'high' ? 'animate-bounce' : ''
                          }`}>
                            {notification.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-semibold ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {getTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {!showSettings && notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
