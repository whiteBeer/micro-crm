import mongoose from "mongoose";
import connectDB from "../db/mongo";
import {connectRedis, redisClient} from "../db/redis";

// important if run tests without Docker
import dotenv from "dotenv";
dotenv.config();

describe("MongoDB Connection", () => {
    beforeEach(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        if (redisClient.isOpen) {
            redisClient.destroy();
        }
    });

    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        if (redisClient.isOpen) {
            redisClient.destroy();
        }
    });

    it("1. MongoDB: should connect to the database successfully", async () => {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await connectDB(mongoURI);
        expect(mongoose.connection.readyState).toBe(1);
    });

    it("2. Redis: should connect to the Redis server successfully", async () => {
        await connectRedis();
        expect(redisClient.isOpen).toBe(true);
    });
});