import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';

const app = express();

// Explicit CORS headers for every response
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
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

// Multer setup for temporary storage
const storage = multer.diskStorage({
  destination: '/tmp',
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

// Upload Endpoint
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = path.join('/tmp', req.file.filename);
    const fileType = req.file.mimetype;
    const technologies = await detectTechnologies(filePath, fileType);

    const newResume = new Resume({
      filename: req.file.filename,
      path: filePath,
      technologies,
    });
    await newResume.save();

    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

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
app.post('/resume/:id/companies', async (req, res) => {
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

// Auto-Apply Endpoint
app.post('/resume/:id/auto-apply', async (req, res) => {
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

export default app;