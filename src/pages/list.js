import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import listImage from '../images/listImage.png';

const List = ({ list, removeVideoFromList }) => {
  const [cachedImage, setCachedImage] = useState(null);

  useEffect(() => {
    const cacheImage = async () => {
      const cachedImage = localStorage.getItem('cachedListImage');
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

      const base64Image = await toBase64(listImage);
      setCachedImage(base64Image);
      localStorage.setItem('cachedListImage', base64Image); // Cache the image permanently
    };

    cacheImage();
  }, []);

  return (
    <div className="bg-white h-screen w-full">
      <h1 className="text-2xl font-bold pt-10 pl-10 text-left">My List</h1>
      <p className="text-xs mt-2 text-left mb-6 pl-10">
        Add items or remove items to your list as required
      </p>

      {/* Render cached image */}
      {cachedImage ? (
        <img src={cachedImage} className="mb-10" alt="List" />
      ) : (
        <p className="text-sm text-left ml-10">Loading image...</p>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-left ml-10">No Videos selected</p>
      ) : (
        <div>
          {list.map((song, index) => (
            <div
              key={song.id}
              className="flex flex-row justify-between items-center mb-3 mx-10"
            >
              <p className="text-left text-sm truncate">
                {index}. {song.title}
              </p>
              <button
                onClick={() => removeVideoFromList(song.youtubeId)}
                className="bg-red-500 text-white px-4 py-1 text-sm rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mx-5 mt-5">
            <Link to="/message-generator">
              <button className="bg-black w-full py-3 rounded-lg text-white font-semibold mt-7 text-sm">
                Proceed to Message Generator
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
