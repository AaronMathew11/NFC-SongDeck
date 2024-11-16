import React from 'react';
import { Link } from 'react-router-dom';

const List = ({ list, removeVideoFromList }) => {
  console.log(list); // This will log the list, make sure it is passed correctly
  return (
    <div className='bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full'>
      <h1 className='text-2xl font-bold pt-10 pl-10 text-left mb-6'>My List</h1>

      {list.length === 0 ? (<p className='text-sm text-left ml-10'>No Videos selected</p>) : <div>
        {list.map((song, index) => {
          return (
            <div key={song.id} className='flex flex-row justify-between items-center mb-2 mx-10'>
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
        <div className='mx-5'>
          <Link to="/message-generator">
            <button className='bg-white w-full py-3 rounded-lg text-black font-semibold mt-7 text-sm '>Proceed to Message Generator</button>
          </Link>
        </div>
      </div>
      }
    </div>
  );
};

export default List;
