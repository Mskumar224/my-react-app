import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>🚀 "Your Career, Automated. Your Future, Secured."</h1>
        <p>🔹 Smart Job Matching | AI-Powered Insights | Faster Hiring<br />
           🔹 Find Your Dream Job with Precision & Speed</p>
        <button className="cta-button" onClick={() => navigate('/upload-resume')}>
          Get Hired Faster
        </button>
        <button className="cta-button" onClick={() => navigate('/upload-resume')}>
          Join the Future of Job Search
        </button>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>💡 "Job hunting shouldn't be a full-time job. Let AI do the work for you!"</h2>
        <div className="benefits">
          <div className="benefit">
            <h3>✅ AI-Powered Job Recommendations</h3>
            <p>Matches you with the best roles based on your skills & goals</p>
          </div>
          <div className="benefit">
            <h3>✅ One-Click Applications</h3>
            <p>Save time & apply effortlessly</p>
          </div>
          <div className="benefit">
            <h3>✅ Automated Resume Optimization</h3>
            <p>Stand out with AI-enhanced resumes</p>
          </div>
          <div className="benefit">
            <h3>✅ Real-Time Market Insights</h3>
            <p>Stay ahead with salary trends & hiring patterns</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Testimonials</h2>
        <p className="testimonial">🗣️ "I landed my dream job in just 2 weeks! The automation tools saved me hours of searching!" – Sarah K.</p>
        <p className="testimonial">💬 "Finally, a platform that understands what I need. No more spam jobs!" – John D.</p>
        <p>🔹 Join 10,000+ job seekers who found success with us!</p>
      </section>

      {/* Call to Action Section */}
      <section className="call-to-action">
        <h2>🚀 “Get Matched Instantly. Find the Right Job Now.”</h2>
        <button className="cta-button" onClick={() => navigate('/upload-resume')}>
          Sign Up for Free
        </button>
      </section>

      {/* Back Button (hidden on root) */}
      <button className="back-button" onClick={() => navigate(-1)} style={{ display: 'none' }}>
        Back
      </button>
    </div>
  );
};

export default LandingPage;