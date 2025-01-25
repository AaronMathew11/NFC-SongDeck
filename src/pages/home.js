import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../images/homeImage.png";

const Home = () => {
  const [cachedImage, setCachedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cacheImage = async () => {
      const cachedImage = localStorage.getItem("cachedHomeImage");
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

      const base64Image = await toBase64(homeImage);
      setCachedImage(base64Image);
      localStorage.setItem("cachedHomeImage", base64Image); // Cache the image permanently
    };

    cacheImage();
  }, []);

  return (
    <div className="bg-white">
      <div className="pt-8 place-items-start ml-10">
        <h1 className="text-black text-2xl font-bold">NFC SongDeck</h1>
        <p className="text-xs mt-2">A single place for all things worship</p>
      </div>

      {/* Render cached image */}
      {cachedImage ? (
        <img src={cachedImage} className="h-90 mt-8" alt="Home" />
      ) : (
        <p className="text-sm ml-10">Loading image...</p>
      )}

      <div className="px-7 mt-3">
        <div
          className="flex flex-col place-items-start py-4 mb-3 px-8 bg-white shadow rounded-lg"
          onClick={() => navigate("/PraiseSongs")}
        >
          <h2 className="text-black mb-3 font-bold">Praise Songs</h2>
          <div className="flex flex-row">
            <span className="text-left text-xs">
              Praise songs to lead the church in glorifying God’s name!
            </span>
          </div>
        </div>
      </div>
      <div className="px-7">
        <div
          className="flex flex-col place-items-start py-4 pb-3 mb-4 px-8 bg-white shadow rounded-lg"
          onClick={() => navigate("/TransitionalSongs")}
        >
          <h2 className="text-black mb-3 font-bold">Transitional Songs</h2>
          <div className="flex flex-row">
            <span className="text-left text-xs">
              Songs that bridge the energy of praise and the depth of worship.
            </span>
          </div>
        </div>
      </div>

      <div className="px-7">
        <div
          className="flex flex-col place-items-start mt-5 py-3 mb-4 px-8 bg-white shadow rounded-lg"
          onClick={() => navigate("/CoreWorship")}
        >
          <h2 className="text-black mb-3 font-bold">Core Worship</h2>
          <div className="flex flex-row">
            <span className="text-left text-xs">
              Core worship songs to deepen intimacy and reverence for God.
            </span>
          </div>
        </div>
      </div>
      <div className="mx-8 mt-16 mb-20">
        <button
          className="bg-black px-4 w-full py-3 rounded-xl shadow text-white font-semibold"
          onClick={() => navigate("/WeeklySongs")}
        >
          This Week's Songs
        </button>
      </div>
    </div>
  );
};

export default Home;
