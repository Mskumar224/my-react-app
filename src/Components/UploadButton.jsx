// src/components/UploadButton.jsx

import React, { useState } from "react";
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { ref, uploadBytes } from "firebase/storage";
import { storage, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const UploadButton = () => {
  const [file, setFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    if (selectedFile) {
      setFile(selectedFile); // Set the selected file in state
      setUploadSuccess(false); // Reset success state
      setOpenDialog(true); // Open the dialog for user choice
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const fileRef = ref(storage, `resumes/${file.name}`); // Define the file reference in Firebase Storage
        await uploadBytes(fileRef, file); // Upload the file to Firebase Storage

        // Save the metadata to Firestore
        const fileMetadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
        };

        await setDoc(doc(db, "resumes", file.name), fileMetadata); // Save metadata in Firestore
        setUploadSuccess(true); // Set upload success state
      } catch (error) {
        console.error("Upload failed", error); // Log any upload errors
      }
    }
  };

  // Simulating AI-based suggestions (replace with actual API calls)
  const getAISuggestions = (file) => {
    // Placeholder for AI tool integration, replace with actual API logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "Add more impactful keywords for your skills.",
          "Consider rephrasing your job experience section to be more concise.",
          "Highlight your achievements in a separate section."
        ]);
      }, 1000);
    });
  };

  const handleUserChoice = async (choice) => {
    if (choice === "submit") {
      alert("Auto-apply activated. Prepare for the final round of the interview.");
    } else if (choice === "modify") {
      alert("Redirecting to AI tools for suggestions to improve your resume.");

      // Call AI function to get suggestions
      const suggestions = await getAISuggestions(file);
      console.log("AI Suggestions:", suggestions);

      // Display suggestions (you can customize this part for a UI display)
      alert(`AI Suggestions: \n- ${suggestions.join("\n- ")}`);
    }
    setOpenDialog(false); // Close the dialog after action
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadIcon />}
        component="label"
      >
        Upload Resume
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {uploadSuccess && (
        <Typography variant="h6" color="success.main" mt={2}>
          Upload Successful!
        </Typography>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upload Successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your resume has been uploaded successfully. What would you like to do next?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUserChoice("submit")} color="primary">
            Proceed for Submissions
          </Button>
          <Button onClick={() => handleUserChoice("modify")} color="secondary">
            Make Changes to Resume
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadButton;
