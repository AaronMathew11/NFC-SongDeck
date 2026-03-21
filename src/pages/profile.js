import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import NotificationSettings from "../Components/NotificationSettings";
import YouTubeConnection from "../Components/YouTubeConnection";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between pt-6 pb-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <FaArrowLeft className="text-white text-lg" />
            </button>
            <h1 className="text-lg font-bold text-white">Profile</h1>
            <div className="w-10 h-10"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* User Info */}
        <div className="mt-6  rounded-xl  p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-gray-600">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-lg text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
            </div>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="mt-6 space-y-4">
          {/* YouTube Integration */}
          <YouTubeConnection />

          {/* Notification Settings */}
          <NotificationSettings />

          {/* Logout */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg p-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <FaSignOutAlt className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Logout</p>
                  <p className="text-xs text-gray-500">Sign out of your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;