



import Image from "next/image";
import io from "socket.io-client";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const ContactList = ({ userContacts,employees,handleCustomerClick,handleEmployeeClick,handleCompanyClick, customers,contacts, chats, setChats, selectedContact, toggleChats, handleContactClick, handleCheckboxChange, selectedChats,parentCompanyDetails,generatorData }) => {
  const [socket, setSocket] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [parentCompanyId, setParentCompanyId] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contactNames, setContactNames] = useState({});
  const [roomName, setRoomName] = useState(null);
  const [latestMessage, setLatestMessage] = useState([]);

  // console.log("generator",generatorData)


  var customer = 


  
  

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

  // const getAllContacts = (queryParams) => {
  //   axios
  //     .get(`http://localhost:7000/api/v1/chats/get-all-contacts`, { params: queryParams })
  //     .then((response) => {
  //       if (response.data.success) {
  //         const filteredContacts = response.data.contacts.filter(contact => contact.sender_id !== loggedInUserId);
  //         setChats(filteredContacts);
  //         setLatestMessage(response.data.contacts[0].message);
  //       } else {
  //         console.error("Failed to fetch contacts:", response.data.error);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching contacts:", error);
  //     });
  // };

  return (
    <div className="w-screen md:w-[317px] border-r-[1px] overflow-y-auto omni-scroll-bar pr-4" style={{ height: 'calc(100vh - 200px)' }}>
      <input
        type="search"
        placeholder="Search Contacts"
        name="search"
        id="search"
        className="add_employee_inputs"
      />
      <div className="mt-5">
        {/* <ul>
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
                <div className="ml-2">
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
          ) : (
            chats.map((message) => (
              <li key={message.sender_id} className="mb-2 py-[4px] px-[8px] gap-3 bg-[#DBF3FF] rounded-xl" onClick={() => handleContactClick(selectedContact)}>
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
            ))
          )}
        </ul> */}


<ul>
  {generatorData && (
    <li key={generatorData.generator_id} className={`mb-2 py-[4px] px-[8px] gap-3 ${generatorData && generatorData.generator_id === selectedContact && selectedContact ? "bg-[#DBF3FF]" : ""} rounded-xl`} onClick={() => handleEmployeeClick(generatorData)}>
      <div className="flex cursor-pointer">
        <div className="flex justify-center items-center gap-2">
          <button className="rounded-full" onClick={() => handleCheckboxChange(generatorData.generator_id)}>
            {selectedChats.includes(generatorData.generator_id) ? (
              <Image src="/assets/checkbox-checked.svg" width={24} height={24} alt="profile image" />
            ) : (
              <Image src="/assets/checkbox-unchecked.svg" width={24} height={24} alt="profile image" />
            )}
          </button>
          <div className="rounded-full">
            <Image src={generatorData.profile_img || "/assets/chat-dp.svg"} width={50} height={50} alt="profile image" />
          </div>
        </div>
        <div className="ml-2 w-full">
          <div className="flex justify-between items-center">
            <span className="font-bold">{generatorData.generator_name}</span>
            <Image src="/assets/webchat-logo.svg" width={16} height={16} alt="chat logo" />
          </div>
          <h1 className="text-[#343233] text-[14px] leading-4 font-normal">
            {/* Render text or generator_id here */}
          </h1>
        </div>
      </div>
    </li>
  )}
</ul>


      </div>
    </div>
  );
};

export default ContactList;

