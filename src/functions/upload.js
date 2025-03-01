const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');

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

const storage = multer.diskStorage({
  destination: '/tmp',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single('resume');

const detectTechnologies = async (filePath, fileType) => {
  try {
    let text = '';
    if (fileType === 'application/pdf') {
      const pdfParse = require('pdf-parse');
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

  return new Promise((resolve, reject) => {
    upload(event, context, async (err) => {
      if (err) {
        return resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
          body: JSON.stringify({ message: 'Error processing upload' }),
        });
      }

      try {
        const filePath = path.join('/tmp', event.file.filename);
        const fileType = event.file.mimetype;
        const technologies = await detectTechnologies(filePath, fileType);

        const newResume = new Resume({
          filename: event.file.filename,
          path: filePath,
          technologies,
        });
        await newResume.save();

        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });

        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
          body: JSON.stringify({
            message: 'Resume uploaded successfully',
            resumeId: newResume._id,
            technologies,
          }),
        });
      } catch (error) {
        console.error('Error saving resume:', error);
        resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
          body: JSON.stringify({ message: 'Error uploading resume' }),
        });
      }
    });
  });
};