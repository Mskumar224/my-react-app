import React from "react";
import { Grid } from "@mui/material";
import PricingCard from "../Components/PricingCard";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    console.log(`Navigating to subscription page with plan: ${plan}`);
    navigate("/subscription", { state: { plan } });
  };

  return (
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
          onSubscribe={() => handleSubscribe("student")}
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
          onSubscribe={() => handleSubscribe("recruiter")}
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
          onSubscribe={() => handleSubscribe("b2b")}
        />
      </Grid>
    </Grid>
  );
};

export default PricingPage;