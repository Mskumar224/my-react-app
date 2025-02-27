// src/pages/UploadResumePage.jsx

import React, { useState } from "react";
import { Box, Container, Typography, Button, TextField, IconButton, Paper } from "@mui/material";
import { Search, UploadFile } from "@mui/icons-material";
import { storage, ref, uploadBytes } from '../firebase'; // Ensure this path is correct
import UploadButton from "../Components/UploadButton"; // This is your existing button component

const UploadResumePage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [fileName, setFileName] = useState(""); // State for file name
  const [file, setFile] = useState(null); // File state
  const [uploading, setUploading] = useState(false); // Uploading state
  const [url, setUrl] = useState(''); // URL after upload

  // Handle file change (file selection)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name); // Set the selected file name
      setFile(selectedFile); // Store the file in state
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };

  // Handle file upload to Firebase
  const handleUpload = async () => {
    if (file) {
      setUploading(true); // Start uploading

      // Create a storage reference for the file in Firebase
      const storageRef = ref(storage, `uploads/${file.name}`);

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);
        setUploading(false); // Stop uploading

        // Get the download URL after upload
        const fileUrl = await storageRef.getDownloadURL();
        setUrl(fileUrl); // Set the file URL after successful upload
        console.log('File uploaded successfully:', fileUrl);
      } catch (error) {
        setUploading(false); // Stop uploading on error
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          label="Search Resumes"
          variant="outlined"
          fullWidth
          sx={{ borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <IconButton sx={{ color: "gray" }}>
                <Search />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Upload Resume Section */}
      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Upload Your Resume</Typography>

        {/* Custom Resume Upload Button */}
        <Button
          variant="contained"
          color="primary"
          component="label"
          sx={{ mb: 2 }}
          startIcon={<UploadFile />}
        >
          Upload Resume
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={handleFileChange} // Handle file selection
          />
        </Button>

        {/* Button to trigger the upload */}
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload to Firebase'}
        </Button>

        {/* Display the file name */}
        {fileName && (
          <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
            File: {fileName}
          </Typography>
        )}

        {/* URL after upload */}
        {url && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            File uploaded successfully! Download URL: <a href={url} target="_blank" rel="noopener noreferrer">Click here</a>
          </Typography>
        )}
      </Paper>

      {/* Include the UploadButton component */}
      <UploadButton /> {/* This renders the existing UploadButton component */}
    </Container>
  );
};

export default UploadResumePage;
