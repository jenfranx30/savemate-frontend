// src/services/notificationService.js
// Notification Service for SaveMate

class NotificationService {
  constructor() {
    this.notifications = this.loadNotifications();
    this.subscribers = [];
  }

  // Load notifications from localStorage
  loadNotifications() {
    try {
      const stored = localStorage.getItem('savemate_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  // Save notifications to localStorage
  saveNotifications() {
    try {
      localStorage.setItem('savemate_notifications', JSON.stringify(this.notifications));
      this.notifySubscribers();
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Subscribe to notification changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // Add a new notification
  addNotification(notification) {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    
    // Show browser notification if permitted
    this.showBrowserNotification(newNotification);
    
    return newNotification;
  }

  // Get all notifications
  getAll() {
    return this.notifications;
  }

  // Get unread notifications
  getUnread() {
    return this.notifications.filter(n => !n.read);
  }

  // Get unread count
  getUnreadCount() {
    return this.getUnread().length;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // Delete notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  // Show browser notification
  async showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: notification.id,
          requireInteraction: false
        });
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }
  }

  // Request notification permission
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Notification creators for specific events

  // When someone favorites a business deal (for business owners)
  createFavoriteNotification(dealTitle, userType = 'guest') {
    return this.addNotification({
      type: 'favorite',
      title: '⭐ Deal Favorited!',
      message: `Someone ${userType === 'guest' ? '' : 'saved '}favorited "${dealTitle}"`,
      category: 'business',
      action: 'view_analytics',
      icon: '⭐'
    });
  }

  // When a user saves a deal (for users)
  createDealSavedNotification(dealTitle) {
    return this.addNotification({
      type: 'saved',
      title: '❤️ Deal Saved!',
      message: `"${dealTitle}" has been added to your favorites`,
      category: 'user',
      action: 'view_favorites',
      icon: '❤️'
    });
  }

  // When a favorited deal is about to expire
  createExpiringDealNotification(dealTitle, daysLeft) {
    return this.addNotification({
      type: 'expiring',
      title: '⏰ Deal Expiring Soon!',
      message: `"${dealTitle}" expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
      category: 'user',
      action: 'view_deal',
      icon: '⏰',
      priority: 'high'
    });
  }

  // When a new deal is posted in a favorited category
  createNewDealNotification(dealTitle, category) {
    return this.addNotification({
      type: 'new_deal',
      title: '🆕 New Deal Available!',
      message: `New ${category} deal: "${dealTitle}"`,
      category: 'user',
      action: 'view_deal',
      icon: '🆕'
    });
  }

  // When a deal price drops
  createPriceDropNotification(dealTitle, oldPrice, newPrice) {
    const savings = oldPrice - newPrice;
    return this.addNotification({
      type: 'price_drop',
      title: '💰 Price Drop Alert!',
      message: `"${dealTitle}" - Save an extra ${savings.toFixed(2)} zł!`,
      category: 'user',
      action: 'view_deal',
      icon: '💰',
      priority: 'high'
    });
  }

  // When a business deal reaches milestone favorites
  createMilestoneNotification(dealTitle, count) {
    return this.addNotification({
      type: 'milestone',
      title: '🎉 Milestone Reached!',
      message: `"${dealTitle}" reached ${count} favorites!`,
      category: 'business',
      action: 'view_analytics',
      icon: '🎉'
    });
  }

  // When deal is claimed/redeemed
  createRedemptionNotification(dealTitle) {
    return this.addNotification({
      type: 'redemption',
      title: '✅ Deal Redeemed!',
      message: `Someone redeemed "${dealTitle}"`,
      category: 'business',
      action: 'view_analytics',
      icon: '✅'
    });
  }

  // System notifications
  createWelcomeNotification() {
    return this.addNotification({
      type: 'welcome',
      title: '👋 Welcome to SaveMate!',
      message: 'Start saving money on local deals today',
      category: 'system',
      action: 'explore_deals',
      icon: '👋'
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;

// Helper functions for common use cases
export const notifyDealFavorited = (dealTitle, userType) => {
  return notificationService.createFavoriteNotification(dealTitle, userType);
};

export const notifyDealSaved = (dealTitle) => {
  return notificationService.createDealSavedNotification(dealTitle);
};

export const notifyDealExpiring = (dealTitle, daysLeft) => {
  return notificationService.createExpiringDealNotification(dealTitle, daysLeft);
};

export const notifyNewDeal = (dealTitle, category) => {
  return notificationService.createNewDealNotification(dealTitle, category);
};

export const notifyPriceDrop = (dealTitle, oldPrice, newPrice) => {
  return notificationService.createPriceDropNotification(dealTitle, oldPrice, newPrice);
};

export const notifyMilestone = (dealTitle, count) => {
  return notificationService.createMilestoneNotification(dealTitle, count);
};

export const notifyRedemption = (dealTitle) => {
  return notificationService.createRedemptionNotification(dealTitle);
};

export const requestNotificationPermission = async () => {
  return await notificationService.requestPermission();
};
