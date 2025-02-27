// src/components/Header.jsx

import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Button } from "@mui/material";
import { UploadFile } from "@mui/icons-material"; // Import Upload File icon
import { useNavigate } from "react-router-dom"; 

const Header = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Track the selected tab
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue); // Update the selected tab
    if (newValue === 0) navigate("/"); // Navigate to home page
    else if (newValue === 1) navigate("/pricing"); // Navigate to pricing
    else if (newValue === 2) navigate("/ai-tools"); // Navigate to AI tools
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#f5f5f5", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          ZvertexAI
        </Typography>

        {/* Tabs for navigation */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tabs
            value={selectedTab} // Set the value to the selected tab index
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="PRICING" />
            <Tab label="LOGIN" />
            <Tab label="AI TOOLS" />
          </Tabs>

          {/* Upload Resume Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/upload-resume")}
            sx={{
              ml: 2,
              bgcolor: "#007bff",
              '&:hover': { bgcolor: "#0056b3" },
            }}
            startIcon={<UploadFile />}
          >
            Upload Resume
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
