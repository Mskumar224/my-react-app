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
    const { companies } = JSON.parse(event.body);
    const { id } = event.pathParameters; // Netlify uses pathParameters for dynamic routes
    const resume = await Resume.findByIdAndUpdate(
      id,
      { companies },
      { new: true }
    );
    console.log('Updated companies:', resume);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Companies updated successfully', resume }),
    };
  } catch (error) {
    console.error('Error updating companies:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Error updating companies' }),
    };
  }
};