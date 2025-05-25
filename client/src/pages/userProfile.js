import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/post';
import '../css/userProfile.css';
import Navbar from '../components/navbar';
import { useSelector } from 'react-redux';

const ProfilePage = ({ socket }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState('private');
    const [friends, setFriends] = useState(false);
    const [requested, setRequested] = useState(false);
    const[userFriends,setUserFriends]=useState([]);
    const location = useLocation();
    const username = new URLSearchParams(location.search).get('username');
    const visitor = sessionStorage.getItem('username');

    const visitor_friends_list = useSelector(state => state.user.friends);
    useEffect(() => {
        setFriends(visitor_friends_list.includes(username));
    }, [visitor_friends_list, username]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/get/user?username=${username}`);
                const userData = userResponse.data;

                setUser(userData);
                setProfile(userData.profile_type);
                setUserFriends(userData.friends_list);
                // setFriends(userData.friends_list.includes(visitor));
                // setFriends(friends_list.includes(visitor));

                const postsResponse = await axios.get(`http://localhost:5000/get/user/posts?username=${username}`);
                setPosts(postsResponse.data);

                // Check if visitor has sent a friend request
                const requestSent = userData.requests.some(request => request.sender === visitor && request.status === 'pending');
                setRequested(requestSent);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username, visitor]);

    const addFriend = async () => {
        try {
            if (!requested) {
                setRequested(true);
                socket.emit('addFriend', { username, visitor });
            } else {
                socket.emit('cancelRequest', { username, visitor });
                setRequested(false);
            }
        } catch (error) {
            console.error('Error handling friend request:', error);
        }
    };

    const removeFriend = async () => {
        try {
            setFriends(false);
            socket.emit('removeFriend', { username, visitor });
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    useEffect(() => {
        const handleFriendRequestSent = () => {
            setRequested(true);
        };

        const handlFriendAdded=({receiverData})=>{
            setUser(receiverData);
        }

        const handlFriendRemoved=({receiverData})=>{
            setUser(receiverData);
        }

        socket.on('friendRequestSent', handleFriendRequestSent);
        socket.on('friendAdded',handlFriendAdded);
        socket.on('friendRemoved',handlFriendRemoved);

        return () => {
            socket.off('friendRequestSent', handleFriendRequestSent);
        };
    }, [socket]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className='navbar'>
                <Navbar />
            </div>
            <div className='profilePage'>
                <div className="profile-header">
                    <img src={user.profile_image} alt="Profile" className="profile-image" />
                    <h2>{user.username}</h2>
                    <div className="profile-stats">
                        <div><span>Friends</span><span>{user.friends_list.length}</span></div>
                        {visitor !== username && !friends && (
                            <div><button onClick={addFriend}>{!requested ? 'Add friend' : 'Requested'}</button></div>
                        )}
                        {visitor !== username && friends && (
                            <div><button onClick={removeFriend}>Remove</button></div>
                        )}
                        <div><span>Posts</span><span>{posts.length}</span></div>
                    </div>
                </div>
                {(profile === 'public' || friends || username === visitor) && (
                    <div className="profile-posts">
                        {posts.map(post => (
                            <div key={post._id} className="post-thumbnail">
                                <Post
                                    postId={post._id}
                                    username={post.user}
                                    profileImg={user.profile_image}
                                    content={post.content}
                                    media={post.media}
                                    likes={post.likes}
                                    comments={post.comments}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {profile === 'private' && !friends && username !== visitor && (
                    <div>
                        <h3>This account is private</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
