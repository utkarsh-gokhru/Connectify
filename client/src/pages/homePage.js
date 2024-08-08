import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import '../css/homePage.css';
import axios from 'axios';

const HomePage = () => {
  
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); 
  const username = user.username;
  const [img, setImg] = useState('');
  console.log(user);

  useEffect(() => {
    axios.post('http://localhost:5000/get/profile',{username})
    .then(response => {
      setImg(response.data.img);
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  })

  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome, {user.username}!</h1>
        <p>Explore what's happening around you.</p>
      </header>
      <section className="profile">
        <div className="profile-picture">
          <img src={'http://localhost:5000/images/' + img} alt={`${user.username}'s profile`} />
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
        </div>
      </section>
      <section className="navigation">
        <button className="nav-button" onClick={() => navigate('/feed')}>Your Feed</button>
        <button className="nav-button" onClick={() => navigate('/messages')}>Messages</button>
        <button className="nav-button" onClick={() => navigate('/settings')}>Settings</button>
      </section>
    </div>
  );
};

export default HomePage;
