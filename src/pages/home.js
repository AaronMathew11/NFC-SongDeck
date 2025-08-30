import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaHeart, FaStar, FaCalendarWeek } from "react-icons/fa";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  
  const getCurrentDate = () => {
    return moment().format('DD MMM');
  };
  
  const getNextSunday = () => {
    const today = moment();
    const nextSunday = today.clone().day(7);
    if (today.day() === 0) {
      nextSunday.add(7, 'days');
    }
    return nextSunday.format('DD MMM');
  };
  
  const getDaysUntilSunday = () => {
    const today = moment();
    const nextSunday = today.clone().day(7);
    if (today.day() === 0) {
      nextSunday.add(7, 'days');
    }
    const daysLeft = nextSunday.diff(today, 'days');
    return daysLeft;
  };

  const songCategories = [
    {
      title: "Praise Songs",
      subtitle: "50+ songs",
      description: "Uplifting songs to glorify God's name",
      icon: <FaMusic className="text-2xl text-white" />,
      route: "/PraiseSongs",
      bgColor: "bg-gray-900",
      textColor: "text-white"
    },
    {
      title: "Transitional Songs", 
      subtitle: "40+ songs",
      description: "Bridge between praise and worship",
      icon: <FaStar className="text-2xl text-white" />,
      route: "/TransitionalSongs",
      bgColor: "bg-gray-900",
      textColor: "text-white"
    },
    {
      title: "Core Worship",
      subtitle: "60+ songs",
      description: "Intimate songs for deeper reverence",
      icon: <FaHeart className="text-2xl text-white" />,
      route: "/CoreWorship", 
      bgColor: "bg-gray-900",
      textColor: "text-white"
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">Hello, Worship Team</h1>
            <p className="text-gray-500 text-xs mt-2">Today {getCurrentDate()}</p>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <FaMusic className="text-gray-600 text-lg" />
          </div>
        </div>
      </div>

      {/* Daily Challenge Card - Featured Card */}
      <div className="mb-8">
        <div className="bg-accent-yellow rounded-3xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Weekly Planning</h2>
            <p className="text-gray-700 text-xs mb-4">Next Sunday {getNextSunday()} • {getDaysUntilSunday()} days left</p>
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center">
                  <FaMusic className="text-white text-xs" />
                </div>
                <div className="w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                  <FaHeart className="text-white text-xs" />
                </div>
                <div className="w-8 h-8 bg-accent-green rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
            </div>
          </div>
          <div className="absolute right-4 top-4 opacity-20">
            <FaCalendarWeek className="text-6xl text-gray-800" />
          </div>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="mb-8">
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

      {/* Your Plan Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your worship plan</h3>
        <div className="grid grid-cols-2 gap-3">
          {songCategories.map((category, index) => (
            <div
              key={category.title}
              className={`${category.bgColor} rounded-2xl p-6 cursor-pointer`}
              onClick={() => navigate(category.route)}
            >
              <div className="flex items-start justify-between mb-3">
                {category.icon}
                <span className="text-white text-xs font-medium">{category.subtitle}</span>
              </div>
              <h4 className="text-white font-bold text-xs mb-1">{category.title}</h4>
              <p className="text-white/80 text-xs">{category.description}</p>
            </div>
          ))}
          
          {/* This Week's Songs Card */}
          <div 
            className="bg-gray-200 rounded-2xl p-4 cursor-pointer"
            onClick={() => navigate("/WeeklySongs")}
          >
            <div className="flex items-start justify-between mb-3">
              <FaCalendarWeek className="text-2xl text-gray-700" />
              <span className="text-gray-700 text-xs font-medium">This week</span>
            </div>
            <h4 className="text-gray-900 font-bold text-xs mb-1">Weekly Songs</h4>
            <p className="text-gray-600 text-xs">Access chord sheets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
