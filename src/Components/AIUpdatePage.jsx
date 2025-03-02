import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';

const AIUpdatePage = () => {
  const { state } = useLocation();
  const { resumeId, technologies } = state || {};
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    console.log('AI Prompt:', prompt);
    const simulatedResponse = `Suggested updates based on your prompt "${prompt}":\n1. Added skills: AI, Machine Learning\n2. Enhanced formatting\nPlease update your resume with these suggestions and re-upload.`;
    setAiResponse(simulatedResponse);
    setMessage('AI processing completed. Review the suggestions below and update your resume.');
  };

  return (
    <div>
      <h2>AI Resume Update (Perplexity Integration)</h2>
      {technologies && <p>Current Technologies: {technologies.join(', ')}</p>}
      {!aiResponse ? (
        <form onSubmit={handlePromptSubmit}>
          <label>
            Enter instructions for AI to update your resume:
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Add more technical skills, improve formatting..."
              required
            />
          </label>
          <button type="submit">Process with AI</button>
        </form>
      ) : (
        <div>
          <p>{message}</p>
          <pre>{aiResponse}</pre>
          <button onClick={() => navigate('/update-resume', { state: { resumeId, technologies } })}>
            Upload Updated Resume
          </button>
        </div>
      )}
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default AIUpdatePage;