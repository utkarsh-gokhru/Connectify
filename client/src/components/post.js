import React, { useState } from 'react';
import '../css/post.css';
import { useNavigate } from 'react-router-dom';
import PostModal from './modal'; // Import the modal component
import { useSelector } from 'react-redux';

const Post = ({ postId, username, profileImg, content, media, likes, comments }) => {
    const [likeClicked, setLikeClicked] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [open, setOpen] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);
    const maxLength = 20;

    const navigate = useNavigate();
    const viewer = useSelector((state) => state.user);
    const viewerName = viewer.username;

    const userNav = () => {
        navigate(`/user-profile?username=${username}`);
    }

    const handleLikeClick = () => {
        if(likeClicked === false){
            setLikeClicked(true);
            setLikeCount(likeCount+1);
        }else{
            setLikeCount(likeCount-1);
            setLikeClicked(false);
        }
    };


    const handleReadMoreClick = () => {
        setShowFullCaption(!showFullCaption);
    };

    const truncateCaption = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleImageClick = () => {
        // Single click to open modal
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        } else {
            setClickTimeout(setTimeout(() => {
                handleOpen();
            }, 250)); // Delay to distinguish from double click
        }
    }

    const handleImageDoubleClick = () => {
        // Double click to like
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }
        handleLikeClick();
    }

    return (
        <div className='post'>
            <div className='post-card'>
                <div className='post_user'>
                    <div className='post-header'>
                        <div id='userName' onClick={userNav}><h3>{username}</h3></div>
                        <div id='prImg' onClick={userNav}><img src={'http://localhost:5000/images/' + profileImg} alt='Profile' className='icon' /></div>
                    </div>
                </div>
                <div className='caption'>
                    <div 
                        className='post-image' 
                        onClick={handleImageClick} 
                        onDoubleClick={handleImageDoubleClick}
                    >
                        {media && <img src={'http://localhost:5000/images/' + media} alt='Post' />}
                    </div>
                </div>
                <p>
                    {showFullCaption ? content : truncateCaption(content, maxLength)}
                    {content.length > maxLength && (
                        <span onClick={handleReadMoreClick} className='read-more'>
                            {showFullCaption ? ' Read Less' : ' Read More'}
                        </span>
                    )}
                </p>
                <div className="post-icons">
                    <div className='like'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            onClick={handleLikeClick}
                            className='like-icon'
                            style={{
                                cursor: 'pointer',
                                width: '30px',
                                height: '40px',
                                transition: 'transform 0.3s ease, fill 0.3s ease'
                            }}
                        >
                            <g>
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill={likeClicked ? 'red' : 'white'}
                                    stroke={likeClicked ? 'transparent' : 'black'}
                                    strokeWidth="1"
                                />
                            </g>
                        </svg>
                        <span><p>{likeCount}</p></span>
                    </div>
                    <div className='comment'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="100%"
                            viewBox="0 -960 960 960"
                            width="30px"
                            fill="#000000"
                            className='comment-icon'
                        >
                            <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                        </svg>
                        <span><p>{comments}</p></span>
                    </div>
                </div>
            </div>
            {open && (
                <PostModal
                    handleClose={handleClose}
                    username={username}
                    profileImg={profileImg}
                    content={content}
                    media={media}
                    likes={likeCount}
                    comments={comments}
                />
            )}
        </div>
    );
}

export default Post;
