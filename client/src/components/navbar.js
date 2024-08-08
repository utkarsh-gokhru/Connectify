import React from 'react';
import { FaHome, FaSearch, FaCompass, FaVideo, FaEnvelope, FaHeart, FaPlusSquare, FaUserCircle } from 'react-icons/fa';
import '../css/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Connectify</h1>
      </div>
      <ul className="navbar-links">
        <li className="navbar-item">
          <FaHome />
          <span>Home</span>
        </li>
        <li className="navbar-item">
          <FaSearch />
          <span>Search</span>
        </li>
        <li className="navbar-item">
          <FaCompass />
          <span>Explore</span>
        </li>
        <li className="navbar-item">
          <FaVideo />
          <span>Reels</span>
        </li>
        <li className="navbar-item">
          <FaEnvelope />
          <span>Messages</span>
        </li>
        <li className="navbar-item">
          <FaHeart />
          <span>Notifications</span>
        </li>
        <li className="navbar-item">
          <FaPlusSquare />
          <span>Create</span>
        </li>
        <li className="navbar-item">
          <FaUserCircle />
          <span>Profile</span>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
