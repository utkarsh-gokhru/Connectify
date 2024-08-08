import express from 'express';
import multer from 'multer';
import { userModel } from '../models/user.js';
import storage from '../utils/file_upload.js';
import { postsModel } from '../models/posts.js';

const app = express();
const upload = multer({ storage: storage });

app.post('/profile', upload.single('image'), async (req, res) => {
    try {
        const { existUsername, username, bio, profileType } = req.body;
        let image;

        if (req.file) {
            image = req.file.filename;
        }
        else {
            image = '/images\default_prof.jpg'
        }

        const update = {
            username: username,
            bio: bio,
            profile_image: image,
            profile_type: profileType
        }

        const user = await userModel.findOneAndUpdate(
            { username: existUsername },
            { $set: update },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with success message and updated user object
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' }); // Provide a generic error message
    }
});

app.post('/post', upload.single('image'), async (req, res) => {
    try {
        const { user, caption } = req.body;
        let image;

        if (req.file) {
            image = req.file.filename;
        }

        const postId = user + Date.now();
        const post = new postsModel({ postId, user, content: caption, media: image });
        await post.save();

        await userModel.findOneAndUpdate(
            { username: user },
            { $push: { posts: post._id } },
            { new: true }
        );

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export { app as Saver };
