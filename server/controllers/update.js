import mongoose from "mongoose";
import { postsModel } from "../models/posts.js";
import { userModel } from "../models/user.js";

const updateLikes = async (data) => {
    try {
        const post = await postsModel.findOne({ 'postId': data.postId });
        const user = post.user;
        const userData = await userModel.findOne({ 'username': user });
        if (!post) throw new Error('Post not found');

        if (!post.likes.includes(data.viewerName)) {
            post.likes.push(data.viewerName); // Add the user's name to the likes array
            userData.notifications.push({
                postId: data.postId,
                message: `${data.viewerName} liked your post`,
            })
        }
        else {
            post.likes.pull(data.viewerName);
            userData.notifications = userData.notifications.filter(notification =>
                notification.postId !== data.postId || notification.message !== `${data.viewerName} liked your post`
            );
        }

        await post.save();
        await userData.save();

        return { likes: post.likes, user: user, notifications: userData.notifications }; // Return the updated like count
    } catch (err) {
        throw new Error(`Error updating like count: ${err.message}`);
    }
};

export const handleUpdateNotification = async (data) => {
    try {
        // Find the user by username
        const userData = await userModel.findOne({ username: data.receiver });

        // Check if userData is found
        if (!userData) {
            console.error('User not found');
            return;
        }

        // Find the notification to update
        const updateNotification = userData.notifications.find(notification => notification._id == data.notificationId);

        // Check if the notification exists
        if (!updateNotification) {
            console.error('Notification not found');
            return;
        }

        // Update the notification's read status
        updateNotification.read = true;

        // Save the updated user data back to the database
        await userData.save();
        return userData;
    } catch (error) {
        console.error('Error updating notification:', error);
    }
};

export default updateLikes;
