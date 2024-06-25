


"use client"
// components/ChatHeader.js
import React, { useState } from "react";
import Image from "next/image";

const ChatHeader = ({generateWebChatLink, selectedContact, selectedChats, handleMergeChats, openModal }) => {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  const toggleActionsDropdown = () => {
    setShowActionsDropdown(!showActionsDropdown);
  };

  

  // return (
  //   <div className="flex justify-between items-center">
  //     <h1 className="text-[#343233] text-[24px] font-bold md:leading-7 mb-4 md:mb-0">
  //       Text Chats
  //     </h1>
  //     <div className="flex flex-col md:flex-row gap-2">
  //       {/* Only show "Actions" button on small screens */}
  //       <div className="md:hidden relative">
  //         <button
  //           className="bg-[#2D8AC5] py-[6px] px-[16px] rounded-[50px] text-white font-normal md:leading-4 text-[14px] mb-2 md:mb-0"
  //           onClick={toggleActionsDropdown}
  //         >
  //           Actions
  //         </button>
  //         {showActionsDropdown && (
  //           <div className="absolute top-[40px] right-0 bg-white border border-gray-200 rounded-md p-2 w-[230px] shadow-md">
  //             <button
  //               className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100"
  //               onClick={handleMergeChats}
  //             >
  //               Merge Selected Chats
  //             </button>
  //             <button
  //               className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100"
  //               onClick={generateWebChatLink}
  //             >
  //               Generate Web Chat Link
  //             </button>
  //             <button
  //               className="block rounded-[50px] w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100"
  //               onClick={openModal}
  //             >
  //               + New Chat
  //             </button>
  //           </div>
  //         )}
  //       </div>

  //       {/* Hide these buttons on small screens */}
  //       <button
  //         className="hidden md:block py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0"
  //         onClick={handleMergeChats}
  //       >
  //         Merge Selected Chats
  //       </button>
  //       <button
  //         className="hidden md:block bg-white py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-[#2D8AC5] border border-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0"
  //         onClick={generateWebChatLink}
  //       >
  //         Generate Web Chat Link
  //       </button>
        
  //       <button
  //         className="hidden md:block bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-white font-normal md:leading-4 text-[14px]"
  //         onClick={openModal}
  //       >
  //         + New Chat
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default ChatHeader;

