import React from "react";
import { Paper, Typography, Box, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { blue } from "@mui/material/colors";

const PlaceholderContent = () => (
  <Paper
    sx={{
      p: 4,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      bgcolor: "rgba(255, 255, 255, 0.8)",  // Use white directly here
      backdropFilter: "blur(10px)",
      borderRadius: 3,
      boxShadow: 3,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        color: blue[700],
        mb: 2,
        textTransform: "uppercase",
      }}
    >
      Zvertex AI
    </Typography>
    <Typography
      variant="h6"
      sx={{
        color: blue[500],
        mb: 4,
      }}
    >
      "Just drop your resume and prepare for the final round of interview."
    </Typography>

    {/* Highlighting the feature */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 3,
        backgroundColor: blue[50],
        p: 2,
        borderRadius: 2,
        width: "100%",
      }}
    >
      <CheckCircleIcon sx={{ color: blue[700], mr: 1 }} />
      <Typography variant="body1" sx={{ color: blue[700] }}>
        AI-powered tools ready for your success.
      </Typography>
    </Box>

    {/* Resume Upload Button */}
    <Button
      variant="contained"
      color="primary"
      startIcon={<UploadIcon />}
      sx={{
        bgcolor: blue[700],
        ":hover": { bgcolor: blue[800] },
        color: "white",  // Use white directly here
        fontWeight: "bold",
        padding: "12px 24px",
      }}
    >
      Upload Resume
    </Button>
  </Paper>
);

export default PlaceholderContent;
