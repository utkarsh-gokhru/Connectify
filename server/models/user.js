import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    profile_image: { type: String, default: 'default_prof.jpg' },
    profile_type: { type: String, enum: ['Public', 'Private'], default: 'Public' },
    friends_list: [{ type: String }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connectify_Posts' }],
    notifications: [notificationSchema],
    sent_requests: [{
        to: { type: String, required: true },
        status: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    received_requests: [{
        from: { type: String, required: true },
        status: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
});

export const userModel = mongoose.model('Connectify_Users', userSchema);
