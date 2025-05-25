import { userModel } from '../models/user.js';
import { postsModel } from '../models/posts.js';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from 'uuid';
import path from 'path';

export const profile = async (req, res) => {
    try {
        const { existUsername, username, bio, profileType } = req.body;
        let imageUrl;

        if (req.file) {
            // Handle file upload
            const file = req.file.buffer;
            const fileName = v4() + path.extname(req.file.originalname);
            const storageRef = ref(storage, `profile_images/${fileName}`);
            
            // Upload file to Firebase
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
        } else {
            // Default image URL
            imageUrl = 'https://firebasestorage.googleapis.com/v0/b/connectify-7ec8b.appspot.com/o/profile_images%2Fdefault_prof.jpg?alt=media&token=aeb79218-d65e-4162-bce1-d46700fa4508';
        }

        const update = {
            username: username,
            bio: bio,
            profile_image: imageUrl, // Update with the new image URL
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

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' }); // Provide a generic error message
    }
};

export const post = async (req, res) => {
    try {
        const { user, caption } = req.body;
        console.log(req.body);
        let mediaUrl;

        // Handle file upload
        if (req.file) {
            const file = req.file.buffer;
            console.log(req.file);
            const fileName = v4() + path.extname(req.file.originalname);
            const storageRef = ref(storage, `posts/${fileName}`);
            
            // Upload file to Firebase
            await uploadBytes(storageRef, file);
            mediaUrl = await getDownloadURL(storageRef);
        }

        const postId = user + Date.now();
        const post = new postsModel({ postId, user, content: caption, media: mediaUrl });
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
};