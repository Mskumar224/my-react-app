const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const resumeSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadDate: { type: Date, default: Date.now },
  companies: [String],
  appliedJobs: [{ jobTitle: String, company: String, appliedDate: { type: Date, default: Date.now } }],
  technologies: [String],
});
const Resume = mongoose.model('Resume', resumeSchema);

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { id } = event.pathParameters; // Netlify uses pathParameters for dynamic routes
    const resume = await Resume.findById(id);
    if (!resume || !resume.companies.length) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ message: 'No companies selected for this resume' }),
      };
    }

    const techBasedJobs = {
      'javascript': ['Frontend Developer', 'Full-Stack Engineer'],
      'python': ['Data Scientist', 'Backend Developer'],
      'java': ['Java Developer', 'Enterprise Architect'],
      'devops': ['DevOps Engineer', 'Cloud Architect'],
      'csharp': ['.NET Developer', 'Software Engineer'],
      'unknown': ['General Software Engineer', 'Tech Associate'],
    };

    const mockJobs = resume.companies.flatMap(company => {
      return resume.technologies.map(tech => {
        const jobTitles = techBasedJobs[tech] || techBasedJobs['unknown'];
        return jobTitles.map(title => ({ jobTitle: `${title} - ${company}`, company }));
      }).flat();
    });

    const appliedJobs = mockJobs.map(job => ({
      jobTitle: job.jobTitle,
      company: job.company,
      appliedDate: new Date(),
    }));

    resume.appliedJobs = [...(resume.appliedJobs || []), ...appliedJobs];
    await resume.save();

    console.log(`Auto-applied to jobs for resume ${id}:`, appliedJobs);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Auto-applied to jobs successfully', appliedJobs }),
    };
  } catch (error) {
    console.error('Error auto-applying:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Error during auto-apply' }),
    };
  }
};