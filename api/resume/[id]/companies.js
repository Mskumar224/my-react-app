import mongoose from 'mongoose';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { companies } = req.body;
    const { id } = req.query; // Get ID from URL path
    const resume = await Resume.findByIdAndUpdate(
      id,
      { companies },
      { new: true }
    );
    console.log('Updated companies:', resume);
    res.status(200).json({ message: 'Companies updated successfully', resume });
  } catch (error) {
    console.error('Error updating companies:', error);
    res.status(500).json({ message: 'Error updating companies' });
  }
};