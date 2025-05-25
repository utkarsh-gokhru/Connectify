import React, { useState, useEffect } from 'react';
import Post from '../components/post';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../css/postPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends, setNotifications } from '../state/actions/action';

const PostsPage = ({ socket }) => {
    const [posts, setPosts] = useState([]);
    // const [notifications, setNotifications] = useState([]);
    const [userProfImg, setUserProfImg] = useState('');
    const [requests, setRequests] = useState([]);
    const username = sessionStorage.getItem('username');
    const dispatch = useDispatch();

    const notifications = useSelector(state => state.user.notifications);

    // Register the socket with the username once
    useEffect(() => {
        if (socket) {
            socket.emit('registerCustomId', { username });
        }
    }, [socket, username]);

    // Fetch posts once on mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // Handle socket events for like counts and comments
    useEffect(() => {
        if (!socket) return;

        const handleUpdateLikeCount = ({ postId, updatedLikes }) => {
            console.log('Update Like Count:', postId, updatedLikes);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postId === postId ? { ...post, likes: updatedLikes.likes } : post
                )
            );
            if (updatedLikes.notifications) {
                dispatch(setNotifications(updatedLikes.notifications));
            }
        };

        const handleUpdateComments = ({ postId, addComment }) => {
            console.log('Update Comments:', postId, addComment);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postId === postId ? { ...post, comments: addComment } : post
                )
            );
        };

        const handleFriendRequest = ({ friend }) => {
            console.log('Friend Request:', friend);
            alert(`${friend} sent you a friend request`);
        }

        socket.on('updateLikeCount', handleUpdateLikeCount);
        socket.on('updateComments', handleUpdateComments);
        socket.on('friendRequest', handleFriendRequest);

        // Clean up socket listeners on unmount
        return () => {
            socket.off('updateLikeCount', handleUpdateLikeCount);
            socket.off('updateComments', handleUpdateComments);
            socket.off('friendRequest', handleFriendRequest);
        };
    }, [socket]);

    // Fetch user data (including notifications) once on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, reqRes] = await Promise.all([
                    axios.get(`http://localhost:5000/get/user?username=${username}`),
                    // axios.get(`http://localhost:5000/get/requests?username=${username}`)
                ]);
                const userData = userResponse.data;
                setUserProfImg(userData.profile_image)
                // const reqData = reqRes.data;
                if (userData && userData.notifications) {
                    dispatch(setNotifications(userData.notifications));
                }
                if (userData && userData.requests) {
                    console.log(userData.requests);
                    setRequests(userData.requests);
                }
                if (userData && userData.friends_list) {
                    dispatch(setFriends(userData.friends_list));
                }
            } catch (err) {
                console.log('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, [username]);

    return (
        <div className='posts-page'>
            <div className='nav'>
                <Navbar notifications={notifications} requests={requests} userProfImg={userProfImg} />
            </div>
            <div className='posts'>
                {posts.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    posts.map(post => (
                        <Post
                            key={post.postId} // Ensure unique key for each post
                            postId={post.postId}
                            username={post.user}
                            profileImg={post.userdata.profile_image}
                            content={post.content}
                            media={post.media}
                            likes={post.likes}
                            comments={post.comments}
                            socket={socket}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PostsPage;
