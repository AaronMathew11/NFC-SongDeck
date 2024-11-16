import React from 'react';
import { useNavigate } from "react-router-dom";
import praiseImage from '../images/praise.jpg';
import worshipImage from '../images/worship.jpg';



const Home = () => {
  const navigate = useNavigate();

  return (<div class="bg-gradient-to-b from-[#DDD5F5] to-[#FFFFFF] h-screen w-full">
        <div class="pt-10 place-items-start ml-10">  <h1 class="text-black text-2xl font-bold">NFC SongDeck</h1>
        <p class="text-xs mt-2">A single place for all things worship</p>
        </div>

    <div class="flex flex-col place-items-start py-10 px-10">
    <h2 class="text-black mb-4 text-lg font-semibold">Praise Songs</h2>
    <div class="flex flex-row">
      <img src={praiseImage} class="rounded-lg h-20 w-20"></img>
    <span class="text-left px-5 text-sm">Praise songs to lead the church in vibrant worship and glorify God’s name!</span>
    </div>
    <button  onClick={() => navigate("/PraiseSongs")} class="bg-white w-full py-3 rounded-lg text-black font-semibold mt-7 text-sm">
        Go to Songs
      </button>
      </div>
      <div class="flex flex-col place-items-start pb-10 px-10">
    <h2 class="text-black mb-4 text-lg font-semibold">Core Worship</h2>
    <div class="flex flex-row">
    <img src={worshipImage} class="rounded-lg h-20 w-20"></img>
    <span class="text-left px-5 text-sm">Core worship songs to guide the church into deeper intimacy and reverence for God’s presence</span>
    </div>
    <button  onClick={() => navigate("/CoreWorship")} class="bg-white w-full py-3 rounded-lg text-black font-semibold mt-7 text-sm border-black">
        Go to Songs
      </button>
      </div>

  </div>);
};

export default Home;