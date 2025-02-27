// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";  // Ensure this is the correct path
import HomePage from "./pages/HomePage";  // Ensure this is the correct path
import PricingPage from "./pages/PricingPage";  // Ensure this is the correct path
import LoginPage from "./pages/LoginPage";  // ✅ Case-sensitive
import AiToolsPage from "./pages/AiToolsPage";  // Ensure this is the correct path
import UploadResumePage from "./pages/UploadResumePage";  // Import the UploadResumePage

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout for general routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="ai-tools" element={<AiToolsPage />} />
          <Route path="upload-resume" element={<UploadResumePage />} /> {/* Add UploadResumePage route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
