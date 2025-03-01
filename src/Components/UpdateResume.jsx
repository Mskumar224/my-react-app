import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';

const UpdateResume = () => {
  const { state } = useLocation();
  let { resumeId, technologies } = state || {};
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [updatedFile, setUpdatedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const companies = ['Google', 'Amazon', 'Microsoft', 'Tesla', 'Facebook'];

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    console.log('AI Prompt:', prompt);
    setMessage('Resume updated (simulated). Please upload the updated file.');
    setShowUpload(true);
  };

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
      const response = await axios.post('https://zvertexai.netlify.app/.netlify/functions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Updated resume uploaded successfully');
      resumeId = response.data.resumeId;
      technologies = response.data.technologies;
      setShowUpload(false);
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

  const handleConfirm = async () => {
    try {
      await axios.post(`https://zvertexai.netlify.app/.netlify/functions/companies`, { 
        companies: selectedCompanies,
        id: resumeId // Pass resumeId in body for Netlify
      });

      const response = await axios.post(`https://zvertexai.netlify.app/.netlify/functions/auto-apply`, {
        id: resumeId // Pass resumeId in body for Netlify
      });
      setAppliedJobs(response.data.appliedJobs);
      setMessage('Good to go! Auto-applied updated resume to selected companies.');
      console.log('Auto-apply response:', response.data);
    } catch (error) {
      console.error('Error during confirm/auto-apply:', error);
      setMessage('Failed to process auto-apply');
    }
  };

  return (
    <div>
      <h2>Update Your Resume</h2>
      {technologies && <p>Detected Technologies: {technologies.join(', ')}</p>}
      {!showUpload ? (
        <form onSubmit={handlePromptSubmit}>
          <label>
            Enter instructions for AI to update your resume:
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Add more technical skills, improve formatting..."
            />
          </label>
          <button type="submit">Update Resume with AI</button>
        </form>
      ) : (
        <>
          <form onSubmit={handleUploadUpdated}>
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              multiple={false} 
            />
            <button type="submit">Upload Updated Resume</button>
          </form>
          {message && !selectedCompanies.length && !appliedJobs.length && (
            <div>
              <p>{message}</p>
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
            </div>
          )}
        </>
      )}
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

export default UpdateResume;