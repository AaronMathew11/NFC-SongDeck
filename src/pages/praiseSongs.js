import React, { useState, useEffect } from 'react';
import VideoList from '../Components/videoList';
import axios from 'axios';

const PraiseSongs = ({addVideoToList, removeVideoFromList, selectedVideos}) => {
  const [praiseSongs, setPraiseSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPraiseSongs = async () => {
      try {
        const response = await axios.get('https://us-central1-nfc-worship-app.cloudfunctions.net/api/api/getSongsByCategory/Praise');
        setPraiseSongs(response.data.map(song => ({
          title: song.songName,
          youtubeId: song.youtubeId
        })));
      } catch (error) {
        console.error('Error fetching praise songs:', error);
        setPraiseSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPraiseSongs();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading praise songs...</div>;
  }
  return (
    <VideoList 
      videos={praiseSongs} 
      title="Praise Songs" 
      subtitle="Uplifting songs to glorify God's name" 
      addVideoToList={addVideoToList} 
      removeVideoFromList={removeVideoFromList}
      selectedVideos={selectedVideos}
    />
  )
};

export default PraiseSongs;