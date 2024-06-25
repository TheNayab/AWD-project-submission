"use client";
// components/ChatMessages.js
import { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import { useSocket } from "@/context/SocketContext";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const ChatMessages = ({
  selectedContact,
  toggleOptions,
  showOptions,
  goBack,
}) => {
  const searchParams = useSearchParams();
  const myParam = searchParams.get("db");
  const socket = useSocket();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [companyId, setcompanyId] = useState(myParam);
  const [receiverId, setReceiverId] = useState("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)"); // Adjust the max-width as needed

    const handleScreenSizeChange = (e) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleScreenSizeChange);
    setIsSmallScreen(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenSizeChange);
    };
  }, []);

  const fetchWebchatMessages = (myParam, generatedReceiverId, setMessages) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/chats/get-all-messages`, {
        params: {
          user_id: myParam,
          sender_id: myParam,
          receiver_id: generatedReceiverId,
        },
      })
      .then((response) => {
        setMessages(response.data.messages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const fetchWhatsAppMessages = (myParam, phoneNumber, setMessages) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/get-all-whatsapp-messages`,
        {
          params: {
            sender_id: myParam,
            user_id: myParam,
            receipient_whatsapp: phoneNumber,
          },
        }
      )
      .then((response) => {
        console.log("whatsapp res", response);

        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.messages,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching WhatsApp messages:", error);
      });
  };

  // ## GET ALL SMS MESSAGES

  const fetchSMSMessages = (myParam, phoneNumber, setMessages) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/sms/get-all-sms`, {
        params: {
          sender_id: myParam,
          user_id: myParam,
          receipient_whatsapp: phoneNumber,
        },
      })
      .then((response) => {
        console.log("SMS res", response);
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.messages,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching SMS messages:", error);
      });
  };

  useEffect(() => {
    if (selectedContact) {
      setMessages([]);

      const generatedReceiverId =
        selectedContact?.selected_employee_id == myParam
          ? selectedContact?.sender_id
          : selectedContact?.selected_employee_id;

      setReceiverId(generatedReceiverId);

      if (selectedContact && selectedContact.preferred_platform) {
        const preferredPlatforms = selectedContact?.preferred_platform
          ?.split(",")
          .map((p) => p.trim());

        if (preferredPlatforms.includes("webchat")) {
          fetchWebchatMessages(myParam, generatedReceiverId, setMessages);
        }

        if (preferredPlatforms.includes("whatsApp")) {
          fetchWhatsAppMessages(myParam, selectedContact?.phone, setMessages);
        }

        if (preferredPlatforms.includes("sms")) {
          fetchSMSMessages(myParam, selectedContact?.phone, setMessages);
        }
      }
    }
  }, [selectedContact, socket, myParam]);
  return (
    <div
      className={`w-full h-screen px-3 ${
        selectedContact ? "visible" : "invisible w-0"
      }`}
    >
      {isSmallScreen && selectedContact && (
        <div
          className="mt-4 mb-2 flex text-[#2D8AC5]  cursor-pointer"
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
                src="/assets/chat-dp.svg"
                width={50}
                height={50}
                alt="profile image"
              />
              <div>
                <div className="flex flex-col md:flex-row">
                  <p className="ml-2 font-bold ">{selectedContact.name}</p>
                  <p className="lg:ml-3 ml-2 -mt-1 text-[10px] md:text[14px]">
                    All Chats / WhatsApp / Facebook / Web
                  </p>
                </div>
                <p className="text-[#343233] ml-2 text-[14px] leading-4">
                  with <span className="capitalize font-bold">Jamson</span>
                </p>
                {/* <p className="md:hidden lg:ml-3 ml-2 -mt-1 text-[px]">
                    All Chats / WhatsApp / Facebook / Web
                  </p> */}
              </div>
            </div>
          </div>
        )}

        <div className="flex mt-2 lg:mt-0  items-center justify-end">
          <div className="bg-[#2D8AC5] text-[14px] md:leading-4 py-[6px] px-[16px] md:py-[9px] md:px-[24px] rounded-[50px] flex items-center text-white">
            <p>Priority Chat:</p>
            <select
              name=""
              id=""
              className="outline-none bg-transparent font-bold custom-dropdown"
            >
              <option className="text-[#343233]" value="">
                Facebook
              </option>
              <option className="text-[#343233]" value="">
                WhatsApp
              </option>
              <option className="text-[#343233]" value="">
                Web Chat
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
      {/* Messages */}
      <div className="mt-4">
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
                message.sender_id === parseInt(myParam)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender_id === parseInt(myParam) ? (
                <>
                  <div className="flex flex-col">
                    <div className="flex">
                      <div
                        className={`bg-[#F3F3F3]  py-[8px] px-[16px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-0 rounded-bl-[12px] 
                              `}
                      >
                        <p className="text-[#343233] text-[14px] md:text-[16px] lmd:eading-[19px]">
                          {message.message}
                        </p>
                      </div>
                      <div className="rounded-full ml-2">
                        <Image
                          src="/assets/chat-dp.svg"
                          width={30}
                          height={30}
                          alt="profile image"
                        />
                      </div>
                    </div>

                    <div className="flex flex-row-reverse justify-between mt-1 mr-10">
                      <div className="rounded-[100x]">
                        {/* Change the order of logo and time when the sender is 'You' */}
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
                        {moment(message.time).format("h:mm a")}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Render the layout when the sender is not 'You'
                <>
                  {message.sender_id != parseInt(myParam) && (
                    <div className="rounded-full">
                      <Image
                        src="/assets/chat-dp.svg"
                        width={30}
                        height={30}
                        alt="profile image"
                      />
                    </div>
                  )}
                  <div className="flex flex-col ml-2">
                    <div
                      className={`py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]  ${
                        message.platform === "webchat"
                          ? "bg-[#F9B1B1]"
                          : message.platform === "whatsApp"
                          ? "bg-[#B2F9B1]"
                          : "bg-[#D5F1FF]"
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
                        {moment(message.time).format("h:mm a")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>

      {/* End of Messages */}
    </div>
  );
};

export default ChatMessages;
