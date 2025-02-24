// src/pages/UploadResumePage.jsx
import React, { useState } from "react";
import { Box, Container, Typography, Button, TextField, IconButton, Paper } from "@mui/material";
import { Search, UploadFile } from "@mui/icons-material";
import { storage, ref, uploadBytes } from '../firebase';

const UploadResumePage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [fileName, setFileName] = useState(""); // State for file name

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file.name) // Store selected file name
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query
  };
  const handleUpload = async () => {
    if (file) {
      setUploading(true);

      // Create a storage reference for the file
      const storageRef = ref(storage, `uploads/${file.name}`);

      try {
        // Upload the file
        await uploadBytes(storageRef, file);
        setUploading(false);

        // Get the download URL
        const fileUrl = await storageRef.getDownloadURL();
        setUrl(fileUrl);

        console.log('File uploaded successfully:', fileUrl);
      } catch (error) {
        setUploading(false);
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

        {/* Resume Upload Button */}
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
            onChange={handleFileChange}
          />
        </Button>
        <Button onClick={handleUpload} value="Upload">
                  Upload to firebase
        </Button>

        {/* Display the file name */}
        {fileName && (
          <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
            File: {fileName}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default UploadResumePage;
