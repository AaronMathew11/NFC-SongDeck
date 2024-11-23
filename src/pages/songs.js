import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Songs = () => {

    const [songs,setSongs] = useState([])

        const openLink = (link) => {
          window.open(link, "_blank"); // Opens the link in a new tab
        };

        useEffect(() => {
            async function fetchSongs() {
                try {
                  const response = await fetch("https://nfcsongdeckbackend-et89zztk.b4a.run/api/getSongs",{method: "get", headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                  }),});
                  
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
              
                  const data = await response.json(); // Parse the JSON data
                  console.log(data); // Log the roster data
                  setSongs(data.data);
                } catch (error) {
                  console.error("Error fetching roster:", error.message);
                }
              }
              fetchSongs();
          }, []);


  return (
    <div className='bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full'>
      <h1 className='text-2xl font-bold pt-10 pl-10 text-left mb-6'>This Weeks Songs</h1>
      {songs.map((song, index)=>(
        <div className='text-left px-10 flex justify-between items-center font-semibold truncate mb-3'>{index+1}. {song.songName}
              <button className='bg-white px-4 py-3 rounded text-left' onClick={()=> openLink(song.link)}>Chord Sheet</button>
</div>
        
      ))}
    </div>
  );
};

export default Songs;
