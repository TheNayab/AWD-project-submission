



'use client'
// Chat_component.js
import React, { useState, useEffect } from "react";
// import NewChatModal from "./NewChatModal";
import Image from "next/image";
import moment from "moment";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { getGuestAccessToken } from "@/utils/authutils";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'next/navigation'


const Chat_component = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [chats, setChats] = useState([]);
  const [contactType, setContactType] = useState('customer');
  const [chatsVisible, setChatsVisible] = useState(false);
  const [parentCompanyDetails, setParentCompanyDetails] = useState(null);
  const [preferredPlatform, setPreferredPlatform] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [isWebChatModal, setWebChatModal] = useState(true);
  const [fullName, setFullName] = useState('');
  const [linkValid, setLinkValid] = useState(false);
  const [generatorData, setGeneratorData] = useState(null);
  
  


  const params = useParams();

  useEffect(() => {
    // Check token validity and fetch data
    if (params) {
      try {
        const token = params.slug; // Assuming slug contains the token
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
        
        setGeneratorData(decodedToken)
        // Fetch data or perform any action based on the decoded token
        setLinkValid(true); // Assuming token is valid
        setWebChatModal(true); // Show the modal
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle invalid token
        toast.error('Invalid or expired token.');
      }
    }
  }, [params]);

  // In the useEffect hook where you handle joining the chat
useEffect(() => {
  // Check if the user's name exists in local storage
  const storedName = sessionStorage.getItem('guest_access_token');
  if (storedName) {
    // If the name exists, set it as the initial state for fullName
    setFullName(storedName);
    setWebChatModal(false);
  }
}, []);



    // Function to generate a random 10-digit ID
    const generateRandomId = () => {
      return Math.floor(1000000000 + Math.random() * 9000000000); // Generate a 10-digit random number
    };
  
 
  
// Function to handle joining the chat
const handleJoinChat = () => {
  // Verify the link's validity
  if (linkValid) {

    const id = generateRandomId(); // Generate a random 10-digit ID
    // Store the user's full name in local storage
    // localStorage.setItem('guest_access_token', fullName);
    sessionStorage.setItem('guest_access_token', JSON.stringify({ id, fullName }));
    // If link is valid, close the modal and proceed
    setWebChatModal(false);
    window.location.reload()
    // Additional logic to join the chat
  } else {
    // If link is not valid, show an error message
    toast.error('The link has expired or is not valid. Please request a new one.');
  }
};




  const toggleChats = () => {
    setChatsVisible(!chatsVisible);
  };
  
  


  // useEffect(() => {
  //   const token = getGuestAccessToken();
  //   const decodedToken = jwtDecode(token);
  //     const company_id = decodedToken.company_id;
  //   if (company_id) {
  //     axios.get(`http://localhost:7000/api/v1/employee/get-parent-company-details/${company_id}`,{
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //       .then(response => {
  //         console.log("response",response)
  //         if (response.data) {
  //           setParentCompanyDetails(response.data.parentCompanyDetails); // Set parent company details in state
  //         } else {
  //           console.error("Failed to fetch parent company details:", response.data.error);
  //         }
  //       })
  //       .catch(error => {
  //         console.error("Error fetching parent company details:", error);
  //       });
  //   }
  // }, []);



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
    

    setSelectedContact(contact);
    setShowOptions(false);

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
  console.log("company",company)
  if (selectedContact && selectedContact.user_id === company.user_id) {
    // If the clicked customer is already selected, deselect it
    setSelectedContact(null);
  } else {
    // Otherwise, select the clicked customer
    setSelectedContact(company);
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
    setSelectedContact('');
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
    <div className="px-6 pt-5 pb-3"> {isWebChatModal && (
      <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="modal-content bg-white p-8 rounded-lg">
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <button
            onClick={handleJoinChat}
            className="join-button bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Join Chat
          </button>
        </div>
      </div>
    )}
      <ChatHeader
        selectedContact={selectedContact}
        handleMergeChats={handleMergeChats}
        openModal={openModal}
        
      />

      <div className="">
      <ToastContainer />
        <div className="bg-white p-4 pr-0 h-full rounded-xl my-2">
          <div className="flex">
          {(!isSmallScreen || !selectedContact) && (
              <ContactList
              contacts={contactType === 'customer' ? customers : employees}
                selectedContact={selectedContact}
                chats={chats}
                setChats={setChats}
                handleContactClick={handleContactClick}
                handleEmployeeClick={handleEmployeeClick}
                handleCustomerClick={handleCustomerClick}
                handleCompanyClick={handleCompanyClick}
                handleCheckboxChange={handleCheckboxChange}
                selectedChats={selectedChats}
                toggleChats={toggleChats}
                employees={employees}
                customers={customers}
                parentCompanyDetails={parentCompanyDetails}
                generatorData={generatorData}
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
              generatorData={generatorData}
            />
          </div>
        </div>
      </div>

      {/* <NewChatModal
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
      /> */}
    </div>
 

    
  );
};



export default Chat_component;









