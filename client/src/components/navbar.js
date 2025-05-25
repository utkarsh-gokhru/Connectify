import React, { useEffect, useState } from 'react';
import { FaHome, FaSearch, FaCompass, FaVideo, FaEnvelope, FaHeart, FaPlusSquare, FaUserCircle } from 'react-icons/fa';
import '../css/navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ notifications, requests, userProfImg }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (requests) {
      console.log('Navbar', requests);
      setPendingRequests(requests.filter(req => req.status === 'pending'));
    }
  }, [requests]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Connectify</h1>
      </div>
      <ul className="navbar-links">
        <li className="navbar-item" onClick={() => navigate('/home')}>
          <FaHome />
          <span>Home</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/search')}>
          <FaSearch />
          <span>Search</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/explore')}>
          <FaCompass />
          <span>Explore</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/reels')}>
          <FaVideo />
          <span>Reels</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/messages')}>
          <FaEnvelope />
          <span>Messages</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/notifications', { state: { notifications, pendingRequests, userProfImg } })}>
          <FaHeart />
          <span>Notifications</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/add-post')}>
          <FaPlusSquare />
          <span>Create</span>
        </li>
        <li className="navbar-item" onClick={() => navigate('/profile')}>
          <FaUserCircle />
          <span>Profile</span>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
