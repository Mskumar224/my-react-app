import React from "react";
import { Typography, Box, List, ListItem, ListItemText } from "@mui/material";

const AiToolsPage = () => {
  // Sample list of AI tools for job search candidates
  const jobSearchTools = [
    {
      name: "Resume Builder",
      description:
        "Automatically generate an ATS-friendly resume tailored to job descriptions.",
    },
    {
      name: "Job Matcher",
      description:
        "Find job listings that align with your skills and preferences using AI.",
    },
    {
      name: "Auto-Apply Bot",
      description:
        "Submit applications to multiple job postings with one click.",
    },
    {
      name: "Interview Prep",
      description:
        "Practice with AI-generated interview questions and get real-time feedback.",
    },
    {
      name: "Cover Letter Generator",
      description:
        "Create personalized cover letters based on job requirements.",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Explore Our AI Tools for Job Seekers
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
        Supercharge your job search with these powerful AI tools designed to save
        time and boost your chances of landing the perfect role.
      </Typography>
      <List>
        {jobSearchTools.map((tool, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemText
              primary={
                <Typography variant="h6" color="primary">
                  {tool.name}
                </Typography>
              }
              secondary={
                <Typography variant="body2">{tool.description}</Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AiToolsPage;