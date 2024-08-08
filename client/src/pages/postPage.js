import React, { useState, useEffect } from 'react';
import Post from '../components/post';
import axios from 'axios';
import Navbar from '../components/navbar';
import '../css/postPage.css';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
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
                        postId={post._id}
                        username={post.user}
                        profileImg={post.userdata.profile_image}
                        content={post.content}
                        media={post.media}
                        likes={post.likes.length}
                        comments={post.comments.length}
                    />
                ))
            )}
            </div>
        </div>
    );
}

export default PostsPage;
