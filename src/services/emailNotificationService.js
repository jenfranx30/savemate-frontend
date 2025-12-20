// src/services/emailNotificationService.js - FIXED VERSION
class EmailNotificationService {
  constructor() {
    // Don't use process.env in browser - just use a default endpoint
    this.apiEndpoint = '/api/emails';
  }

  /**
   * Send welcome email to new individual user
   */
  async sendIndividualWelcomeEmail(user) {
    const emailData = {
      to: user.email,
      subject: '🎉 Welcome to SaveMate!',
      template: 'individual_welcome',
      data: {
        firstName: user.firstName || user.name?.split(' ')[0] || 'there',
        email: user.email,
        signupDate: new Date().toLocaleDateString()
      }
    };

    try {
      await this.sendEmail(emailData);
      console.log('✅ Welcome email sent to:', user.email);
      
      // Show in-app notification
      this.showInAppNotification(
        'Welcome to SaveMate! 🎉',
        `Check your email at ${user.email} for getting started tips.`
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  /**
   * Send welcome email to new business user
   */
  async sendBusinessWelcomeEmail(user) {
    const emailData = {
      to: user.email,
      subject: '🏪 Welcome to SaveMate Business!',
      template: 'business_welcome',
      data: {
        businessName: user.businessName || 'Your Business',
        firstName: user.firstName || user.name?.split(' ')[0] || 'there',
        email: user.email,
        signupDate: new Date().toLocaleDateString()
      }
    };

    try {
      await this.sendEmail(emailData);
      console.log('✅ Business welcome email sent to:', user.email);
      
      // Show in-app notification
      this.showInAppNotification(
        'Welcome to SaveMate Business! 🏪',
        `Check your email at ${user.email} for tips on posting your first deal.`
      );
    } catch (error) {
      console.error('Failed to send business welcome email:', error);
    }
  }

  /**
   * Send email via API (mock for now, replace with actual API call)
   */
  async sendEmail(emailData) {
    // For development: Log email to console and localStorage
    console.log('📧 EMAIL SENT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Template:', emailData.template);
    console.log('Data:', emailData.data);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Store in localStorage to simulate sending
    const sentEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
    sentEmails.push({
      ...emailData,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });

    /* 
    // PRODUCTION: Replace with actual API call
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return await response.json();
    */
  }

  /**
   * Show in-app notification
   */
  showInAppNotification(title, message) {
    // Check if browser supports notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/logo192.png',
          badge: '/logo192.png'
        });
      } catch (error) {
        console.log('Notification error:', error);
      }
    }

    // Also log to console
    console.log('📬 NOTIFICATION:', title);
    console.log('   ', message);
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Get all sent emails from localStorage (for debugging)
   */
  getSentEmails() {
    return JSON.parse(localStorage.getItem('sentEmails') || '[]');
  }

  /**
   * Clear sent emails from localStorage (for debugging)
   */
  clearSentEmails() {
    localStorage.removeItem('sentEmails');
    console.log('✅ Cleared sent emails');
  }
}

// Export singleton instance
const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
