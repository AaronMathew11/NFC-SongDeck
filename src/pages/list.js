import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMusic, FaArrowRight, FaListUl, FaGripVertical } from 'react-icons/fa';
import listImage from '../images/listImage.png';

const List = ({ list, removeVideoFromList, reorderSongs }) => {
  const [cachedImage, setCachedImage] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const cacheImage = async () => {
      const cachedImage = localStorage.getItem('cachedListImage');
      if (cachedImage) {
        setCachedImage(cachedImage);
        return;
      }

      const toBase64 = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              })
          );

      const base64Image = await toBase64(listImage);
      setCachedImage(base64Image);
      localStorage.setItem('cachedListImage', base64Image);
    };

    cacheImage();
  }, []);

  const handleDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }
    
    const newList = [...list];
    const draggedSong = newList[draggedItem];
    newList.splice(draggedItem, 1);
    newList.splice(dropIndex, 0, draggedSong);
    
    if (reorderSongs) {
      reorderSongs(newList);
    }
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center pt-6 pb-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <h1 className="section-header">My Worship List</h1>
        </div>
        <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
          Curate your perfect worship experience
        </p>
      </div>

      {/* Hero Image */}
      <div className="flex justify-center mb-6 animate-slide-up">
        {cachedImage ? (
          <div className="relative">
            <img 
              src={cachedImage} 
              className="h-32 w-auto rounded-2xl" 
              alt="List" 
            />
          </div>
        ) : (
          <div className="h-32 w-48 bg-white rounded-2xl flex items-center justify-center shadow-card">
            <p className="text-gray-500 text-xs">Loading...</p>
          </div>
        )}
      </div>

      {/* Songs List */}
      {list.length === 0 ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto shadow-card">
            <FaMusic className="text-3xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-xs mb-2">No songs selected yet</p>
            <p className="text-gray-400 text-xs">Browse song categories to build your list</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          <div className="bg-white rounded-xl p-3 mb-4 shadow-card">
            <p className="text-gray-500 text-xs text-center">
              {list.length} song{list.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          
          {list.map((song, index) => (
            <div
              key={song.youtubeId}
              className={`bg-white rounded-xl shadow-card animate-slide-up cursor-move ${
                draggedItem === index ? 'opacity-50' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div 
                    className="text-gray-400 text-sm cursor-move p-1"
                    onMouseDown={handleMouseDown}
                  >
                    <FaGripVertical />
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-normal text-xs text-gray-900 leading-relaxed">
                      {song.title}
                    </h3>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideoFromList(song.youtubeId);
                  }}
                  className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 flex items-center justify-center"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
          
          {/* CTA Button */}
          <div className="mt-12 animate-slide-up">
            <Link to="/message-generator">
              <button className="btn-primary w-full py-3 text-sm font-semibold">
                <div className="flex items-center justify-center space-x-2">
                  <span>Generate Message</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
