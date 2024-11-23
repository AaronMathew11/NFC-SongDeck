import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect } from 'react';
import moment from 'moment';



const Roster = ({ list, removeVideoFromList }) => {
    const [roster,setRoster] = useState([])
    const [searchQuery,setSearchQuery] = useState('')

    const filteredDays = roster.filter(day => {
        const formattedDate = moment(day.Date, 'Do MMMM YYYY'); // Parse date (e.g., "17th August 2024")
        return (
            formattedDate.isAfter(moment()) && // Filter dates after today
            (
                day.Date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Worship Lead/ PPT"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Acoustic Guitar"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Bass Guitar"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Keyboard"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Drums"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Song Posting"].toLowerCase().includes(searchQuery.toLowerCase()) ||
                day["Back-up Singers"].toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    });
    

    useEffect(() => {
        async function fetchRoster() {
            try {
              const response = await fetch("https://nfcsongdeckbackend-et89zztk.b4a.run/api/getRoster",{method: "get", headers: new Headers({
                "ngrok-skip-browser-warning": "69420",
              }),});
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
          
              const data = await response.json(); // Parse the JSON data
              console.log(data); // Log the roster data
              setRoster(data.data);
            } catch (error) {
              console.error("Error fetching roster:", error.message);
            }
          }
        fetchRoster();
      }, []);
//   console.log(list); // This will log the list, make sure it is passed correctly
  return (
    <div className='bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full'>
      <h1 className='text-2xl font-bold pt-10 pl-10 text-left mb-6'>Roster</h1>
      <div className='px-5'>
      <input
                    type="text"
                    placeholder="Search the Roster..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 p-2  rounded border-2 border-gray-300 w-full"
                />
</div>
      {roster.length === 0 ? (<p className='text-sm text-left ml-10'>Roster is not Up</p>) : <div className='pb-20'>
        {filteredDays.map((day, index) => {
          return (
            <div key={day._id} className='flex flex-col mb-2 mx-10 bg-white rounded py-4 px-3 shadow'>
              <p className='text-left text-lg truncate font-bold'>{day.Date}</p>
              <p className='text-left text-sm truncate mt-3'> <span className='font-semibold'>Lead</span> : {day["Worship Lead/ PPT"]}</p>
              <p className='text-left text-sm truncate mt-1'><span className='font-semibold'>Acoustic</span>  : {day["Acoustic Guitar"]}</p>
              <p className='text-left text-sm truncate mt-1'><span className='font-semibold'>Bass</span>  : {day["Bass Guitar"]}</p>
              <p className='text-left text-sm truncate mt-1'><span className='font-semibold'>Keyboard</span> : {day["Keyboard"]}</p>
              <p className='text-left text-sm truncate mt-1'><span className='font-semibold'>Drums</span> : {day["Drums"]}</p>
              <p className='text-left text-sm truncate mt-1'><span className='font-semibold'>Back up Singers</span> : {day["Back-up Singers"]}</p>
              <p className='text-left text-sm truncate mt-1'><span className='font-semibold'>Song Posting</span> : {day["Song Posting"]}</p>
            </div>
          );
        })}

      </div>
      }
    </div>
  );
};

export default Roster;
