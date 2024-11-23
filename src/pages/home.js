import React from 'react';
import { useNavigate } from "react-router-dom";
import praiseImage from '../images/praise.jpg';
import worshipImage from '../images/worship.jpg';
import transitionalImage from '../images/transitional.jpg';



const Home = () => {
  const navigate = useNavigate();

  return (<div class="bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full">
        <div class="pt-10 place-items-start ml-10">  <h1 class="text-black text-2xl font-bold">NFC SongDeck</h1>
        <p class="text-xs mt-2">A single place for all things worship</p>
        </div>
<div className='px-7'>
    <div class="flex flex-col place-items-start mt-10 py-4 mb-4 px-8 bg-white shadow rounded-lg" onClick={() => navigate("/PraiseSongs")}>
    <h2 class="text-black mb-4 font-semibold">Praise Songs</h2>
    <div class="flex flex-row">
      <img src={praiseImage} class="rounded-lg h-16 w-16"></img>
    <span class="text-left px-5 text-sm">Praise songs to lead the church in vibrant worship and glorify God’s name!</span>
    </div>
    </div>
      </div>
      <div className='px-7'>
      <div class="flex flex-col place-items-start mt-5 py-4 mb-4 px-8 bg-white shadow rounded-lg" onClick={() => navigate("/TransitionalSongs")}>
    <h2 class="text-black mb-4 font-semibold">Transitional Songs</h2>
    <div class="flex flex-row">
    <img src={transitionalImage} class="rounded-lg h-16 w-16"></img>
    <span class="text-left px-5 text-sm">Songs that bridge the energy of praise and the depth of worship.</span>
    </div>
      </div>
      </div>

      <div className='px-7'>

      <div class="flex flex-col place-items-start mt-5 py-4 mb-4 px-8 bg-white shadow rounded-lg" onClick={() => navigate("/CoreWorship")}>
    <h2 class="text-black mb-4 font-semibold">Core Worship</h2>
    <div class="flex flex-row">
    <img src={worshipImage} class="rounded-lg h-16 w-16"></img>
    <span class="text-left px-5 text-sm">Core worship songs to guide the church into deeper intimacy and reverence for God’s presence</span>
    </div>
      </div>
      </div>
      <div className='mx-8 mt-20'>
      <button className='bg-white px-4 w-full py-3 rounded shadow' onClick={()=> navigate("/WeeklySongs")}>This Weeks Songs</button>
      </div>
  </div>);
};

export default Home;