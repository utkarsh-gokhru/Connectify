import { Server } from 'socket.io';
import updateLikes from './controllers/update.js';
import addComments from './controllers/comments.js';
import addFriend from './controllers/friendRequest.js';

const setupSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: "*", // Allow all HTTP methods
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('likesUpdate', async (data) => {
            console.log('Message received:', data);
            try {
                // Update the like count in the database
                const updatedLikes = await updateLikes(data);

                // Emit the updated like count to all connected clients
                io.emit('updateLikeCount', { postId: data.postId, updatedLikes });
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

        //   io.emit()
        //     }socket.on('addFriend', async(data)=>{
        //     console.log(data);
        //     try{
        //         const addFriend = await addFriend(data);

              
        // })

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default setupSocketIO;
