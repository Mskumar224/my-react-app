import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Collapse,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PricingCard = ({ icon: Icon, title, price, description, jobDetails }) => {
  const [expanded, setExpanded] = useState(true); // Expanded by default

  return (
    <Card
      sx={{
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: 3,
        backdropFilter: "blur(20px)",
        bgcolor: "rgba(255, 255, 255, 0.9)",
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardHeader
        avatar={<Icon sx={{ fontSize: 40, color: "primary.main" }} />}
        title={<Typography variant="h6">{title}</Typography>}
        subheader={<Typography variant="subtitle1">${price}/Month</Typography>}
        action={
          <IconButton onClick={() => setExpanded(!expanded)}>
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Job Openings:
            </Typography>
            {jobDetails.map((job, index) => (
              <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                {job.title} - <b>${job.salary}</b>
              </Typography>
            ))}
          </Box>
        </Collapse>
        <Button variant="contained" fullWidth sx={{ mt: 2, borderRadius: 2 }}>
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
