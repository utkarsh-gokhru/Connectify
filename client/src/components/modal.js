import React, { useState } from 'react';
import '../css/post.css';

const PostModal = ({ handleClose, username, profileImg, content, media, likes, comments }) => {

    const [likeClicked, setLikeClicked] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const maxLength = 20;

    const handleLikeClick = () => {
        setLikeClicked(!likeClicked);
    };

    const handleReadMoreClick = () => {
        setShowFullCaption(!showFullCaption);
    };

    const truncateCaption = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className='post-card'>
                <div className='post_user'>
                    <div className='post-header'>
                        <div id='userName' ><h3>{username}</h3></div>
                        <div id='prImg' ><img src={'http://localhost:5000/images/' + profileImg} alt='Profile' className='icon' /></div>
                    </div>
                </div>
                <div className='caption'>
                    <div className='post-image' onDoubleClick={() => setLikeClicked(!likeClicked)} >
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
                        <span><p>{likes}</p></span>
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
                <button className="modal-close" onClick={handleClose}>X</button>
            </div>
        </div>
    );
}

export default PostModal;
