import { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "@/context/SocketContext";
import styles from "./emp.module.css";

const ChatMessages = ({
  preferredPlatform,
  setPreferredPlatform,
  selectedContact,
  chats,
  chatsVisible,
  toggleOptions,
  showOptions,
  goBack,
  parentCompanyDetails,
  allChats,
  mode,
  setMode,
  handleOptionClick,
  companyWhatsapp,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [parentCompanyId, setParentCompanyId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [roomName, setRoomName] = useState(null); // New state to store the room name
  const [socketId, setSocketId] = useState("");
  const [guestUserData, setGuestUserData] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [lastMessagePlatform, setLastMessagePlatform] = useState("");

  // console.log("selectedContact",selectedContact?.preferred_platform)
  // console.log("allChats",allChats)
  // console.log("preferred platform", preferredPlatform)
  // console.log("mode", mode)
  const socket = useSocket();

  useEffect(() => {
    setCharacterCount(newMessage.length);
    // console.log("character count", characterCount)
  }, [newMessage]);

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
    // Retrieve loggedInUserId from local storage
    const token = localStorage.getItem("employee_access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      // console.log("tok",decodedToken)
      setLoggedInUserId(decodedToken.employee_id);
      setParentCompanyId(decodedToken.company_id);
      setLoggedInUserName(decodedToken.user_name);
    }
  }, []);

  // const processChatHistoryAPI = async (chatHistory, parentCompanyId, loggedInUserId, selectedContact) => {
  //   try {
  //     const response = await axios.post('http://localhost:7000/api/v1/employee/process-chat-history-for-ai-bot', {
  //       chatHistory,
  //       companyId: parentCompanyId,
  //       userId: parentCompanyId,
  //       sessionId: selectedContact?.sessionId || 'sessionId',
  //       chatId: selectedContact?.chatId || 'chatId',
  //       messageId: selectedContact?.messageId || 'messageId',
  //       platform:preferredPlatform,
  //       receiverId:receiverId,
  //       senderId:loggedInUserId,
  //       senderName:loggedInUserName,
  //       phoneNumber:selectedContact?.phone,
  //     });

  //     if (response) {
  //       console.log("Chat history processed successfully:", response);
  //     } else {
  //       console.error("Error processing chat history:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error processing chat history:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (socket) {
  //     // Emit "storeUserId" event to associate user ID with socket ID
  //     socket.emit("storeUserId", loggedInUserId); // Replace loggedInUserId with the actual user ID

  //     // Listen for "chatMessage" event
  //     socket.on("chatMessage", (message) => {

  //       if(message.user_type === "guest"){
  //         setGuestUserData(message)
  //       }
  //       // setGuestUserData(message)
  //       // Handle incoming chat message

  //       console.log("Received chat message:", message);
  //       // Update messages state with the new message
  //       setMessages((prevMessages) => [...prevMessages, message]);

  //        if (mode === "auto") {
  //         processChatHistoryAPI([...messages, message], parentCompanyId, loggedInUserId, selectedContact);
  //       }

  //     });

  //     // Clean up event listener when component unmounts
  //     return () => {
  //       socket.off("chatMessage");
  //     };
  //   }
  // }, [socket, loggedInUserId]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("whatsappMessage", (message) => {
  //       console.log("whatsapp recevied evenet",message)
  //       setMessages((prevMessages) => [...prevMessages, message]);

  //       if (mode === "auto") {
  //         processChatHistoryAPI([...messages, message], parentCompanyId, loggedInUserId, selectedContact);
  //       }
  //     });
  //   }
  // }, [socket]);

  const processChatHistoryAPI = async (
    chatHistory,
    parentCompanyId,
    loggedInUserId,
    selectedContact
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/process-chat-history-for-ai-bot`,
        {
          chatHistory,
          companyId: parentCompanyId,
          userId: parentCompanyId,
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
      socket.emit("storeUserId", loggedInUserId);

      const handleChatMessage = (message) => {
        if (message.user_type === "guest") {
          setGuestUserData(message);
        }
        console.log("Received chat message:", message);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          if (mode === "auto") {
            processChatHistoryAPI(
              updatedMessages,
              parentCompanyId,
              loggedInUserId,
              selectedContact
            );
          }
          return updatedMessages;
        });
      };

      socket.on("chatMessage", handleChatMessage);

      // Clean up event listener when component unmounts
      return () => {
        socket.off("chatMessage", handleChatMessage);
      };
    }
  }, [socket, loggedInUserId, mode, parentCompanyId, selectedContact]);

  useEffect(() => {
    if (socket) {
      const handleWhatsAppMessage = (message) => {
        console.log("Received WhatsApp message:", message);
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          if (mode === "auto") {
            processChatHistoryAPI(
              updatedMessages,
              parentCompanyId,
              loggedInUserId,
              selectedContact
            );
          }
          return updatedMessages;
        });
        getlastwhatsappmsg(parentCompanyId, selectedContact.phone);
      };

      socket.on("whatsappMessage", handleWhatsAppMessage);

      // Clean up event listener when component unmounts
      return () => {
        socket.off("whatsappMessage", handleWhatsAppMessage);
      };
    }
  }, [socket, mode, parentCompanyId, loggedInUserId, selectedContact]);

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
      // Generate a unique room name based on user IDs for private messaging
      // const generatedRoomName = `${loggedInUserId}`;
      // const generatedRoomName = `${loggedInUserId}`;

      // setRoomName(generatedRoomName);
      // const generatedReceiverId = selectedContact && (selectedContact.employee_id || selectedContact.customer_id || selectedContact.user_id);
      //     const generatedReceiverId =
      // (selectedContact && selectedContact.user_type === "guest")
      //   ? (selectedContact.receiver_id !== loggedInUserId ? selectedContact.receiver_id : selectedContact.sender_id)
      //   : (selectedContact && (selectedContact.employee_id || selectedContact.customer_id || selectedContact.user_id));

      const generatedReceiverId =
        selectedContact?.selected_employee_id == loggedInUserId
          ? selectedContact?.sender_id
          : selectedContact?.selected_employee_id;

      setReceiverId(generatedReceiverId);

      // Join the room when a user is selected
      // if (socket) {
      //   socket.emit("joinRoom", generatedRoomName);
      // }

      //     // Usage in your code
      // if (selectedContact) {

      //   if (selectedContact.preferred_platform === "webchat") {
      //     fetchWebchatMessages(parentCompanyId, loggedInUserId, generatedReceiverId, setMessages);
      //   } else if (selectedContact.preferred_platform === "whatsApp") {
      //     fetchWhatsAppMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //   } else if (selectedContact.preferred_platform === "sms") {
      //     fetchSMSMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //   }else if(selectedContact.preferred_platform.includes("sms") && selectedContact.preferred_platform.includes("whatsApp")){
      //     fetchSMSMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //     fetchWhatsAppMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //   }else if(selectedContact.preferred_platform.includes("sms") && selectedContact.preferred_platform.includes("webchat")){
      //     fetchSMSMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //     fetchWebchatMessages(parentCompanyId, loggedInUserId, generatedReceiverId, setMessages);
      //   }else if (selectedContact.preferred_platform.includes("whatsApp") && selectedContact.preferred_platform.includes("webchat")) {
      //     fetchWhatsAppMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //     fetchWebchatMessages(parentCompanyId, loggedInUserId, generatedReceiverId, setMessages);
      //   }else if (

      //     selectedContact.preferred_platform.includes("whatsApp") &&
      //     selectedContact.preferred_platform.includes("sms") &&
      //     selectedContact.preferred_platform.includes("webchat")
      //   ) {
      //     fetchWhatsAppMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //     fetchSMSMessages(parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //     fetchWebchatMessages(parentCompanyId, loggedInUserId, generatedReceiverId, setMessages);
      //   }

      // }

      // console.log("generatedReceiverId",generatedReceiverId)

      if (selectedContact && selectedContact.preferred_platform) {
        const preferredPlatforms = selectedContact.preferred_platform
          ?.split(",")
          .map((p) => p.trim());

        if (preferredPlatforms.includes("webchat")) {
          fetchWebchatMessages(
            parentCompanyId,
            loggedInUserId,
            generatedReceiverId,
            setMessages
          );
        }

        if (preferredPlatforms.includes("whatsApp")) {
          fetchWhatsAppMessages(
            parentCompanyId,
            loggedInUserId,
            selectedContact.phone,
            setMessages
          );
        }

        if (preferredPlatforms.includes("sms")) {
          fetchSMSMessages(
            parentCompanyId,
            loggedInUserId,
            selectedContact.phone,
            setMessages
          );
        }
      }

      // if (selectedContact) {
      //   const platformFunctions = {
      //     webchat: fetchWebchatMessages,
      //     whatsApp: fetchWhatsAppMessages,
      //     sms: fetchSMSMessages
      //   };

      //   const preferredPlatforms = selectedContact.preferred_platform.split(",").map(p => p.trim());
      //   preferredPlatforms.forEach(platform => {
      //     if (platformFunctions.hasOwnProperty(platform)) {
      //       platformFunctions[platform](parentCompanyId, loggedInUserId, selectedContact.phone, setMessages);
      //     }
      //   });
      // }
    }
  }, [selectedContact, socket, loggedInUserId, chats]);

  // Function to fetch messages for webchat platform
  const fetchWebchatMessages = (
    parentCompanyId,
    loggedInUserId,
    generatedReceiverId,
    setMessages
  ) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/get-all-messages`, {
        params: {
          user_id: parentCompanyId,
          sender_id: loggedInUserId,
          receiver_id: generatedReceiverId,
        },
      })
      .then((response) => {
        // getlastwebchatmsg(parentCompanyId);
        getlastwebchatmsg(parentCompanyId);
        setMessages(response.data.messages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  // Function to fetch messages for WhatsApp platform
  const fetchWhatsAppMessages = (
    parentCompanyId,
    loggedInUserId,
    phoneNumber,
    setMessages
  ) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/get-all-whatsapp-messages`,
        {
          params: {
            sender_id: companyWhatsapp,
            user_id: parentCompanyId,
            receipient_whatsapp: phoneNumber,
          },
        }
      )
      .then((response) => {
        getlastwhatsappmsg(parentCompanyId, phoneNumber);

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
        console.log("whatsapp last ", response);
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
        console.log("whatsapp last ", response.data.messages[0].message);
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
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/get-latest-messages`, {
        params: {
          user_id: loggedInUserId,
        },
      })
      .then((response) => {
        console.log("web latest  ", response);
        localStorage.setItem(
          "weblmsg" + response.data.messages[0].receiver_id,
          response.data.messages[0].message
        );
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp messages:", error);
      });
  };

  // Function to fetch messages for SMS platform
  const fetchSMSMessages = (
    parentCompanyId,
    loggedInUserId,
    phoneNumber,
    setMessages
  ) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sms/get-all-sms`, {
        params: {
          sender_id: loggedInUserId,
          user_id: parentCompanyId,
          receipient_whatsapp: phoneNumber,
        },
      })
      .then((response) => {
        getlastSMSmsg(parentCompanyId, selectedContact.phone);

        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.messages,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching SMS messages:", error);
      });
  };

  // Function to fetch messages for all preferred platforms

  const sendMessage = () => {
    if (socket && newMessage.trim() !== "" && selectedContact) {
      // const message = newMessage.trim();
      const message = newMessage.trim();
      const data = {
        // user_id: selectedContact.company_id,
        // sender_id: loggedInUserId,
        // receiver_id: selectedContact.employee_id || selectedContact.employee_id ,
        user_id: parentCompanyId,
        sender_id: loggedInUserId,
        receiver_id: receiverId,
        message,
        sender_name: loggedInUserName,
        platform: selectedContact?.preferred_platform,
        // room: roomName, // Include the room information in the data
      };

      // Calculate the number of SMS messages required based on character count
      let smsCount = Math.ceil(message.length / 153);

      // Update the local state with the sent message
      // setMessages((prevMessages) => [...prevMessages, { message, sender_id: loggedInUserId }]);
      // Emit the chat message to the specific room
      // socket.emit("chatMessage", data);
      // If the SMS count exceeds 3, set it to 3
      if (smsCount > 3) {
        smsCount = 3;
      }

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
      if (selectedContact?.is_merged === 1) {
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
    localStorage.setItem("empwebchat", message);

    const direction = loggedInUserId || aiBotResponse ? "out" : "in";
    const messageType = selectedContact?.mode == "manual" ? "user" : "aiBot";

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/send-message-guest`, {
        // user_id: selectedContact.company_id,
        // sender_id: selectedContact.employee_id,
        // receiver_id: selectedContact.company_id,
        // message: message,

        user_id: parentCompanyId,
        sender_id: loggedInUserId,
        sender_name: loggedInUserName,
        receiver_id: receiverId,
        message: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        getlastwebchatmsg(parentCompanyId);

        setNewMessage(""); // Clear the input field after sending the message
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const sendWhatsAppMessage = (message) => {
    const direction = loggedInUserId || aiBotResponse ? "out" : "in";
    const messageType = selectedContact?.mode == "manual" ? "user" : "aiBot";
    // Clear the message input immediately
    setNewMessage("");
    localStorage.setItem("empwhatsapp", message);
    // Send message through WhatsApp
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/send-message`, {
        user_id: parentCompanyId,
        sender_id: loggedInUserId,
        sender: companyWhatsapp,
        sender_name: loggedInUserName,
        recipient: selectedContact && selectedContact.phone,
        message: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        setNewMessage("");

        getlastwhatsappmsg(parentCompanyId, selectedContact.phone);

        console.log("WhatsApp message sent:", response.data);
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
    localStorage.setItem("empsms", message);

    setNewMessage("");
    // Send message through WhatsApp
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/sms/send-sms`, {
        user_id: parentCompanyId,
        rcpt: parseInt(selectedContact && selectedContact.phone),
        txt: message,
        direction: direction,
        message_type: messageType,
      })
      .then((response) => {
        fetchSMSMessages(
          parentCompanyId,
          loggedInUserId,
          selectedContact.phone,
          message
        );
        setNewMessage("");
        console.log("eurosms message sent:", response.data);
      })
      .catch((error) => {
        console.error("Error sending eurosms message:", error);
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
      // const generatedReceiverId = selectedContact && (selectedContact.employee_id || selectedContact.customer_id || selectedContact.user_id);
      // const generatedReceiverId =
      // (selectedContact && selectedContact.user_type === "guest")
      //   ? (selectedContact.receiver_id !== loggedInUserId ? selectedContact.receiver_id : selectedContact.sender_id)
      //   : (selectedContact && (selectedContact.employee_id || selectedContact.customer_id || selectedContact.user_id));
      const generatedReceiverId =
        selectedContact?.selected_employee_id == loggedInUserId
          ? selectedContact?.sender_id
          : selectedContact?.selected_employee_id;

      setReceiverId(generatedReceiverId);
    }
  }, [selectedContact]);

  return (
    <>
      {selectedContact && selectedContact ? (
        <div
          className={`w-full px-3 ${
            selectedContact ? "visible" : "invisible w-0"
          }`}
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
              {/* <div className="bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white invisible"> */}
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
                  message.receipient_whatsapp == selectedContact.phone ||
                  message.sender_id === selectedContact.phone
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
                              className="text-[#343233] text-[14px] md:text-[16px] lmd:eading-[19px]"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {message.message}
                            </p>
                          </div>
                          <div className="rounded-full ml-2">
                            <Image
                              src={
                                selectedContact.profile_img ||
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
                              selectedContact.profile_img ||
                              "/assets/chat-dp.svg"
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
                  Remaining {Math.max(459 - characterCount, 0)}, accounted for
                  as {Math.ceil(characterCount / 153)} SMS
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
              <Image
                src="/assets/send-btn.png"
                width={28}
                height={28}
                alt="send"
              />
            </div>
          </div>
          {selectedContact?.preferred_platform == "sms" && (
            <p className="sms-text">MAX. 459 Characters.</p>
          )}
        </div>
      ) : (
        // ternary opertaor else part
        <div
          className={`${styles.widmsg} px-3 ${
            chats && chatsVisible ? "visible" : "invisible w-0"
          }`}
        >
          {isSmallScreen && chats && (
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
                      <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text-[14px] capitalize">
                        {/* All Chats / WhatsApp / Facebook / Web */}
                        {selectedContact?.preferred_platform}
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

              <div className="relative ml-3 invisible">
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
          <div
            id="message-container"
            className="mt-4 omni-scroll-bar"
            style={{ height: "calc(100vh - 325px)", overflowY: "auto" }}
          >
            {messages
              .filter(
                (message) =>
                  message.receiver_id === receiverId ||
                  (message.sender_id === receiverId &&
                    message.sender_id !== loggedInUserId)
              )
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex mb-2 ${
                    message.sender_id === loggedInUserId
                      ? "justify-end"
                      : "justify-start"
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
                            message.sender_id === loggedInUserId
                              ? "bg-[#D5F1FF]"
                              : ""
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
              <Image
                src="/assets/send-btn.png"
                width={28}
                height={28}
                alt="send"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessages;
