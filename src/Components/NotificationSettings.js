import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import notificationService from '../services/notificationService';

const NotificationSettings = () => {
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    checkInitialStatus();
    notificationService.setupForegroundMessageListener();
  }, []);

  const checkInitialStatus = async () => {
    setIsSupported(notificationService.isSupported);
    if (notificationService.isSupported) {
      const status = await notificationService.getPermissionStatus();
      setPermissionStatus(status);
      
      // Check if user is actually subscribed (has valid token on server)
      const subscribed = await notificationService.isUserSubscribed();
      setIsSubscribed(subscribed);
    }
  };

  const handleToggleNotifications = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      if (isSubscribed) {
        await notificationService.unsubscribe();
        setIsSubscribed(false);
        setMessage('Notifications disabled');
      } else {
        await notificationService.subscribeToNotifications();
        const status = await notificationService.getPermissionStatus();
        setPermissionStatus(status);
        setIsSubscribed(true);
        setMessage('Notifications enabled');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      if (error.message.includes('blocked')) {
        setMessage('Please allow notifications in your browser settings');
      } else {
        setMessage('Error updating notification settings');
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaBellSlash className="text-gray-400 text-xl" />
            <div>
              <p className="text-sm text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Not supported on this device</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEnabled = isSubscribed && permissionStatus === 'granted';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isEnabled ? (
            <FaBell className="text-blue-500 text-xl" />
          ) : (
            <FaBellSlash className="text-gray-400 text-xl" />
          )}
          <div className="text-left">
            <p className="text-sm text-gray-900">Push Notifications</p>
            <p className="text-xs text-gray-500">
              {isEnabled ? 'Receiving notifications' : 'Stay updated with worship notifications'}
            </p>
          </div>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={isEnabled}
            onChange={handleToggleNotifications}
            disabled={isLoading}
          />
          <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
            isEnabled ? 'bg-blue-500' : 'bg-gray-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            } mt-0.5 ml-0.5`}>
              {isLoading && (
                <div className="w-full h-full rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
              )}
            </div>
          </div>
        </label>
      </div>

      {message && (
        <div className={`mt-3 p-3 rounded-md text-sm ${
          message.includes('Error') || message.includes('Please')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : message.includes('disabled')
            ? 'bg-gray-50 text-gray-700 border border-gray-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {isEnabled && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 text-left">You'll receive notifications for:</p>
          <ul className="text-xs text-gray-500 space-y-1 text-left">
            <li>• Daily quiet time reminders</li>
            <li>• Midweek roster check-ins</li>
            <li>• Worship practice reminders</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;