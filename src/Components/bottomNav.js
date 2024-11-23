import React from 'react';
import { FaHome, FaList, FaRegEdit } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav class="fixed bottom-0 left-0 w-full h-[60px] bg-[#FDF8FA] flex justify-around items-center border-t border-gray-300 z-1000 no-border">
      <NavLink to="/" className=" flex flex-col  items-center">
        <FaHome className="text-[16px] text-black"/>
        <span className="block mt-1 text-black text-[12px]">Home</span>
      </NavLink>
      <NavLink to="/list" className=" flex flex-col items-center " >
        <FaList className="text-[16px] text-black"/>
        <span className="block mt-1 text-black text-[12px]">List</span>
      </NavLink>
      <NavLink to="/roster" className=" flex flex-col  items-center" >
        <FaRegEdit className="text-[16px] text-black"/>
        <span className="block mt-1 text-black text-[12px]">Roster</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;