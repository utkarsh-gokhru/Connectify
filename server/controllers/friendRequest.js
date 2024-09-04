import { userModel } from "../models/user.js";

const addFriend = async (data) => {
    try {
        const receiverUsername = data.username;
        const senderUsername = data.viewerName;

        // Fetch the receiver and sender user documents
        const receiver = await userModel.findOne({ username: receiverUsername });
        const sender = await userModel.findOne({ username: senderUsername });

        if (!receiver || !sender) {
            throw new Error('Receiver or sender not found');
        }

        // Add a notification to the receiver
        receiver.notifications.push({
            type: 'Friend Request',
            message: `${senderUsername} sent you a friend request`,
            timestamp: Date.now(),
            read: false
        });

        // Add a received request to the receiver
        receiver.received_requests.push({
            from: senderUsername,
            status: 'Pending',
            timestamp: Date.now()
        });

        // Add a sent request to the sender
        sender.sent_requests.push({
            to: receiverUsername,
            status: 'Pending',
            timestamp: Date.now()
        });

        // Save the updated user documents
        await receiver.save();
        await sender.save();

    } catch (err) {
        console.log(err);
    }
}

export default addFriend;
