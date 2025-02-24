import React from "react";
import { Paper, Typography } from "@mui/material";

const PlaceholderContent = () => (
  <Paper
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column", // Stack headers vertically
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      bgcolor: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: 3,
      boxShadow: 3,
    }}
  >
    <Typography variant="h4" gutterBottom>
      "Welcome to MyApp"
    </Typography>
    <Typography variant="h5" gutterBottom>
      "Unlock the future today"
    </Typography>
    <Typography variant="h6">
      "LOGIN"
    </Typography>
  </Paper>
);

export default PlaceholderContent;