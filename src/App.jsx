import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import UploadResume from './Components/ResumeUpload';
import AutoApply from './Components/AutoApply';
import UpdateResume from './Components/UpdateResume';
import AIUpdatePage from './Components/AIUpdatePage';
import './index.css';

function App() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header className="site-header">
        <button className="home-button" onClick={() => navigate('/')}>
          ZvertexAI
        </button>
      </header>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/auto-apply" element={<AutoApply />} />
        <Route path="/update-resume" element={<UpdateResume />} />
        <Route path="/ai-update" element={<AIUpdatePage />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}