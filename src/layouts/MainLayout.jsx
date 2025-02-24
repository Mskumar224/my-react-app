import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f5f5f5", cursor: "pointer" }} onClick={() => navigate("/")}>
          MyApp
        </Typography>
        <Tabs textColor="inherit" indicatorColor="secondary">
          <Tab label="PRICING" onClick={() => navigate("/pricing")} />
          <Tab label="LOGIN" onClick={() => navigate("/login")} />
          <Tab label="AI TOOLS" onClick={() => navigate("/ai-tools")} />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

const Footer = () => (
  <Box sx={{ py: 2, textAlign: "center", bgcolor: "#1e1e1e", mt: 4, color: "#f5f5f5" }}>
    <Typography variant="body2">© 2025 MyApp. All rights reserved.</Typography>
  </Box>
);

const MainLayout = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Outlet /> {/* This will load different page content */}
      </Container>
      <Footer />
    </>
  );
};

export default MainLayout;
