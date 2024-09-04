import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/post';
import '../css/userProfile.css';
import Navbar from '../components/navbar';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState('private');
    const [friends, setFriends] = useState(false);
    const [requested, setRequested] = useState(false);
    const [socket, setSocket] = useState(null);
    const location = useLocation();
    const username = new URLSearchParams(location.search).get('username');

    const viewer = useSelector((state) => state.user);
    const viewerName = viewer.username;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/get/user?username=${username}`);
                setUser(userResponse.data);
                setProfile(userResponse.data.profile_type);
                setFriends(userResponse.data.friends_list.includes(viewerName));
                
                const postsResponse = await axios.get(`http://localhost:5000/get/user/posts?username=${username}`);
                setPosts(postsResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username, viewerName]);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const addFriend = () => {
        if (!requested) {
            setRequested(true);
            socket.emit('addFriend', { username, viewerName });
        } else {
            socket.emit('cancelRequest', { username, viewerName });
            setRequested(false);
        }
    };

    if (!user) {
        // Show loading state or a placeholder if user data is not yet available
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className='navbar'>
                <Navbar />
            </div>
            <div className='profilePage'>
                <div className="profile-header">
                    <img src={`http://localhost:5000/images/${user.profile_image}`} alt="Profile" className="profile-image" />
                    <h2>{user.username}</h2>
                    <div className="profile-stats">
                        <div><span>Friends</span><span>{user.friends_list.length}</span></div>
                        {viewerName !== username && !friends && (
                            <div><button onClick={addFriend}>{!requested ? 'Add friend' : 'Requested'}</button></div>
                        )}
                        <div><span>Posts</span><span>{posts.length}</span></div>
                    </div>
                </div>
                {profile === 'public' && (
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
                {profile === 'private' && (
                    <div>
                        <h3>This account is private</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
