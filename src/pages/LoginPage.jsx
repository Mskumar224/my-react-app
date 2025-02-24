import React from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Password" type="password" margin="normal" />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Sign In
      </Button>
    </Paper>
  );
};

export default LoginPage;  // ✅ Make sure it's exported correctly
