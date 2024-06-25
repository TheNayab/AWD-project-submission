// // components/ChatHeader.js
// 'use client'
// import React from "react";
// import Image from "next/image";

// const ChatHeader = ({ selectedContact,selectedChats, handleMergeChats, openModal }) => {
//   return (
//     <div className="flex justify-between">
//       <h1 className="text-[#343233] text-[18px] md:text-[24px] font-bold md:leading-7">
//         Text Chats
//       </h1>
//       <div className="flex gap-2">
//         <button
//           className=" py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px]"
//           onClick={handleMergeChats}

//         >
//           Merge Selected Chats
//         </button>
//         <button className="bg-white py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-[#2D8AC5] border border-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px]">
//           Generate web Chat Link
//         </button>
//         <button
//           className="bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] gap-1 rounded-[50px] text-white font-normal md:leading-4 text-[14px]"
//           onClick={openModal}
//         >
//           + New Chat
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

// // components/ChatHeader.js
// import React from "react";
// import Image from "next/image";

// const ChatHeader = ({ selectedContact, selectedChats, handleMergeChats, openModal }) => {
//   return (
//     <div className="flex flex-col md:flex-row justify-between items-center">
//       <h1 className="text-[#343233] text-[24px] font-bold md:leading-7 mb-4 md:mb-0">
//         Text Chats
//       </h1>
//       <div className="flex flex-col md:flex-row gap-2">
//         <button
//           className="py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0"
//           onClick={handleMergeChats}
//         >
//           Merge Selected Chats
//         </button>
//         <button className="bg-white py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-[#2D8AC5] border border-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0">
//           Generate Web Chat Link
//         </button>
//         <button
//           className="bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-white font-normal md:leading-4 text-[14px]"
//           onClick={openModal}
//         >
//           + New Chat
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

"use client";
// components/ChatHeader.js
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import styles from "./company.module.css";

const ChatHeader = ({
  mergeName,
  setMergeName,
  openMergeModal,
  closeMergeModal,
  loggedInUserId,
  handleMergeSubmit,
  showMergeModal,
  mergeError,
  generateWebChatLink,
  selectedContact,
  selectedChats,
  handleMergeChats,
  openModal,
  mode,
  setMode,
}) => {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);


  const toggleMode = (newMode) => {
    setMode(newMode);
  };
  const handleGenerateButtonClick = () => {
    generateWebChatLink();
  };

  const toggleActionsDropdown = () => {
    setShowActionsDropdown(!showActionsDropdown);
  };

  // const toggleMode = (newMode) => {
  //   setMode(newMode);
  // };

  // get current mode either manual or auto

  // useEffect(() => {
  //   // Fetch current mode from the API on component mount
  //   const fetchCurrentMode = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/company/get-current-mode`, {
  //         params: {
  //           companyId: loggedInUserId,
  //         },
  //       });
  //       setMode(response.data.mode);
  //     } catch (error) {
  //       console.error("Error fetching current mode:", error);
  //     }
  //   };

  //   fetchCurrentMode();
  // }, [ loggedInUserId, setMode]);



  // const toggleMode = (newMode) => {
  //   setMode(newMode);

  // };

  // const toggleMode = async (newMode) => {
  //   // setMode(newMode);
  //   try {
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/company/toggle-auto-manual-tab`, {
  //       companyId: loggedInUserId, 
  //       mode: newMode,
  //     });
  //     setMode(newMode);
  //     console.log("Mode updated successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error updating mode:", error);
  //   }
  // };



  return (
    <>
      <div className={`${styles.hedr} flex justify-between items-center`}>
        <h1
          className={`${styles.uprtxt} text-[#343233] text-[24px] font-bold md:leading-7 mb-4 md:mb-0`}
        >
          Text Chats
        </h1>
        <div className=" flex  md:flex-row gap-1" style={{ height: "37px" }}>
          <button
            className={`${
              styles.allbtn
            } py-[6px] px-[16px] rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0 ${
              mode === "all"
                ? "bg-[#2D8AC5] text-white"
                : "bg-white border border-[#2D8AC5] text-[#2D8AC5]"
            }`}
            onClick={() => toggleMode("all")}
          >
            All
          </button>
          <button
            className={`${
              styles.manualbtn
            } py-[6px] px-[16px] rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0 ${
              mode === "manual"
                ? "bg-[#2D8AC5] text-white"
                : "bg-white border border-[#2D8AC5] text-[#2D8AC5]"
            }`}
            onClick={() => toggleMode("manual")}
          >
            Manual
          </button>
          {/* Auto Mode Tab */}
          <button
            className={` ${
              styles.allbtn
            } py-[6px] px-[16px] rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0 ${
              mode === "auto"
                ? "bg-[#2D8AC5] text-white"
                : "bg-white border border-[#2D8AC5] text-[#2D8AC5]"
            }`}
            onClick={() => toggleMode("auto")}
          >
            Auto
          </button>
          {/* Only show "Actions" button on small screens */}
          <div className="md:hidden relative">
            <button
              className="bg-[#2D8AC5] py-[6px] px-[16px] rounded-[50px] text-white font-normal md:leading-4 text-[14px] mb-2 md:mb-0"
              onClick={toggleActionsDropdown}
            >
              Actions
            </button>
            {showActionsDropdown && (
              <div className="absolute top-[40px] right-0 bg-white border border-gray-200 rounded-md p-2 w-[230px] shadow-md">
                <button
                  className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100"
                  onClick={handleMergeChats}
                >
                  Merge Selected Chats
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100"
                  onClick={handleGenerateButtonClick}
                >
                  Generate Web Chat Link
                </button>
                <button
                  className="block rounded-[50px] w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100"
                  onClick={openModal}
                >
                  + New Chat
                </button>
              </div>
            )}
          </div>

          {/* Hide these buttons on small screens */}
          <button
            className={` ${styles.mergedchatlink} hidden md:block py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0`}
            onClick={openMergeModal}
          >
            Merge Selected Chats
          </button>
          <button
            className={`${styles.genbtnlink} hidden md:block bg-white py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-[#2D8AC5] border border-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal md:leading-4 text-[14px] mb-2 md:mb-0`}
            onClick={generateWebChatLink}
          >
            Generate Web Chat Link
          </button>
          <button
            className={`${styles.newchat} hidden md:block bg-[#2D8AC5] py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] text-white font-normal md:leading-4 text-[14px]`}
            onClick={openModal}
          >
            + New Chat
          </button>
        </div>
      </div>

      {showMergeModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Merge Chats</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter merge name"
              value={mergeName}
              onChange={(e) => setMergeName(e.target.value)}
            />
            {mergeError && <p className="modal-error">{mergeError}</p>}
            <div className="modal-buttons">
              <button
                className="modal-button modal-cancel"
                onClick={closeMergeModal}
              >
                Cancel
              </button>
              <button
                className="modal-button modal-merge"
                onClick={handleMergeChats}
              >
                Merge
              </button>
            </div>
          </div>
        </div>
      )}
    </>

    // merge chat modal
  );
};

export default ChatHeader;
