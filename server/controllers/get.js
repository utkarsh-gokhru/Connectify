import { userModel } from '../models/user.js';
import { postsModel } from '../models/posts.js';

export const profile = async (req, res) => {

    try {
        const { username } = req.body;

        const user = await userModel.findOne({ username });
        const img = user.profile_image;

        res.status(200).json({ message: 'User found', img });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const posts = async (req, res) => {
    try {
        const posts = await postsModel.find().sort({ time: -1 });

        // Fetch user details for each post
        const postsWithUserDetails = await Promise.all(posts.map(async (post) => {
            const user = await userModel.findOne({ username: post.user }).exec();
            return {
                ...post.toObject(),
                userdata: {
                    profile_image: user.profile_image
                }
            };
        }));

        res.status(200).json(postsWithUserDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const user = async (req, res) => {
    try {
        const username = req.query.username;

        const userData = await userModel.findOne({ username });

        res.status(200).json(userData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const userPosts = async (req, res) => {
    try {
        const user = req.query.username;

        const userPosts = await postsModel.find({ user });

        return res.status(200).json(userPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
