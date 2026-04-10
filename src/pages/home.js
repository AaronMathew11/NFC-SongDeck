import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarWeek, FaSave, FaCheckCircle, FaUser, FaQuoteLeft, FaEdit, FaFolder } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { draftService } from "../utils/draftService";
import { canAccessWorshipHeadDashboard } from "../utils/permissions";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [currentVerse, setCurrentVerse] = useState({ text: "", author: "", date: "" });
  const [showVerseEdit, setShowVerseEdit] = useState(false);
  const [newVerse, setNewVerse] = useState("");
  const [sharedResources, setSharedResources] = useState([]);
  
  const getCurrentDate = () => {
    return moment().format('DD MMM');
  };

  const loadCurrentVerse = async () => {
    try {
      const response = await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/verse');
      
      if (response.ok) {
        const data = await response.json();
        setCurrentVerse({
          text: data.verse,
          author: data.setBy?.name || 'Community',
          date: moment(data.setAt).format('MMM DD, YYYY')
        });
      } else {
        console.error('Failed to load verse:', response.statusText);
        // Fallback to default verse
        setCurrentVerse({
          text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
          author: "Admin",
          date: moment().format('MMM DD, YYYY')
        });
      }
    } catch (error) {
      console.error('Error loading verse:', error);
      // Fallback to default verse
      setCurrentVerse({
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        author: "Admin", 
        date: moment().format('MMM DD, YYYY')
      });
    }
  };

  const loadSharedResources = async () => {
    try {
      const response = await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/resources', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSharedResources(data.resources || []);
      } else {
        console.error('Failed to load resources:', response.statusText);
        // Fallback to localStorage
        const saved = localStorage.getItem('sharedResources');
        if (saved) {
          setSharedResources(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading shared resources:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('sharedResources');
      if (saved) {
        setSharedResources(JSON.parse(saved));
      }
    }
  };

  const handleVerseSubmit = async () => {
    if (!newVerse.trim()) return;
    
    try {
      const response = await fetch('https://api-m2ugc4x7ma-uc.a.run.app/api/verse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test'}`
        },
        body: JSON.stringify({
          verse: newVerse.trim(),
          reference: 'Custom verse' // You could add a reference field to the form if needed
        })
      });

      if (response.ok) {
        // Reload the verse from the server to get updated data
        await loadCurrentVerse();
        setNewVerse('');
        setShowVerseEdit(false);
      } else {
        const error = await response.text();
        console.error('Failed to update verse:', error);
        alert('Failed to update verse: ' + error);
      }
    } catch (error) {
      console.error('Error updating verse:', error);
      alert('Error updating verse: ' + error.message);
    }
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

    // Load verse and resources
    loadCurrentVerse();
    loadSharedResources();
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


          {/* Shared Resources Section */}
          {sharedResources.length > 0 && (
            <div 
              className="bg-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={() => navigate("/shared-resources")}
            >
              <div className="flex items-center">
                <FaFolder className="text-2xl text-gray-700 mr-6 ml-3" />
                <div className="text-left py-2">
                  <h4 className="text-gray-900 font-bold text-sm mb-1">Shared Resources</h4>
                  <p className="text-gray-600 text-xs">Access files and documents ({sharedResources.length} items)</p>
                </div>
              </div>
            </div>
          )}
          
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

          {/* Community Verse Section */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <FaQuoteLeft className="text-lg text-gray-600 mr-3" />
                <h4 className="text-gray-900 font-bold text-sm">Community Verse</h4>
              </div>
              <button
                onClick={() => {
                  setNewVerse(currentVerse.text);
                  setShowVerseEdit(true);
                }}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center justify-center"
                title="Edit verse"
              >
                <FaEdit className="text-xs" />
              </button>
            </div>
            
            {!showVerseEdit ? (
              <div>
                <p className="text-gray-800 text-sm italic leading-relaxed mb-3">
                  "{currentVerse.text}"
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>— {currentVerse.author}</span>
                  <span>{currentVerse.date}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={newVerse}
                  onChange={(e) => setNewVerse(e.target.value)}
                  placeholder="Enter an inspiring verse or quote..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="3"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleVerseSubmit}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                  >
                    Update Verse
                  </button>
                  <button
                    onClick={() => {
                      setShowVerseEdit(false);
                      setNewVerse('');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      </div>
    </>
  );
};

export default Home;
