import React, { useState, useEffect } from "react";
import songImage from "../images/songsImage.png";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [cachedImage, setCachedImage] = useState(null);

  const openLink = (link) => {
    window.open(link, "_blank"); // Opens the link in a new tab
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const cacheExpiryTime = 3600 * 1000; // 1 hour in milliseconds
      const cachedData = localStorage.getItem("songs");
      const cachedTimestamp = localStorage.getItem("songsTimestamp");

      const isCacheValid =
        cachedData && cachedTimestamp && Date.now() - cachedTimestamp < cacheExpiryTime;

      if (isCacheValid) {
        setSongs(JSON.parse(cachedData)); // Use cached data
      } else {
        try {
          const response = await fetch("https://nfcsongdeckbackend-et89zztk.b4a.run/api/getSongs", {
            method: "GET",
            headers: new Headers({
              "ngrok-skip-browser-warning": "69420",
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setSongs(data.data);

          // Store the fetched data and current timestamp in localStorage
          localStorage.setItem("songs", JSON.stringify(data.data));
          localStorage.setItem("songsTimestamp", Date.now());
        } catch (error) {
          console.error("Error fetching songs:", error.message);
        }
      }
    };

    const cacheImage = async () => {
      const cachedImage = localStorage.getItem("cachedImage");
      if (cachedImage) {
        setCachedImage(cachedImage); // Use cached image
        return;
      }

      // Convert the image to base64 and store it
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

      const base64Image = await toBase64(songImage);
      setCachedImage(base64Image);
      localStorage.setItem("cachedImage", base64Image); // Cache the image permanently
    };

    fetchSongs();
    cacheImage();
  }, []);

  return (
    <div className="bg-white h-screen w-full">
      <h1 className="text-2xl font-bold pt-10 pl-10 text-left">This Week's Songs</h1>
      <p className="text-xs mt-2 text-left mb-6 pl-10">
        View Chords for the songs for the coming Sunday!
      </p>
      {/* Render cached image */}
      {cachedImage ? <img src={cachedImage} className="mt-6" alt="Songs" /> : <p>Loading image...</p>}
      <div className="bg-white rounded mt-2 py-10 mx-3">
        {songs.map((song, index) => (
          <div
            key={index}
            className="text-left px-10 flex justify-between items-center text-sm truncate mb-3"
          >
            {index + 1}. {song.songName}
            <button
              className="bg-black px-4 py-2 rounded text-left text-white"
              onClick={() => openLink(song.link)}
            >
              Chords
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Songs;
