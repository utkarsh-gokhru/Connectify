import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    postId: {type: String},
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const friendRequestSchema = mongoose.Schema({
  sender: { type: String, ref: 'Connectify_Users', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profile_image: { type: String, default: 'default_prof.jpg' },
    profile_type: { type: String, enum: ['public', 'private'], default: 'public' },
    friends_list: [{ type: String }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connectify_Posts' }],
    notifications: [notificationSchema],
    requests:[friendRequestSchema]
});

export const userModel = mongoose.model('Connectify_Users', userSchema);
