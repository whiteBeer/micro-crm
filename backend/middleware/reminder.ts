import { Request, Response, NextFunction } from "express";
import { redisClient } from "../db/redis";
import { TASK_DUE_DATE_REMINDER_KEY } from "../worker/reminder";

const reminderMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", async () => {
        const task = res.locals.task;
        const deletedTaskId = res.locals.deletedTaskId;

        if (!redisClient.isOpen) return;

        try {
            if (deletedTaskId) {
                await redisClient.zRem(TASK_DUE_DATE_REMINDER_KEY, deletedTaskId);
            } else if (task) {
                if (task.dueDate && task.status !== "completed") {
                    const score = new Date(task.dueDate).getTime();
                    await redisClient.zAdd(TASK_DUE_DATE_REMINDER_KEY, { score, value: task._id.toString() });
                    console.log("Redis added to zset:", { score, value: task._id.toString() });
                } else {
                    await redisClient.zRem(TASK_DUE_DATE_REMINDER_KEY, task._id.toString());
                }
            }
        } catch (e) {
            console.error("Reminder middleware error", e);
        }
    });
    next();
};

export default reminderMiddleware;