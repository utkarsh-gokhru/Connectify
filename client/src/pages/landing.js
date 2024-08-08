import React from 'react';
import '../css/landing.css';
import {useNavigate} from 'react-router-dom'

const LandingPage = () => {
    
    const navigate = useNavigate();

    return (
        <div className="landing-page">
        <section className="hero">
            <div className="hero-content">
            <h1>Connect, Share, and Discover</h1>
            <p>Join our community and share your moments with friends and family.</p>
            <div className="cta-buttons">
                <button className="btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
                <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
            </div>
            </div>
        </section>

        <section className="features">
            <h2>Features</h2>
            <div className="feature-grid">
            <div className="feature-item">
                <i className="fas fa-user-friends"></i>
                <h3>User Profiles</h3>
                <p>Create and personalize your profile.</p>
            </div>
            <div className="feature-item">
                <i className="fas fa-user-plus"></i>
                <h3>Friend Requests</h3>
                <p>Connect with people you know.</p>
            </div>
            <div className="feature-item">
                <i className="fas fa-edit"></i>
                <h3>Posts</h3>
                <p>Share your thoughts, photos, and videos.</p>
            </div>
            <div className="feature-item">
                <i className="fas fa-comments"></i>
                <h3>Messaging</h3>
                <p>Communicate in real-time.</p>
            </div>
            <div className="feature-item">
                <i className="fas fa-bell"></i>
                <h3>Notifications</h3>
                <p>Stay updated with instant notifications.</p>
            </div>
            </div>
        </section>

        <footer className="footer">
            <p>&copy; 2024 Social Media App. All rights reserved.</p>
        </footer>
        </div>
    );
}

export default LandingPage;
