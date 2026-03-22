import { messaging, getToken, onMessage, isSupported } from '../firebase/config';

class NotificationService {
  constructor() {
    this.vapidKey = process.env.REACT_APP_VAPID_KEY || 'VAPID_KEY_NOT_SET';
    this.token = null;
    this.isSupported = this.checkSupport();
  }

  checkSupport() {
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasNotification = 'Notification' in window;
    const hasPushManager = 'PushManager' in window;
    
    console.log('Push notification support check:', {
      hasServiceWorker,
      hasNotification, 
      hasPushManager,
      isSecureContext: window.isSecureContext
    });
    
    return hasServiceWorker && hasNotification && hasPushManager && window.isSecureContext;
  }

  async requestPermission() {
    if (!this.isSupported) {
      console.log('Push notifications are not supported');
      return false;
    }

    console.log('Current permission status:', Notification.permission);
    
    // If already denied, we can't request again - user must manually enable
    if (Notification.permission === 'denied') {
      console.log('Notifications are blocked. User must enable manually in browser settings.');
      throw new Error('Notifications are blocked. Please enable them in your browser settings and refresh the page.');
    }

    const permission = await Notification.requestPermission();
    console.log('Permission request result:', permission);
    return permission === 'granted';
  }

  async getPermissionStatus() {
    if (!this.isSupported) return 'not-supported';
    return Notification.permission;
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('SW registered: ', registration);
        return registration;
      } catch (error) {
        console.log('SW registration failed: ', error);
        return null;
      }
    }
  }

  async getFCMToken() {
    try {
      console.log('Starting FCM token generation...');
      
      if (!this.isSupported) {
        throw new Error('Push notifications are not supported on this browser/device');
      }
      
      // Wait for Firebase messaging to be ready
      const messagingSupported = await isSupported();
      if (!messagingSupported) {
        throw new Error('Firebase Messaging is not supported');
      }
      
      const registration = await this.registerServiceWorker();
      if (!registration) {
        throw new Error('Service worker registration failed');
      }
      
      console.log('Service worker registered, getting FCM token...');
      
      // Wait a bit for messaging to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!messaging) {
        throw new Error('Firebase messaging not initialized');
      }
      
      const currentToken = await getToken(messaging, {
        vapidKey: this.vapidKey,
        serviceWorkerRegistration: registration
      });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        this.token = currentToken;
        return currentToken;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (err) {
      console.error('Error getting FCM token:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code
      });
      return null;
    }
  }

  async subscribeToNotifications() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Notification permission denied');
    }

    const token = await this.getFCMToken();
    if (!token) {
      throw new Error('Failed to get FCM token');
    }

    // Send token to your backend
    await this.sendTokenToServer(token);
    
    return token;
  }

  async sendTokenToServer(token) {
    try {
      const response = await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/saveNotificationToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save FCM token');
      }
    } catch (error) {
      console.error('Error sending token to server:', error);
      throw error;
    }
  }

  setupForegroundMessageListener() {
    // Wait for messaging to be initialized
    const setupListener = () => {
      if (messaging) {
        onMessage(messaging, (payload) => {
          // Show notification when app is in foreground
          if (Notification.permission === 'granted') {
            const notification = new Notification(payload.notification.title, {
              body: payload.notification.body,
              icon: payload.notification.icon || '/logo192.png',
              tag: 'nfc-worship-notification'
            });

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }
        });
      } else {
        // Retry after a delay if messaging isn't ready
        setTimeout(setupListener, 1000);
      }
    };
    
    setupListener();
  }

  async unsubscribe() {
    // Remove token from server and clear local storage
    if (this.token) {
      await this.removeTokenFromServer(this.token);
      this.token = null;
    }
  }

  async removeTokenFromServer(token) {
    try {
      await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/removeNotificationToken', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
    } catch (error) {
      console.error('Error removing token from server:', error);
    }
  }

}

export default new NotificationService();