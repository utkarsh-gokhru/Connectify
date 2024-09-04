import React, { useState, useEffect } from 'react';
import Post from '../components/post';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../css/postPage.css';
import { io } from 'socket.io-client';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [socket, setSocket] = useState(null);
    // const [error,setError] = useState(false);
    // const [loading,setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Use GET request to fetch posts
                const response = await axios.get('http://localhost:5000/get/posts');
                // console.log(response.data);

                // Assuming response data is in response.data
                setPosts(response.data);
                // setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching posts:', error);
                // setError('Failed to fetch posts.'); // Set error state
                // setLoading(false); // Set loading to false even if there's an error
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const newSocket = io('http://localhost:5000'); // Replace with your server URL
        setSocket(newSocket);

        // Clean up the socket connection when the component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        // Listen for 'updateLikeCount' events from the server
        socket.on('updateLikeCount', ({ postId, updatedLikes }) => {
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postId === postId ? { ...post, likes: updatedLikes } : post
                )
            );
        });

        // Clean up the listener when the component unmounts or socket changes
        return () => {
            socket.off('updateLikeCount');
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        // Listen for 'updateLikeCount' events from the server
        socket.on('updateComments', ({ postId, addComment }) => {
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.postId === postId ? { ...post, comments: addComment } : post
                )
            );
        });

        // Clean up the listener when the component unmounts or socket changes
        return () => {
            socket.off('updateLikeCount');
        };
    }, [socket]);

    return (
        <div className='posts-page'>
            <div className='nav'>
                <Navbar />
            </div>
            <div className='posts'>
                {posts.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    posts.map(post => (
                        <Post
                            key={post._id}
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
}

export default PostsPage;
