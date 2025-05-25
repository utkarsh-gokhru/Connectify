import { userModel } from "../models/user.js";

const addFriend = async (data) => {
    try {
        const receiverUsername = data.username;
        const senderUsername = data.visitor;

        // Fetch receiver and sender user documents
        const receiver = await userModel.findOne({ username: receiverUsername });
        const sender = await userModel.findOne({ username: senderUsername });

        if (!receiver || !sender) {
            throw new Error("Receiver or sender not found");
        }

        // Add a friend request
        receiver.requests.push({ sender: senderUsername, status: "pending" });

        // Add a notification
        receiver.notifications.push({
            message: `${senderUsername} sent you a friend request`,
            timestamp: Date.now(),
            read: false
        });

        await receiver.save();
        return { receiverUsername, senderUsername, receiver };
    } catch (err) {
        console.log(err);
    }
};

const cancelRequest = async (data) => {
    try {
        const receiverUsername = data.username;
        const senderUsername = data.visitor;

        // Find receiver user document
        const receiver = await userModel.findOne({ username: receiverUsername });
        if (!receiver) throw new Error("Receiver not found");

        // Remove friend request
        receiver.requests = receiver.requests.filter(req => req.sender !== senderUsername || req.status !== 'pending');

        // Remove related notification
        receiver.notifications = receiver.notifications.filter(
            notification => notification.message !== `${senderUsername} sent you a friend request`
        );

        await receiver.save();
        return { receiverUsername, senderUsername, receiver };
    } catch (err) {
        console.log(err);
    }
};

const handleRecReq = async (data) => {
    try {
        const { sender, receiver, action } = data;

        // Fetch both users
        const receiverUser = await userModel.findOne({ username: receiver });
        const senderUser = await userModel.findOne({ username: sender });

        if (!receiverUser || !senderUser) {
            throw new Error("Sender or receiver not found");
        }

        // Find the friend request in receiver's requests
        const friendRequest = receiverUser.requests.find(req => req.sender === sender && req.status === 'pending');
        if (!friendRequest) {
            console.log(`No pending friend request found between ${sender} and ${receiver}`);
            return;
        }

        // Update request status
        friendRequest.status = action === 'accept' ? 'accepted' : 'rejected';

        if (action === 'accept') {
            // Update friends list for both users
            receiverUser.friends_list.push(sender);
            senderUser.friends_list.push(receiver);

            // Notify sender about request acceptance
            senderUser.notifications.push({
                message: `${receiver} accepted your friend request`,
                timestamp: Date.now(),
                read: false
            });

            await senderUser.save();
        }

        await receiverUser.save();
        console.log("Friend request processed successfully!");
        return { receiverUser, senderUser };
    } catch (error) {
        console.log("Error handling friend request:", error);
    }
};

const removeFriend = async (data) => {
    try {
        const receiverUsername = data.username;
        const senderUsername = data.visitor;

        const senderData = await userModel.findOneAndUpdate(
            { username: senderUsername },
            { $pull: { friends_list: receiverUsername } },
            { new: true }
        );

        const receiverData = await userModel.findOneAndUpdate(
            { username: receiverUsername },
            { $pull: { friends_list: senderUsername } },
            { new: true }
        );

        if (!senderData || !receiverData) {
            throw new Error("One of the users does not exist.");
        }

        console.log("Friend removed successfully!");

        return { senderData, receiverData };
    } catch (err) {
        console.log(err);
    }
};

export { addFriend, cancelRequest, handleRecReq, removeFriend };
