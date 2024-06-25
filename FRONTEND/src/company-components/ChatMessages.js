// 'use client'
// // components/ChatMessages.js
// import {useState,useEffect} from "react";
// import Image from "next/image";
// import moment from "moment";

// const ChatMessages = ({ messages, selectedContact, toggleOptions, showOptions,goBack }) => {

//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 640px)"); // Adjust the max-width as needed

//     const handleScreenSizeChange = (e) => {
//       setIsSmallScreen(e.matches);
//     };

//     mediaQuery.addEventListener("change", handleScreenSizeChange);
//     setIsSmallScreen(mediaQuery.matches);

//     return () => {
//       mediaQuery.removeEventListener("change", handleScreenSizeChange);
//     };
//   }, []);

//   return (
//     <>
//     <div className={`w-full px-3 ${selectedContact ? "visible" : "invisible w-0"}`}>
//        {isSmallScreen && selectedContact && (
//         <div className="mt-4 mb-2 flex text-[#2D8AC5]  cursor-pointer" onClick={goBack}>
//           <Image src="/assets/arrow-left.svg" width={20} height={20} alt="back" />
//           <span className="ml-2">Back to Chats</span>
//         </div>
//       )}
//       <div className="flex flex-col lg:flex-row justify-between">
//         {selectedContact && (
//           <div>
//             <div className="flex">
//               <Image
//                 src={selectedContact.profile_img || "/assets/chat-dp.svg"}
//                 width={50}
//                 height={50}
//                 alt="profile image"
//               />
//               <div>
//                 <div className="flex flex-col md:flex-row">
//                   <p className="ml-2 font-bold ">{selectedContact.name}</p>
//                   <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text[14px]">
//                     All Chats / WhatsApp / Facebook / Web
//                   </p>
//                 </div>
//                 <p className="text-[#343233] ml-2 text-[14px] leading-4">
//                   with{" "}
//                   <span className="capitalize font-bold">Jamson</span>
//                 </p>
//                 {/* <p className="md:hidden lg:ml-3 ml-2 -mt-1 text-[px]">
//                     All Chats / WhatsApp / Facebook / Web
//                   </p> */}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex mt-2 lg:mt-0  items-center justify-end">
//           <div className="bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white">
//             <p>Priority Chat:</p>
//             <select
//               name=""
//               id=""
//               className="outline-none bg-transparent font-bold custom-dropdown"
//             >
//               <option className="text-[#343233]" value="">
//                 Facebook
//               </option>
//               <option className="text-[#343233]" value="">
//                 WhatsApp
//               </option>
//               <option className="text-[#343233]" value="">
//                 Web Chat
//               </option>
//             </select>
//           </div>

//           <div className="relative ml-3">
//             <button
//               className="bg-[#F7F7F7] p-[5px] rounded-full"
//               onClick={toggleOptions}
//             >
//               <Image
//                 src="/assets/three-dots.svg"
//                 width={34}
//                 height={34}
//                 alt="profile image"
//                 id="three-dots-options"
//               />
//             </button>
//             {showOptions && (
//               <div className="absolute py-[8px] px-[16px] right-0 mt-2 w-72 bg-white border rounded-md shadow-lg">
//                 <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
//                   Copy Web Chat Link
//                 </button>
//                 <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
//                   Close All Chats
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Messages */}
//       <div className="mt-4 omni-scroll-bar" style={{ height: 'calc(100vh - 325px)', overflowY: "auto" }}>
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex mb-2 ${
//               message.sender === "You" ? "justify-end" : "justify-start"
//             }`}
//           >
//             {message.sender === "You" ? (
//               <>
//                 <div className="flex flex-col">
//                   <div className="flex">
//                     <div
//                       className={`py-[8px] px-[16px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-0 rounded-bl-[12px]
//                                ${
//                                  message.platform === "WebChat"
//                                    ? "bg-[#F9B1B1]"
//                                    : message.platform === "WhatsApp"
//                                    ? "bg-[#B2F9B1]"
//                                    : "bg-[#D5F1FF]"
//                                }`}
//                     >
//                       <p className="text-[#343233] text-[14px] md:text-[16px] lmd:eading-[19px]">
//                         {message.text}
//                       </p>
//                     </div>
//                     <div className="rounded-full ml-2">
//                       <Image
//                         src={selectedContact.profile_img || "/assets/chat-dp.svg"}
//                         width={30}
//                         height={30}
//                         alt="profile image"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-row-reverse justify-between mt-1 mr-10">
//                     <div className="rounded-[100x]">
//                       {/* Change the order of logo and time when the sender is 'You' */}
//                       {message.platform === "Facebook" && (
//                         <Image
//                           src="/assets/facebook-logo.svg"
//                           width={13.33}
//                           height={13.33}
//                           alt="social platform logo"
//                         />
//                       )}
//                       {message.platform === "WhatsApp" && (
//                         <Image
//                           src="/assets/whatsapp-logo.svg"
//                           width={13.33}
//                           height={13.33}
//                           alt="social platform logo"
//                         />
//                       )}
//                       {message.platform === "WebChat" && (
//                         <Image
//                           src="/assets/webchat-logo.svg"
//                           width={13.33}
//                           height={13.33}
//                           alt="social platform logo"
//                         />
//                       )}
//                     </div>
//                     <p className="text-[##676767] text-[12px] leading-[14px]">
//                       {moment(message.time).format("h:mm a")}
//                     </p>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               // Render the layout when the sender is not 'You'
//               <>
//                 {message.sender !== "You" && (
//                   <div className="rounded-full">
//                     <Image
//                       src={selectedContact.profile_img || "/assets/chat-dp.svg"}
//                       width={30}
//                       height={30}
//                       alt="profile image"
//                     />
//                   </div>
//                 )}
//                 <div className="flex flex-col ml-2">
//                   <div
//                     className={`bg-[#F3F3F3] py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] ${
//                       message.sender === "You" ? "bg-[#D5F1FF]" : ""
//                     }`}
//                   >
//                     <p className="text-[#343233] text-[14px] md:text-[16px] leading-[19px]">
//                       {message.text}
//                     </p>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <div className="rounded-[100x]">
//                       {message.platform === "Facebook" && (
//                         <Image
//                           src="/assets/facebook-logo.svg"
//                           width={13.33}
//                           height={13.33}
//                           alt="social platform logo"
//                         />
//                       )}
//                       {message.platform === "WhatsApp" && (
//                         <Image
//                           src="/assets/whatsapp-logo.svg"
//                           width={13.33}
//                           height={13.33}
//                           alt="social platform logo"
//                         />
//                       )}
//                       {message.platform === "WebChat" && (
//                         <Image
//                           src="/assets/webchat-logo.svg"
//                           width={13.33}
//                           height={13.33}
//                           alt="social platform logo"
//                         />
//                       )}
//                     </div>
//                     <p className="text-[##676767] text-[12px] leading-[14px]">
//                       {moment(message.time).format("h:mm a")}
//                     </p>
//                   </div>
//                 </div>

//               </>
//             )}

//           </div>

//         ))}
//       </div>

//       {/* End of Messages */}
//       <div className="flex w-full  items-center">
//         <div className="flex w-full">
//         <textarea  placeholder="Enter here" className="textarea" />
//         </div>
//         <div className="bg-[#F7F7F7] rounded-[50px] ml-2 p-[5px] w-[48px] h-[48px] flex justify-center items-center">
//         <Image src="/assets/send-btn.png" width={28} height={28} alt="send" />
//         </div>
//       </div>
//     </div>

//     </>
//   );
// };

// export default ChatMessages;

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import moment from "moment";
// import io from "socket.io-client";
// import axios from "axios";

// const ChatMessages = ({ selectedContact, toggleOptions, showOptions, goBack }) => {
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   console.log(selectedContact)

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 640px)");

//     const handleScreenSizeChange = (e) => {
//       setIsSmallScreen(e.matches);
//     };

//     mediaQuery.addEventListener("change", handleScreenSizeChange);
//     setIsSmallScreen(mediaQuery.matches);

//     return () => {
//       mediaQuery.removeEventListener("change", handleScreenSizeChange);
//     };
//   }, []);

//   useEffect(() => {
//     const newSocket = io("http://localhost:7000", { transports: ['websocket'] });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("chatMessage", (message) => {
//       console.log("Received message:", message);
//       setMessages([...messages, message]);
//     });

//     return () => {
//       socket.off("chatMessage");
//     };
//   }, [socket, messages]);

//   useEffect(() => {
//     if (!selectedContact) return;

//     axios
//       .get("http://localhost:7000/api/v1/chats/get-all-messages", {
//         params: {
//           user_id: selectedContact.company_id,
//           sender_id: selectedContact.company_id,
//           receiver_id: selectedContact.employee_id,
//         },
//       })
//       .then((response) => {
//         console.log("Messages fetched successfully:", response.data);
//         setMessages(response.data.messages);
//       })
//       .catch((error) => {
//         console.error("Error fetching messages:", error);
//       });
//   }, [selectedContact]);

//   const sendMessage = () => {
//     if (socket && newMessage.trim() !== "") {
//       const message = newMessage.trim();
//       socket.emit("chatMessage", message);
//       axios
//         .post("http://localhost:7000/api/v1/chats/send-message", {
//           user_id: selectedContact.company_id,
//           sender_id: selectedContact.company_id,
//           receiver_id: selectedContact.company_id,
//           message: message,
//         })
//         .then((response) => {
//           console.log("Message sent successfully:", response.data);
//           setNewMessage("");
//         })
//         .catch((error) => {
//           console.error("Error sending message:", error);
//         });
//     }
//   };

//   return (
//     <>
//       <div className={`w-full px-3 ${selectedContact ? "visible" : "invisible w-0"}`}>
//         {isSmallScreen && selectedContact && (
//           <div className="mt-4 mb-2 flex text-[#2D8AC5]  cursor-pointer" onClick={goBack}>
//             <Image src="/assets/arrow-left.svg" width={20} height={20} alt="back" />
//             <span className="ml-2">Back to Chats</span>
//           </div>
//         )}
//         <div className="flex flex-col lg:flex-row justify-between">
//           {selectedContact && (
//             <div>
//               <div className="flex">
//                 <Image
//                   src={selectedContact.profile_img || "/assets/chat-dp.svg"}
//                   width={50}
//                   height={50}
//                   alt="profile image"
//                 />
//                 <div>
//                   <div className="flex flex-col md:flex-row">
//                     <p className="ml-2 font-bold ">{selectedContact.name}</p>
//                     <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text[14px]">
//                       All Chats / WhatsApp / Facebook / Web
//                     </p>
//                   </div>
//                   <p className="text-[#343233] ml-2 text-[14px] leading-4">
//                     with{" "}
//                     <span className="capitalize font-bold">Jamson</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex mt-2 lg:mt-0  items-center justify-end">
//             <div className="bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white">
//               <p>Priority Chat:</p>
//               <select
//                 name=""
//                 id=""
//                 className="outline-none bg-transparent font-bold custom-dropdown"
//               >
//                 <option className="text-[#343233]" value="">
//                   Facebook
//                 </option>
//                 <option className="text-[#343233]" value="">
//                   WhatsApp
//                 </option>
//                 <option className="text-[#343233]" value="">
//                   Web Chat
//                 </option>
//               </select>
//             </div>

//             <div className="relative ml-3">
//               <button
//                 className="bg-[#F7F7F7] p-[5px] rounded-full"
//                 onClick={toggleOptions}
//               >
//                 <Image
//                   src="/assets/three-dots.svg"
//                   width={34}
//                   height={34}
//                   alt="profile image"
//                   id="three-dots-options"
//                 />
//               </button>
//               {showOptions && (
//                 <div className="absolute py-[8px] px-[16px] right-0 mt-2 w-72 bg-white border rounded-md shadow-lg">
//                   <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
//                     Copy Web Chat Link
//                   </button>
//                   <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
//                     Close All Chats
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Chat messages display */}
//         <div className="mt-4 omni-scroll-bar" style={{ height: 'calc(100vh - 325px)', overflowY: "auto" }}>
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex mb-2 ${
//                 message.sender === "You" ? "justify-end" : "justify-start"
//               }`}
//             >
//               {message.sender === "You" ? (
//                 <>
//                   <div className="flex flex-col">
//                     <div className="flex">
//                       <div
//                         className={`py-[8px] px-[16px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-0 rounded-bl-[12px]
//                                  ${
//                                    message.platform === "WebChat"
//                                      ? "bg-[#F9B1B1]"
//                                      : message.platform === "WhatsApp"
//                                      ? "bg-[#B2F9B1]"
//                                      : "bg-[#D5F1FF]"
//                                  }`}
//                       >
//                         <p className="text-[#343233] text-[14px] md:text-[16px] lmd:eading-[19px]">
//                           {message.message}
//                         </p>
//                       </div>
//                       <div className="rounded-full ml-2">
//                         <Image
//                           src={selectedContact.profile_img || "/assets/chat-dp.svg"}
//                           width={30}
//                           height={30}
//                           alt="profile image"
//                         />
//                       </div>
//                     </div>

//                     <div className="flex flex-row-reverse justify-between mt-1 mr-10">
//                       <div className="rounded-[100x]">
//                         {message.platform === "Facebook" && (
//                           <Image
//                             src="/assets/facebook-logo.svg"
//                             width={13.33}
//                             height={13.33}
//                             alt="social platform logo"
//                           />
//                         )}
//                         {message.platform === "WhatsApp" && (
//                           <Image
//                             src="/assets/whatsapp-logo.svg"
//                             width={13.33}
//                             height={13.33}
//                             alt="social platform logo"
//                           />
//                         )}
//                         {message.platform === "WebChat" && (
//                           <Image
//                             src="/assets/webchat-logo.svg"
//                             width={13.33}
//                             height={13.33}
//                             alt="social platform logo"
//                           />
//                         )}
//                       </div>
//                       <p className="text-[##676767] text-[12px] leading-[14px]">
//                         {moment(message.timestamp).format("h:mm a")}
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {message.sender !== "You" && (
//                     <div className="rounded-full">
//                       <Image
//                         src={selectedContact.profile_img || "/assets/chat-dp.svg"}
//                         width={30}
//                         height={30}
//                         alt="profile image"
//                       />
//                     </div>
//                   )}
//                   <div className="flex flex-col ml-2">
//                     <div
//                       className={`bg-[#F3F3F3] py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] ${
//                         message.sender === "You" ? "bg-[#D5F1FF]" : ""
//                       }`}
//                     >
//                       <p className="text-[#343233] text-[14px] md:text-[16px] leading-[19px]">
//                         {message.message}
//                       </p>
//                     </div>
//                     <div className="flex justify-between mt-1">
//                       <div className="rounded-[100x]">
//                         {message.platform === "Facebook" && (
//                           <Image
//                             src="/assets/facebook-logo.svg"
//                             width={13.33}
//                             height={13.33}
//                             alt="social platform logo"
//                           />
//                         )}
//                         {message.platform === "WhatsApp" && (
//                           <Image
//                             src="/assets/whatsapp-logo.svg"
//                             width={13.33}
//                             height={13.33}
//                             alt="social platform logo"
//                           />
//                         )}
//                         {message.platform === "WebChat" && (
//                           <Image
//                             src="/assets/webchat-logo.svg"
//                             width={13.33}
//                             height={13.33}
//                             alt="social platform logo"
//                           />
//                         )}
//                       </div>
//                       <p className="text-[##676767] text-[12px] leading-[14px]">
//                         {moment(message.time).format("h:mm a")}
//                       </p>
//                     </div>
//                   </div>

//                 </>
//               )}

//             </div>

//           ))}
//         </div>
//         {/* Message input and send button */}
//         <div className="flex w-full  items-center">
//           <div className="flex w-full">
//             <textarea placeholder="Enter here" className="textarea" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
//           </div>
//           <div className="bg-[#F7F7F7] rounded-[50px] ml-2 p-[5px] w-[48px] h-[48px] flex justify-center items-center" onClick={sendMessage}>
//             <Image src="/assets/send-btn.png" width={28} height={28} alt="send" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatMessages;

// ChatMessages.js

import { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "@/context/SocketContext";
import styles from "./company.module.css";

const ChatMessages = ({
  preferredPlatform,
  setPreferredPlatform,
  selectedContact,
  chats,
  chatsVisible,
  toggleOptions,
  showOptions,
  handleOptionClick,
  Allchats,
  goBack,
  mode,
  setMode,
  companyWhatsapp,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [roomName, setRoomName] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [guestUserData, setGuestUserData] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);

  const socket = useSocket();
  // console.log("selected", selectedContact?.phone )
  useEffect(() => {
    setCharacterCount(newMessage.length);
    // console.log("character count", characterCount)
  }, [newMessage]);

  // console.log(loggedInUserId)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleScreenSizeChange = (e) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleScreenSizeChange);
    setIsSmallScreen(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenSizeChange);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("company_access_token");
    if (token) {
      const decodedToken = jwtDecode(token);

      setLoggedInUserId(decodedToken.user_id);
      setLoggedInUserName(decodedToken.user_name);
    }
  }, []);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:7000");

  //   setSocket(newSocket);
  //   newSocket.on("connect", () => {
  //     console.log("Socket connected with ID:", newSocket.id);
  //     setSocketId(newSocket.id)
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (socket) {

  //     socket.on("connect", () => {
  //       // console.log("Connected to Socket.IO server");

  //       // Emit the 'storeUserId' event to associate user ID with socket ID
  //       socket.emit("storeUserId", loggedInUserId); // Replace userId with the actual user ID
  //     });

  //     // Listen for the 'disconnect' event
  //     socket.on("disconnect", () => {
  //       // console.log("Disconnected from Socket.IO server");
  //     });

  //     socket.on("chatMessage", (message) => {
  //       console.log("messages",message)
  //       setMessages((prevMessages) => [...prevMessages, message]);
  //     });

  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("chatMessage");
  //     }
  //   };
  // }, [socket]);

  const processChatHistoryAPI = async (
    chatHistory,
    loggedInUserId,
    selectedContact
  ) => {
    try {
      console.log("history is here : ==== " + JSON.stringify(selectedContact));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/process-chat-history-for-ai-bot`,
        {
          chatHistory,
          companyId: loggedInUserId,
          userId: loggedInUserId,
          platform: preferredPlatform,
          receiver_id: receiverId,
          sender_id: loggedInUserId,
          recipient: selectedContact?.phone,
          sender: companyWhatsapp,
          rcpt: selectedContact?.phone,
        }
      );

      if (response && response.data) {
        console.log("Chat history processed successfully:", response.data);
      } else {
        console.error("Error processing chat history:", response.data.message);
      }
    } catch (error) {
      console.error("Error processing chat history:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      // Emit "storeUserId" event to associate user ID with socket ID
      socket.emit("storeUserId", loggedInUserId); // Replace loggedInUserId with the actual user ID

      // Listen for "chatMessage" event
      socket.on("chatMessage", (message) => {
        if (message.user_type === "guest") {
          setGuestUserData(message);
        }
        // setGuestUserData(message)
        // Handle incoming chat message

        console.log("Received chat messages: ", message);
        // Update messages state with the new message
        // setMessages((prevMessages) => [...prevMessages, message]);
        console.log("this is mode ----- " + mode);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          if (mode === "auto") {
            processChatHistoryAPI(
              updatedMessages,
              loggedInUserId,
              selectedContact
            );
          }
          return updatedMessages;
        });
        getlastwebchatmsg(loggedInUserId);
      });

      // Clean up event listener when component unmounts
      return () => {
        socket.off("chatMessage");
      };
    }
  }, [socket, loggedInUserId, mode, selectedContact]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("whatsappMessage", (message) => {
  //       console.log("whatsapp recevied evenet",message)
  //       setMessages((prevMessages) => [...prevMessages, message]);
  //     });
  //   }
  // }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleWhatsAppMessage = (message) => {
        console.log("Received WhatsApp message:", message);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          if (mode === "auto") {
            processChatHistoryAPI(
              updatedMessages,
              loggedInUserId,
              selectedContact
            );
          }
          return updatedMessages;
        });
        getlastwhatsappmsg(loggedInUserId, selectedContact.phone);
      };

      socket.on("whatsappMessage", handleWhatsAppMessage);

      // Clean up event listener when component unmounts
      return () => {
        socket.off("whatsappMessage", handleWhatsAppMessage);
      };
    }
  }, [socket, mode, loggedInUserId, selectedContact]);

  // useEffect(() => {
  //   if (socket && selectedContact) {
  //     // Emit event to request WhatsApp messages for the selected contact
  //     socket.emit("whatsappMessage", {
  //       sender_id: loggedInUserId,
  //       user_id: parentCompanyId,
  //       recipient_whatsapp: selectedContact.phone,
  //     });
  //   }
  // }, [socket, selectedContact]);

  useEffect(() => {
    if (selectedContact || chats) {
      setMessages([]);

      // const generatedReceiverId = selectedContact && (selectedContact.employee_id || selectedContact.customer_id);
      //   const generatedReceiverId =
      //   (selectedContact && selectedContact.user_type === "guest")
      // ? (selectedContact.receiver_id !== loggedInUserId ? selectedContact.receiver_id : selectedContact.sender_id)
      // : (selectedContact && (selectedContact.employee_id || selectedContact.customer_id ));

      const generatedReceiverId =
        selectedContact?.selected_employee_id == loggedInUserId
          ? selectedContact?.sender_id
          : selectedContact?.selected_employee_id;

      setReceiverId(generatedReceiverId);
      // // const generatedRoomName = `${selectedContact.employee_id}`;
      // const generatedRoomName = `${selectedContact.employee_id || selectedContact.customer_id}`;
      // setRoomName(generatedRoomName);

      // if (socket) {
      //   // Join the room when a user is selected
      //   socket.emit("joinRoom", generatedRoomName);
      // }

      if (selectedContact && selectedContact.preferred_platform) {
        const preferredPlatforms = selectedContact?.preferred_platform
          ?.split(",")
          .map((p) => p.trim());

        if (preferredPlatforms.includes("webchat")) {
          fetchWebchatMessages(
            loggedInUserId,
            generatedReceiverId,
            setMessages
          );
        }

        if (preferredPlatforms.includes("whatsApp")) {
          fetchWhatsAppMessages(
            loggedInUserId,
            selectedContact?.phone,
            setMessages
          );
        }

        if (preferredPlatforms.includes("sms")) {
          fetchSMSMessages(loggedInUserId, selectedContact?.phone, setMessages);
        }
      }
    }
  }, [selectedContact, socket, loggedInUserId, chats]);

  const fetchWebchatMessages = (
    loggedInUserId,
    generatedReceiverId,
    setMessages
  ) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/get-all-messages`, {
        params: {
          user_id: loggedInUserId,
          sender_id: loggedInUserId,
          receiver_id: generatedReceiverId,
        },
      })
      .then((response) => {
        getlastwebchatmsg(loggedInUserId);
        setMessages(response.data.messages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const fetchWhatsAppMessages = (loggedInUserId, phoneNumber, setMessages) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/get-all-whatsapp-messages`,
        {
          params: {
            sender_id: companyWhatsapp,
            user_id: loggedInUserId,
            receipient_whatsapp: phoneNumber,
          },
        }
      )
      .then((response) => {
        console.log("whatsapp res", response);
        getlastwhatsappmsg(loggedInUserId, phoneNumber);
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.messages,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp messages:", error);
      });
  };

  const getlastwhatsappmsg = (loggedInUserId, phoneNumber) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/get-last-whatsapp-messages`,
        {
          params: {
            user_id: loggedInUserId,
            receipient_whatsapp: phoneNumber,
          },
        }
      )
      .then((response) => {
        console.log("whatsapp last ", response.data.messages[0].message);
        localStorage.setItem(
          "whatsapplmsg" + phoneNumber,
          response.data.messages[0].message
        );
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp messages:", error);
      });
  };

  const getlastSMSmsg = (loggedInUserId, phoneNumber) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sms/get-latest-sms`, {
        params: {
          user_id: loggedInUserId,
          receipient_whatsapp: phoneNumber,
        },
      })
      .then((response) => {
        console.log("sms last ", response.data);
        localStorage.setItem(
          "smslmsg" + phoneNumber,
          response.data.messages[0].message
        );
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp messages:", error);
      });
  };

  const getlastwebchatmsg = (loggedInUserId) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/get-latestt-messages`, {
        params: {
          user_id: loggedInUserId,
        },
      })
      .then((response) => {
        console.log("web latest ", response);
        if (loggedInUserId == response.data.messages[0].sender_id) {
          localStorage.setItem(
            "weblmsg" + response.data.messages[0].receiver_id,
            response.data.messages[0].message
          );
        } else {
          localStorage.setItem(
            "weblmsg" + response.data.messages[0].sender_id,
            response.data.messages[0].message
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp messages:", error);
      });
  };

  // ## GET ALL SMS MESSAGES

  const fetchSMSMessages = (loggedInUserId, phoneNumber, setMessages) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sms/get-all-sms`, {
        params: {
          sender_id: loggedInUserId,
          user_id: loggedInUserId,
          receipient_whatsapp: phoneNumber,
        },
      })
      .then((response) => {
        console.log("SMS res", response);
        getlastSMSmsg(loggedInUserId, phoneNumber);

        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.messages,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching SMS messages:", error);
      });
  };

  const sendMessage = () => {
    let direction = loggedInUserId || aiBotResponse ? "out" : "in";
    const senderType = selectedContact?.mode == "manual" ? "user" : "aiBot";

    if (socket && newMessage.trim() !== "" && selectedContact) {
      const message = newMessage.trim();
      const data = {
        user_id: loggedInUserId,
        sender_id: loggedInUserId,
        receiver_id: receiverId,
        message,
        sender_name: loggedInUserName,
        platform: selectedContact?.preferred_platform,
        direction: direction,
        sender_type: senderType,
        timestamp: Date.now(),
        // room: roomName,
      };

      let smsCount = Math.ceil(message.length / 153);

      if (smsCount > 3) {
        smsCount = 3;
      }

      // setMessages((prevMessages) => [...prevMessages, { message, sender_id: loggedInUserId }]);
      // socket.emit("chatMessage", data);

      if (selectedContact?.is_merged === 0) {
        if (selectedContact?.preferred_platform.includes("whatsApp")) {
          // Send message through WhatsApp API
          sendWhatsAppMessage(message);

          setMessages((prevMessages) => [...prevMessages, { ...data }]);
        } else if (selectedContact?.preferred_platform.includes("webchat")) {
          // Send message through socket.io
          sendWebChatMessage(message);
          // setMessages((prevMessages) => [...prevMessages, { message, sender_id: loggedInUserId }]);
          socket.emit("chatMessage", data);
        } else if (selectedContact?.preferred_platform.includes("sms")) {
          sendEuroSMSMessage(message);
          setMessages((prevMessages) => [
            ...prevMessages,
            { message, sender_id: selectedContact.phone },
          ]);
          socket.emit("chatMessage", data);
        }
      }

      if (selectedContact && selectedContact?.is_merged === 1) {
        if (
          selectedContact?.preferred_platform.includes("whatsApp") &&
          preferredPlatform === "whatsApp"
        ) {
          // Send message through WhatsApp API
          sendWhatsAppMessage(message);

          setMessages((prevMessages) => [...prevMessages, { ...data }]);
        } else if (
          selectedContact?.preferred_platform.includes("webchat") &&
          preferredPlatform === "webchat"
        ) {
          // Send message through socket.io
          sendWebChatMessage(message);
          // setMessages((prevMessages) => [...prevMessages, { message, sender_id: loggedInUserId }]);
          socket.emit("chatMessage", data);
        } else if (
          selectedContact?.preferred_platform.includes("sms") &&
          preferredPlatform === "sms"
        ) {
          // Send message through SMS API
          sendEuroSMSMessage(message);
          // console.log("eurosms",message)
          setMessages((prevMessages) => [
            ...prevMessages,
            { message, sender_id: selectedContact.phone },
          ]);
          socket.emit("chatMessage", data);
        }
      }

      // Update the UI with the SMS count
      setCharacterCount(0); // Reset character count after sending
      setNewMessage(""); // Clear the input field after sending the message
      setCharacterCount(smsCount * 153); //
    }
  };

  const sendWebChatMessage = (message) => {
    localStorage.setItem("webchatmsg", message);

    const direction = loggedInUserId || aiBotResponse ? "out" : "in";
    const messageType = selectedContact?.mode == "manual" ? "user" : "aiBot";
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/send-message-guest`, {
        user_id: loggedInUserId,
        sender_id: loggedInUserId,
        sender_name: loggedInUserName,
        receiver_id: receiverId,
        message: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        setNewMessage("");
        getlastwebchatmsg(loggedInUserId);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };
  //
  const sendWhatsAppMessage = (message) => {
    let direction = loggedInUserId || aiBotResponse ? "out" : "in";
    const messageType = selectedContact?.mode == "manual" ? "user" : "aiBot";
    setNewMessage("");

    // console.log("yg " + loggedInUserId + " ; ; " + selectedContact.phone);
    // Send message through WhatsApp
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/send-message`, {
        user_id: loggedInUserId,
        sender_id: loggedInUserId,
        sender_name: loggedInUserName,
        recipient: selectedContact && selectedContact.phone,
        sender: companyWhatsapp,
        message: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        setNewMessage("");
        console.log("WhatsApp message sent:", response.data);
        getlastwhatsappmsg(loggedInUserId, selectedContact.phone);

        localStorage.setItem("whatsapplatest", message);
      })
      .catch((error) => {
        console.error("Error sending WhatsApp message:", error);
      });
  };

  // SEND EURO SMS API

  const sendEuroSMSMessage = (message) => {
    const direction = loggedInUserId || aiBotResponse ? "out" : "in";
    const messageType = selectedContact?.mode == "manual" ? "user" : "aiBot";
    // Clear the message input immediately
    setNewMessage("");
    // Send message through WhatsApp
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/sms/send-sms`, {
        user_id: loggedInUserId,
        rcpt: parseInt(selectedContact && selectedContact.phone),
        txt: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        setNewMessage("");
        localStorage.setItem("eurosms", message);
        fetchSMSMessages(loggedInUserId, selectedContact.phone, message);

        console.log("sms message sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending sms message:", error);
      });
  };

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedContact) {
      // const generatedReceiverId = selectedContact && (selectedContact.employee_id || selectedContact.customer_id);
      //   const generatedReceiverId =
      //   (selectedContact && selectedContact.user_type === "guest")
      // ? (selectedContact.receiver_id !== loggedInUserId ? selectedContact.receiver_id : selectedContact.sender_id)
      // : (selectedContact && (selectedContact.employee_id || selectedContact.customer_id));

      const generatedReceiverId =
        selectedContact?.selected_employee_id == loggedInUserId
          ? selectedContact?.sender_id
          : selectedContact?.selected_employee_id;

      setReceiverId(generatedReceiverId);
    }
  }, [selectedContact]);

  return (
    <div
      className={`w-full px-3 ${selectedContact ? "visible" : "invisible w-0"}`}
    >
      {isSmallScreen && selectedContact && (
        <div
          className="mt-4 mb-2 flex text-[#2D8AC5] cursor-pointer"
          onClick={goBack}
        >
          <Image
            src="/assets/arrow-left.svg"
            width={20}
            height={20}
            alt="back"
          />
          <span className="ml-2">Back to Chats</span>
        </div>
      )}
      <div className="flex flex-col lg:flex-row justify-between">
        {selectedContact && (
          <div>
            <div className="flex">
              <Image
                src={selectedContact.profile_img || "/assets/chat-dp.svg"}
                width={50}
                height={50}
                alt="profile image"
              />
              <div>
                <div className="flex flex-col md:flex-row">
                  <p className="ml-2 font-bold ">
                    {selectedContact?.name?.split(",")[0]}
                  </p>
                  <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text-[14px]">
                    {/* All Chats / WhatsApp / Facebook / Web */}
                    `All Chats / {selectedContact?.preferred_platform}`
                  </p>
                </div>
                <p className="text-[#343233] ml-2 text-[14px] leading-4">
                  with{" "}
                  <span className="capitalize font-bold">
                    {loggedInUserName}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex mt-2 lg:mt-0 items-center justify-end">
          {/* <div className="bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white"> */}
          <div
            className={`bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white ${
              selectedContact && selectedContact.is_merged === 1
                ? ""
                : "invisible"
            }`}
          >
            <p>Priority Chat:</p>
            <select
              name=""
              id=""
              className="outline-none bg-transparent font-bold custom-dropdown"
              onChange={(e) => setPreferredPlatform(e.target.value)}
            >
              <option className="text-[#343233]" value="facebook">
                Facebook
              </option>
              <option className="text-[#343233]" value="whatsApp">
                WhatsApp
              </option>
              <option className="text-[#343233]" value="webchat">
                Web Chat
              </option>
              <option className="text-[#343233]" value="sms">
                SMS
              </option>
            </select>
          </div>
          <div className="relative">
            <button
              className="bg-[#F7F7F7] p-[5px] rounded-full"
              onClick={toggleOptions}
            >
              <Image
                src="/assets/three-dots.svg"
                width={34}
                height={34}
                alt="options"
              />
            </button>
            {showOptions && (
              <div className="absolute py-[8px] px-[16px] right-0 w-64 bg-white border rounded-md shadow-lg">
                {selectedContact?.mode === "auto" ? (
                  <button
                    className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handleOptionClick("manual")}
                  >
                    Move to Manual
                  </button>
                ) : (
                  <button
                    className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100 whitespace-nowrap"
                    onClick={() => handleOptionClick("auto")}
                  >
                    Move to Auto
                  </button>
                )}
              </div>
            )}
          </div>

          {/* <div className="relative ml-3">
            <button
              className="bg-[#F7F7F7] p-[5px] rounded-full"
              onClick={toggleOptions}
            >
              <Image
                src="/assets/three-dots.svg"
                width={34}
                height={34}
                alt="profile image"
                id="three-dots-options"
              />
            </button>
            {showOptions && (
              <div className="absolute py-[8px] px-[16px] right-0 mt-2 w-72 bg-white border rounded-md shadow-lg">
                <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
                  Copy Web Chat Link
                </button>
                <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
                  Close All Chats
                </button>
              </div>
            )}
          </div> */}
        </div>
      </div>
      {/* Chat messages display */}
      <div
        id="message-container"
        className="mt-4 omni-scroll-bar"
        style={{ height: "calc(100vh - 340px)", overflowY: "auto" }}
      >
        {messages
          .filter(
            (message) =>
              message.receiver_id === receiverId ||
              message.sender_id === receiverId ||
              message.receipient_whatsapp == selectedContact?.phone ||
              message.sender_id === selectedContact?.phone
          )
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((message, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                message.sender_id === loggedInUserId ||
                message.direction === "out"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message && message.sender_id !== loggedInUserId ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex">
                      <div
                        className={`py-[8px] px-[16px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-0 rounded-bl-[12px] ${
                          message.platform === "webchat"
                            ? "bg-[#F9B1B1]"
                            : message.platform === "whatsApp"
                            ? "bg-[#B2F9B1]"
                            : "bg-[#D5F1FF]"
                        }`}
                      >
                        <p
                          className="text-[#343233] text-[14px] md:text-[16px] leading-[19px]"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {message.message}
                        </p>
                      </div>
                      <div className="rounded-full ml-2">
                        <Image
                          src={
                            (selectedContact && selectedContact.profile_img) ||
                            "/assets/chat-dp.svg"
                          }
                          width={30}
                          height={30}
                          alt="profile image"
                        />
                      </div>
                    </div>

                    <div className="flex flex-row-reverse justify-between mt-1 mr-10">
                      <div className="rounded-[100px]">
                        {message.platform === "facebook" && (
                          <Image
                            src="/assets/facebook-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                        {message.platform === "whatsApp" && (
                          <Image
                            src="/assets/whatsapp-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                        {message.platform === "webchat" && (
                          <Image
                            src="/assets/webchat-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                        {message.platform === "sms" && (
                          <Image
                            src="/assets/eurosms-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                      </div>
                      <p className="text-[##676767] text-[12px] leading-[14px]">
                        {moment(message.timestamp).format("h:mm a")}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {message && message.sender_id === loggedInUserId && (
                    <div className="rounded-full">
                      <Image
                        src={
                          selectedContact?.profile_img || "/assets/chat-dp.svg"
                        }
                        width={30}
                        height={30}
                        alt="profile image"
                      />
                    </div>
                  )}
                  <div className="flex flex-col mr-2">
                    <div
                      className={`bg-[#F3F3F3] py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] ${
                        message.sender_id === loggedInUserId
                          ? "bg-[#D5F1FF]"
                          : ""
                      }`}
                    >
                      <p
                        className="text-[#343233] text-[14px] md:text-[16px] leading-[19px]"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {message.message}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="rounded-[100x]">
                        {message.platform === "facebook" && (
                          <Image
                            src="/assets/facebook-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                        {message.platform === "whatsApp" && (
                          <Image
                            src="/assets/whatsapp-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                        {message.platform === "webchat" && (
                          <Image
                            src="/assets/webchat-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                        {message.platform === "sms" && (
                          <Image
                            src="/assets/eurosms-logo.svg"
                            width={13.33}
                            height={13.33}
                            alt="social platform logo"
                          />
                        )}
                      </div>
                      <p className="text-[##676767] text-[12px] leading-[14px]">
                        {moment(message.timestamp).format("h:mm a")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
      {/* Message input and send button */}
      {selectedContact?.preferred_platform === "sms" && (
        <span className=" text-gray-200 flex justify-between">
          <div className="flex justify-between w-full sms-text">
            <h1>SMS text:</h1>
            {/* {characterCount} characters */}
            <p>
              Remaining {Math.max(459 - characterCount, 0)}, accounted for as{" "}
              {Math.ceil(characterCount / 153)} SMS
            </p>
          </div>
        </span>
      )}
      <div
        className={`flex w-full items-center ${
          mode === "auto" ? "invisible" : ""
        }`}
      >
        <div className="flex w-full">
          <textarea
            placeholder="Enter here"
            className="textarea"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
        </div>

        <div
          className="bg-[#F7F7F7] rounded-[50px] ml-2 p-[5px] w-[48px] h-[48px] flex justify-center items-center"
          onClick={sendMessage}
        >
          <Image src="/assets/send-btn.png" width={28} height={28} alt="send" />
        </div>
      </div>
      {selectedContact?.preferred_platform == "sms" && (
        <p className="sms-text">MAX. 459 Characters.</p>
      )}

      {/* {selectedContact?.preferred_platform == "sms" && (
  <p className="sms-text">MAX. 459 Characters.</p>
)} */}
    </div>
  );
};

export default ChatMessages;
