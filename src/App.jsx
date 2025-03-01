import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadResume from './Components/ResumeUpload';
import AutoApply from './Components/AutoApply';
import UpdateResume from './Components/UpdateResume';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container">
        <h1 className="site-title">ZvertexAI</h1>
        <Routes>
          <Route path="/" element={<UploadResume />} />
          <Route path="/auto-apply" element={<AutoApply />} />
          <Route path="/update-resume" element={<UpdateResume />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;