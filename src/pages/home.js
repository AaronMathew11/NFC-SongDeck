import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaHeart, FaStar, FaCalendarWeek, FaSignOutAlt, FaClipboardCheck, FaSave, FaCheckCircle, FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { draftService } from "../utils/draftService";
import { canAccessWorshipHeadDashboard } from "../utils/permissions";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  
  const getCurrentDate = () => {
    return moment().format('DD MMM');
  };

  useEffect(() => {
    // Check for pending requests only if user is worship head
    if (canAccessWorshipHeadDashboard(user)) {
      const loadPendingCount = async () => {
        try {
          const count = await draftService.getPendingRequestsCount();
          setPendingRequests(count);
        } catch (error) {
          console.error('Error loading pending requests count:', error);
          setPendingRequests(0);
        }
      };
      
      loadPendingCount();
    } else {
      setPendingRequests(0);
    }

  }, [user]);
  


  return (
    <>
      
      <div className="page-container">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">Hello, {user?.name || 'Worship Team'}</h1>
              <p className="text-gray-500 text-xs mt-2">Today {getCurrentDate()}</p>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <FaUser className="text-gray-600 text-lg" />
            </button>
          </div>
        </div>


      {/* Week Calendar */}
      <div className="mb-12">
        <div className="flex justify-between">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
            const currentDate = moment().startOf('week').add(index, 'days');
            const isToday = moment().isSame(currentDate, 'day');
            const isSunday = index === 0;
            
            return (
              <div key={day} className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                  isToday ? 'bg-gray-900 text-white' : 
                  isSunday ? 'bg-accent-yellow text-gray-900' : 
                  'bg-white text-gray-500'
                }`}>
                  <span className="text-sm font-medium">{currentDate.format('DD')}</span>
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>



      {/* Worship Head Section - Only show for authorized users */}
      {canAccessWorshipHeadDashboard(user) && (
        <>
          {pendingRequests > 0 && (
            <div className="mb-8">
              <div 
                className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 cursor-pointer hover:bg-amber-200 transition-colors"
                onClick={() => navigate("/worship-head")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-gray-900 font-bold text-sm mb-1">Pending Approvals</h4>
                    <p className="text-gray-700 text-xs">
                      {pendingRequests} worship list{pendingRequests !== 1 ? 's' : ''} waiting for approval
                    </p>
                  </div>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pendingRequests}
                  </span>
                </div>
              </div>
            </div>
          )}

        </>
      )}

      {/* Main Actions Section */}
      <div className="my-10">
        <div className="space-y-4">
          {/* Drafts Card */}
          <div 
            className="bg-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={() => navigate("/drafts")}
          >
            <div className="flex items-center">
              <FaSave className="text-2xl text-gray-700 mr-6 ml-3" />
              <div className="text-left py-2">
                <h4 className="text-gray-900 font-bold text-sm mb-1">My Drafts</h4>
                <p className="text-gray-600 text-xs">Saved worship lists</p>
              </div>
            </div>
          </div>

          {/* My Requests Card */}
          <div 
            className="bg-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={() => navigate("/requests")}
          >
            <div className="flex items-center">
              <FaCheckCircle className="text-2xl text-gray-700 mr-6 ml-3" />
              <div className="text-left py-2">
                <h4 className="text-gray-900 font-bold text-sm mb-1">My Requests</h4>
                <p className="text-gray-600 text-xs">Track submissions</p>
              </div>
            </div>
          </div>
          
          {/* This Week's Songs Card */}
          <div 
            className="bg-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={() => navigate("/WeeklySongs")}
          >
            <div className="flex items-center ">
              <FaCalendarWeek className="text-2xl text-gray-700 mr-6 ml-3" />
              <div className="text-left py-2">
                <h4 className="text-gray-900 font-bold text-sm mb-1">This Weeks Songs</h4>
                <p className="text-gray-600 text-xs">Access chord sheets for approved lists</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
    </>
  );
};

export default Home;
