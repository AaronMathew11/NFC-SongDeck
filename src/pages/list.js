import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaArrowRight, FaFilter, FaPlus, FaCheck, FaPlay } from 'react-icons/fa';
import axios from 'axios';

const List = ({ list, addVideoToList, removeVideoFromList }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tags, setTags] = useState([]);
  const [visibleIframes, setVisibleIframes] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  // Tag legend
  const tagLegend = {
    'PR': 'Praise',
    'JY': 'Joy / Celebration',
    'VT': 'Victory', 
    'TR': 'Trust',
    'FA': 'Faith',
    'GR': 'Grace',
    'SV': 'Salvation / Redemption',
    'PRC': 'Presence of God',
    'WR': 'Worthiness / Adoration',
    'SR': 'Surrender / Devotion',
    'KG': 'Kingship / Majesty',
    'HO': 'Hope / Encouragement',
    'CR': 'Cross / Sacrifice',
    'SP': 'Holy Spirit / Fire / Revival'
  };

  useEffect(() => {
    fetchAllSongs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAllSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api-m2ugc4x7ma-uc.a.run.app/api/getAllMasterSongs');
      const songs = response.data;
      
      setAllSongs(songs);
      setFilteredSongs(songs);
      
      // Extract unique categories, branches, and tags
      const uniqueCategories = [...new Set(songs.map(song => song.category).filter(Boolean))];
      const uniqueBranches = [...new Set(songs.map(song => song.branch).filter(Boolean))];
      const uniqueTags = [...new Set(songs.flatMap(song => song.tags || []).filter(Boolean))];
      
      setCategories(['All', ...uniqueCategories]);
      setBranches(['All', ...uniqueBranches]);
      setTags(['All', ...uniqueTags]);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = () => {
    let filtered = allSongs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.songName && song.songName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(song => song.category === selectedCategory);
    }

    // Filter by branch
    if (selectedBranch !== 'All') {
      filtered = filtered.filter(song => song.branch === selectedBranch);
    }

    // Filter by tag
    if (selectedTag !== 'All') {
      filtered = filtered.filter(song => song.tags && song.tags.includes(selectedTag));
    }

    setFilteredSongs(filtered);
  };

  useEffect(() => {
    filterSongs();
  }, [searchTerm, selectedCategory, selectedBranch, selectedTag, allSongs]);

  const isSongSelected = (song) => {
    return list.some(listSong => listSong.id === (song.id || song._id));
  };

  const handleSongToggle = (song) => {
    const songId = song.id || song._id;
    if (isSongSelected(song)) {
      removeVideoFromList(songId);
    } else {
      // Convert to the format expected by the list
      const formattedSong = {
        id: songId,
        youtubeId: song.youtubeId,
        title: song.songName,
        chordSheet: song.chordSheet || null // Include chord sheet if available
      };
      addVideoToList(formattedSong);
    }
  };

  const toggleIframe = (youtubeId) => {
    setVisibleIframes((prevState) => ({
      ...prevState,
      [youtubeId]: !prevState[youtubeId],
    }));
  };

  return (
    <div className="min-h-screen pb-32 bg-gray-50">
      {/* Dark Header Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-6 pb-4 animate-fade-in">
            <h1 className="text-lg font-bold text-white mb-2">Create Worship List</h1>
            <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
              Browse and select songs for your worship experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Add top spacing for fixed search/filter overlay */}
        <div className={`${showFilters ? 'pt-64' : 'pt-20'} transition-all duration-300`}></div>

        {/* Songs List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <FaMusic className="text-3xl text-gray-400 mx-auto mb-3 animate-pulse" />
              <p className="text-gray-500 text-xs">Loading songs...</p>
            </div>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <FaMusic className="text-3xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-xs mb-2">No songs found</p>
              <p className="text-gray-400 text-xs">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div key={`songs-${filteredSongs.length}-${searchTerm}`} className="space-y-2 mb-24">
            {filteredSongs.map((song, index) => (
              <div 
                key={song.id || song._id || `song-${index}`} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`group relative transition-all duration-200 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md ${
                    isSongSelected(song)
                      ? "border-2 border-green-500" 
                      : "border border-gray-200"
                  }`}
                  onClick={() => toggleIframe(song.youtubeId)}
                >
                  {/* Video iframe */}
                  {visibleIframes[song.youtubeId] && (
                    <div className="pt-4 pb-3 px-4 animate-scale-in">
                      <iframe
                        width="100%"
                        height="180"
                        src={`https://www.youtube.com/embed/${song.youtubeId}`}
                        title={song.songName}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isSongSelected(song)
                          ? "bg-green-500" 
                          : "bg-gray-100"
                      }`}>
                        <FaPlay className={`text-xs ${
                          isSongSelected(song)
                            ? "text-white" 
                            : "text-gray-500"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="font-normal text-xs text-gray-900 leading-relaxed mb-1">
                          {song.songName}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          {song.category && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {song.category}
                            </span>
                          )}
                          {song.branch && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                              {song.branch}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                        isSongSelected(song)
                          ? "bg-green-500 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSongToggle(song);
                      }}
                    >
                      {isSongSelected(song) ? (
                        <FaCheck className="text-xs" />
                      ) : (
                        <FaPlus className="text-xs" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Fixed Search and Filter Overlay */}
      <div 
        className="fixed top-0 left-0 right-0 z-40 bg-gray-50 border-b border-gray-200 transition-all duration-300" 
        style={{ top: isScrolled ? '0px' : '90px' }}
      >
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="space-y-3">
            {/* Search Bar and Filter Button */}
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-xl p-2 shadow-card flex-1">
                <input
                  type="text"
                  placeholder="Search songs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm placeholder-gray-500 border-none outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-card ${
                  selectedCategory !== 'All' || selectedBranch !== 'All' || selectedTag !== 'All' 
                    ? 'bg-blue-500 text-white' 
                    : showFilters 
                      ? 'bg-gray-200 text-gray-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaFilter className="text-sm" />
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="bg-white rounded-xl p-4 shadow-card space-y-4">
                {/* Category Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Branch Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-900"
                  >
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Tags</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-gray-900"
                  >
                    {tags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag === 'All' ? 'All' : `${tag} - ${tagLegend[tag] || tag}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Overlay for Selected Songs */}
      {list.length > 0 && (
        <div className="fixed left-0 right-0 z-50" style={{ bottom: '100px' }}>
          <div className="max-w-md mx-auto px-4">
            <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaMusic className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {list.length} song{list.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-gray-300 text-xs">Ready to create list</p>
                  </div>
                </div>
                
                <Link to="/selected-songs">
                  <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
                    <span>Proceed</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
