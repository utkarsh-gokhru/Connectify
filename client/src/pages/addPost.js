import React, { useState } from 'react';
import '../css/addPost.css';
import axios from 'axios';

const AddPost = () => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const user = sessionStorage.getItem('username');

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (media && caption) {
      setLoading(true);

      const formData = new FormData();
      formData.append('user', user);
      formData.append('media', media);
      formData.append('caption', caption);

      axios.post('http://localhost:5000/save/post', formData)
        .then(response => {
          console.log(response);
          setLoading(false);
          alert('Post saved!');
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } else {
      alert('Please upload an image or video and add a caption.');
    }
  };

  return (
    <div className="media-upload-container">
      <h1>Upload Image or Video</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Enter caption"
            value={caption}
            onChange={handleCaptionChange}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
