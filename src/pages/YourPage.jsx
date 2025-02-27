// src/pages/YourPage.jsx

import React from "react";
import UploadButton from "../Components/UploadButton";  // Correct import path

const YourPage = () => {
  return (
    <div>
      <h1>Welcome to ZvertexAI</h1>
      <UploadButton />  {/* This will display the button */}
    </div>
  );
};

export default YourPage;
