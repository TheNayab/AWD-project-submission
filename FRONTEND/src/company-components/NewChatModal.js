// import React from 'react';

// const NewChatModal = ({ isOpen, onClose, contactsList }) => {
//   return (
//     <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
//       <div className="bg-gray-800 bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
//       <div className="bg-white p-8 rounded-xl z-10 w-[500px]">
//         <h2 className="text-[#343233] text-[20px] leading-6 font-medium">New Chat</h2>
//         <div>
//           <label className="block add_employee_label mt-5">Select Contact</label>
//           <select className="add_employee_inputs">
            
//             {contactsList.map((contact) => (
//               <option key={contact.id} value={contact.contact}>
//                 {contact.name} - {contact.contact}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mt-4 flex justify-end gap-2">
//           <button
//             className="bg-white text-[14px] text-[#2D8AC5] font-medium border border-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] hover:bg-[#225e88] hover:text-white duration-300"
//             onClick={onClose}
//           >
//             Close
//           </button>
//           <button
//             className="bg-[#2D8AC5] text-[14px] font-medium text-white py-[9px] px-[24px] rounded-[50px] duration-300  hover:bg-[#225e88]"
//             onClick={onClose}
//           >
//             Start Chat
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewChatModal;




// import React, { useState } from 'react';

// const NewChatModal = ({ isOpen, onClose, contactsList }) => {
//   const [contactType, setContactType] = useState('customer');
//   const [selectedContact, setSelectedContact] = useState('');
//   const [preferredPlatform, setPreferredPlatform] = useState('');

//   const handleContactTypeChange = (e) => {
//     setContactType(e.target.value);
//   };

//   return (
//     <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
//       <div className="bg-gray-800 bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
//       <div className="bg-white p-8 rounded-xl z-10 w-[500px]">
//         <h2 className="text-[#343233] text-[20px] leading-6 font-medium">New Chat</h2>

//         <div>
          
//           <div className="flex mt-2">
//             <input
//               type="radio"
//               id="customer"
//               value="customer"
//               checked={contactType === 'customer'}
//               onChange={handleContactTypeChange}
//               className='w-[24px] h-[24px]'
//             />
//             <label htmlFor="customer" className="ml-2 mr-4">
//               Customer
//             </label>

//             <input
//               type="radio"
//               id="employee"
//               value="employee"
//               checked={contactType === 'employee'}
//               onChange={handleContactTypeChange}
//             />
//             <label htmlFor="employee" className="ml-2 mr-4">
//               Employee
//             </label>

//             <input
//               type="radio"
//               id="newNumber"
//               value="newNumber"
//               checked={contactType === 'newNumber'}
//               onChange={handleContactTypeChange}
//             />
//             <label htmlFor="newNumber" className="ml-2">
//               New Number
//             </label>
//           </div>
//         </div>

//         {contactType !== 'newNumber' && (
//           <div>
//             <label className="block add_employee_label mt-4">
//               Select {contactType === 'customer' ? 'Customer' : 'Employee'}
//             </label>
//             <select
//               className="add_employee_inputs"
//               value={selectedContact}
//               onChange={(e) => setSelectedContact(e.target.value)}
//             >
//               {contactsList.map((contact) => (
//                 <option key={contact.id} value={contact.contact}>
//                   {contact.name} - {contact.contact}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {contactType === 'newNumber' && (
//           <div>
//             <label className="block add_employee_label mt-4">Enter New Number</label>
//             <input
//               type="text"
//               className="add_employee_inputs"
//               value={selectedContact}
//               onChange={(e) => setSelectedContact(e.target.value)}
//             />
//           </div>
//         )}

//         {contactType !== 'newNumber' && (
//           <div>
//             <label className="block add_employee_label mt-4">Preferred Platform</label>
//             <select
//               className="add_employee_inputs"
//               value={preferredPlatform}
//               onChange={(e) => setPreferredPlatform(e.target.value)}
//             >
//               <option value="">Select Preferred Platform</option>
//               <option value="Facebook">Facebook</option>
//               <option value="WhatsApp">WhatsApp</option>
//               <option value="Webchat">Webchat</option>
//               <option value="SMS">SMS</option>
//             </select>
//           </div>
//         )}

//         <div className="mt-4 flex justify-end gap-2">
//           <button
//             className="bg-white text-[14px] text-[#2D8AC5] font-medium border border-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] hover:bg-[#225e88] hover:text-white duration-300"
//             onClick={onClose}
//           >
//             Close
//           </button>
//           <button
//             className="bg-[#2D8AC5] text-[14px] font-medium text-white py-[9px] px-[24px] rounded-[50px] duration-300  hover:bg-[#225e88]"
//             onClick={onClose}
//           >
//             Start Chat
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewChatModal;










// import React, { useState } from 'react';

// const NewChatModal = ({preferredPlatform,setPreferredPlatform, isOpen, onClose, employees, customers,contactType,setContactType,handleContactClick }) => {
//   // const [contactType, setContactType] = useState('customer');
//   const [selectedContact, setSelectedContact] = useState({});
//   // const [preferredPlatform, setPreferredPlatform] = useState('');

//   const handleContactTypeChange = (e) => {
//     setContactType(e.target.value);
//   };

//   const getContactsList = () => {
//     return contactType === 'customer' ? customers : employees;
//   };

// const handleStartChat = () => {
//   // Find the selected contact from the list of contacts
//   const selectedContactData = getContactsList().find(contact => contact.phone === selectedContact);
//   if (selectedContactData) {
//     // Pass selected contact to parent component
//     handleContactClick(selectedContactData);
//   }
//   onClose(); // Close the modal after starting the chat

//   // Log the selected preferred platform
//   console.log("Preferred Platform:", preferredPlatform);
// };


//   return (
//     <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
//       <div className="bg-gray-800 bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
//       <div className="bg-white p-8 rounded-xl z-10 w-[500px]">
//         <h2 className="text-[#343233] text-[20px] leading-6 font-medium">New Chat</h2>

//         <div>
//           <div className="flex mt-2">
//             <input
//               type="radio"
//               id="customer"
//               value="customer"
//               checked={contactType === 'customer'}
//               onChange={handleContactTypeChange}
//               className='w-[24px] h-[24px]'
//             />
//             <label htmlFor="customer" className="ml-2 mr-4">
//               Customer
//             </label>

//             <input
//               type="radio"
//               id="employee"
//               value="employee"
//               checked={contactType === 'employee'}
//               onChange={handleContactTypeChange}
//             />
//             <label htmlFor="employee" className="ml-2 mr-4">
//               Employee
//             </label>

//             <input
//               type="radio"
//               id="newNumber"
//               value="newNumber"
//               checked={contactType === 'newNumber'}
//               onChange={handleContactTypeChange}
//             />
//             <label htmlFor="newNumber" className="ml-2">
//               New Number
//             </label>
//           </div>
//         </div>

//         {contactType !== 'newNumber' && (
//           <div>
//             <label className="block add_employee_label mt-4">
//               Select {contactType === 'customer' ? 'Customer' : 'Employee'}
//             </label>
//             <select
//               className="add_employee_inputs"
//               value={selectedContact.phone}
//               onChange={(e) => setSelectedContact(e.target.value)}
//               defaultValue=""
//             >
//               <option value="" disabled>Select Contact</option>
//               {getContactsList().map((contact) => (
//                 <option className='capitalize' key={contact.employee_id || contact.customer_id} value={contact.phone}>
//                   {contact.name} - {contact.phone}
//                 </option>
               
//               ))}
//             </select>
//           </div>
//         )}

//         {contactType === 'newNumber' && (
//           <div>
//             <label className="block add_employee_label mt-4">Enter New Number</label>
//             <input
//               type="text"
//               className="add_employee_inputs"
//               value={selectedContact}
//               onChange={(e) => setSelectedContact(e.target.value)}
//             />
//           </div>
//         )}

//         {contactType !== 'newNumber' && (
//           <div>
//             <label className="block add_employee_label mt-4">Preferred Platform</label>
//             <select
//               className="add_employee_inputs"
//               value={preferredPlatform}
//               onChange={(e) => setPreferredPlatform(e.target.value)}
//             >
//               <option value="">Select Preferred Platform</option>
//               <option value="facebook">Facebook</option>
//               <option value="whatsApp">WhatsApp</option>
//               <option value="webchat">Webchat</option>
//               <option value="sms">SMS</option>
//             </select>
//           </div>
//         )}

//         <div className="mt-4 flex justify-end gap-2">
//           <button
//             className="bg-white text-[14px] text-[#2D8AC5] font-medium border border-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] hover:bg-[#225e88] hover:text-white duration-300"
//             onClick={onClose}
//           >
//             Close
//           </button>
//           <button
//             className="bg-[#2D8AC5] text-[14px] font-medium text-white py-[9px] px-[24px] rounded-[50px] duration-300  hover:bg-[#225e88]"
//             onClick={handleStartChat}
//           >
//             Start Chat
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewChatModal;




import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const NewChatModal = ({ preferredPlatform, setPreferredPlatform, isOpen, onClose, employees, customers, contactType, setContactType, handleContactClick }) => {
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedContact, setSelectedContact] = useState({});
  

  useEffect(() => {
    const token = localStorage.getItem("company_access_token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.user_id);
      // setParentCompanyId(decodedToken.company_id);
    }
  }, []);

 
  const handleContactTypeChange = (e) => {
    setContactType(e.target.value);
  };

  const getContactsList = () => {
    if (contactType === 'customer') {
      return customers;
    } else if (contactType === 'employee') {
      return employees.filter(employee => employee.employee_id !== loggedInUserId);
    } else {
      return [];
    }
  };

  const handleStartChat = async () => {
    const selectedContactData = getContactsList().find(contact => contact.phone === selectedContact);
    // console.log("selectedcontactdata",selectedContactData)
    if (!selectedContactData) {
      // Handle case where selected contact is not found
      return;
    }

    const requestData = {
      user_id: loggedInUserId,
      customer_id: selectedContactData.customer_id,
      selected_employee_id:loggedInUserId,
      name: selectedContactData.name,
      email: selectedContactData.email,
      phone: selectedContactData.phone,
      user_name: selectedContactData.user_name,
      preferred_platform: preferredPlatform
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/employee/start-new-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        // Handle non-successful response
        throw new Error('Failed to start chat');
      }

      const responseData = await response.json();
      console.log('Chat started successfully', responseData.chatId);

      onClose(); // Close the modal after starting the chat
    } catch (error) {
      console.error('Error starting chat:', error);
      // Handle error
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-gray-800 bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
      <div className="bg-white p-8 rounded-xl z-10 w-[500px]">
        <h2 className="text-[#343233] text-[20px] leading-6 font-medium">New Chat</h2>

        <div>
          <div className="flex mt-2">
            <input
              type="radio"
              id="customer"
              value="customer"
              checked={contactType === 'customer'}
              onChange={handleContactTypeChange}
              className='w-[24px] h-[24px]'
            />
            <label htmlFor="customer" className="ml-2 mr-4">
              Customer
            </label>

            {/* <input
              type="radio"
              id="employee"
              value="employee"
              checked={contactType === 'employee'}
              onChange={handleContactTypeChange}
            />
            <label htmlFor="newNumber" className="ml-2">
              New Number
            </label> */}
          </div>
        </div>

        {contactType !== 'newNumber' && (
          <div>
            <label className="block add_employee_label mt-4">
              Select {contactType === 'customer' ? 'Customer' : 'Employee'}
            </label>
            <select
              className="add_employee_inputs"
              value={selectedContact.phone}
              onChange={(e) => setSelectedContact(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select Contact</option>
              {getContactsList().map((contact) => (
                <option className='capitalize' key={contact.employee_id || contact.customer_id} value={contact.phone}>
                  {contact.name} - {contact.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        {contactType === 'newNumber' && (
          <div>
            <label className="block add_employee_label mt-4">Enter New Number</label>
            <input
              type="text"
              className="add_employee_inputs"
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
            />
          </div>
        )}

        {contactType !== 'newNumber' && (
          <div>
            <label className="block add_employee_label mt-4">Preferred Platform</label>
            <select
              className="add_employee_inputs"
              value={preferredPlatform}
              onChange={(e) => setPreferredPlatform(e.target.value)}
            >
              <option value="">Select Preferred Platform</option>
              <option value="facebook">Facebook</option>
              <option value="whatsApp">WhatsApp</option>
              {/* <option value="webchat">Webchat</option> */}
              <option value="sms">SMS</option>
            </select>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-white text-[14px] text-[#2D8AC5] font-medium border border-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] hover:bg-[#225e88] hover:text-white duration-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-[#2D8AC5] text-[14px] font-medium text-white py-[9px] px-[24px] rounded-[50px] duration-300  hover:bg-[#225e88]"
            onClick={handleStartChat}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;

