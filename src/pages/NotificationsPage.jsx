// src/pages/NotificationsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, user, business, system
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe(loadNotifications);
    
    // Mark all as read when page loads
    setTimeout(() => {
      notificationService.markAllAsRead();
    }, 1000);

    return () => unsubscribe();
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getAll();
    setNotifications(allNotifications);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.category === filter;
  });

  const handleNotificationClick = (notification) => {
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
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    notificationService.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      notificationService.clearAll();
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
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return past.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      business: 'bg-purple-100 text-purple-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🔔 Notifications</h1>
              <p className="text-blue-100">Stay updated with all your SaveMate activity</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({notifications.filter(n => !n.read).length})
              </button>
              <button
                onClick={() => setFilter('user')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setFilter('business')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'business'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Business
              </button>
              <button
                onClick={() => setFilter('system')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'system'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                System
              </button>
            </div>

            {/* Clear All Button */}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-7xl mb-6">🔔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No Notifications' : `No ${filter} Notifications`}
            </h2>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? "You're all caught up! We'll notify you when something happens."
                : `You don't have any ${filter} notifications at the moment.`}
            </p>
            <button
              onClick={() => navigate('/deals')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Explore Deals
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden ${
                  !notification.read ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`text-4xl flex-shrink-0 ${
                      notification.priority === 'high' ? 'animate-pulse' : ''
                    }`}>
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          title="Delete notification"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(notification.category)}`}>
                          {notification.category.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-semibold">
                            NEW
                          </span>
                        )}
                        {notification.priority === 'high' && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-semibold">
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
