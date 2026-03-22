import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api-m2ugc4x7ma-uc.a.run.app/api';

// Create axios instance with auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const YouTubeConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await api.get('/youtube/status');
      
      if (response.data.success) {
        setIsConnected(response.data.connected);
      }
    } catch (error) {
      console.error('Error checking YouTube connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      
      const response = await api.get('/youtube/auth');
      
      if (response.data.success && response.data.authUrl) {
        // Open popup window for OAuth
        const popup = window.open(
          response.data.authUrl, 
          'youtube-auth', 
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );
        
        // Listen for popup closure or success
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setConnecting(false);
            // Recheck connection status after popup closes
            setTimeout(() => checkConnectionStatus(), 1000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting YouTube connection:', error);
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect your YouTube account? This will prevent automatic playlist creation.')) {
      return;
    }

    try {
      const response = await api.delete('/youtube/disconnect');
      
      if (response.data.success) {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting YouTube:', error);
    }
  };


  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-left flex-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">YouTube Integration</p>
              <p className="text-xs text-gray-500">
                {isConnected 
                  ? 'Connected - Playlists will be created automatically' 
                  : 'Enable automatic playlist creation for approved requests'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={connecting}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              isConnected ? 'bg-red-500' : 'bg-gray-300'
            } ${connecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                isConnected ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeConnection;