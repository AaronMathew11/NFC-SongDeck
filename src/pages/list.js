import React from 'react';
import { Link } from 'react-router-dom';
import listImage from '../images/listImage.png';


const List = ({ list, removeVideoFromList }) => {
  console.log(list); // This will log the list, make sure it is passed correctly
  return (
    <div className='bg-white h-screen w-full'>
      <h1 className='text-2xl font-bold pt-10 pl-10 text-left '>My List</h1>
      <p class="text-xs mt-2 text-left mb-6 pl-10">Add items or remove items to your list as required</p>

      <img src={listImage} className='mb-10' />

      {list.length === 0 ? (<p className='text-sm text-left ml-10'>No Videos selected</p>) : <div>
        {list.map((song, index) => {
          return (
            <div key={song.id} className='flex flex-row justify-between items-center mb-3 mx-10'>
              <p className='text-left text-sm truncate'>{index}. {song.title}</p>
              <button
                onClick={() => removeVideoFromList(song.youtubeId)}
                className="bg-red-500 text-white px-4 py-1 text-sm rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          );
        })}
        <div className='mx-5 mt-5'>
          <Link to="/message-generator">
            <button className='bg-black w-full py-3 rounded-lg text-white font-semibold mt-7 text-sm '>Proceed to Message Generator</button>
          </Link>
        </div>
      </div>
      }
    </div>
  );
};

export default List;
