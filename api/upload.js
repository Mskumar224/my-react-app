import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mammoth from 'mammoth';

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
const upload = multer({ storage }).single('resume');

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

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

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
};