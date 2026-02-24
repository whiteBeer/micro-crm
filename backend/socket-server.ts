import {Express } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import { createServer } from "http";

const startSocketServer = (app:Express, httpServer:ReturnType<typeof createServer>) => {
    const socketServer = new SocketIOServer(httpServer, {
        cors: { origin: "*" }
    });
    socketServer.on("connection", (socket:Socket) => {
        console.log("Sockets: client connected");
        //TODO: in real system split to rooms by project and organization
        socket.join("globalRoom");
        socket.on("disconnect", () => {
            console.log("Sockets: client Disconnected ", socket.id);
        });
    });
    return socketServer;
};

export default startSocketServer;