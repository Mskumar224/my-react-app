import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import UserDetailsForm from './UserDetailsForm';
import '../index.css';

const UpdateResume = () => {
  const { state } = useLocation();
  let { resumeId, technologies } = state || {};
  const navigate = useNavigate();
  const [updatedFile, setUpdatedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectAll, setIsSelectAll] = useState(false);

  const companies = [
    'Google', 'Amazon', 'Microsoft', 'Tesla', 'Facebook', 'Apple', 'IBM', 'Intel', 'Cisco', 'Oracle',
    'Netflix', 'Adobe', 'NVIDIA', 'Salesforce', 'Uber', 'Lyft', 'Airbnb', 'Spotify', 'Twitter', 'LinkedIn',
    'PayPal', 'Square', 'Zoom', 'Slack', 'Dropbox', 'GitHub', 'Atlassian', 'SAP', 'ServiceNow', 'Workday',
    'Dell', 'HP', 'Lenovo', 'Samsung', 'Sony', 'Qualcomm', 'Broadcom', 'VMware', 'Red Hat', 'MongoDB',
    'Snowflake', 'Databricks', 'Palantir', 'Splunk', 'Twilio', 'Okta', 'CrowdStrike', 'Zscaler', 'DocuSign', 'Intuit'
  ];

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e) => {
    setUpdatedFile(e.target.files[0]);
  };

  const handleUploadUpdated = async (e) => {
    e.preventDefault();
    if (!updatedFile) {
      setMessage('Please select an updated file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', updatedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Updated resume uploaded successfully');
      resumeId = response.data.resumeId;
      technologies = response.data.technologies;
      setShowUpload(false);
      setShowUserForm(true);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload updated resume');
    }
  };

  const handleCompanyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCompanies((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(filteredCompanies);
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserDetailsSubmit = (details) => {
    setUserDetails(details);
    setShowUserForm(false);
  };

  const handleConfirm = async () => {
    if (!userDetails) {
      setMessage('Please submit your details first');
      return;
    }

    try {
      const jobsResponse = await axios.post('http://localhost:5000/api/fetch-jobs', {
        companies: selectedCompanies,
        resumeId
      });
      setJobs(jobsResponse.data.jobs);

      const applyResponse = await axios.post('http://localhost:5000/api/auto-apply', {
        resumeId,
        companies: selectedCompanies,
        userDetails
      });
      setAppliedJobs(applyResponse.data.appliedJobs);
      setMessage(applyResponse.data.message);
      console.log('Auto-apply response:', applyResponse.data);
    } catch (error) {
      console.error('Error during auto-apply:', error);
      setMessage('Failed to process auto-apply');
    }
  };

  return (
    <div>
      <h2>Update Your Resume</h2>
      {technologies && <p>Detected Technologies: {technologies.join(', ')}</p>}
      {!showUpload && !showUserForm ? (
        <div>
          <button onClick={() => setShowUpload(true)}>Upload Updated Resume</button>
          <button onClick={() => navigate('/ai-update', { state: { resumeId, technologies } })}>
            Update Resume with AI
          </button>
        </div>
      ) : showUpload ? (
        <form onSubmit={handleUploadUpdated}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            multiple={false} 
          />
          <button type="submit">Upload Updated Resume</button>
        </form>
      ) : showUserForm ? (
        <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
      ) : (
        <>
          <p>Select companies to apply to:</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button onDoubleClick={handleSelectAll} onClick={handleSelectAll}>
            {isSelectAll ? 'Deselect All' : 'Select All'}
          </button>
          <div className="company-list">
            {filteredCompanies.map((company) => (
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
          </div>
          <button onClick={handleConfirm} disabled={selectedCompanies.length === 0}>
            Confirm
          </button>
          {message && <p>{message}</p>}
          {jobs.length > 0 && (
            <div>
              <h3>Recent Job Postings:</h3>
              <ul>
                {jobs.map((job, index) => (
                  <li key={index}>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">{job.title} at {job.company}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {appliedJobs.length > 0 && (
            <div>
              <h3>Applied Jobs:</h3>
              <ul>
                {appliedJobs.map((job, index) => (
                  <li key={index}>
                    {job.jobTitle} at {job.company} (Status: {job.status})
                    {job.status === 'manual' && (
                      <a href={job.jobUrl} style={{ marginLeft: '10px' }}>Apply Manually</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default UpdateResume;