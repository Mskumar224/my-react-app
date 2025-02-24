import React from "react";
import { Paper, Typography } from "@mui/material";

const PlaceholderContent = () => (
  <Paper
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      bgcolor: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      borderRadius: 3,
      boxShadow: 3,
    }}
  >
    <Typography variant="h6">
      "Innovation meets opportunity. Unlock the future with MyApp."
    </Typography>
  </Paper>
);

export default PlaceholderContent;
