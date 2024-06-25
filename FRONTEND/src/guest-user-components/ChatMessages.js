


import { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ChatMessages = ({preferredPlatform,setPreferredPlatform, selectedContact,chats,chatsVisible, toggleOptions, showOptions, goBack,parentCompanyDetails,generatorData }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [parentCompanyId, setParentCompanyId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [receiverId, setReceiverId] = useState(""); 
  const [socketId, setSocketId] = useState(""); 
  
  
// console.log("generator",generatorData && generatorData)
  console.log("selected",selectedContact)
  // console.log("receiverId",receiverId)

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


  // Retrieve loggedInUserId from local storage
// Retrieve loggedInUserId from session storage
useEffect(() => {
  const token = sessionStorage.getItem("guest_access_token");
  if (token) {
    try {
      const tokenData = JSON.parse(token); // Parse token data
      const { id, fullName } = tokenData; // Destructure id and fullName from tokenData
      // console.log("Token data:", tokenData); // Log token data for debugging
      
      // Set loggedInUserId, parentCompanyId, and loggedInUserName from token data
      setLoggedInUserId(id);
      setParentCompanyId(generatorData && generatorData.user_id);
      setLoggedInUserName(fullName);
    } catch (error) {
      console.error("Error parsing token data:", error);
      // Handle error if parsing fails
    }
  }
}, []);




  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL_SOCKET}`);

    setSocket(newSocket);
    // Listen for the 'connect' event to get the socket ID
  newSocket.on("connect", () => {
    // console.log("Socket connected with ID:", newSocket.id);
    
    setSocketId(newSocket.id)
  });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  

 

  useEffect(() => {
    
    if (socket) {
        socket.on("connect", () => {
          // console.log("Connected to Socket.IO server");
  
          // Emit the 'storeUserId' event to associate user ID with socket ID
          socket.emit("storeUserId", loggedInUserId); // Replace userId with the actual user ID
        });
  
        // Listen for the 'disconnect' event
        socket.on("disconnect", () => {
          // console.log("Disconnected from Socket.IO server");
        });


      socket.on("chatMessage", (message) => {
        // console.log("emp-mesgs",message)
        setMessages((prevMessages) => [...prevMessages, message]);

      });

      
    }

    return () => {
      if (socket) {
        socket.off("chatMessage");
      }
    };
  }, [socket]);

  

  useEffect(() => {
    if (selectedContact || chats) {
      // Generate a unique room name based on user IDs for private messaging
      // const generatedRoomName = `${loggedInUserId}`;
      // const generatedRoomName = `${loggedInUserId}`;

      // setRoomName(generatedRoomName);
      const generatedReceiverId = selectedContact && selectedContact.generator_id;


      setReceiverId(generatedReceiverId);

      
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/get-all-messages`, {
          params: {
            // user_id: selectedContact.company_id,
            // sender_id: selectedContact.employee_id,
            // receiver_id: selectedContact.company_id,
            user_id: generatorData && generatorData.user_id,
            sender_id: loggedInUserId,
            receiver_id: generatedReceiverId,
            
          },
        })
        .then((response) => {
          setMessages(response.data.messages);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });

        
    }
  }, [selectedContact, socket, loggedInUserId,chats]);

 
  const sendMessage = () => {

      let direction = loggedInUserId ? "in" : "out"
      const senderType = selectedContact?.mode == "manual" ? "user" : "aiBot";
 

    if (socket && newMessage.trim() !== "" && selectedContact ) {
      
      const message = newMessage.trim();
      const data = {
        // user_id: selectedContact.company_id,
        // sender_id: loggedInUserId,
        // receiver_id: selectedContact.employee_id || selectedContact.employee_id ,
        user_id: generatorData && generatorData.user_id,
        sender_id: loggedInUserId,
        receiver_id:  receiverId,
        message,
        sender_name:loggedInUserName,
        platform: "webchat",
        user_type: "guest",
        id:loggedInUserId,
        direction:direction,
        sender_type: senderType,
        timestamp: Date.now(),
        // room: roomName, // Include the room information in the data
      };

    

      // Update the local state with the sent message
      // setMessages((prevMessages) => [...prevMessages, { message, sender_id: loggedInUserId }]);
        // Emit the chat message to the specific room
        // socket.emit("chatMessage", data);

             
      if (preferredPlatform === "whatsApp") {
        // Send message through WhatsApp API
        sendWhatsAppMessage(message);
        setMessages((prevMessages) => [...prevMessages, { ...data}]);
      } else {
        // Send message through socket.io
        sendWebChatMessage(message);
        setMessages((prevMessages) => [...prevMessages, { message, sender_id: loggedInUserId }]);
        socket.emit("chatMessage", data);
      }
   
  };
    }


    const sendWebChatMessage = (message) => {
      let direction = loggedInUserId ? "in" : "out"
      const messageType = selectedContact?.mode == "manual" ? "user" : "aiBot";
      axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/send-message-guest`, {
        // user_id: selectedContact.company_id,
        // sender_id: selectedContact.employee_id,
        // receiver_id: selectedContact.company_id,
        // message: message,

        user_id: generatorData && generatorData.user_id,
        sender_id: loggedInUserId,
        sender_name: loggedInUserName,
        receiver_id: receiverId,
        message: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        setNewMessage(""); // Clear the input field after sending the message
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
  
  const sendWhatsAppMessage = (message) => {
     // Clear the message input immediately
  setNewMessage("");
    // Send message through WhatsApp 
    axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/send-message`, {
      user_id: parentCompanyId,
      sender_id: loggedInUserId,
      sender_name: loggedInUserName,
      recipient: selectedContact && selectedContact.phone, 
      message: message,
      
    })
    .then((response) => {
      setNewMessage("");
      console.log("WhatsApp message sent:", response.data);
    })
    .catch((error) => {
      console.error("Error sending WhatsApp message:", error);
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
      const generatedReceiverId = selectedContact && selectedContact.generator_id;
      setReceiverId(generatedReceiverId);
    }
  }, [selectedContact]);

  return (
    <>
    {selectedContact && selectedContact ?

<div className={`w-full px-3 ${selectedContact ? "visible" : "invisible w-0"}`}>
{isSmallScreen && selectedContact && (
  <div className="mt-4 mb-2 flex text-[#2D8AC5] cursor-pointer" onClick={goBack}>
    <Image src="/assets/arrow-left.svg" width={20} height={20} alt="back" />
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
            <p className="ml-2 font-bold ">{selectedContact.name}</p>
            {/* <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text-[14px]">
              All Chats / WhatsApp / Facebook / Web
            </p> */}
          </div>
          <p className="text-[#343233] ml-2 text-[14px] leading-4">
            with{" "}
            <span className="capitalize font-bold">{loggedInUserName}</span>
          </p>
        </div>
      </div>
    </div>
  )}

  
</div>
{/* Chat messages display */}
<div id="message-container" className="mt-4 omni-scroll-bar" style={{ height: 'calc(100vh - 325px)', overflowY: "auto" }}>
  {messages
  .filter(message => message.receiver_id === receiverId || message.sender_id === receiverId )
  .map((message, index) => (
    
    <div
      key={index}
      className={`flex mb-2 ${
        message.sender_id === loggedInUserId ? "justify-end" : "justify-start"
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
                <p className="text-[#343233] text-[14px] md:text-[16px] lmd:eading-[19px]">
                  {message.message}
                </p>
              </div>
              <div className="rounded-full ml-2">
                <Image
                  src={selectedContact.profile_img || "/assets/chat-dp.svg"}
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
              </div>
              <p className="text-[##676767] text-[12px] leading-[14px]">
                {moment(message.timestamp).format("h:mm a")}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {message && (message.sender_id === loggedInUserId) && (
            <div className="rounded-full">
              <Image
                src={selectedContact.profile_img || "/assets/chat-dp.svg"}
                width={30}
                height={30}
                alt="profile image"
              />
            </div>
          )}
          <div className="flex flex-col mr-2">
            <div
              className={`bg-[#F3F3F3] py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] ${
                message.sender_id === loggedInUserId ? "bg-[#D5F1FF]" : ""
              }`}
            >
              <p className="text-[#343233] text-[14px] md:text-[16px] leading-[19px]">
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
<div className="flex w-full items-center">
  <div className="flex w-full">
    <textarea
      placeholder="Enter here"
      className="textarea"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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
</div> 
// ternary opertaor else part
:
 (
  <div className={`w-full px-3 ${chats && chatsVisible ? "visible" : "invisible w-0"}`}>
  {isSmallScreen && chats && (
    <div className="mt-4 mb-2 flex text-[#2D8AC5] cursor-pointer" onClick={goBack}>
      <Image src="/assets/arrow-left.svg" width={20} height={20} alt="back" />
      <span className="ml-2">Back to Chats</span>
    </div>
  )}
  <div className="flex flex-col lg:flex-row justify-between">
    {chats && (
      <div>
        <div className="flex">
          <Image
            src={chats.profile_img || "/assets/chat-dp.svg"}
            width={50}
            height={50}
            alt="profile image"
          />
          <div>
            <div className="flex flex-col md:flex-row">
              <p className="ml-2 font-bold ">{chats.name}</p>
              <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text-[14px]">
                All Chats / WhatsApp / Facebook / Web
              </p>
            </div>
            <p className="text-[#343233] ml-2 text-[14px] leading-4">
              with{" "}
              <span className="capitalize font-bold">{loggedInUserName}</span>
            </p>
          </div>
        </div>
      </div>
    )}
  
    <div className="flex mt-2 lg:mt-0 items-center justify-end">
      <div className="bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white">
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
  
      <div className="relative ml-3">
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
      </div>
    </div>
  </div>
  {/* Chat messages display */}
  <div id="message-container" className="mt-4 omni-scroll-bar" style={{ height: 'calc(100vh - 325px)', overflowY: "auto" }}>
    {messages
    .filter(message => message.receiver_id === receiverId || message.sender_id === receiverId && message.sender_id !== loggedInUserId)
    .map((message, index) => (
      <div
        key={index}
        className={`flex mb-2 ${
          message.sender_id === loggedInUserId ? "justify-end" : "justify-start"
        }`}
      >
        {message && message.sender_id === loggedInUserId ? (
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
                  <p className="text-[#343233] text-[14px] md:text-[16px] lmd:eading-[19px]">
                    {message.message}
                  </p>
                </div>
                <div className="rounded-full ml-2">
                  <Image
                    src={chats.profile_img || "/assets/chat-dp.svg"}
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
                </div>
                <p className="text-[##676767] text-[12px] leading-[14px]">
                  {moment(message.timestamp).format("h:mm a")}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {message && !(message.sender_id === loggedInUserId) && (
              <div className="rounded-full">
                <Image
                  src={chats.profile_img || "/assets/chat-dp.svg"}
                  width={30}
                  height={30}
                  alt="profile image"
                />
              </div>
            )}
            <div className="flex flex-col ml-2">
              <div
                className={`bg-[#F3F3F3] py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] ${
                  message.sender_id === loggedInUserId ? "bg-[#D5F1FF]" : ""
                }`}
              >
                <p className="text-[#343233] text-[14px] md:text-[16px] leading-[19px]">
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
  <div className="flex w-full items-center">
    <div className="flex w-full">
      <textarea
        placeholder="Enter here"
        className="textarea"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
    </div>
    <div
      className="bg-[#F7F7F7] rounded-[50px] ml-2 p-[5px] w-[48px] h-[48px] flex justify-center items-center"
      onClick={sendMessage}
    >
      <Image src="/assets/send-btn.png" width={28} height={28} alt="send" />
    </div>
  </div>
  </div> 
)
    
  
  }
    </>
  );
};

export default ChatMessages;


