import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const UserDetailsForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [visaType, setVisaType] = useState('');
  const [jobType, setJobType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !address || !visaType || !jobType) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({ name, phone, email, address, visaType, jobType });
  };

  return (
    <div>
      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Phone:
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Address:
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>
          Visa Type:
          <select value={visaType} onChange={(e) => setVisaType(e.target.value)} required>
            <option value="">Select Visa Type</option>
            <option value="H1B">H1B</option>
            <option value="GC">Green Card</option>
            <option value="Citizen">Citizen</option>
            <option value="OPT">OPT</option>
            <option value="STEM-OPT">STEM-OPT</option>
          </select>
        </label>
        <label>
          Job Type:
          <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
            <option value="">Select Job Type</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
            <option value="FullTime">FullTime</option>
          </select>
        </label>
        <button type="submit">Submit Details</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default UserDetailsForm;