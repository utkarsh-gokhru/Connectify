import React, { useState } from 'react';
import '../css/profile.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProfileSetupPage = () => {

  const user = useSelector((state) => state.user);
  const existUsername = user.username;
  console.log(user);

  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState('');
  const [profileType, setProfileType] = useState('public'); // Default to public
  const [loading, setLoading] = useState(false); // State for loading state if needed

  const navigate = useNavigate();

  const formData = new FormData();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // You may want to handle file validation here (size, type, etc.)
    setProfileImage(file);
  };

  formData.append('existUsername',existUsername);
  formData.append('username',username);
  formData.append('bio',bio);
  formData.append('profileType',profileType);
  if(profileImage){
    formData.append('image',profileImage);
  }

  const handleSubmit = (e) => {
    if(username && bio ){
      e.preventDefault();
      setLoading(true); // Set loading state while processing

      axios.post('http://localhost:5000/save/profile',formData)
      .then(response => {
        console.log(response);
        // dispatch(setUsername(username));
        navigate('/home');
      })
      .catch(error => {
        console.log(error);
      });
    }else{
      alert('Please fill in all the details');
    }

  };

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-content">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea placeholder="Write a short bio..." value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <label>Profile Type</label>
            <select value={profileType} onChange={(e) => setProfileType(e.target.value)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button className="btn-primary" type="submit">{loading ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
