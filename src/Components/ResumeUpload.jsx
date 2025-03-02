import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import '../index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [jobRole, setJobRole] = useState('');
  const [manualTechs, setManualTechs] = useState([]);
  const [overrideTechs, setOverrideTechs] = useState(false);
  const [manualTechInput, setManualTechInput] = useState(''); // New state for manual tech input
  const [previewContent, setPreviewContent] = useState('');
  const [numPages, setNumPages] = useState(null);
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      setResumeId(response.data.resumeId);
      setTechnologies(response.data.technologies);
      setJobRole(response.data.jobRole);
      setPreviewContent(response.data.content);
      setShowOptions(true);
      console.log('Upload response:', response.data);
    } catch (error) {
      console.error('Upload error:', error.response ? error.response.data : error.message);
      setMessage('Failed to upload resume');
    }
  };

  const handleTechChange = (e) => {
    const { value, checked } = e.target;
    setManualTechs((prev) =>
      checked ? [...prev, value] : prev.filter((t) => t !== value)
    );
  };

  const handleManualTechInput = (e) => {
    setManualTechInput(e.target.value);
  };

  const handleOverrideSubmit = (e) => {
    e.preventDefault();
    const customTechs = manualTechInput
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech && !manualTechs.includes(tech)); // Split by comma, trim, and avoid duplicates
    const finalTechs = [...manualTechs, ...customTechs].filter(Boolean); // Combine checked and manual techs
    if (finalTechs.length > 0) {
      setTechnologies(finalTechs);
      setOverrideTechs(false);
      setManualTechInput(''); // Clear input after submission
    }
  };

  const handleOption = (option) => {
    if (option === 'auto') {
      navigate('/auto-apply', { state: { resumeId, technologies, jobRole } });
    } else if (option === 'update') {
      navigate('/ai-update', { state: { resumeId, technologies, jobRole } });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
      {previewContent && (
        <div className="preview-container">
          <h3>Resume Preview:</h3>
          {file && file.type === 'application/pdf' ? (
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={0.8} />
              ))}
            </Document>
          ) : (
            <pre>{previewContent}</pre>
          )}
        </div>
      )}
      {technologies.length > 0 && (
        <div>
          <p>Detected Job Role: {jobRole}</p>
          <p>Detected Technologies: {technologies.join(', ')}</p>
          <button onClick={() => setOverrideTechs(true)}>
            Override Technologies
          </button>
        </div>
      )}
      {overrideTechs && (
        <form onSubmit={handleOverrideSubmit}>
          <p>Select detected technologies or add your own:</p>
          {technologies.map((tech) => (
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
          <label>
            Add custom technologies (comma-separated):
            <input
              type="text"
              value={manualTechInput}
              onChange={handleManualTechInput}
              placeholder="e.g., React Native, Kubernetes"
              style={{ width: '100%', marginTop: '10px' }}
            />
          </label>
          <button type="submit" style={{ marginTop: '10px' }}>Confirm Technologies</button>
        </form>
      )}
      {showOptions && (
        <div>
          <h3>What's next?</h3>
          <button onClick={() => handleOption('auto')}>Continue for Auto Apply</button>
          <button onClick={() => handleOption('update')}>Update Resume with AI</button>
        </div>
      )}
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default UploadResume;