import cron from "node-cron";
import { redisClient } from "../db/redis";
import Task from "../models/Task";

export const TASK_DUE_DATE_REMINDER_KEY = "scheduler:reminders";

export const startReminderWorker = () => {
    cron.schedule("*/5 * * * *", async () => {
        if (!redisClient.isOpen) return;
        try {
            const now = Date.now();
            const oneDayLater = now + (24 * 60 * 60 * 1000);
            const taskIds = await redisClient.zRangeByScore(TASK_DUE_DATE_REMINDER_KEY, now, oneDayLater);

            if (taskIds.length > 0) {
                //TODO: maybe better to save full notification in redis?
                const tasks = await Task.find({ _id: { $in: taskIds } });

                tasks.forEach(task => {
                    console.log(`📢 Напоминание: задача «${task.title}» до ${task.dueDate}`);
                });

                //TODO: remove key after notification? (redisClient.zRem)
            }
        } catch (error) {
            console.error("Reminder worker error:", error);
        }
    });
};