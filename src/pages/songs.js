import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import songImage from '../images/songsImage.png';

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
    <div className='bg-white h-screen w-full'>
      <h1 className='text-2xl font-bold pt-10 pl-10 text-left '>This Weeks Songs</h1>
      <p class="text-xs mt-2 text-left mb-6 pl-10">View Chords for the songs for the coming Sunday !</p>
      <img src={songImage} className='mt-6'/>
      <div className='bg-white rounded  mt-2 py-10 mx-3'>

      {songs.map((song, index)=>(
        <div className='text-left px-10 flex justify-between items-center text-sm truncate mb-3'>{index+1}. {song.songName}
              <button className='bg-black px-4 py-2 rounded text-left text-white' onClick={()=> openLink(song.link)}>Chords</button>
</div>
        
      ))}
      </div>
    </div>
  );
};

export default Songs;
