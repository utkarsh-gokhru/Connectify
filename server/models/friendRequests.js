import mongoose from 'mongoose';

const friendRequestSchema = mongoose.Schema({
  sender: { type: String, ref: 'Connectify_Users', required: true },
  receiver: { type: String, ref: 'Connectify_Users', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

export const friendRequestModel = mongoose.model('FriendRequests', friendRequestSchema);
