import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    commentor: { type: String, required: true },
    comment: { type: String, required: true }
});

const postSchema = mongoose.Schema({
    postId : {type: String},
    user: { type: String, required: true, ref: 'Connectify_Users' },
    content: { type: String, required: true },
    media: { type: String },
    likes: [{ type: String }],
    comments: [commentSchema],
    time: { type: Date, default: Date.now, required: true }
});

export const postsModel = mongoose.model('Connectify_Posts', postSchema);
