import { Server } from "socket.io";
import { chatSocket } from "../socket/chatEvents";

const onlineUsers: any = {};
const socketIds: any = {};


export const initializeSocket = async (httpServer: any) => {
    const io = new Server(httpServer, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        chatSocket(io, socket);

        const { userId } = socket.handshake.auth;
        console.log("User connected:", userId);
        socketIds[userId] = socket.id;

        socket.on("disconnect", async () => {
            try {
                console.log("User disconnected:", userId);
            } catch (error: any) {
                console.log("Error updating last seen:", error.message);
            }
        });
    });
};
