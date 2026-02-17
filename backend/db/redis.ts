import { createClient } from "redis";

const url = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 3) return new Error("Too many retries on REDIS");
            return 500;
        }
    }
});

redisClient.on("error", (err) => console.log("Redis Client Error", err.message));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
            console.log("Redis connected to: ", url);
        } catch (err) {
            console.log("Failed to connect to Redis. Ensure Redis is running. App will continue without caching.");
            await redisClient.destroy();
        }
    }
};

const invalidateCacheByPrefix = async (prefix: string) => {
    if (!redisClient.isOpen) {
        return;
    }
    try {
        const keysForDelete: string[] = [];
        for await (const key of redisClient.scanIterator({
            MATCH: `${prefix}:*`,
            COUNT: 1000
        })) {
            if (key.length) {
                keysForDelete.push(key.toString());
            }
        }
        if (keysForDelete.length > 0) {
            await redisClient.unlink(keysForDelete);
        }
        console.log(`Cache invalidated for prefix: ${prefix}, keys found: ${keysForDelete.length}`);
    } catch (err) {
        console.error(`Error invalidating cache for prefix ${prefix}:`, err);
    }
};


export { redisClient, connectRedis, invalidateCacheByPrefix };