import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const PricingCard = ({
  icon: Icon,
  title,
  price,
  description,
  jobDetails,
  onSubscribe,
}) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Icon sx={{ fontSize: 40, mb: 2 }} color="primary" />
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          ${price}/mo
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {description}
        </Typography>
        {jobDetails.map((job, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 1 }}>
            {job.title}: {job.salary}
          </Typography>
        ))}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={onSubscribe}
        >
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;