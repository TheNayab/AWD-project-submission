"use client";
import Image from "next/image";
import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "@/context/SocketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./company.module.css";

const ContactList = ({
  contacts,
  employees,
  handleCustomerClick,
  handleEmployeeClick,
  handleCompanyClick,
  customers,
  selectedContact,
  handleContactClick,
  handleGuestClick,
  handleCheckboxChange,
  selectedChats,
  allChats,
  setAllchats,
  allMergedChats,
  setAllMergedChats,
  mode,
  setMode,
  handleOptionClick,
}) => {
  // const [socket, setSocket] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [parentCompanyId, setParentCompanyId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null); // Changed here
  const [guestUserData, setGuestUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [whatsapplatest, setwhatsapplatest] = useState([]);
  const [llatestMessage, setllatestMessage] = useState("");
  const [eurosms, seteurosms] = useState("");
  const [smslatest, setsmslatest] = useState([]);
  const [WhatsappMessages, setWhatsappMessages] = useState([]);
  const [webchatlatest, setwebchatlatest] = useState([]);

  const socket = useSocket();
  // console.log(selectedContact)
  // Display only the selected contact if it exists

  // console.log("currentMode",mode)
  // console.log("customers",customers)
  // console.log("selected",selectedContact)

  //  const displayedContacts = selectedContact ? [selectedContact] : [];

  useEffect(() => {
    const token = localStorage.getItem("company_access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken)
      setLoggedInUserId(decodedToken.user_id);

      // setParentCompanyId(decodedToken.company_id);
    }
  }, []);

  useEffect(() => {
    function truncateMessage(message) {
      const words = message?.split(" ");
      if (words?.length > 3) {
        return words.slice(0, 3).join(" ") + "...";
      } else {
        return message;
      }
    }

    const intervalId = setInterval(() => {
      var items = [];
      allChats.forEach((item) => {
        var whatsappnoKey = "whatsappmsg" + item.phone;
        var whatsappmsgKey = "whatsapplmsg" + item.phone;

        var whatsappno = localStorage.getItem(whatsappnoKey);
        var whatsappmsg = localStorage.getItem(whatsappmsgKey);

        if (whatsappmsg) {
          var prefix = "whatsapplmsg";
          var phoneNumber = whatsappmsgKey.substring(prefix.length);

          if (item.phone === phoneNumber) {
            var truncatedMessage = truncateMessage(whatsappmsg);
            // Check for duplicates based on phone and truncated message
            if (
              !items.find(
                (obj) =>
                  obj.phone === whatsappno && obj.message === truncatedMessage
              )
            ) {
              items.push({
                phone: whatsappno,
                message: truncatedMessage,
              });
            }
          }
        } else if (
          whatsappno &&
          !items.find((obj) => obj.phone === whatsappno)
        ) {
          items.push({ phone: whatsappno, message: null });
        }
      });
      setwhatsapplatest(items);
    }, 1 * 100);

    return () => clearInterval(intervalId);
  }, [allChats]);

  useEffect(() => {
    function truncateMessage(message) {
      const words = message?.split(" ");
      if (words?.length > 3) {
        return words.slice(0, 3).join(" ") + "...";
      } else {
        return message;
      }
    }

    const intervalId = setInterval(() => {
      var items = [];
      allChats.map((item) => {
        var whatsappnoKey = "whatsappmsg" + item.phone;
        var whatsappmsgKey = "smslmsg" + item.phone;

        var whatsappno = localStorage.getItem(whatsappnoKey);
        var whatsappmsg = localStorage.getItem(whatsappmsgKey);

        if (whatsappmsg) {
          var prefix = "smslmsg";
          var phoneNumber = whatsappmsgKey.substring(prefix.length);

          if (item.phone === phoneNumber) {
            var truncatedMessage = truncateMessage(whatsappmsg);
            // Check for duplicates based on phone and truncated message
            if (
              !items.find(
                (obj) =>
                  obj.phone === whatsappno && obj.message === truncatedMessage
              )
            ) {
              items.push({
                phone: whatsappno,
                message: truncatedMessage,
              });
            }
          }
        } else if (
          whatsappno &&
          !items.find((obj) => obj.phone === whatsappno)
        ) {
          items.push({ phone: whatsappno, message: null });
        }
      });

      setsmslatest(items);
    }, 1 * 100);
    return () => clearInterval(intervalId);
  }, [allChats]);

  useEffect(() => {
    function truncateMessage(message) {
      const words = message?.split(" ");
      if (words?.length > 3) {
        return words.slice(0, 3).join(" ") + "...";
      } else {
        return message;
      }
    }

    const intervalId = setInterval(() => {
      var items = [];
      allChats.map((item) => {
        var whatsappmsgKey = "weblmsg" + item.sender_id;
        var whatsappmsg = localStorage.getItem(whatsappmsgKey);

        if (whatsappmsg) {
          var prefix = "weblmsg";
          var phoneNumber = whatsappmsgKey.substring(prefix.length);

          if (item.sender_id == phoneNumber) {
            var truncatedMessage = truncateMessage(whatsappmsg);
            // Check for duplicates based on phone and truncated message
            if (
              !items.find(
                (obj) =>
                  obj.id === phoneNumber && obj.message === truncatedMessage
              )
            ) {
              items.push({
                id: phoneNumber,
                message: truncatedMessage,
              });
            }
          }
        }
      });

      setwebchatlatest(items);
    }, 1 * 100);

    return () => clearInterval(intervalId);
  }, [allChats]);

  // useEffect(() => {
  //   var items = [];
  //   allChats.map((item) => {
  //     var whatsappnoKey = "whatsappmsg" + item.phone;
  //     var whatsappmsgKey = "whatsapplmsg" + item.phone;

  //     var whatsappno = localStorage.getItem(whatsappnoKey);
  //     var whatsappmsg = localStorage.getItem(whatsappmsgKey);

  //     if (whatsappmsg) {
  //       var prefix = "whatsapplmsg";
  //       var phoneNumber = whatsappmsgKey.substring(prefix.length);
  //       console.log(
  //         `Extracted phoneNumber: ${phoneNumber} from key: ${whatsappmsgKey}`
  //       );
  //       if (item.phone === phoneNumber) {
  //         // Check for duplicates based on phone and message
  //         if (
  //           !items.find(
  //             (obj) => obj.phone === whatsappno && obj.message === whatsappmsg
  //           )
  //         ) {
  //           items.push({ phone: whatsappno, message: whatsappmsg });
  //           console.log(
  //             `Pushed to items: { phone: ${whatsappno}, message: ${whatsappmsg} }`
  //           );
  //         }
  //       }
  //     } else if (whatsappno && !items.find((obj) => obj.phone === whatsappno)) {
  //       items.push({ phone: whatsappno, message: null });
  //       console.log(`Pushed to items: { phone: ${whatsappno}, message: null }`);
  //     }
  //   });

  //   console.log("Final items array:", items);
  //   setwhatsapplatest(items);
  // }, [allChats]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      function truncateMessage(message) {
        const words = message?.split(" ");
        if (words?.length > 3) {
          return words.slice(0, 3).join(" ") + "...";
        } else {
          return message;
        }
      }

      let msg = localStorage.getItem("eurosms");
      seteurosms(truncateMessage(msg));
    }, 1 * 100);
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:7000");

  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("chatMessage", (message) => {
  //       // console.log("msgss",message)
  //       setMessages((prevMessages) => [...prevMessages, message]);
  //       // setLatestMessage(message); // Updated here
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("chatMessage");
  //     }
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   if (selectedContact) {
  //     setReceiverId(selectedContact.employee_id || selectedContact.customer_id);
  //     const generatedRoomName = `${selectedContact.employee_id || selectedContact.customer_id}`;
  //     setRoomName(generatedRoomName);

  //     if (socket) {
  //       socket.emit("joinRoom", generatedRoomName);
  //     }
  //   }
  // }, [selectedContact, socket, loggedInUserId]);

  // const getMessage = () => {
  //   if (socket && roomName) {
  //     socket.emit("chatMessage", roomName);
  //   }
  // };
  useEffect(() => {
    const intervalId = setInterval(() => {
      function truncateMessage(llatestMessage) {
        const words = llatestMessage?.split(" ");
        if (words?.length > 3) {
          return words.slice(0, 3).join(" ") + "...";
        } else {
          return llatestMessage;
        }
      }

      let ltmsg = localStorage.getItem("latestmessage");
      let msg = truncateMessage(ltmsg);

      setllatestMessage(msg);
    }, 1 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (socket) {
      // Emit "storeUserId" event to associate user ID with socket ID
      socket.emit("storeUserId", loggedInUserId); // Replace loggedInUserId with the actual user ID

      // Listen for "chatMessage" event
      socket.on("chatMessage", (message) => {
        if (message.user_type === "guest") {
          setGuestUserData(message);
        }
        // setGuestUserData(message);
        // Handle incoming chat message
        console.log("Received chat message on contact:", message);
        // Update messages state with the new message
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Clean up event listener when component unmounts
      return () => {
        socket.off("chatMessage");
      };
    }
  }, [socket, loggedInUserId]);
  const truncateMessage = (message) => {
    message = String(message); // Convert to string
    // console.log(message);
    if (message.length > 23) {
      return message.slice(0, 20) + ".....";
    } else {
      return message;
    }
  };

  // useEffect(() => {
  //   // console.log(loggedInUserId)

  //   if ( selectedContact && loggedInUserId !== null) {

  //     axios
  //       .get(
  //         `http://localhost:7000/api/v1/chats/get-latest-message?user_id=${loggedInUserId}&sender_id=${loggedInUserId}&receiver_id=${receiverId}`
  //       )
  //       .then((response) => {
  //         if (response.data.success) {
  //           const lastMessage = response.data.latestMessage;
  //           // console.log("last",lastMessage[0].message)
  //           setLatestMessage(lastMessage[0].message); // Updated here
  //         } else {
  //           console.error(
  //             "Failed to fetch latest message:",
  //             response.data.error
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching latest message:", error);
  //       });
  //   }
  // }, [loggedInUserId,receiverId]);

  useEffect(() => {
    // Function to fetch all contacts when the component mounts
    const getAllContacts = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-chats?user_id=${loggedInUserId}&selected_employee_id=${loggedInUserId}&mode=${mode}`
        )
        .then((response) => {
          if (response.data) {
            let filteredChats = response.data;

            if (mode === "auto") {
              filteredChats = filteredChats.filter(
                (chat) => chat.mode === "auto"
              );
            } else if (mode === "manual") {
              filteredChats = filteredChats.filter(
                (chat) => chat.mode === "manual"
              );
            }
            setAllchats(filteredChats);
          } else {
            console.error("Failed to fetch contacts:", response.data.error);
          }
        })
        .catch((error) => {
          console.error("Error fetching contacts:", error);
        });
    };

    const getAllMergedContacts = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-merged-chats?user_id=${loggedInUserId}&selected_employee_id=${loggedInUserId}`
        )
        .then((response) => {
          // console.log("response", response.data);

          if (response.data && response.data.length > 0) {
            setAllMergedChats(response.data);
          } else {
            console.error("Failed to fetch contacts:", response.data.error);
          }
        })
        .catch((error) => {
          console.error("Error fetching contacts:", error);
        });
    };

    // Call getAllContacts when the component mounts
    getAllContacts();
    getAllMergedContacts();

    // Listen for chatMessage event
    if (socket) {
      socket.on("chatMessage", () => {
        // Call getAllContacts when a chatMessage event is received
        getAllContacts();
      });
      socket.on("chatsMerged", () => {
        getAllContacts();
        getAllMergedContacts();
      });
      socket.on("newChat", () => {
        getAllContacts();
      });

      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        socket.off("chatMessage");
        socket.off("whatsappMessage");
        socket.off("chatsMerged");
        socket.off("newChat");
      };
    }
  }, [mode, socket, loggedInUserId, setAllchats, setAllMergedChats]);

  useEffect(() => {
    // console.log("selectedContact:", allChats);
  }, [allChats, allMergedChats]); // Log selectedContact whenever it changes

  const searchChats = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/search-chats?user_id=${loggedInUserId}&selected_employee_id=${loggedInUserId}&searchTerm=${searchTerm}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setAllchats(response.data);
        } else {
          setAllchats([]);
        }
      })
      .catch((error) => {
        console.error("Error searching chats:", error);
      });
  };

  // Function to handle search term change
  // Function to handle search term change
  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Trigger search when the search term is not empty
    if (value.trim() !== "") {
      searchChats();
    } else {
      // Clear the search results when the search term is empty
      setAllchats([]);
    }
  };

  return (
    <div
      className={`${styles.widthcon} md:w-[317px] border-r-[1px] overflow-y-auto omni-scroll-bar pr-4`}
      style={{ height: "calc(100vh - 200px)" }}
    >
      <input
        type="search"
        placeholder="Search Contacts"
        name="search"
        id="search"
        className="add_employee_inputs"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <div className="mt-5">
        <ul>
          {allMergedChats
            ? allMergedChats.map((contact) => (
                <li
                  key={contact.id}
                  className={`mb-2 py-[4px] px-[8px] gap-3 ${
                    selectedContact?.id === contact.id
                      ? "bg-[#DBF3FF]"
                      : "bg-white"
                  } rounded-xl`}
                  onClick={() => handleContactClick(contact)}
                >
                  <div className="flex cursor-pointer">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="rounded-full"
                        onClick={(e) => handleCheckboxChange(contact.id, e)}
                      >
                        {selectedChats.some(
                          (chat) => chat.contactId === contact.id
                        ) ? (
                          <Image
                            src="/assets/checkbox-checked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        ) : (
                          <Image
                            src="/assets/checkbox-unchecked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        )}
                      </button>
                      <div className="rounded-full">
                        <Image
                          src={contact.profile_img || "/assets/chat-dp.svg"}
                          width={50}
                          height={50}
                          alt="profile image"
                        />
                      </div>
                    </div>
                    <div className="ml-2 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          {contact?.merged_name?.split(",")[0]}
                        </span>
                        {/* <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" /> */}
                        {/* Render chat logo based on preferred platform */}
                        {contact.preferred_platform == "webchat" && (
                          <Image
                            src="/assets/webchat-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "facebook" && (
                          <Image
                            src="/assets/facebook-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "sms" && (
                          <Image
                            src="/assets/eurosms-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "whatsApp" && (
                          <Image
                            src="/assets/whatsapp-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                      </div>
                      <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                        {messages && messages.length > 0
                          ? truncateMessage(
                              messages[messages.length - 1].message
                            )
                          : truncateMessage(latestMessage)}
                      </h1>
                    </div>
                  </div>
                </li>
              ))
            : ""}
        </ul>

        <ul>
          {allChats
            ? allChats.map((contact) => (
                <li
                  key={contact.id}
                  className={`mb-2 py-[4px] px-[8px] gap-3 ${
                    selectedContact?.id === contact.id
                      ? "bg-[#DBF3FF]"
                      : "bg-white"
                  } rounded-xl`}
                  onClick={() => handleContactClick(contact)}
                >
                  <div className="flex cursor-pointer">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="rounded-full"
                        onClick={(e) => handleCheckboxChange(contact.id, e)}
                        disabled={contact.preferred_platform === "webchat"}
                      >
                        {selectedChats.some(
                          (chat) => chat.contactId === contact.id
                        ) ? (
                          <Image
                            src="/assets/checkbox-checked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        ) : (
                          <Image
                            src="/assets/checkbox-unchecked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        )}
                      </button>
                      <div className="rounded-full">
                        <Image
                          src={contact.profile_img || "/assets/chat-dp.svg"}
                          width={50}
                          height={50}
                          alt="profile image"
                        />
                      </div>
                    </div>
                    <div className="ml-2 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          {contact.name.split(",")[0]}
                        </span>
                        {/* <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" /> */}
                        {/* Render chat logo based on preferred platform */}
                        {contact.preferred_platform == "webchat" && (
                          <Image
                            src="/assets/webchat-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "facebook" && (
                          <Image
                            src="/assets/facebook-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "sms" && (
                          <Image
                            src="/assets/eurosms-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                        {contact.preferred_platform === "whatsApp" && (
                          <Image
                            src="/assets/whatsapp-logo.svg"
                            width={16}
                            height={16}
                            alt="chat logo"
                          />
                        )}
                      </div>
                      <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                        {/* {messages && messages.length > 0
                          ? truncateMessage(
                              messages[messages.length - 1].message
                            )
                          : truncateMessage(latestMessage)} */}
                        {contact.preferred_platform === "whatsApp" &&
                          whatsapplatest.map((item, index) =>
                            contact.phone == item.phone && item.message ? (
                              <p key={index}>{item.message}</p>
                            ) : null
                          )}

                        {contact.preferred_platform === "sms" &&
                          smslatest.map((item, index) =>
                            contact.phone == item.phone && item.message ? (
                              <p key={index}>{item.message}</p>
                            ) : null
                          )}

                        {contact.preferred_platform == "webchat" &&
                          webchatlatest.map((item, index) =>
                            contact.sender_id == item.id ? (
                              <p key={index}>{item.message}</p>
                            ) : null
                          )}
                      </h1>
                    </div>
                  </div>
                </li>
              ))
            : chats.map((message) => (
                <li
                  key={message.sender_id}
                  className="mb-2 py-[4px] px-[8px] gap-3 bg-[#DBF3FF] rounded-xl"
                  onClick={() => handleContactClick(selectedContact)}
                >
                  <div className="flex cursor-pointer" onClick={toggleChats}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        className="rounded-full"
                        onClick={() => handleCheckboxChange(message.sender_id)}
                      >
                        {selectedChats.includes(message.sender_id) ? (
                          <Image
                            src="/assets/checkbox-checked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        ) : (
                          <Image
                            src="/assets/checkbox-unchecked.svg"
                            width={24}
                            height={24}
                            alt="profile image"
                          />
                        )}
                      </button>
                      <div className="rounded-full">
                        <Image
                          src={message.profile_img || "/assets/chat-dp.svg"}
                          width={50}
                          height={50}
                          alt="profile image"
                        />
                      </div>
                    </div>
                    <div className="ml-2 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">
                          {contactNames
                            ? contactNames[message.sender_id] ||
                              contactNames[message.receiver_id] ||
                              message.sender_name
                            : message.sender_name}
                        </span>
                        <Image
                          src="/assets/webchat-logo.svg"
                          width={16}
                          height={16}
                          alt="chat logo"
                        />
                      </div>
                      <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                        {(message.last_message &&
                          truncateMessage(message.last_message)) ||
                          (latestMessage && truncateMessage(latestMessage))}
                      </h1>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;
