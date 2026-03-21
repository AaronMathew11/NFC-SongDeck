import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMusic, FaSave, FaPaperPlane, FaGripVertical, FaCalendarAlt, FaCopy, FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import listImage from '../images/listImage.png';
import { draftService } from '../utils/draftService';

const SelectedSongs = ({ list, removeVideoFromList, reorderSongs, addVideoToList }) => {
  const [cachedImage, setCachedImage] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [worshipDate, setWorshipDate] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [theme, setTheme] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [message, setMessage] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showAddCustomSong, setShowAddCustomSong] = useState(false);
  const [customSongName, setCustomSongName] = useState('');
  const [customYoutubeLink, setCustomYoutubeLink] = useState('');
  const [customChordSheet, setCustomChordSheet] = useState('');
  const navigate = useNavigate();

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
    
    // Set default date to next Sunday
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()));
    setWorshipDate(nextSunday.toISOString().split('T')[0]);
  }, []);
  
  useEffect(() => {
    if (theme && book && chapter && verse) {
      generateMessage();
    }
  }, [theme, book, chapter, verse, list, worshipDate, playlistName]);

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

  const fetchBibleVerses = async () => {
    if (!book || !chapter || !verse) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book.toLowerCase()}/chapters/${chapter}/verses/${verse}.json`);
      const data = await response.json();
      setBibleVerse(data.text);
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      setBibleVerse('Could not fetch verse. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMessage = () => {
    const formattedDate = worshipDate ? new Date(worshipDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'this week';

    let generatedMessage = `Hi Team,\nPlease find the worship set for ${formattedDate}:\n\n`;
    generatedMessage += `Theme: ${theme}\n`;
    generatedMessage += `Key verse: ${book} ${chapter}:${verse}\n\n`;

    list.forEach((song, index) => {
      generatedMessage += `${index + 1}- ${song.title}\n`;
    });

    if (playlistName) {
      generatedMessage += `\nPlaylist: ${playlistName}`;
    }

    setMessage(generatedMessage);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && message) {
      navigator.clipboard.writeText(message).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handleSaveDraft = () => {
    if (!playlistName.trim()) {
      setSaveStatus('Please enter a playlist name');
      return;
    }

    if (!theme.trim()) {
      setSaveStatus('Please enter a worship theme');
      return;
    }

    if (!book.trim() || !chapter.trim() || !verse.trim()) {
      setSaveStatus('Please enter a complete scripture reference (book, chapter, and verse)');
      return;
    }

    try {
      const scriptureRef = book && chapter && verse ? `${book} ${chapter}:${verse}` : '';
      draftService.saveDraft(
        playlistName.trim(),
        list,
        theme,
        scriptureRef,
        message,
        worshipDate,
        playlistName
      );
      
      setSaveStatus('Draft saved successfully!');
      setShowSaveDialog(false);
      setTimeout(() => {
        setSaveStatus('');
        navigate('/drafts');
      }, 1000);
    } catch (error) {
      setSaveStatus('Error saving draft');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleRequestPublish = async () => {
    if (!playlistName.trim()) {
      setSaveStatus('Please enter a playlist name');
      return;
    }

    if (!theme.trim()) {
      setSaveStatus('Please enter a worship theme');
      return;
    }

    if (!book.trim() || !chapter.trim() || !verse.trim()) {
      setSaveStatus('Please enter a complete scripture reference (book, chapter, and verse)');
      return;
    }

    try {
      const scriptureRef = book && chapter && verse ? `${book} ${chapter}:${verse}` : '';
      const draft = draftService.saveDraft(
        playlistName.trim(),
        list,
        theme,
        scriptureRef,
        message,
        worshipDate,
        playlistName
      );
      
      await draftService.requestPublish(draft, message);
      
      setSaveStatus('Publish request sent to worship head!');
      setShowPublishDialog(false);
      setTimeout(() => {
        setSaveStatus('');
        navigate('/requests');
      }, 2000);
    } catch (error) {
      setSaveStatus('Error sending publish request');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleAddCustomSong = () => {
    if (!customSongName.trim()) {
      setSaveStatus('Please enter a song name');
      return;
    }

    if (!customYoutubeLink.trim()) {
      setSaveStatus('Please enter a YouTube link');
      return;
    }

    if (!customChordSheet.trim()) {
      setSaveStatus('Please enter a chord sheet link');
      return;
    }

    const youtubeId = extractYouTubeId(customYoutubeLink.trim());
    if (!youtubeId) {
      setSaveStatus('Please enter a valid YouTube link');
      return;
    }

    // Check if song with this YouTube ID already exists
    const existingSong = list.find(song => song.youtubeId === youtubeId);
    if (existingSong) {
      setSaveStatus('This song is already in your list');
      return;
    }

    // Create custom song object
    const customSong = {
      id: `custom-${Date.now()}`, // Generate unique ID
      youtubeId: youtubeId,
      title: customSongName.trim(),
      chordSheet: customChordSheet.trim(),
      isCustom: true
    };

    // Add to list using the parent component's function
    if (addVideoToList) {
      addVideoToList(customSong);
    }

    // Reset form
    setCustomSongName('');
    setCustomYoutubeLink('');
    setCustomChordSheet('');
    setShowAddCustomSong(false);
    setSaveStatus('Custom song added successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">My Worship List</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Curate your perfect worship experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">

      {/* Hero Image */}
      <div className="flex justify-center mb-6 animate-slide-up pt-6">
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
            <p className="text-gray-400 text-xs">Browse songs to build your list</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {/* Songs Count */}
          <div className="bg-white rounded-xl p-3 shadow-card">
            <p className="text-gray-500 text-xs text-center">
              {list.length} song{list.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Worship Details Form */}
          <div className="space-y-4">
            {/* Date Selection */}
            <div className="bg-white rounded-xl shadow-card p-4">
              <h3 className="font-medium text-sm text-gray-900 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2" />
                Worship Date
              </h3>
              <input
                type="date"
                value={worshipDate}
                onChange={(e) => setWorshipDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
              />
            </div>

            {/* Playlist Name */}
            <div className="bg-white rounded-xl shadow-card p-4">
              <h3 className="font-medium text-sm text-gray-900 mb-3">Playlist Name *</h3>
              <input
                type="text"
                placeholder="Enter playlist name..."
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
              />
            </div>

            {/* Theme */}
            <div className="bg-white rounded-xl shadow-card p-4">
              <h3 className="font-medium text-sm text-gray-900 mb-3">Worship Theme *</h3>
              <input
                type="text"
                placeholder="Enter worship theme..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
              />
            </div>

            {/* Scripture Reference */}
            <div className="bg-white rounded-xl shadow-card p-4">
              <h3 className="font-medium text-sm text-gray-900 mb-3">Key Verse *</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Book"
                  value={book}
                  onChange={(e) => setBook(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                />
                <input
                  type="text"
                  placeholder="Chapter"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                />
                <input
                  type="text"
                  placeholder="Verse"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>
          
          {/* Songs List */}
          <div className="space-y-2">
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
                      {song.isCustom && (
                        <p className="text-xs text-blue-600">Custom Song</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVideoFromList(song.id || song.youtubeId);
                    }}
                    className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 flex items-center justify-center"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Song Button */}
          <div className="mt-4">
            <button
              onClick={() => setShowAddCustomSong(true)}
              className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl py-4 px-4 text-gray-600 hover:text-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <FaPlus className="text-sm" />
              <span className="text-sm font-medium">Add Custom Song</span>
            </button>
          </div>

          {/* Status Message */}
          {saveStatus && (
            <div className={`p-3 rounded-xl text-center text-sm ${
              saveStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            } animate-fade-in`}>
              {saveStatus}
            </div>
          )}


          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaSave />
              <span>Save Draft</span>
            </button>
            
            <button
              onClick={() => setShowPublishDialog(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaPaperPlane />
              <span>Submit</span>
            </button>
          </div>
        </div>
      )}

      {/* Save Draft Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Save as Draft</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Request Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Submit for Approval</h3>
            <p className="text-gray-600 text-sm mb-4">This will send your worship list to the worship head for approval.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPublishDialog(false);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPublish}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Song Dialog */}
      {showAddCustomSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900">Add Custom Song</h3>
              <button
                onClick={() => {
                  setShowAddCustomSong(false);
                  setCustomSongName('');
                  setCustomYoutubeLink('');
                  setCustomChordSheet('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Song Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Song Name *</label>
                <input
                  type="text"
                  placeholder="Enter song name..."
                  value={customSongName}
                  onChange={(e) => setCustomSongName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                  autoFocus
                />
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Link *</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customYoutubeLink}
                  onChange={(e) => setCustomYoutubeLink(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                />
              </div>

              {/* Chord Sheet Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chord Sheet Link *</label>
                <input
                  type="url"
                  placeholder="https://example.com/chord-sheet"
                  value={customChordSheet}
                  onChange={(e) => setCustomChordSheet(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddCustomSong(false);
                  setCustomSongName('');
                  setCustomYoutubeLink('');
                  setCustomChordSheet('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomSong}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Add Song
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SelectedSongs;