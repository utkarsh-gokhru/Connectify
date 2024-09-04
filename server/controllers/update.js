import mongoose from "mongoose";
import { postsModel } from "../models/posts.js";

const updateLikes = async (data) => {
    try {
        const post = await postsModel.findOne({ 'postId': data.postId });
        if (!post) throw new Error('Post not found');

        if (!post.likes.includes(data.viewerName)) {
            post.likes.push(data.viewerName); // Add the user's name to the likes array
        }
        else {
            post.likes.pull(data.viewerName);
        }

        await post.save();

        return post.likes; // Return the updated like count
    } catch (err) {
        throw new Error(`Error updating like count: ${err.message}`);
    }
};

export default updateLikes;
