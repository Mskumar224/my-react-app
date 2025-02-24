import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const SubscriptionPage = () => {
  const location = useLocation();
  const { plan } = location.state || {};

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Subscription Checkout
      </Typography>
      <Typography variant="h6">
        {plan
          ? `You’re subscribing to the ${plan.toUpperCase()} plan!`
          : "Please select a plan to proceed."}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Complete your subscription details here.
      </Typography>
    </Box>
  );
};

export default SubscriptionPage;