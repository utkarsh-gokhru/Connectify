import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique: true},
    password: {type:String, required:true},
    bio: {type:String},
    profile_image: {type:String, default:'C:\Users\Admin\Social_Media\server\public\default-avatar-profile-icon-of-social-media-user-vector.jpg'},
    profile_type: {type:String, default:'Public'},
    friends_list: [{type:String}],
    posts: [{type:mongoose.Schema.Types.ObjectId, ref: 'Connectify_Posts'}]
});

export const userModel = mongoose.model('Connectify_Users',userSchema);
