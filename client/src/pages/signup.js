import React, { useState, useEffect, useRef } from 'react';
import '../css/AuthPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUsername } from '../state/actions/action';

const SignupPage = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [mailOtp, setMailOtp] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    if (user && email && password) {
      setLoading(true);
      axios.post('http://localhost:5000/auth/sendOtp', { email })
        .then(response => {
          setMailOtp(response.data.otp);
          setVerifyOtp(true);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        })
    } else {
      alert('Please fill all the fields!');
    }
  };

  const otpInputRefs = useRef([]);

  const focusNextInput = (index) => {
    const nextIndex = index + 1;
    if (nextIndex < otpInputRefs.current.length) {
      otpInputRefs.current[nextIndex].focus();
    }
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    focusNextInput(index);
  };

  useEffect(() => {
    if (verifyOtp) {
      otpInputRefs.current[0].focus();
    }
  }, [verifyOtp]);

  useEffect(() => {
    if (!user) {
      setUserExists(false);
    }

    if (user) {
      setCheckingUser(true);
      console.log(user);
      axios.post('http://localhost:5000/auth/checkExisting', { user })
        .then(response => {
          console.log(response);
          setUserExists(false);
          setCheckingUser(false);
        })
        .catch(error => {
          if (error.response && error.response.status === 409) {
            setUserExists(true);
          } else {
            setUserExists(false);
            console.error(error);
          }
          setCheckingUser(false);
        });
    }
  }, [user]);

  const handleVerify = (e) => {
    e.preventDefault();
    const newOtp = otp.join('');
    if (mailOtp === newOtp) {
      setLoading(true);
      axios.post('http://localhost:5000/auth/signup', { user, email, password })
        .then(response => {
          console.log(response.data);
          if (response.data.user) {
            dispatch(setUsername(response.data.user));
          }
          setEmail('');
          setPassword('');
          setUser('');
          navigate('/profile');
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } else {
      alert('Invalid Otp. Please enter again');
    }
  };

  return (
    <div className="auth-page">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      )}
      {!verifyOtp && (
        <div className={`auth-content ${loading ? 'blur-background' : ''}`}>
          <h2>Sign Up</h2>
          <form>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" required value={user} onChange={(e) => setUser(e.target.value)} />
              {checkingUser && <span>Checking...</span>}
              {userExists && <span>Username already exists</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={handleClick}>Sign Up</button>
          </form>
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      )}
      {verifyOtp && (
        <div className={`otp-container ${loading ? 'blur-background' : ''}`}>
          <h2>Verify OTP</h2>
          <form onSubmit={handleVerify}>
            <div className="otp-inputs">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ''}
                  onChange={(e) => handleOtpChange(e, index)}
                  ref={(input) => (otpInputRefs.current[index] = input)}
                />
              ))}
            </div>
            <div className="verify">
              <button className="btn-primary" type="submit">Verify</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
