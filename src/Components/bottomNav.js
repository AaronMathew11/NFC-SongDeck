import React from 'react';
import { FaHome, FaList, FaExchangeAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav class="fixed bottom-0 left-0 w-full h-[60px] bg-[#FDF8FA] flex justify-around items-center border-t border-gray-300 z-1000 no-border">
      <NavLink to="/" class=" flex flex-col  items-center justify-center">
        <FaHome class="text-[16px] text-black"/>
        <span class="block mt-1 text-black text-[12px]">Home</span>
      </NavLink>
      <NavLink to="/list" class=" flex flex-col tems-center justify-center" >
        <FaList class="text-[16px] text-black"/>
        <span class="block mt-1 text-black text-[12px]">List</span>
      </NavLink>
      <NavLink to="/recomend" class=" flex flex-col  items-center justify-center" >
        <FaExchangeAlt class="text-[16px] text-black"/>
        <span class="block mt-1 text-black text-[12px]">recommend</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;