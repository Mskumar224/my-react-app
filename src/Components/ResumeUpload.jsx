import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [manualTechs, setManualTechs] = useState([]);
  const [overrideTechs, setOverrideTechs] = useState(false);
  const navigate = useNavigate();

  const techOptions = ['javascript', 'python', 'java', 'devops', 'csharp'];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('https://zvertexai.netlify.app/.netlify/functions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      setResumeId(response.data.resumeId);
      setTechnologies(response.data.technologies);
      setShowOptions(true);
      console.log('Upload response:', response.data);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload resume');
    }
  };

  const handleTechChange = (e) => {
    const { value, checked } = e.target;
    setManualTechs((prev) =>
      checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  };

  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    if (manualTechs.length > 0) {
      setTechnologies(manualTechs);
      setOverrideTechs(false);
    }
  };

  const handleOption = (option) => {
    if (option === 'auto') {
      navigate('/auto-apply', { state: { resumeId, technologies } });
    } else if (option === 'update') {
      navigate('/update-resume', { state: { resumeId, technologies } });
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
          multiple={false} 
        />
        <button type="submit">Upload Resume</button>
      </form>
      {message && <p>{message}</p>}
      {technologies.length > 0 && (
        <div>
          <p>Detected Technologies: {technologies.join(', ')}</p>
          <button onClick={() => setOverrideTechs(true)}>
            Override Technologies
          </button>
        </div>
      )}
      {overrideTechs && (
        <form onSubmit={handleOverrideSubmit}>
          <p>Select your technologies:</p>
          {techOptions.map((tech) => (
            <label key={tech}>
              <input
                type="checkbox"
                value={tech}
                onChange={handleTechChange}
                checked={manualTechs.includes(tech)}
              />
              {tech}
            </label>
          ))}
          <button type="submit">Confirm Technologies</button>
        </form>
      )}
      {showOptions && (
        <div>
          <h3>What's next?</h3>
          <button onClick={() => handleOption('auto')}>Continue for Auto Apply</button>
          <button onClick={() => handleOption('update')}>Update your Resume</button>
        </div>
      )}
    </div>
  );
};

export default UploadResume;