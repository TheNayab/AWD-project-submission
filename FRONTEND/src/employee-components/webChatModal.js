import React, { useState } from "react";
import { useRouter } from 'next/navigation'

const WebChatModal = ({ onClose, onJoinChat }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError("");
  };

  const handleJoinChat = () => {
    if (name.length < 3 || name.length > 15) {
      setError("Name must be between 3 and 15 characters");
      return;
    }
    onJoinChat(name);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Your Name</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        />
        {error && <p className="error">{error}</p>}
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleJoinChat}>Join Chat</button>
        </div>
      </div>
    </div>
  );
};

export default WebChatModal;
