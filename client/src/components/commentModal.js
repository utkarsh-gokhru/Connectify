// ImageCommentModal.js
import React, { useState } from 'react';
import '../css/CModel.css'; // Import your CSS for the modal
import EmojiPicker from 'emoji-picker-react'

const CommentModal = ({ media, comments, comment, onCommentChange, onAddComment, onClose }) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const handleContentClick = (e) => {
        // Stop clicks inside the content from closing the modal
        e.stopPropagation();
    };

    const handleEmojiClick = (emoji) => {
        // Append the emoji to the current comment text
        onCommentChange(comment + emoji.emoji);
    };

    return (
        <div className='image-comment-overlay' onClick={onClose}>
            <div className='image-section' onClick={handleContentClick}>
                <img src={'http://localhost:5000/images/' + media} alt='Post' />
            </div>
            <div className='comment-section' onClick={handleContentClick}>
                <div className='allComments'>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment._id} className='CScomment'>
                                <p><strong>{comment.commentor}</strong></p>
                                <p id='comment'>{comment.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet</p>
                    )}
                </div>
                <div className='addComment'>
                    <div className='inputs'>
                        <input
                            type='text'
                            required
                            onChange={(e) => onCommentChange(e.target.value)}
                            value={comment}
                        />
                        <button
                            className='emoji-btn'
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            😀
                        </button>
                    </div>
                    <button onClick={onAddComment} disabled={!comment} className='addC'>Add Comment</button>
                    {showEmojiPicker && (
                        <div className='emoji-picker'>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
            </div>
            <button className='close-overlay' onClick={onClose}>X</button>
        </div>
    );
}

export default CommentModal;
