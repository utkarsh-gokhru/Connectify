import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/post';
import '../css/userProfile.css';
import Navbar from '../components/navbar';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState('private');
    const location = useLocation();
    const username = new URLSearchParams(location.search).get('username');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5000/get/user?username=${username}`);
                setUser(userResponse.data);
                setProfile(userResponse.data.profile_type);
                const postsResponse = await axios.get(`http://localhost:5000/get/user/posts?username=${username}`);
                setPosts(postsResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [username]);

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
                    <img src={`http://localhost:5000/images/${user.profile_image}`} alt="Profile" className="profile-image" />
                    <h2>{user.username}</h2>
                    <div className="profile-stats">
                        <div><span>Friends</span><span>{user.friends_list.length}</span></div>
                        <div><span>Posts</span><span>{posts.length}</span></div>
                    </div>
                </div>
                {profile === 'private' && (
                    <div className="profile-posts">
                        {posts.map(post => (
                            <div key={post._id} className="post-thumbnail">
                                <Post
                                    postId={post._id}
                                    username={post.user}
                                    profileImg={user.profile_image}
                                    content={post.content}
                                    media={post.media}
                                    likes={post.likes.length}
                                    comments={post.comments.length}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
