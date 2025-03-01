import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';

const AutoApply = () => {
  const { state } = useLocation();
  const { resumeId, technologies } = state || {};
  const navigate = useNavigate();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [message, setMessage] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);

  const companies = ['Google', 'Amazon', 'Microsoft', 'Tesla', 'Facebook'];

  const handleCompanyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCompanies((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleConfirm = async () => {
    try {
      await axios.post(`http://localhost:5000/api/resume/${resumeId}/companies`, {
        companies: selectedCompanies,
      });

      const response = await axios.post(`http://localhost:5000/api/resume/${resumeId}/auto-apply`);
      setAppliedJobs(response.data.appliedJobs);
      setMessage('Good to go! Auto-applied to jobs at selected companies.');
      console.log('Auto-apply response:', response.data);
    } catch (error) {
      console.error('Error during confirm/auto-apply:', error);
      setMessage('Failed to process auto-apply');
    }
  };

  return (
    <div>
      <h2>Auto Apply</h2>
      {technologies && <p>Detected Technologies: {technologies.join(', ')}</p>}
      <p>Select companies to apply to:</p>
      {companies.map((company) => (
        <label key={company}>
          <input
            type="checkbox"
            value={company}
            onChange={handleCompanyChange}
            checked={selectedCompanies.includes(company)}
          />
          {company}
        </label>
      ))}
      <button onClick={handleConfirm} disabled={selectedCompanies.length === 0}>
        Confirm
      </button>
      {message && <p>{message}</p>}
      {appliedJobs.length > 0 && (
        <div>
          <h3>Applied Jobs:</h3>
          <ul>
            {appliedJobs.map((job, index) => (
              <li key={index}>{job.jobTitle} at {job.company} (Applied: {new Date(job.appliedDate).toLocaleString()})</li>
            ))}
          </ul>
        </div>
      )}
      <button className="back-button" onClick={() => navigate('/')}>Back to Upload</button>
    </div>
  );
};

export default AutoApply;