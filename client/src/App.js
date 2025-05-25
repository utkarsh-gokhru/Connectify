import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import ProfileSetupPage from './pages/profile';
import Post from './components/post';
import AddPost from './pages/addPost';
import PostsPage from './pages/postPage';
import ProfilePage from './pages/userProfile';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import NotificationPage from './pages/notifications';
import './index.css';
import Chatbot from './components/chatbot';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends, setNotifications, setRequests } from './state/actions/action';

function App() {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  const notifications = useSelector(state => state.user.notifications);
  // const username = sessionStorage.getItem('username');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected with socket ID:', newSocket.id);
    });

    const handleNoteUpdates = ({ receiverData }) => {
      console.log('received', receiverData);
      if (receiverData.notifications) {
        dispatch(setNotifications(receiverData.notifications));
      }
      if (receiverData.requests) {
        dispatch(setRequests(receiverData.requests));
      }
      if (receiverData.friends_list) {
        dispatch(setFriends(receiverData.friends_list));
      }
    }

    newSocket.on('updateNotes', handleNoteUpdates);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) {
    // Optionally handle loading state while socket is initializing
    return <div>Loading...</div>;
  }

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/notifications' element={<NotificationPage socket={socket} />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/home' element={<PostsPage socket={socket} />} />
          <Route path='/profile' element={<ProfileSetupPage />} />
          <Route path='/post' element={<Post />} />
          <Route path='/add-post' element={<AddPost />} />
          <Route path='/user-profile' element={<ProfilePage socket={socket} />} />
          <Route path='/chatbot' element={<Chatbot />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
