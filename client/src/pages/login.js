import React, { useState } from 'react';
import '../css/AuthPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';  // Import useDispatch
import { setUsername } from '../state/actions/action';  // Import the setUsername action

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Initialize useDispatch

  const handleLogin = (e) => {
    e.preventDefault();
    if (identifier && password) {
      setLoading(true);
      axios.post('http://localhost:5000/auth/login', { identifier, password })
        .then(response => {
          console.log(response.data);
          
          // Dispatch the username to the Redux store
          if (response.data.username) {
            dispatch(setUsername(response.data.username));
          }

          setLoading(false);
          navigate('/home');
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
          alert('Invalid Credentials');
        });
    } else {
      alert('Please fill in both fields!');
    }
  };

  return (
    <div className="auth-page">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      )}
      <div className={`auth-content ${loading ? 'blur-background' : ''}`}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email/Username</label>
            <input
              type="text"
              placeholder="Enter your email or username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn-primary" type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
}

export default LoginPage;
