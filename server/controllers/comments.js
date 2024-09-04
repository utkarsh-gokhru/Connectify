import mongoose from "mongoose";
import { postsModel } from "../models/posts.js";

const addComments = async (data) => {
    try {
        const post = await postsModel.findOne({ 'postId': data.postId });
        if (!post) throw new Error('Post not found');

        const comment = {
            'commentor': data.viewerName,
            'comment': data.comment
        }

        post.comments.push(comment)

        await post.save();

        return post.comments; // Return the updated like count
    } catch (err) {
        throw new Error(`Error updating like count: ${err.message}`);
    }
};

export default addComments;