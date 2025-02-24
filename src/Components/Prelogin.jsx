import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";

const Header = () => (
  <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f5f5f5" }}>
      ZvertexAI
      </Typography>
      <Tabs textColor="inherit" indicatorColor="secondary">
        <Tab label="PRICING" />
        <Tab label="LOGIN" />
        <Tab label="AI TOOLS" />
      </Tabs>
    </Toolbar>
  </AppBar>
);

const Footer = () => (
  <Box sx={{ py: 2, textAlign: "center", bgcolor: "#1e1e1e", mt: 4, color: "#f5f5f5" }}>
    <Typography variant="body2">© 2025 ZvertexAI. All rights reserved.</Typography>
  </Box>
);

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
      "Innovation meets opportunity. Unlock the future with ZvertexAI."
    </Typography>
  </Paper>
);

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

const Prelogin = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Left Column (Small, Centered Text) */}
          <Grid item xs={12} md={4}>
            <PlaceholderContent />
          </Grid>

          {/* Right Column (Horizontally Aligned Cards, Expanded by Default) */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <PricingCard
                  icon={WorkIcon}
                  title="STUDENT"
                  price="39"
                  description="Access any software job position with a competitive salary range."
                  jobDetails={[
                    { title: "Junior Developer", salary: "50,000 - 70,000" },
                    { title: "QA Engineer", salary: "55,000 - 75,000" },
                    { title: "UI/UX Designer", salary: "60,000 - 80,000" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PricingCard
                  icon={AttachMoneyIcon}
                  title="RECRUITER"
                  price="79"
                  description="Post unlimited software job openings with tailored salary insights."
                  jobDetails={[
                    { title: "Software Engineer", salary: "80,000 - 120,000" },
                    { title: "Data Analyst", salary: "75,000 - 110,000" },
                    { title: "DevOps Engineer", salary: "90,000 - 130,000" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PricingCard
                  icon={BusinessIcon}
                  title="B2B"
                  price="159"
                  description="Unlock enterprise-level hiring solutions with customized support."
                  jobDetails={[
                    { title: "Senior Software Engineer", salary: "120,000 - 160,000" },
                    { title: "AI/ML Specialist", salary: "130,000 - 170,000" },
                    { title: "Cloud Architect", salary: "140,000 - 180,000" },
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Prelogin;
