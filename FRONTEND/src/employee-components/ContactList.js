import Image from "next/image";
import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "@/context/SocketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./emp.module.css";

const ContactList = ({
  userContacts,
  employees,
  handleCustomerClick,
  handleEmployeeClick,
  handleCompanyClick,
  customers,
  contacts,
  chats,
  setChats,
  toggleChats,
  handleContactClick,
  handleGuestClick,
  handleCheckboxChange,
  selectedChats,
  parentCompanyDetails,
  selectedContact,
  setSelectedContact,
  allChats,
  setAllchats,
  allMergedChats,
  setAllMergedChats,
  mode,
  setMode,
}) => {
  // const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [guestUserData, setGuestUserData] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [parentCompanyId, setParentCompanyId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contactNames, setContactNames] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [latestMessage, setLatestMessage] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sms, setsms] = useState("");
  const [whatsapp, setwhatsapp] = useState("");
  const [whatsapplatest, setwhatsapplatest] = useState([]);
  const [webchatlatest, setwebchatlatest] = useState([]);
  const [smslatest, setsmslatest] = useState([]);

  const socket = useSocket();

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

      let msg = localStorage.getItem("empwhatsapp");
      setwhatsapp(truncateMessage(msg));
    }, 1 * 100);
    return () => clearInterval(intervalId);
  }, []);

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

      let msg = localStorage.getItem("empsms");
      setsms(truncateMessage(msg));
    }, 1 * 100);
    return () => clearInterval(intervalId);
  }, []);

  // console.log("allchats", allChats);
  // console.log("gestuserdata",guestUserData)

  // console.log("employees",employees)
  // console.log("customers",customers)
  // console.log("selected",selectedContact)

  useEffect(() => {
    const token = localStorage.getItem("employee_access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.employee_id);
      setParentCompanyId(decodedToken.company_id);
      setLoggedInUserName(decodedToken.user_name);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      // Emit "storeUserId" event to associate user ID with socket ID
      socket.emit("storeUserId", loggedInUserId);

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

  useEffect(() => {
    if (socket) {
      socket.on("whatsappMessage", (message) => {
        console.log("whatsapp recevied event on contact", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

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
  //       setChats((prevContacts) => {
  //         const existingContactIndex = prevContacts.findIndex(
  //           (contact) =>
  //             contact.sender_id === message.sender_id ||
  //             contact.receiver_id === message.sender_id ||
  //             contact.sender_id === message.receiver_id ||
  //             contact.receiver_id === message.receiver_id
  //         );

  //         if (existingContactIndex !== -1) {
  //           const updatedContacts = [...prevContacts];
  //           updatedContacts[existingContactIndex].last_message = message.message;
  //           return updatedContacts;
  //         } else {
  //           // Find the selected contact index in the existing list
  //           const selectedIndex = prevContacts.findIndex(contact => contact.id === selectedContact.id);
  //           // Create a new list with the selected contact moved to the top
  //           const updatedContacts = selectedIndex !== -1 ? [selectedContact, ...prevContacts.filter((_, index) => index !== selectedIndex)] : [message, ...prevContacts];
  //           return updatedContacts;
  //         }
  //       });
  //       updateContactNames(message);
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("chatMessage");
  //     }
  //   };
  // }, [socket]);

  // // useEffect(() => {
  // //   if (loggedInUserId && socket) {
  // //     const generatedRoomName = `${loggedInUserId}`;
  // //     setRoomName(generatedRoomName);
  // //     socket.emit("joinRoom", generatedRoomName);
  // //   }
  // // }, [loggedInUserId, socket]);

  // useEffect(() => {
  //   if (parentCompanyId && loggedInUserId) {
  //     getAllContacts({ company_id: parentCompanyId, user_id: loggedInUserId });
  //   }
  // }, [parentCompanyId, loggedInUserId]);

  // const updateContactNames = (message) => {
  //   if (message.sender_id !== loggedInUserId) {
  //     const contactId = message.sender_id;
  //     const contactName = message.sender_name;
  //     setContactNames((prevNames) => ({ ...prevNames, [contactId]: contactName }));
  //   }
  // };

  const truncateMessage = (message) => {
    message = String(message);
    if (message.length > 23) {
      return message.slice(0, 20) + ".....";
    } else {
      return message;
    }
  };

  useEffect(() => {
    // Function to fetch all contacts when the component mounts
    const getAllContacts = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-chats?user_id=${parentCompanyId}&selected_employee_id=${loggedInUserId}&mode=${mode}`
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-merged-chats?user_id=${parentCompanyId}&selected_employee_id=${loggedInUserId}`
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
  }, [
    mode,
    socket,
    parentCompanyId,
    loggedInUserId,
    setAllchats,
    setAllMergedChats,
  ]);

  useEffect(() => {
    // console.log("selectedContact:", allChats);
  }, [allChats, allMergedChats]); // Log selectedContact whenever it changes

  // ###### SEARCH CHATS API CALL

  const searchChats = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/search-chats?user_id=${parentCompanyId}&selected_employee_id=${loggedInUserId}&searchTerm=${searchTerm}`
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
      console.log("items: " + JSON.stringify(items));
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
                          {contact?.name?.split(",")[0]}
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
            : "No contacts found"}

          {/* merged chats here */}

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
                        {/* {messages && messages.length > 0
                          ? truncateMessage(
                              messages[messages.length - 1].message
                            )
                          : truncateMessage(latestMessage)} */}
                      </h1>
                    </div>
                  </div>
                </li>
              ))
            : ""}

          {/* {groupedChats && Object.keys(groupedChats).length > 0
            ? Object.keys(groupedChats).map((mergedName, index) => (
                <li
                  key={index}
                  className={`mb-2 py-[4px] px-[8px] gap-3 rounded-xl ${
                    selectedContact?.id === groupedChats[mergedName][0].id ? "bg-[#DBF3FF]" : "bg-white"
                  }`}
                  onClick={() => handleContactClick(groupedChats[mergedName])}
                >
                  <div className="flex cursor-pointer justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-full"
                        onClick={(e) => handleCheckboxChange(groupedChats[mergedName][0].id, e)}
                      >
                        {selectedChats.some(chat => chat.contactId === groupedChats[mergedName][0].id) ? (
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
                          src={groupedChats[mergedName][0].profile_img || "/assets/chat-dp.svg"}
                          width={50}
                          height={50}
                          alt="profile image"
                        />
                      </div>
                    </div>
                    <div className="ml-2 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{mergedName}</span>
                        <div className="flex gap-1">
                          {groupedChats[mergedName].map((contact) => (
                            <Image
                              key={contact.id}
                              src={
                                contact.preferred_platform === "webchat"
                                  ? "/assets/webchat-logo.svg"
                                  : contact.preferred_platform === "facebook"
                                  ? "/assets/facebook-logo.svg"
                                  : contact.preferred_platform === "sms"
                                  ? "/assets/eurosms-logo.svg"
                                  : contact.preferred_platform === "whatsApp"
                                  ? "/assets/whatsapp-logo.svg"
                                  : null
                              }
                              width={16}
                              height={16}
                              alt="chat logo"
                            />
                          ))}
                        </div>
                      </div>
                      <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                        {messages && messages.length > 0
                          ? truncateMessage(messages[messages.length - 1].message)
                          : truncateMessage(latestMessage)}
                      </h1>
                    </div>
                  </div>
                </li>
              ))
            : ""
  } */}
        </ul>

        <ul>
          {/* {guestUserData && (
            <li
              key={guestUserData.receiver_id}
              className={`mb-2 py-[4px] px-[8px] gap-3 ${
                guestUserData &&
                guestUserData?.receiver_id === selectedContact &&
                selectedContact?.receiver_id
                  ? "bg-[#DBF3FF]"
                  : ""
              } rounded-xl`}
              onClick={() => handleGuestClick(guestUserData)}
            >
              <div className="flex cursor-pointer">
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="rounded-full"
                    onClick={(e) => handleCheckboxChange(guestUserData?.receiver_id,e)}
                  >
                    {selectedChats.includes(guestUserData.receiver_id) ? (
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
                      src={guestUserData.profile_img || "/assets/chat-dp.svg"}
                      width={50}
                      height={50}
                      alt="profile image"
                    />
                  </div>
                </div>
                <div className="ml-2 w-full">
                  <div className="flex justify-between items-center">
                  
                    <span className="font-bold capitalize">{guestUserData.sender_name}</span>
                    <Image
                      src="/assets/webchat-logo.svg"
                      width={16}
                      height={16}
                      alt="chat logo"
                    />
                  </div>
                  <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                   
                  </h1>
                </div>
              </div>
            </li>
          )} */}
        </ul>

        <ul>
          {/* {employees && employees.filter(employee => employee.employee_id !== loggedInUserId) 
  
  .map(employee => (
    <li key={employee.employee_id} className={`mb-2 py-[4px] px-[8px] gap-3 ${selectedContact && selectedContact.employee_id === employee.employee_id ? "bg-[#DBF3FF]" : ""} rounded-xl`} onClick={() => handleEmployeeClick(employee)}>
      <div className="flex cursor-pointer">
        <div className="flex justify-center items-center gap-2">
          <button className="rounded-full" onClick={() => handleCheckboxChange(employee.id)}>
            {selectedChats.includes(employee.id) ? (
              <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
            ) : (
              <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
            )}
          </button>
          <div className="rounded-full">
            <Image src={employee.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">{employee.name}</span>
            <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
          </div>
          <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
          text
          
          </h1>
        </div>
      </div>
    </li>
  ))} */}

          {/* {customers && customers.map(customer => (
    <li key={customer.customer_id} className={`mb-2 py-[4px] px-[8px] gap-3 ${selectedContact && selectedContact.customer_id === customer.customer_id ? "bg-[#DBF3FF]" : ""} rounded-xl`} onClick={() => handleCustomerClick(customer)}>
      <div className="flex cursor-pointer">
        <div className="flex justify-center items-center gap-2">
          <button className="rounded-full" onClick={(e) => handleCheckboxChange(customer.customer_id,e)}>
            {selectedChats.find(chat => chat.contactId === customer.customer_id) ? (
              <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
            ) : (
              <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
            )}
          </button>
          <div className="rounded-full">
            <Image src={customer.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">{customer.name}</span>
            <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
          </div>
          <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
           
            text
          </h1>
        </div>
      </div>
    </li>
  ))} */}

          {/* 
{selectedContact ? (
            <li key={selectedContact.employee_id || selectedContact.customer_id} className="mb-2 py-[4px] px-[8px] gap-3 bg-[#DBF3FF] rounded-xl" onClick={() => handleContactClick(selectedContact)}>
              <div className="flex cursor-pointer">
                <div className="flex justify-center items-center gap-2">
                  <button className="rounded-full" onClick={() => handleCheckboxChange(selectedContact.id)}>
                    {selectedChats.includes(selectedContact.id) ? (
                      <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
                    ) : (
                      <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
                    )}
                  </button>
                  <div className="rounded-full">
                    <Image src={selectedContact.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
                  </div>
                </div>
                <div className="ml-2 w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{selectedContact.name}</span>
                    <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
                  </div>
                  <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
                    {messages && messages.length > 0 ? truncateMessage(messages[messages.length - 1].message) : truncateMessage(latestMessage)}
                  </h1>
                </div>
              </div>
            </li>
          ) : ""
                    } */}

          {/* Parent Company Details */}
          {/* {parentCompanyDetails && (
        <div>
         <li className={`mb-2 py-[4px] px-[8px] gap-3 ${selectedContact && selectedContact.user_id === parentCompanyDetails.user_id ? "bg-[#DBF3FF]" : ""} rounded-xl`} onClick={() => handleCompanyClick(parentCompanyDetails)}>
      <div className="flex cursor-pointer">
        <div className="flex justify-center items-center gap-2">
          <button className="rounded-full" onClick={(e) => handleCheckboxChange(parentCompanyDetails.user_id,e)}>
            {selectedChats.find(chat => chat.contactId === parentCompanyDetails.user_id) ? (
              <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
            ) : (
              <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
            )}
          </button>
          <div className="rounded-full">
            <Image src={parentCompanyDetails.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">{parentCompanyDetails.name}</span>
            <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
          </div>
          <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
            {messages && messages.length > 0 ? truncateMessage(messages[messages.length - 1].message) : truncateMessage(latestMessage)}
            text
          </h1>
        </div>
      </div>
    </li>
        </div>
      )} */}

          {/* {selectedContact && (
    <li key={selectedContact.employee_id || selectedContact.customer_id} className={`mb-2 py-[4px] px-[8px] gap-3 bg-[#DBF3FF] rounded-xl`} onClick={() => handleContactClick(selectedContact)}>
      <div className="flex cursor-pointer">
        <div className="flex justify-center items-center gap-2">
          <button className="rounded-full" onClick={() => handleCheckboxChange(selectedContact.id)}>
            {selectedChats.includes(selectedContact.id) ? (
              <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
            ) : (
              <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
            )}
          </button>
          <div className="rounded-full">
            <Image src={selectedContact.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">{selectedContact.name}</span>
            <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
          </div>
          <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
            {messages && messages.length > 0 ? truncateMessage(messages[messages.length - 1].message) : truncateMessage(latestMessage)}
          </h1>
        </div>
      </div>
    </li>
  )} */}

          {/* {chats && chats.map(message => (
    <li key={message.sender_id} className={`mb-2 py-[4px] px-[8px] gap-3 ${message && message.user_id  ===  parentCompanyId ? "bg-[#DBF3FF]" : ""} rounded-xl`} onClick={() => handleContactClick(selectedContact)}>
      <div className="flex cursor-pointer" onClick={toggleChats}>
        <div className="flex justify-center items-center gap-2">
          <button className="rounded-full" onClick={() => handleCheckboxChange(message.sender_id)}>
            {selectedChats.includes(message.sender_id) ? (
              <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
            ) : (
              <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
            )}
          </button>
          <div className="rounded-full">
            <Image src={message.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">
              {contactNames ? (contactNames[message.sender_id] || contactNames[message.receiver_id] || message.sender_name) : message.sender_name}
            </span>
            <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
          </div>
          <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
            {message.last_message && truncateMessage(message.last_message) || latestMessage && truncateMessage(latestMessage)}
          </h1>
        </div>
      </div>
    </li>
  ))} */}
        </ul>
      </div>
    </div>
  );
};

export default ContactList;
