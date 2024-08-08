import React, { useState } from 'react';
import '../css/addPost.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddPost = () => {

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  console.log(user);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const formData = new FormData();

  formData.append('user',user.username);
  formData.append('image', image);
  formData.append('caption', caption);

  const handleSubmit = (e) => {
    if (image && caption) {
      e.preventDefault();
      setLoading(true);
      console.log(user);

      axios.post('http://localhost:5000/save/post', formData)
        .then(response => {
          console.log(response);
          setLoading(false);
          alert('Post saved!');
        })
        .catch(error => {
          console.log(error);
        })
    }
    else{
      alert('Please upload image and caption')
    }
  };

  return (
    <div className="image-upload-container">
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Enter caption"
            value={caption}
            onChange={handleCaptionChange}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>Save
        </button>
      </form>
    </div>
  );
};

export default AddPost;
