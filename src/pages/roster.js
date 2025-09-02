import React, { useState, useEffect } from "react";
import moment from "moment";
import { FaUsers, FaCalendarAlt, FaGuitar, FaSearch, FaMicrophone, FaMusic, FaDrum, FaCopy, FaCheck } from "react-icons/fa";

const Roster = ({ list, removeVideoFromList }) => {
  const [roster, setRoster] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedDays, setCopiedDays] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredDays = roster
    .filter((day) => {
      const formattedDate = moment(day.Date, "Do MMMM YYYY");
      return (
        formattedDate.isAfter(moment()) &&
        (
          day.Date.toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Lead/ Lyrics/ Posting"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Guitar"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Bass"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Keyboard"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Drums"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Supporting Vocals"].toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    })
    .sort((a, b) => {
      const dateA = moment(a.Date, "Do MMMM YYYY");
      const dateB = moment(b.Date, "Do MMMM YYYY");
      
      // Prioritize Sundays first, then sort by date
      const isSundayA = dateA.day() === 0;
      const isSundayB = dateB.day() === 0;
      
      if (isSundayA && !isSundayB) return -1;
      if (!isSundayA && isSundayB) return 1;
      
      return dateA - dateB;
    });

  const fetchRoster = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      const response = await fetch(`https://nfcsongdeckbackend-et89zztk.b4a.run/api/getRoster?page=${page}&limit=10`, {
        method: "GET",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (append) {
        setRoster(prev => [...prev, ...data.data]);
      } else {
        setRoster(data.data);
      }
      
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching roster:", error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRoster(1);
  }, []);

  const loadMore = () => {
    if (currentPage < pagination.pages && !loadingMore) {
      fetchRoster(currentPage + 1, true);
    }
  };

  const getRoleIcon = (role) => {
    const iconClass = "text-sm";
    switch (role.toLowerCase()) {
      case 'lead':
      case 'lead/ lyrics/ posting':
        return <FaMicrophone className={`${iconClass} text-primary-500`} />;
      case 'guitar':
        return <FaGuitar className={`${iconClass} text-accent-500`} />;
      case 'bass':
        return <FaMusic className={`${iconClass} text-blue-500`} />;
      case 'keyboard':
        return <FaMusic className={`${iconClass} text-purple-500`} />;
      case 'drums':
        return <FaDrum className={`${iconClass} text-red-500`} />;
      case 'supporting vocals':
        return <FaUsers className={`${iconClass} text-pink-500`} />;
      default:
        return <FaMusic className={`${iconClass} text-navy-500`} />;
    }
  };

  const copyRosterToClipboard = (day) => {
    let rosterText = `Worship Team Roster - ${day.Date}\n\n`;
    
    const roles = [
      { label: "Lead", value: day["Lead/ Lyrics/ Posting"] },
      { label: "Guitar", value: day["Guitar"] },
      { label: "Bass", value: day["Bass"] },
      { label: "Keys", value: day["Keyboard"] },
      { label: "Drums", value: day["Drums"] },
      { label: "Vocals", value: day["Supporting Vocals"] }
    ];
    
    roles.forEach(role => {
      rosterText += `${role.label}: ${role.value || "TBD"}\n`;
    });
    
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rosterText).then(() => {
        setCopiedDays({ ...copiedDays, [day._id]: true });
        setTimeout(() => {
          setCopiedDays(prev => ({ ...prev, [day._id]: false }));
        }, 2000);
      });
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">Team Roster</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              View worship team assignments and schedules
            </p>
          </div>

          {/* Search Bar */}
          <div className="pb-6 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search roster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {loading ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-card">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full mx-auto animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading roster...</p>
          </div>
        </div>
      ) : roster.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-card">
            <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Roster not available</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {filteredDays.map((day, index) => (
            <div
              key={day._id}
              className="bg-white rounded-xl shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Date Header with Copy Button */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900">{day.Date}</h3>
                <button
                  onClick={() => copyRosterToClipboard(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                    copiedDays[day._id]
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {copiedDays[day._id] ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              {/* Team Members - Better spaced layout */}
              <div className="px-4 py-6">
                <div className="space-y-4">
                  {[
                    { label: "Lead", value: day["Lead/ Lyrics/ Posting"], key: "lead", color: "bg-gray-900 text-white" },
                    { label: "Guitar", value: day["Guitar"], key: "guitar", color: "bg-gray-100 text-gray-700" },
                    { label: "Bass", value: day["Bass"], key: "bass", color: "bg-gray-100 text-gray-700" },
                    { label: "Keys", value: day["Keyboard"], key: "keyboard", color: "bg-gray-100 text-gray-700" },
                    { label: "Drums", value: day["Drums"], key: "drums", color: "bg-gray-100 text-gray-700" },
                    { label: "Vocals", value: day["Supporting Vocals"], key: "supporting vocals", color: "bg-gray-100 text-gray-700" }
                  ].map((role, roleIndex) => (
                    <div key={role.key} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {role.value ? role.value.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1 mx-4">
                          {role.value || "TBD"}
                        </p>

                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.label}
                        </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Load More Button */}
          {pagination.pages > currentPage && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={`bg-gray-900 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
              >
                {loadingMore ? 'Loading...' : `Load More (${pagination.total - roster.length} remaining)`}
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Roster;
