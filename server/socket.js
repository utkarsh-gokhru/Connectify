import { Server } from 'socket.io';
import updateLikes, { handleUpdateNotification } from './controllers/update.js';
import addComments from './controllers/comments.js';
import { addFriend, cancelRequest, handleRecReq, removeFriend } from './controllers/friendRequest.js';

const customIdMap = {};

const setupSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: "*", // Allow all HTTP methods
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('registerCustomId', (data) => {
            console.log(data);
            customIdMap[data.username] = socket.id;
            console.log(customIdMap);
        })

        socket.on('likesUpdate', async (data) => {
            console.log('Message received:', data);
            try {
                // Update the like count in the database
                const updatedLikes = await updateLikes(data);
                const likes = updatedLikes.likes;
                const notifications = updatedLikes.notifications;

                // Emit the updated like count to all connected clients
                if (customIdMap[updateLikes.user]) {
                    io.to(customIdMap[data.username]).emit('updateLikeCount', { postId: data.postId, updatedLikes: { likes } });
                }
                else {
                    io.emit('updateLikeCount', { postId: data.postId, updatedLikes: { likes, notifications } });
                }
            } catch (err) {
                console.error('Error updating like count:', err);
            }
        });

        socket.on('addComment', async (data) => {
            console.log(data);
            try {
                const addComment = await addComments(data);

                io.emit("updateComments", { postId: data.postId, addComment })
            } catch (err) {
                console.error('Error adding comment', err);
            }
        });

        socket.on('addFriend', async (data) => {
            console.log(data);
            try {
                const friendRequest = await addFriend(data);

                io.emit('friendRequestSent', { friendRequest });
                // console.log(friendRequest.receiver.notifications);
                if (customIdMap[data.username]) {
                    io.to(customIdMap[data.username]).emit('friendRequest', { friend: data.visitor });
                    io.to(customIdMap[data.username]).emit('updateNotes', { receiverData: friendRequest.receiver });

                    console.log('Notes updated');
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });

        socket.on('cancelRequest', async (data) => {
            console.log(data);
            try {
                const cancelReq = await cancelRequest(data);

                // io.emit('cancelledRequest', { cancelReq });
                if (customIdMap[data.username]) {
                    io.to(customIdMap[data.username]).emit('updateNotes', { receiverData: cancelReq.receiver });
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });

        socket.on('handleRecReq', async (data) => {
            console.log(data);
            try {
                const handleRecReqs = await handleRecReq(data);

                if (customIdMap[data.receiver]) {
                    io.to(customIdMap[data.receiver]).emit('updateNotes', { receiverData: handleRecReqs.receiverUser });
                }
                if (customIdMap[data.sender]) {
                    io.to(customIdMap[data.sender]).emit('updateNotes', { receiverData: handleRecReqs.senderUser });
                }
                io.emit('friendAdded', { receiverData: handleRecReqs.senderUser });
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('removeFriend', async (data) => {
            console.log(data);
            try {
                const handleRemoveFriend = await removeFriend(data);
                if (customIdMap[data.receiver]) {
                    io.to(customIdMap[data.receiver]).emit('updateNotes', { receiverData: handleRemoveFriend.receiverUser });
                }
                if (customIdMap[data.sender]) {
                    io.to(customIdMap[data.sender]).emit('updateNotes', { receiverData: handleRemoveFriend.senderUser });
                }
                io.emit('friendRemoved', { receiverData: handleRemoveFriend.senderData });
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('handleNotificationClick', async (data) => {
            console.log(data);
            try {
                const notificationUpdate = await handleUpdateNotification(data);
                io.to(customIdMap[data.receiver]).emit('updateNotes', { receiverData: notificationUpdate });
            } catch (err) {
                console.error('Error:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            // Remove the disconnected client's ID from the customIdMap
            for (const [username, id] of Object.entries(customIdMap)) {
                if (id === socket.id) {
                    delete customIdMap[username];
                    console.log(`Removed ${username} from customIdMap`);
                    break;
                }
            }
            console.log(customIdMap);
        });
    });
};

export default setupSocketIO;
