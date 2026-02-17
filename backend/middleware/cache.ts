import { Request, Response, NextFunction } from "express";
import { redisClient } from "../db/redis";

export const cacheMiddleware = (prefix: string, duration: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?._id;
        if (req.method !== "GET" || !redisClient.isOpen) {
            return next();
        }
        if (!userId) {
            return next();
        }
        const qs = req.query?.selection;
        // "all" or userId
        const selectionKey = (qs === "all" ? qs : "") || userId.toString();
        const key = `${prefix}:${selectionKey}:${req.originalUrl}`;

        try {
            const cachedResponse = await redisClient.get(key);
            if (cachedResponse) {
                console.log("Cached response got for key: ", key);
                return res.json(JSON.parse(cachedResponse));
            } else {
                const originalJson = res.json;
                res.json = (body:unknown): Response => {
                    redisClient.setEx(key, duration, JSON.stringify(body)).catch(err => console.error("Redis set error:", err));
                    return originalJson.call(res, body);
                };
                next();
            }
        } catch (error) {
            console.error("Redis cache error:", error);
            next();
        }
    };
};