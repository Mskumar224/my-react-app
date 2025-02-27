// src/layouts/MainLayout.js

import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Button } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { UploadFile } from "@mui/icons-material"; // Import Upload File icon

// Header Component
const Header = () => {
  const navigate = useNavigate();

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
          <Tabs textColor="inherit" indicatorColor="secondary">
            <Tab label="PRICING" onClick={() => navigate("/pricing")} />
            <Tab label="LOGIN" onClick={() => navigate("/login")} />
            <Tab label="AI TOOLS" onClick={() => navigate("/ai-tools")} />
          </Tabs>

          {/* Upload Resume Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/upload-resume")}
            sx={{
              ml: 2, // Left margin for spacing
              bgcolor: "#007bff", // Blue color
              '&:hover': { bgcolor: "#0056b3" }, // Darker blue on hover
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

// Footer Component
const Footer = () => (
  <Box sx={{ py: 2, textAlign: "center", bgcolor: "#1e1e1e", mt: 4, color: "#f5f5f5" }}>
    <Typography variant="body2">© 2025 ZvertexAI. All rights reserved.</Typography>
  </Box>
);

// MainLayout Component
const MainLayout = () => {
  return (
    <>
      <Header />  {/* Include the Header */}
      <Box sx={{ minHeight: "calc(100vh - 120px)" }}>
        <Outlet />  {/* This will render the child route components */}
      </Box>
      <Footer />  {/* Include the Footer */}
    </>
  );
};

export default MainLayout;
