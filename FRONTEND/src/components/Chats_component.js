// "use client";
// import React, { useState, useEffect } from "react";
// import NewChatModal from "./NewChatModal";
// import Image from "next/image";
// import moment from "moment";

// const Chat_component = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [selectedChats, setSelectedChats] = useState([]);

// const contactsList = [
//   {
//     id: 1,
//     profile_img: "/assets/chat-dp.svg",
//     name: "Olivia Rhyne",
//     email: "contact@mail.com",
//     contact: "111-111-111",
//   },
//   {
//     id: 2,
//     profile_img: "/assets/chat-dp.svg",
//     name: "Jane Doe",
//     email: "jane@example.com",
//     contact: "222-22-222",
//   },
//   {
//     id: 3,
//     profile_img: "/assets/chat-dp.svg",
//     name: "Olivia Rhyne",
//     email: "webdev335@gmail.com",
//     contact: "111-111-111",
//   },
//   {
//     id: 4,
//     profile_img: "/assets/chat-dp.svg",
//     name: "Olivia Rhyne",
//     email: "webdev335@gmail.com",
//     contact: "111-111-111",
//   },
//   {
//     id: 5,
//     profile_img: "/assets/chat-dp.svg",
//     name: "Olivia Rhyne",
//     email: "webdev335@gmail.com",
//     contact: "111-111-111",
//   },
//   {
//     id: 6,
//     profile_img: "/assets/chat-dp.svg",
//     name: "Olivia Rhyne",
//     email: "webdev335@gmail.com",
//     contact: "111-111-111",
//   },
// ];

// // checkbox logic
// const handleCheckboxChange = (contactId) => {
//   const updatedSelectedChats = [...selectedChats];

//   if (updatedSelectedChats.includes(contactId)) {
//     // If already selected, remove from the list
//     const index = updatedSelectedChats.indexOf(contactId);
//     updatedSelectedChats.splice(index, 1);
//   } else {
//     // If not selected, add to the list
//     updatedSelectedChats.push(contactId);
//   }

//   setSelectedChats(updatedSelectedChats);
// };

// const handleMergeChats = () => {
//   // Perform the logic to merge selected chats
//   console.log("Merging selected chats:", selectedChats);
//   // Reset selectedChats after merging
//   setSelectedChats([]);
// };
// // checkbox logic end

//   const openModal = () => {
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   const handleContactClick = (contact) => {
//     setSelectedContact(contact);
//     setShowOptions(false);

//     // Load sample messages for the selected contact (replace with your actual messages logic)
//     setMessages([
//       {
//         sender: contact.name,
//         text: "hi, i need help with my order",
//         time: moment().subtract(10, "minutes"),
//         platform: "Facebook",
//       },
//       {
//         sender: contact.name,
//         text: "Can you please check the status of it?",
//         time: moment().subtract(10, "minutes"),
//         platform: "Facebook",
//       },
//       {
//         sender: contact.name,
//         text: "Can you please check the status of it?",
//         time: moment().subtract(10, "minutes"),
//         platform: "WebChat",
//       },
//       {
//         sender: contact.name,
//         text: "Can you please check the status of it?",
//         time: moment().subtract(10, "minutes"),
//         platform: "WhatsApp",
//       },
//       {
//         sender: "You",
//         text: "Hi, How can I help you in this matter",
//         time: moment(),
//         platform: "WebChat",
//       },
//       {
//         sender: "You",
//         text: "We are here to assist you!",
//         time: moment(),
//         platform: "WebChat",
//       },
//       {
//         sender: "You",
//         text: "We are here to assist you!",
//         time: moment(),
//         platform: "WhatsApp",
//       },
//       {
//         sender: "You",
//         text: "We are here to assist you!",
//         time: moment(),
//         platform: "Facebook",
//       },
//     ]);
//   };

//   const toggleOptions = () => {
//     setShowOptions(!showOptions);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showOptions && !event.target.closest("#three-dots-options")) {
//         setShowOptions(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [showOptions]);

//   return (
//     <div className="px-6 pt-5 pb-3">
//       <div className="flex justify-between">
//         <h1 className="text-[#343233] text-[24px] font-bold leading-7">
//           Text Chats
//         </h1>
//         <div className="flex gap-2">
//           <button
//             className=" py-[9px] px-[24px] gap-1 rounded-[50px] text-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal leading-4 text-[14px]"
//             onClick={handleMergeChats}
//             disabled={selectedChats.length === 0}
//           >
//             Merge Selected Chats
//           </button>
//           <button className="bg-white py-[9px] px-[24px] gap-1 rounded-[50px] text-[#2D8AC5] border border-[#2D8AC5] hover:bg-[#2D8AC5] hover:text-white duration-300 font-normal leading-4 text-[14px]">
//             Generate web Chat Link
//           </button>
//           <button
//             className="bg-[#2D8AC5] py-[9px] px-[24px] gap-1 rounded-[50px] text-white font-normal leading-4 text-[14px]"
//             onClick={openModal}
//           >
//             + New Chat
//           </button>
//         </div>
//       </div>

//       <div>
//         <div className="bg-white p-4 pr-0 rounded-xl my-2 h-screen">
//           <div className="flex">
//             <div className=" w-[317px] h-screen border-r-[1px] pr-4">
//               <input
//                 type="search"
//                 placeholder="Search Contacts"
//                 name="search"
//                 id="search"
//                 className="add_employee_inputs"
//               />
//               <div className="mt-5">
//                 <ul>
//                   {contactsList.map((contact) => (
//                     <li
//                       key={contact.id}
//                       className={`mb-2 py-[4px] px-[8px] gap-3  ${
//                         selectedContact && selectedContact.id === contact.id
//                           ? "bg-[#DBF3FF] rounded-xl"
//                           : ""
//                       }`}
//                       onClick={() => handleContactClick(contact)}
//                     >
//                       <div className="flex cursor-pointer">
//                         <div className="flex justify-center items-center gap-2">
//                           {/* checkbox */}
//                           <button
//                             className="rounded-full"
//                             onClick={() => handleCheckboxChange(contact.id)}
//                           >
//                             {selectedChats.includes(contact.id) ? (
//                               <Image
//                                 src="/assets/checkbox-checked.svg"
//                                 width={24}
//                                 height={24}
//                                 alt="profile image"
//                               />
//                             ) : (
//                               <Image
//                                 src="/assets/checkbox-unchecked.svg"
//                                 width={24}
//                                 height={24}
//                                 alt="profile image"
//                               />
//                             )}
//                           </button>
//                           {/* checkbox end */}
//                           <div className="rounded-full">
//                             <Image
//                               src={contact.profile_img}
//                               width={50}
//                               height={50}
//                               alt="profile image"
//                             />
//                           </div>
//                         </div>
//                         <div className="ml-2">
//                           <div className="flex justify-between items-center">
//                             <span className="font-bold">{contact.name}</span>
//                             <Image
//                               src="/assets/whatsapp-logo.svg"
//                               width={16}
//                               height={16}
//                               alt="chat logo"
//                             />
//                           </div>
//                           <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
//                             Have you done my job? Where...
//                           </h1>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div
//               className={`w-full h-screen px-3 ${
//                 selectedContact ? "visible" : "invisible"
//               }`}
//             >
//               <div className="flex justify-between">
//                 {selectedContact && (
//                   <div>
//                     <div className="flex">
//                       <Image
//                         src={selectedContact.profile_img}
//                         width={50}
//                         height={50}
//                         alt="profile image"
//                       />
//                       <div>
//                         <div className="flex">
//                           <p className="ml-2 font-bold ">
//                             {selectedContact.name}
//                           </p>
//                           <p className="ml-3 -mt-1">
//                             All Chats / WhatsApp / Facebook / Web
//                           </p>
//                         </div>
//                         <p className="text-[#343233] ml-2 text-[14px] leading-4">
//                           with{" "}
//                           <span className="capitalize font-bold">Jamson</span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-end">
//                   <div className="bg-[#2D8AC5] text-[14px] leading-4 py-[9px] px-[24px] rounded-[50px] flex items-center text-white">
//                     <p>Priority Chat:</p>
//                     <select
//                       name=""
//                       id=""
//                       className="outline-none bg-transparent font-bold custom-dropdown"
//                     >
//                       <option className="text-[#343233]" value="">
//                         Facebook
//                       </option>
//                       <option className="text-[#343233]" value="">
//                         WhatsApp
//                       </option>
//                       <option className="text-[#343233]" value="">
//                         Web Chat
//                       </option>
//                     </select>
//                   </div>

//                   <div className="relative ml-3">
//                     <button
//                       className="bg-[#F7F7F7] p-[5px] rounded-full"
//                       onClick={toggleOptions}
//                     >
//                       <Image
//                         src="/assets/three-dots.svg"
//                         width={50}
//                         height={50}
//                         alt="profile image"
//                         id="three-dots-options"
//                       />
//                     </button>
//                     {showOptions && (
//                       <div className="absolute py-[8px] px-[16px] right-0 mt-2 w-72 bg-white border rounded-md shadow-lg">
//                         <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
//                           Copy Web Chat Link
//                         </button>
//                         <button className="block w-full text-left px-4 py-2 text-[#343233] hover:bg-gray-100">
//                           Close All Chats
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               {/* Messages */}
//               <div className="mt-4">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex mb-2 ${
//                       message.sender === "You" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {message.sender === "You" ? (
//                       <>
//                         <div className="flex flex-col">
//                           <div className="flex">
//                             <div
//                               className={`py-[8px] px-[16px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-0 rounded-bl-[12px]
//                                   ${
//                                     message.platform === "WebChat"
//                                       ? "bg-[#F9B1B1]"
//                                       : message.platform === "WhatsApp"
//                                       ? "bg-[#B2F9B1]"
//                                       : "bg-[#D5F1FF]"
//                                   }`}
//                             >
//                               <p className="text-[#343233] text-[16px] leading-[19px]">
//                                 {message.text}
//                               </p>
//                             </div>
//                             <div className="rounded-full ml-2">
//                               <Image
//                                 src={selectedContact.profile_img}
//                                 width={30}
//                                 height={30}
//                                 alt="profile image"
//                               />
//                             </div>
//                           </div>

//                           <div className="flex flex-row-reverse justify-between mt-1 mr-10">
//                             <div className="rounded-[100x]">
//                               {/* Change the order of logo and time when the sender is 'You' */}
//                               {message.platform === "Facebook" && (
//                                 <Image
//                                   src="/assets/facebook-logo.svg"
//                                   width={13.33}
//                                   height={13.33}
//                                   alt="social platform logo"
//                                 />
//                               )}
//                               {message.platform === "WhatsApp" && (
//                                 <Image
//                                   src="/assets/whatsapp-logo.svg"
//                                   width={13.33}
//                                   height={13.33}
//                                   alt="social platform logo"
//                                 />
//                               )}
//                               {message.platform === "WebChat" && (
//                                 <Image
//                                   src="/assets/webchat-logo.svg"
//                                   width={13.33}
//                                   height={13.33}
//                                   alt="social platform logo"
//                                 />
//                               )}
//                             </div>
//                             <p className="text-[##676767] text-[12px] leading-[14px]">
//                               {moment(message.time).format("h:mm a")}
//                             </p>
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       // Render the layout when the sender is not 'You'
//                       <>
//                         {message.sender !== "You" && (
//                           <div className="rounded-full">
//                             <Image
//                               src={selectedContact.profile_img}
//                               width={30}
//                               height={30}
//                               alt="profile image"
//                             />
//                           </div>
//                         )}
//                         <div className="flex flex-col ml-2">
//                           <div
//                             className={`bg-[#F3F3F3] py-[8px] px-[16px] rounded-tl-0 rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] ${
//                               message.sender === "You" ? "bg-[#D5F1FF]" : ""
//                             }`}
//                           >
//                             <p className="text-[#343233] text-[16px] leading-[19px]">
//                               {message.text}
//                             </p>
//                           </div>
//                           <div className="flex justify-between mt-1">
//                             <div className="rounded-[100x]">
//                               {message.platform === "Facebook" && (
//                                 <Image
//                                   src="/assets/facebook-logo.svg"
//                                   width={13.33}
//                                   height={13.33}
//                                   alt="social platform logo"
//                                 />
//                               )}
//                               {message.platform === "WhatsApp" && (
//                                 <Image
//                                   src="/assets/whatsapp-logo.svg"
//                                   width={13.33}
//                                   height={13.33}
//                                   alt="social platform logo"
//                                 />
//                               )}
//                               {message.platform === "WebChat" && (
//                                 <Image
//                                   src="/assets/webchat-logo.svg"
//                                   width={13.33}
//                                   height={13.33}
//                                   alt="social platform logo"
//                                 />
//                               )}
//                             </div>
//                             <p className="text-[##676767] text-[12px] leading-[14px]">
//                               {moment(message.time).format("h:mm a")}
//                             </p>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               {/* End of Messages */}
//             </div>
//           </div>
//         </div>
//       </div>

//       <NewChatModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         contactsList={contactsList}
//       />
//     </div>
//   );
// };

// export default Chat_component;

"use client";
// Chat_component.js
import React, { useState, useEffect } from "react";
import NewChatModal from "./NewChatModal";
import Image from "next/image";
import moment from "moment";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { useSearchParams,useRouter } from "next/navigation";
import axios from "axios";

const Chat_component = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [chats, setchats] = useState([]);
  const [Allchats, setAllchats] = useState([]);
  const [AllMergedChats, setAllMergedChats] = useState([]);
  const searchParams = useSearchParams();
  const myParam = searchParams.get("db");

  // const getAllContacts = () => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-chats?user_id=${myParam}&selected_employee_id=${myParam}`
  //     )
  //     .then((response) => {
  //       console.log("response", response.data);

  //       if (response.data && response.data.length > 0) {
  //         setAllchats(response.data);
  //       } else {
  //         console.error("Failed to fetch contacts:", response.data.error);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching contacts:", error);
  //     });
  // };

  // const getAllMergedContacts = () => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-merged-chats?user_id=${myParam}&selected_employee_id=${myParam}`
  //     )
  //     .then((response) => {
  //       console.log("response", response.data);

  //       if (response.data && response.data.length > 0) {
  //         setAllMergedChats(response.data);
  //       } else {
  //         console.error("Failed to fetch contacts:", response.data.error);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching contacts:", error);
  //     });
  // };

  // useEffect(() => {
  //   getAllContacts();
  //   getAllMergedContacts();
  // }, []);

  const contactsList = [
    {
      id: 1,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "contact@mail.com",
      contact: "111-111-111",
    },
    {
      id: 2,
      profile_img: "/assets/chat-dp.svg",
      name: "Jane Doe",
      email: "jane@example.com",
      contact: "222-22-222",
    },
    {
      id: 3,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },
    {
      id: 4,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },
    {
      id: 5,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },
    {
      id: 6,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },

    {
      id: 6,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },
    {
      id: 6,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },
    {
      id: 6,
      profile_img: "/assets/chat-dp.svg",
      name: "Olivia Rhyne",
      email: "webdev335@gmail.com",
      contact: "111-111-111",
    },
  ];

  const handleCheckboxChange = (contactId) => {
    const updatedSelectedChats = [...selectedChats];

    if (updatedSelectedChats.includes(contactId)) {
      const index = updatedSelectedChats.indexOf(contactId);
      updatedSelectedChats.splice(index, 1);
    } else {
      updatedSelectedChats.push(contactId);
    }

    setSelectedChats(updatedSelectedChats);
  };

  const handleMergeChats = () => {
    console.log("Merging selected chats:", selectedChats);
    setSelectedChats([]);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleContactClick = (contact) => {
    // console.log("contact clicked",contact)

    // setSelectedContact(contact);
    // setShowOptions(false);

    // console.log("contact clicked",contact)
    // console.log("selectedContact",selectedContact)
    if (
      selectedContact &&
      selectedContact.customer_id === contact.customer_id
    ) {
      // If the clicked customer is already selected, deselect it
      setSelectedContact(null);
    } else {
      // Otherwise, select the clicked customer
      setSelectedContact(contact);
      setShowOptions(false);
    }
  };

  // const handleContactClick = (contact) => {
  //   setSelectedContact(contact);
  //   setShowOptions(false);

  //   const fetchWhatsAppMessages = (loggedInUserId, phoneNumber) => {
  //     axios
  //       .get(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/whatsapp/get-all-whatsapp-messages`,
  //         {
  //           params: {
  //             sender_id: loggedInUserId,
  //             user_id: loggedInUserId,
  //             receipient_whatsapp: phoneNumber,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         console.log("whatsapp res", response);

  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           ...response.data.messages,
  //         ]);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching WhatsApp messages:", error);
  //       });
  //   };

  //   fetchWhatsAppMessages(myParam, "023423424");

  //   // Load sample messages for the selected contact (replace with your actual messages logic)
  //   // setMessages([
  //   //   {
  //   //     sender: contact.name,
  //   //     text: "hi, i need help with my order",
  //   //     time: moment().subtract(10, "minutes"),
  //   //     platform: "Facebook",
  //   //   },
  //   //   {
  //   //     sender: contact.name,
  //   //     text: "Can you please check the status of it?",
  //   //     time: moment().subtract(10, "minutes"),
  //   //     platform: "Facebook",
  //   //   },
  //   //   {
  //   //     sender: contact.name,
  //   //     text: "Can you please check the status of it?",
  //   //     time: moment().subtract(10, "minutes"),
  //   //     platform: "WebChat",
  //   //   },
  //   //   {
  //   //     sender: contact.name,
  //   //     text: "Can you please check the status of it?",
  //   //     time: moment().subtract(10, "minutes"),
  //   //     platform: "WhatsApp",
  //   //   },
  //   //   {
  //   //     sender: "You",
  //   //     text: "Hi, How can I help you in this matter",
  //   //     time: moment(),
  //   //     platform: "WebChat",
  //   //   },
  //   //   {
  //   //     sender: "You",
  //   //     text: "We are here to assist you!",
  //   //     time: moment(),
  //   //     platform: "WebChat",
  //   //   },
  //   //   {
  //   //     sender: "You",
  //   //     text: "We are here to assist you!",
  //   //     time: moment(),
  //   //     platform: "WhatsApp",
  //   //   },
  //   //   {
  //   //     sender: "You",
  //   //     text: "We are here to assist you!",
  //   //     time: moment(),
  //   //     platform: "Facebook",
  //   //   },
  //   // ]);
  // };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleScreenSize = (event) => {
      setIsSmallScreen(event.matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 640px)");

    handleScreenSize(mediaQuery); // Set initial state

    mediaQuery.addListener(handleScreenSize);

    return () => {
      mediaQuery.removeListener(handleScreenSize);
    };
  }, []);

  const goBack = () => {
    setSelectedContact("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions && !event.target.closest("#three-dots-options")) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div className="px-6 pt-5 pb-3">
      <ChatHeader
        selectedContact={selectedContact}
        handleMergeChats={handleMergeChats}
        openModal={openModal}
      />

      <div className="">
        <div className="bg-white p-4 pr-0 rounded-xl my-2 h-auto">
          <div className="flex">
            {(!isSmallScreen || !selectedContact) && (
              <ContactList
                contacts={chats}
                selectedContact={selectedContact}
                handleContactClick={handleContactClick}
                handleCheckboxChange={handleCheckboxChange}
                selectedChats={selectedChats}
                // setAllchats={Allchats}
                // allMergedChats={AllMergedChats}
              />
            )}

            <ChatMessages
              messages={messages}
              selectedContact={selectedContact}
              toggleOptions={toggleOptions}
              showOptions={showOptions}
              goBack={goBack}
            />
          </div>
        </div>
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contactsList={chats}
      />
    </div>
  );
};

export default Chat_component;
