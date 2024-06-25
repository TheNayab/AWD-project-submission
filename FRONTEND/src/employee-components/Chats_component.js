// "use client";
// import React, { useState, useEffect } from "react";
// import NewChatModal from "./NewChatModal";
// import Image from "next/image";
// import moment from "moment";
// import { getEmployeeAccessToken } from "@/utils/authutils";
// import { jwtDecode } from "jwt-decode";
// import axios from 'axios';

// const Chat_component = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [selectedChats, setSelectedChats] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [contactType, setContactType] = useState('customer');

//   const fetchEmployees = async () => {
//     try {
//       const token = getEmployeeAccessToken();
//       const decodedToken = jwtDecode(token);
//       // console.log(decodedToken)
//       const company_id = decodedToken.company_id;
//       const employee_id = decodedToken.employee_id;

//       const employeesResponse = await axios.get(`http://localhost:7000/api/v1/employee/get-all-employees/${company_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Employees Response:", employeesResponse.data);

//       const employeesData = Array.isArray(employeesResponse.data.employees) ? employeesResponse.data.employees : [];
//       setEmployees(employeesData);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const token = getEmployeeAccessToken();
//       const decodedToken = jwtDecode(token);
//       const company_id = decodedToken.company_id;
//       const customer_id = decodedToken.customer_id;

//       const customersResponse = await axios.get(`http://localhost:7000/api/v1/employee/get-all-customers/${company_id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Customers Response:", customersResponse.data);

//       const customersData = Array.isArray(customersResponse.data.customers) ? customersResponse.data.customers : [];
//       setCustomers(customersData);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//     fetchCustomers();
//   }, []);

//   const contactsList = [
//     {
//       id: 1,
//       profile_img: "/assets/chat-dp.svg",
//       name: "Olivia Rhyne",
//       email: "contact@mail.com",
//       contact: "111-111-111",
//     },
//     {
//       id: 2,
//       profile_img: "/assets/chat-dp.svg",
//       name: "Jane Doe",
//       email: "jane@example.com",
//       contact: "222-22-222",
//     },
//     {
//       id: 3,
//       profile_img: "/assets/chat-dp.svg",
//       name: "Olivia Rhyne",
//       email: "webdev335@gmail.com",
//       contact: "111-111-111",
//     },
//     {
//       id: 4,
//       profile_img: "/assets/chat-dp.svg",
//       name: "Olivia Rhyne",
//       email: "webdev335@gmail.com",
//       contact: "111-111-111",
//     },
//     {
//       id: 5,
//       profile_img: "/assets/chat-dp.svg",
//       name: "Olivia Rhyne",
//       email: "webdev335@gmail.com",
//       contact: "111-111-111",
//     },
//     {
//       id: 6,
//       profile_img: "/assets/chat-dp.svg",
//       name: "Olivia Rhyne",
//       email: "webdev335@gmail.com",
//       contact: "111-111-111",
//     },
//   ];

//   // checkbox logic
//   const handleCheckboxChange = (contactId) => {
//     const updatedSelectedChats = [...selectedChats];

//     if (updatedSelectedChats.includes(contactId)) {
//       // If already selected, remove from the list
//       const index = updatedSelectedChats.indexOf(contactId);
//       updatedSelectedChats.splice(index, 1);
//     } else {
//       // If not selected, add to the list
//       updatedSelectedChats.push(contactId);
//     }

//     setSelectedChats(updatedSelectedChats);
//   };

//   const handleMergeChats = () => {
//     // Perform the logic to merge selected chats
//     console.log("Merging selected chats:", selectedChats);
//     // Reset selectedChats after merging
//     setSelectedChats([]);
//   };
//   // checkbox logic end

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
//         <div className="bg-white pr-0 h-full rounded-xl my-2">

//           <div className="flex">
//           <div  className="w-screen md:w-[317px] border-r-[1px] overflow-y-auto omni-scroll-bar pr-4" style={{ height: 'calc(100vh - 200px)' }}>
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
//               className={`w-full px-3 ${
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
//               <div id="message-container" className="mt-4 omni-scroll-bar" style={{ height: 'calc(100vh - 325px)', overflowY: "auto" }}>
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
//                             {/* Message input and send button */}
//   <div className="flex w-full items-center">
//     <div className="flex w-full">
//       <textarea
//         placeholder="Enter here"
//         className="textarea"
//         // value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//       />
//     </div>
//     <div
//       className="bg-[#F7F7F7] rounded-[50px] ml-2 p-[5px] w-[48px] h-[48px] flex justify-center items-center"
//       // onClick={sendMessage}
//     >
//       <Image src="/assets/send-btn.png" width={28} height={28} alt="send" />
//     </div>
//   </div>

//             </div>
//           </div>
//         </div>
//       </div>

//       <NewChatModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         contactsList={contactsList}
//         contactType={contactType}
//         setContactType={setContactType}
//         employees={employees}
//         customers={customers}
//         handleContactClick={handleContactClick}
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
import io from "socket.io-client";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { getEmployeeAccessToken } from "@/utils/authutils";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chat_component = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [contactType, setContactType] = useState("customer");
  const [chatsVisible, setChatsVisible] = useState(false);
  const [parentCompanyDetails, setParentCompanyDetails] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [companyWhatsapp, setCompanyWhatsapp] = useState(null);
  const [preferredPlatform, setPreferredPlatform] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [guestUserData, setGuestUserData] = useState([]);
  const [companyId, setCompanyId] = useState();
  const [allChats, setAllchats] = useState([]);
  const [allMergedChats, setAllMergedChats] = useState([]);
  const [mode, setMode] = useState("manual"); // Default mode is manual
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeName, setMergeName] = useState("");
  const [mergeError, setMergeError] = useState("");





  

  // console.log("Preferred Platform main:", preferredPlatform);

  // console.log("cowhatsapp",companyWhatsapp)

  
  // useEffect(() => {
  //   // Retrieve loggedInUserId from local storage
  //   const token = getEmployeeAccessToken();

  //   if (token) {
  //     const decodedToken = jwtDecode(token);
  //     // console.log("tok",decodedToken)
  //     setLoggedInUserName(decodedToken.user_name);
  //   }
  // }, []);

  const toggleChats = () => {
    setChatsVisible(!chatsVisible);
  };

  useEffect(() => {
    const token = getEmployeeAccessToken();
    const decodedToken = jwtDecode(token);
    // console.log("tokennn",decodedToken)
    setCompanyId(decodedToken.company_id);
    setLoggedInUserName(decodedToken.user_name);
    setLoggedInUserId(decodedToken.employee_id);

    // Cleanup function
    return () => {
      // Perform any cleanup if needed
    };
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  const generateWebChatLink = () => {
    // Add logic for generating web chat link here
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chats/generate-web-chat-link`,
        {
          user_id: companyId,
          generator_id: loggedInUserId,
          generator_name: loggedInUserName,
        }
      )
      .then((response) => {
        // Handle successful response here
        // console.log("Generated chat link:", response.data);
        const baseUrlForChatLink = `${process.env.NEXT_PUBLIC_BASE_URL_CLIENT}`;
        setGeneratedLink(
          `${baseUrlForChatLink}/guest/chats/${response.data.chat_link}`
        ); // Set the generated link in state
        setLinkInputVisible(true); // Show the input field
      })
      .catch((error) => {
        console.error("Error generating chat link:", error);
        // Handle error here
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard successfully");
    setLinkInputVisible(false);
  };

  const cancelLinkGeneration = () => {
    setGeneratedLink("");
    setLinkInputVisible(false);
  };

  // Function to merge selected chats

  const fetchEmployees = async () => {
    try {
      const token = getEmployeeAccessToken();
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken)
      const company_id = decodedToken.company_id;
      const employee_id = decodedToken.employee_id;

      const employeesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-employees/${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Employees Response:", employeesResponse.data);

      const employeesData = Array.isArray(employeesResponse.data.employees)
        ? employeesResponse.data.employees
        : [];

      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = getEmployeeAccessToken();
      const decodedToken = jwtDecode(token);
      const company_id = decodedToken.company_id;
      const customer_id = decodedToken.customer_id;

      const customersResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-all-customers/${company_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Customers Response:", customersResponse.data);

      const customersData = Array.isArray(customersResponse.data.customers)
        ? customersResponse.data.customers
        : [];
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchCustomers();
  }, []);

  useEffect(() => {
    const token = getEmployeeAccessToken();
    const decodedToken = jwtDecode(token);
    const company_id = decodedToken.company_id;
    if (company_id) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/employee/get-parent-company-details/${company_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // console.log("response",response)
          if (response.data) {
            setParentCompanyDetails(response.data.parentCompanyDetails); // Set parent company details in state
            setCompanyWhatsapp(parentCompanyDetails?.phone)
          } else {
            console.error(
              "Failed to fetch parent company details:",
              response.data.error
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching parent company details:", error);
        });
    }
  }, [companyWhatsapp]);



  // const handleCheckboxChange = (contactId) => {

  //   const updatedSelectedChats = [...selectedChats];

  //   console.log("contactId",contactId)

  //   if (updatedSelectedChats.includes({contactId:contactId})) {
  //     const index = updatedSelectedChats.indexOf(contactId);
  //     updatedSelectedChats.splice(index, 1);
  //   } else {
  //     updatedSelectedChats.push({contactId:contactId});
  //   }

  //   setSelectedChats(updatedSelectedChats);
  // };

  // const handleCheckboxChange = (contactId) => {
  //   const updatedSelectedChats = [...selectedChats];

  //   console.log("contactId", contactId);

  //   const existingIndex = updatedSelectedChats.findIndex(chat => chat.contactId === contactId);

  //   if (existingIndex !== -1) {
  //     updatedSelectedChats.splice(existingIndex, 1);
  //   } else {
  //     updatedSelectedChats.push({ contactId: contactId });
  //   }

  //   setSelectedChats(updatedSelectedChats);
  // };

  const handleCheckboxChange = (contactId, e) => {
    console.log("contactId", contactId);

    e.stopPropagation(); // Stop the event from propagating to the parent container

    const updatedSelectedChats = [...selectedChats];
    // console.log("updatedSelectedChats",updatedSelectedChats)

    const existingIndex = updatedSelectedChats.findIndex(
      (chat) => chat.contactId === contactId
    );

    if (existingIndex !== -1) {
      updatedSelectedChats.splice(existingIndex, 1);
    } else {
      const chatsToAdd =
        allChats.filter((chat) => chat.customer_id === contactId) ||
        contactId === selectedContact?.receiver_id;

      // Add all chats to selectedChats

      updatedSelectedChats.push({ contactId: contactId, chatsToAdd });
    }

    setSelectedChats(updatedSelectedChats);
  };

  //   const mergeChats = async (user_id, chat_ids) => {
  //     try {
  //       if (chat_ids.length < 2) {
  //         // If less than 2 chats are selected, show an error toast message
  //         toast.error('Please select at least two chats to merge');
  //         return;
  //       }
  //       const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/merge-chats`, {
  //         user_id: companyId,
  //         chat_ids: chat_ids,
  //       });
  //       // console.log("merge response",response.data);
  //       toast.success('Chats Merged successfully');
  //       // Optionally, you can update the UI or state after merging chats
  //     } catch (error) {
  //       console.error("Error merging chats:", error);
  //     }
  //   };

  //   // const handleMergeChats = () => {
  //   //   console.log("Merging selected chats:", selectedChats);
  //   //   setSelectedChats([]);
  //   // };

  //   // Function to handle merge action
  // const handleMergeChats = () => {
  //   // console.log("Merging selected chats:", selectedChats);
  //   // const chatIdsToMerge = allChats.map(chat => chat.id);
  //   const chatIdsToMerge = selectedChats.filter(chat => chat.contactId).map(chat => chat.contactId);
  //   // console.log("chatIdsToMerge",chatIdsToMerge)
  //   mergeChats(loggedInUserId, chatIdsToMerge); // Assuming loggedInUserId is accessible here
  //   // setSelectedChats([]);
  // };

  const openMergeModal = () => {
    setShowMergeModal(true);
  };

  const closeMergeModal = () => {
    setShowMergeModal(false);
    setMergeName("");
    setMergeError("");
  };

  const mergeChats = async (user_id, chatIds, mergeName) => {
    try {
      if (chatIds?.length < 2) {
        toast.error("Please select at least two chats to merge");
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/employee/merge-chats`,
        {
          user_id,
          chatIds,
          merged_name: mergeName, // Use the merge name from the modal
        }
      );
      toast.success("Chats Merged successfully");
      // Optionally, you can update the UI or state after merging chats
    } catch (error) {
      console.error("Error merging chats:", error);
      toast.error("Failed to merge chats");
    }
  };

  const handleMergeChats = () => {
    const chatIdsToMerge = selectedChats
      .filter((chat) => chat.contactId)
      .map((chat) => chat.contactId);
    mergeChats(companyId, chatIdsToMerge, mergeName);
    closeMergeModal();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleContactClick = (contact) => {
    localStorage.setItem("whatsappmsg" + contact.phone, contact.phone);

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

  // Function to handle clicks on employees
  const handleEmployeeClick = (employee) => {
    if (selectedContact && selectedContact.id === employee.id) {
      // If the clicked employee is already selected, deselect it
      setSelectedContact(null);
    } else {
      // Otherwise, select the clicked employee
      setSelectedContact(employee);
      setShowOptions(false);
    }
  };

  // Function to handle clicks on customers
  const handleCustomerClick = (customer) => {
    if (selectedContact && selectedContact.id === customer.id) {
      // If the clicked customer is already selected, deselect it
      setSelectedContact(null);
    } else {
      // Otherwise, select the clicked customer
      setSelectedContact(customer);
      setShowOptions(false);
    }
  };

  // Function to handle clicks on parent company
  const handleCompanyClick = (company) => {
    // console.log("company",company)
    if (selectedContact && selectedContact.user_id === company.user_id) {
      // If the clicked customer is already selected, deselect it
      setSelectedContact(null);
    } else {
      // Otherwise, select the clicked customer
      setSelectedContact(company);
      setShowOptions(false);
    }
  };
  const handleGuestClick = (guest) => {
    // console.log("guestttt",guest)
    if (selectedContact && selectedContact.receiver_id === guest.receiver_id) {
      // If the clicked customer is already selected, deselect it
      setSelectedContact(null);
    } else {
      // Otherwise, select the clicked customer
      setSelectedContact(guest);
      setShowOptions(false);
    }
  };

  // const handleContactClick = (contact) => {
  //   if (contact.employee_id || contact.customer_id) {
  //     setSelectedContact(contact);
  //     setShowOptions(false);
  //   }
  // };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (mode) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/update-chat-mode`, {
        user_id: companyId, 
        customer_id: selectedContact.customer_id,
        preferred_platform : selectedContact?.preferred_platform,
        mode,
      })
      .then((response) => {
        // Update the selectedContact mode locally to reflect the change immediately
        setSelectedContact((prevContact) => ({
          ...prevContact,
          mode,
        }));
        // Optionally, you can also show a success message or handle UI updates
        console.log("Updated chat mode:", response.data.message);
      })
      .catch((error) => {
        console.error('Error updating chat mode:', error);
        // Optionally, you can show an error message to the user
      });
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
        companyId={companyId}
        loggedInUserId={loggedInUserId}
        openModal={openModal}
        generateWebChatLink={generateWebChatLink}
        mode={mode}
        setMode={setMode}
        mergeName={mergeName}
          setMergeName={setMergeName}
          mergeError={mergeError}
          openMergeModal={openMergeModal}
          closeMergeModal={closeMergeModal}
          handleMergeSubmit={handleMergeChats}
          showMergeModal={showMergeModal}
          allChats={allChats}
          setAllchats={setAllchats}
      />

      {linkInputVisible && (
        <div className="flex justify-center items-center">
          <div className="flex flex-col">
            <div
              className=""
              style={{ width: "calc(100vw - 500px)", overflowX: "hidden" }}
            >
              <p>{generatedLink}</p>
            </div>
            <div className="flex gap-5">
              <button className="chat-link-btn" onClick={copyToClipboard}>
                Copy
              </button>
              <button
                className="chat-link-btn-cancel"
                onClick={cancelLinkGeneration}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="">
        <ToastContainer />
        <div className="bg-white p-4 pr-0 h-full rounded-xl my-2">
          <div className="flex">
            {(!isSmallScreen || !selectedContact) && (
              <ContactList
                contacts={contactType === "customer" ? customers : employees}
                selectedContact={selectedContact}
                setSelectedContact={setSelectedContact}
                chats={chats}
                setChats={setChats}
                handleContactClick={handleContactClick}
                handleEmployeeClick={handleEmployeeClick}
                handleCustomerClick={handleCustomerClick}
                handleCompanyClick={handleCompanyClick}
                handleGuestClick={handleGuestClick}
                handleCheckboxChange={handleCheckboxChange}
                selectedChats={selectedChats}
                toggleChats={toggleChats}
                employees={employees}
                customers={customers}
                parentCompanyDetails={parentCompanyDetails}
                allChats={allChats}
                setAllchats={setAllchats}
                allMergedChats={allMergedChats}
                setAllMergedChats={setAllMergedChats}
                mode={mode}
                setMode={setMode}
              />
            )}

            <ChatMessages
              messages={messages}
              chats={chats}
              selectedContact={selectedContact}
              toggleOptions={toggleOptions}
              showOptions={showOptions}
              goBack={goBack}
              chatsVisible={chatsVisible}
              parentCompanyDetails={parentCompanyDetails}
              preferredPlatform={preferredPlatform}
              setPreferredPlatform={setPreferredPlatform}
              allChats={allChats}
              mode={mode}
              setMode={setMode}
              handleOptionClick={handleOptionClick}
              companyWhatsapp={companyWhatsapp}
            />
          </div>
        </div>
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={closeModal}
        // contactsList={contactsList}
        contactType={contactType}
        setContactType={setContactType}
        employees={employees}
        customers={customers}
        handleContactClick={handleContactClick}
        preferredPlatform={preferredPlatform}
        setPreferredPlatform={setPreferredPlatform}
      />
    </div>
  );
};

export default Chat_component;
