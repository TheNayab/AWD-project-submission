"use client"
import { useState } from 'react';


const EmployeeModal = ({ isOpen, onClose, mode, employee }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    setPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    // Add your logic to handle form submission
    // You can send the form data to your backend or perform any other necessary actions
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{mode === 'new' ? 'New Employee' : 'Edit Employee'}</h2>

        {/* Your form fields */}
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        {/* Add other form fields here based on your requirements */}

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default EmployeeModal;
