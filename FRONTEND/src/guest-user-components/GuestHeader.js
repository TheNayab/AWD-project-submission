// components/Header.js
"use client"
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { SidebarContext } from "@/context/Sidebarcontext";



const GuestHeader = ({ guestName, title, profileImage }) => {

  
  const { toggleSidebar } = useContext(SidebarContext);

 
  return (
    <header className="bg-white py-[15px] px-[24px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            {/* Hamburger icon (you can replace this with your own icon or styling) */}
            <button 
            onClick={toggleSidebar} 
            
            className={`bg-[#F7F7F7] p-[10px] rounded-[50px]`}>
              <Image
                src="/assets//burger-icon.svg"
                width={28}
                height={26}
                alt=""
              />
            </button>
          </div>

          <div className="ml-4">
            <span className="text-[#2D8AC5] text-[18px] md:text-[24px] md:leading-7 font-black capitalize">{guestName} - {title}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* <div className="flex border border-[#DA1539] py-[9px] px-[24px] rounded-[50px] gap-1">
            <Image
              src="/assets/logout.svg"
              width={16}
              height={16}
              alt="Logout"
            />
            <button className="text-[#DA1539] text-[14px] font-normal leading-4">Logout</button>
          </div> */}

          {/* <div className="bg-[#E3E5E8] rounded-full gap-x-2">
            <Image
              src={profileImage}
              width={46}
              height={46}
              alt="Profile"
              className="rounded-full"
            />
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;



