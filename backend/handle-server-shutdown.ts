import {Server} from "http";
import mongoose from "mongoose";

export const handleShutdown = (server: Server) => {
    let isShuttingDown = false;
    async function shutdown() {
        if (isShuttingDown) {
            return;
        }
        isShuttingDown = true;
        console.log("Shutting down gracefully...");
        server.close();
        try {
            console.log("Disconnecting mongoose");
            await mongoose.disconnect();
            console.log("Mongoose disconnected");
        } catch (err) {
            console.error("Error disconnecting Mongoose:", err);
        }
        process.exit(0);
    }

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    process.on("uncaughtException", (err) => {
        console.error("Uncaught exception:", err);
        shutdown();
    });
    process.on("unhandledRejection", (reason) => {
        console.error("Unhandled rejection:", reason);
        shutdown();
    });
};