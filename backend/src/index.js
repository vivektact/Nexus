import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import db from "./lib/db.js";

db(); // Assuming you are using this to connect to the database.

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.BASE_URL, // Assumes BASE_URL is set in your .env file
        methods: ["GET", "POST"],
    },
});

const onlineUsers = {};

// WebSocket logic for handling users
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsers[userId] = socket.id;
        console.log(`User ${userId} is online.`);
    }

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const [key, value] of Object.entries(onlineUsers)) {
            if (value === socket.id) {
                delete onlineUsers[key];
                break;
            }
        }
    });
});

export const getRecipientSocketId = (recipientId) => {
    return onlineUsers[recipientId];
};

export { io };

server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
    console.log(process.env.BASE_URL);
});
