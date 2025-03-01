import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to test database'))
  .catch(err => console.log('MongoDB connection error:', err));

// Resume Schema
const resumeSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadDate: { type: Date, default: Date.now },
  companies: [String],
  appliedJobs: [{ jobTitle: String, company: String, appliedDate: { type: Date, default: Date.now } }],
  technologies: [String],
});
const Resume = mongoose.model('Resume', resumeSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Technology detection function
const detectTechnologies = async (filePath, fileType) => {
  try {
    let text = '';
    if (fileType === 'application/pdf') {
      const { default: pdfParse } = await import('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text.toLowerCase();
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value.toLowerCase();
    } else {
      throw new Error('Unsupported file type');
    }

    const techKeywords = {
      'javascript': ['javascript', 'js', 'react', 'node', 'nodejs', 'vue'],
      'python': ['python', 'django', 'flask', 'pandas', 'numpy'],
      'java': ['java', 'spring', 'hibernate', 'j2ee'],
      'devops': ['docker', 'kubernetes', 'aws', 'ci/cd', 'jenkins', 'terraform'],
      'csharp': ['c#', '.net', 'asp.net', 'dotnet'],
    };

    const detectedTechs = [];
    for (const [tech, keywords] of Object.entries(techKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        detectedTechs.push(tech);
      }
    }
    return detectedTechs.length > 0 ? detectedTechs : ['unknown'];
  } catch (error) {
    console.error('Error parsing resume:', error);
    return ['unknown'];
  }
};

// Upload Endpoint with Technology Detection
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);
    const fileType = req.file.mimetype;
    const technologies = await detectTechnologies(filePath, fileType);

    const newResume = new Resume({
      filename: req.file.filename,
      path: req.file.path,
      technologies,
    });
    await newResume.save();
    console.log('Saved to MongoDB:', newResume);
    res.status(200).json({ 
      message: 'Resume uploaded successfully', 
      resumeId: newResume._id,
      technologies
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Error uploading resume' });
  }
});

// Update Companies Endpoint
app.post('/api/resume/:id/companies', async (req, res) => {
  try {
    const { companies } = req.body;
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { companies },
      { new: true }
    );
    console.log('Updated companies:', resume);
    res.status(200).json({ message: 'Companies updated successfully', resume });
  } catch (error) {
    console.error('Error updating companies:', error);
    res.status(500).json({ message: 'Error updating companies' });
  }
});

// Fetch Jobs and Auto-Apply Endpoint
app.post('/api/resume/:id/auto-apply', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume || !resume.companies.length) {
      return res.status(400).json({ message: 'No companies selected for this resume' });
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

    console.log(`Auto-applied to jobs for resume ${req.params.id}:`, appliedJobs);
    res.status(200).json({ message: 'Auto-applied to jobs successfully', appliedJobs });
  } catch (error) {
    console.error('Error auto-applying:', error);
    res.status(500).json({ message: 'Error during auto-apply' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});