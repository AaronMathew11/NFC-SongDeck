import React from 'react';
import { useNavigate } from "react-router-dom";
import praiseImage from '../images/praise.jpg';
import worshipImage from '../images/worship.jpg';
import transitionalImage from '../images/transitional.jpg';
import homeImage from '../images/homeImage.png';



const Home = () => {
  const navigate = useNavigate();

  return (<div class="bg-white">
        <div class="pt-10 place-items-start ml-10">  <h1 class="text-black text-2xl font-bold">NFC SongDeck</h1>
        <p class="text-xs mt-2">A single place for all things worship</p>
        </div>
        <img src={homeImage} className='h-90 mt-8'/>

        {/* <div className='flex flex-row'>
        <div className='flex flex-col bg-white shadow text-black rounded-3xl px-2 py-4'><p>Praise</p></div>
        </div> */}
<div className='px-7 mt-3'>
    <div class="flex flex-col place-items-start  py-4 mb-3 px-8 bg-white shadow rounded-lg" onClick={() => navigate("/PraiseSongs")}>
    <h2 class="text-black mb-3 font-semibold">Praise Songs</h2>
    <div class="flex flex-row">
      {/* <img src={praiseImage} class="rounded-lg h-16 w-16"></img> */}
    <span class="text-left  text-xs">Praise songs to lead the church in glorifying God’s name!</span>
    </div>
    </div>
      </div>
      <div className='px-7'>
      <div class="flex flex-col place-items-start py-4  pb-3 mb-4 px-8 bg-white shadow rounded-lg" onClick={() => navigate("/TransitionalSongs")}>
    <h2 class="text-black mb-3 font-semibold">Transitional Songs</h2>
    <div class="flex flex-row">
    {/* <img src={transitionalImage} class="rounded-lg h-16 w-16"></img> */}
    <span class="text-left  text-xs">Songs that bridge the energy of praise and the depth of worship.</span>
    </div>
      </div>
      </div>

      <div className='px-7'>

      <div class="flex flex-col place-items-start mt-5 py-3 mb-4 px-8 bg-white shadow rounded-lg" onClick={() => navigate("/CoreWorship")}>
    <h2 class="text-black mb-3 font-semibold">Core Worship</h2>
    <div class="flex flex-row">
    {/* <img src={worshipImage} class="rounded-lg h-16 w-16"></img> */}
    <span class="text-left  text-xs">Core worship songs to deepen intimacy and reverence for God.</span>
    </div>
      </div>
      </div> 
      <div className='mx-8 mt-16 mb-20'>
      <button className='bg-black px-4 w-full py-3 rounded-xl shadow text-white font-semibold' onClick={()=> navigate("/WeeklySongs")}>This Weeks Songs</button>
      </div>
  </div>);
};

export default Home;