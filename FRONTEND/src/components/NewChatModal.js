import React from 'react';

const NewChatModal = ({ isOpen, onClose, contactsList }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-gray-800 bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
      <div className="bg-white p-8 rounded-xl z-10 w-[500px]">
        <h2 className="text-[#343233] text-[20px] leading-6 font-medium">New Chat</h2>
        <div>
          <label className="block add_employee_label mt-5">Select Contact</label>
          <select className="add_employee_inputs">
            
            {contactsList.map((contact) => (
              <option key={contact.id} value={contact.contact}>
                {contact.name} - {contact.contact}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-white text-[14px] text-[#2D8AC5] font-medium border border-[#2D8AC5] py-[9px] px-[24px] rounded-[50px] hover:bg-[#225e88] hover:text-white duration-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-[#2D8AC5] text-[14px] font-medium text-white py-[9px] px-[24px] rounded-[50px] duration-300  hover:bg-[#225e88]"
            onClick={onClose}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
