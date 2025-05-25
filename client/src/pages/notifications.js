import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import '../css/notifications.css';
import Navbar from '../components/navbar';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PostModal from '../components/modal';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications, setRequests } from '../state/actions/action';

const NotificationPage = ({ socket }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const receiver = sessionStorage.getItem('username');

  // Get notifications and friend requests from Redux state
  const notifications = useSelector(state => state.user.notifications);
  const allRequests = useSelector(state => state.user.requests);

  // Filter pending requests
  const pendingRequests = allRequests.filter(request => request.status === 'pending');

  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState(null);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    if (socket) {
      socket.emit('registerCustomId', { username: receiver });

      // socket.on('updateNotes', ({ receiverData }) => {
      //   console.log('Received', receiverData);
      //   if (receiverData.notifications) {
      //     dispatch(setNotifications(receiverData.notifications));
      //     // console.log('xyz', notifications);
      //   }
      //   if (receiverData.requests) {
      //     dispatch(setRequests(receiverData.requests));
      //     console.log('xyz', receiverData.requests);
      //   }
      // });

      // return () => {
      //   socket.off('updateNotes');
      // };
    }
  }, [socket, receiver, dispatch]);

  const handleRequestAction = (sender, action) => {
    try {
      socket.emit('handleRecReq', { sender, receiver, action });
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotificationClick = (notification) => {
    const clickedPost = posts.find(post => post.postId === notification.postId);
    setPostData(clickedPost);
    setOpen(true);
    if (!notification.read) {
      socket.emit('handleNotificationClick', { receiver, notificationId: notification._id });
    }
  };

  const closeModal = () => {
    setOpen(false);
    setPostData(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const postsResponse = await axios.get(`http://localhost:5000/get/user/posts?username=${receiver}`);
        setPosts(postsResponse.data);

        // console.log('Reqs', allRequests, 'Nots', notifications);
        // console.log('pending:', pendingRequests);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [receiver]);

  return (
    <div>
      <div className="nav">
        <Navbar notifications={notifications} requests={pendingRequests} />
      </div>
      <div className="notification-page">
        <div className="tabs">
          <button
            className={activeTab === 'notifications' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications <sup>{notifications.length}</sup>
          </button>
          <button
            className={activeTab === 'requests' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('requests')}
          >
            Friend Requests <sup>{pendingRequests.length}</sup>
          </button>
        </div>

        {activeTab === 'notifications' && (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <h2>{notification.message}</h2>
                <span>
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="request-list">
            {pendingRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div>
                  <h2>{request.sender} sent you a friend request</h2>
                </div>
                <div className="request-actions">
                  <button className="accept-button" onClick={() => handleRequestAction(request.sender, 'accept')}>
                    <FaCheck />
                  </button>
                  <button className="reject-button" onClick={() => handleRequestAction(request.sender, 'reject')}>
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && postData && (
        <PostModal
          handleClose={closeModal}
          username={postData.user}
          profileImg={location.state?.userProfImg || ''}
          content={postData.content}
          media={postData.media}
          likes={postData.likes.length}
          comments={postData.comments.length}
          likeClicked={postData.likes.includes(receiver)}
        />
      )}
    </div>
  );
};

export default NotificationPage;
