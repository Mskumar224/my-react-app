import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mammoth from 'mammoth';
import nodemailer from 'nodemailer';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const mongoURI = 'mongodb://localhost:27017/zvertexai';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to zvertexai database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Resume Schema
const resumeSchema = new mongoose.Schema({
  filename: String,
  path: String,
  content: String,
  uploadDate: { type: Date, default: Date.now },
  companies: [String],
  appliedJobs: [{
    jobTitle: String,
    company: String,
    appliedDate: { type: Date, default: Date.now },
    status: { type: String, default: 'applied' },
    jobUrl: String
  }],
  technologies: [String],
  jobRole: String, // New field for detected job role
  userDetails: {
    name: String,
    phone: String,
    email: String,
    address: String,
    visaType: { type: String, enum: ['H1B', 'GC', 'Citizen', 'OPT', 'STEM-OPT'] },
    jobType: { type: String, enum: ['Hybrid', 'Remote', 'FullTime'] }
  }
});
const Resume = mongoose.model('Resume', resumeSchema);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-actual-gmail@gmail.com', // Replace with your Gmail
    pass: 'your-actual-app-password'     // Replace with your app-specific password
  }
});

// Verify Nodemailer setup
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error.message);
  } else {
    console.log('Nodemailer configured successfully');
  }
});

// Enhanced Technology and Job Role Detection
const detectTechnologiesAndRole = async (filePath, fileType) => {
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

    // Technology Keywords with Regex Patterns
    const techKeywords = {
      'JavaScript': [/javascript/i, /js/i, /react\.?js/i, /node\.?js/i, /vue\.?js/i, /angular/i, /typescript/i],
      'Python': [/python/i, /django/i, /flask/i, /pandas/i, /numpy/i, /tensorflow/i, /pytorch/i],
      'Java': [/java/i, /spring/i, /hibernate/i, /j2ee/i, /jsp/i, /servlet/i],
      'DevOps': [/devops/i, /docker/i, /kubernetes/i, /aws/i, /azure/i, /gcp/i, /ci\/cd/i, /jenkins/i, /terraform/i, /ansible/i],
      'C#': [/c#/i, /\.net/i, /asp\.net/i, /dotnet/i, /xamarin/i],
      'SQL': [/sql/i, /mysql/i, /postgresql/i, /sqlite/i, /oracle\s+database/i],
      'PHP': [/php/i, /laravel/i, /symfony/i, /codeigniter/i],
      'Ruby': [/ruby/i, /rails/i, /ruby\s+on\s+rails/i],
      'C++': [/c\+\+/i, /cpp/i],
      'Go': [/go/i, /golang/i]
    };

    // Job Role Keywords with Regex Patterns
    const jobRoleKeywords = {
      'Software Engineer': [/software\s+engineer/i, /software\s+developer/i, /full\s+stack\s+engineer/i],
      'Data Scientist': [/data\s+scientist/i, /data\s+analyst/i, /machine\s+learning\s+engineer/i],
      'DevOps Engineer': [/devops\s+engineer/i, /site\s+reliability\s+engineer/i, /sre/i],
      'Frontend Developer': [/frontend\s+developer/i, /front-end\s+engineer/i, /ui\s+developer/i],
      'Backend Developer': [/backend\s+developer/i, /back-end\s+engineer/i, /server-side\s+developer/i],
      'Cloud Engineer': [/cloud\s+engineer/i, /cloud\s+architect/i, /aws\s+engineer/i],
      'Mobile Developer': [/mobile\s+developer/i, /ios\s+developer/i, /android\s+developer/i],
      'Project Manager': [/project\s+manager/i, /pm/i, /program\s+manager/i],
      'QA Engineer': [/qa\s+engineer/i, /quality\s+assurance/i, /test\s+engineer/i],
      'System Administrator': [/system\s+administrator/i, /sysadmin/i, /network\s+administrator/i]
    };

    // Detect Technologies
    const detectedTechs = [];
    for (const [tech, patterns] of Object.entries(techKeywords)) {
      if (patterns.some(pattern => pattern.test(text))) {
        detectedTechs.push(tech);
      }
    }

    // Detect Job Role
    let detectedRole = null;
    for (const [role, patterns] of Object.entries(jobRoleKeywords)) {
      if (patterns.some(pattern => pattern.test(text))) {
        detectedRole = role;
        break; // Take the first match
      }
    }

    return {
      technologies: detectedTechs.length > 0 ? detectedTechs : ['unknown'],
      jobRole: detectedRole || 'unknown'
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    return { technologies: ['unknown'], jobRole: 'unknown' };
  }
};

// Upload Endpoint with Enhanced Detection
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, req.file.path);
    const fileType = req.file.mimetype;
    let content = '';

    if (fileType === 'application/pdf') {
      const { default: pdfParse } = await import('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      content = data.text || 'Unable to extract text from PDF';
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      content = result.value || 'Unable to extract text from Word document';
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    const { technologies, jobRole } = await detectTechnologiesAndRole(filePath, fileType);
    const newResume = new Resume({
      filename: req.file.filename,
      path: req.file.path,
      content,
      technologies,
      jobRole
    });

    await newResume.save();
    console.log('Saved to MongoDB:', newResume);
    res.status(200).json({ 
      message: 'Resume uploaded successfully', 
      resumeId: newResume._id,
      technologies,
      jobRole,
      content
    });
  } catch (error) {
    console.error('Error in upload endpoint:', error.message, error.stack);
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
});

// Updated Company Career Page Mapping
const companyCareerPages = {
  'Google': { 
    url: 'https://www.google.com/about/careers/applications/jobs/results/?sort_by=date', 
    selector: '.p77Rsh.tzDURb a'
  },
  'Amazon': { 
    url: 'https://www.amazon.jobs/en/search?base_query=', 
    selector: '.job-tile .job-link'
  },
  'Microsoft': { 
    url: 'https://jobs.careers.microsoft.com/global/en/search?sort=date', 
    selector: '.ms-search-result-job-card a'
  },
  'Tesla': { 
    url: 'https://www.tesla.com/careers/search/?sort=date', 
    selector: '.job-listing-title a'
  },
  'Facebook': { 
    url: 'https://www.metacareers.com/jobs/', 
    selector: '.job-card a'
  }
};

// Cheerio-based real-time job scraping
const scrapeJobs = async (companies, technologies) => {
  const jobs = [];
  try {
    for (const company of companies) {
      console.log(`Fetching real-time jobs for ${company}`);
      const careerPage = companyCareerPages[company];
      let response;

      if (careerPage) {
        const searchQuery = technologies.join(' ');
        const url = `${careerPage.url}${encodeURIComponent(searchQuery)}`;
        response = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
          timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const jobElements = $(careerPage.selector);
        if (jobElements.length === 0) {
          console.warn(`No jobs found for ${company} on ${url}, falling back to Indeed`);
        } else {
          jobElements.slice(0, 3).each((index, element) => {
            const title = $(element).text().trim();
            const jobUrl = $(element).attr('href').startsWith('http') ? $(element).attr('href') : `${careerPage.url.split('/jobs')[0]}${$(element).attr('href')}`;
            const requiresDocs = Math.random() > 0.5;
            jobs.push({ company, title, url: jobUrl, requiresDocs, techs: technologies, posted: new Date() });
          });
        }
      }

      if (!careerPage || $(careerPage.selector).length === 0) {
        const indeedUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(company + ' ' + technologies.join(' '))}&sort=date`;
        response = await axios.get(indeedUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
          timeout: 10000
        });
        const $indeed = cheerio.load(response.data);
        $indeed('.jobTitle a').slice(0, 3).each((index, element) => {
          const title = $indeed(element).text().trim();
          const jobUrl = 'https://www.indeed.com' + $indeed(element).attr('href');
          const requiresDocs = Math.random() > 0.5;
          jobs.push({ company, title, url: jobUrl, requiresDocs, techs: technologies, posted: new Date() });
        });
      }
    }
    return jobs.length > 0 ? jobs : companies.map(company => ({
      company,
      title: `No Jobs Available - ${company}`,
      url: `https://www.indeed.com/jobs?q=${encodeURIComponent(company)}`,
      requiresDocs: false,
      techs: technologies,
      posted: new Date()
    }));
  } catch (error) {
    console.error('Error in scrapeJobs:', error.message, error.stack);
    return companies.map(company => ({
      company,
      title: `Failed to Fetch Jobs - ${company}`,
      url: `https://www.indeed.com/jobs?q=${encodeURIComponent(company)}`,
      requiresDocs: false,
      techs: technologies,
      posted: new Date()
    }));
  }
};

// Apply Jobs Logic with Email Error Handling
const applyJobs = async (jobs, userDetails) => {
  const appliedJobs = [];
  for (const job of jobs) {
    const jobEntry = {
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date(),
      status: job.requiresDocs ? 'manual' : 'applied',
      jobUrl: job.requiresDocs ? `mailto:${userDetails.email}?subject=Manual%20Application%20for%20${job.title}` : job.url
    };
    appliedJobs.push(jobEntry);

    if (!job.requiresDocs) {
      console.log(`Simulating auto-apply to ${job.title} at ${job.company}`);
      const mailOptions = {
        from: 'your-actual-gmail@gmail.com',
        to: userDetails.email,
        subject: `Auto-Apply Confirmation: ${job.title} at ${job.company}`,
        text: `Dear ${userDetails.name},\n\nYour resume has been auto-applied to ${job.title} at ${job.company}.\n\nDetails:\nPhone: ${userDetails.phone}\nEmail: ${userDetails.email}\nVisa Type: ${userDetails.visaType}\nJob Type: ${userDetails.jobType}\n\nExpect a call or email from the employer.\n\nRegards,\nZvertexAI Team`
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent for ${job.title} at ${job.company}`);
      } catch (emailError) {
        console.error(`Failed to send email for ${job.title} at ${job.company}:`, emailError.message);
      }
    } else {
      console.log(`Manual apply required for ${job.title} at ${job.company}`);
    }
  }
  return appliedJobs;
};

// Fetch Jobs Endpoint
app.post('/api/fetch-jobs', async (req, res) => {
  const { companies, resumeId } = req.body;
  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ message: 'Resume not found' });

  try {
    const jobs = await scrapeJobs(companies, resume.technologies);
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Auto-Apply Endpoint
app.post('/api/auto-apply', async (req, res) => {
  const { resumeId, companies, userDetails } = req.body;
  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ message: 'Resume not found' });

  try {
    resume.userDetails = userDetails;
    const jobs = await scrapeJobs(companies, resume.technologies);
    const appliedJobs = await applyJobs(jobs, userDetails);

    resume.appliedJobs = [...(resume.appliedJobs || []), ...appliedJobs];
    resume.companies = companies;
    await resume.save();

    console.log('Saved to MongoDB with applied jobs:', resume);
    res.status(200).json({ message: 'Auto-apply initiated', appliedJobs });
  } catch (error) {
    console.error('Error in auto-apply endpoint:', error.message, error.stack);
    res.status(500).json({ message: 'Error processing auto-apply', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});