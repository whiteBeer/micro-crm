import { Request, Response } from "express";
import Client from "../models/Client";
import Task from "../models/Task";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";

export const getStats = async (req: Request, res: Response) => {
    const selection = req.query.selection as string || "my";
    const userId = req.user?._id;

    const clientFilter = selection === "my" ? {
        managerId: userId
    } : {};
    const taskFilter =  selection === "my" ? {
        assigneeId: new mongoose.Types.ObjectId(userId)
    } : {};

    const clientsCount = await Client.countDocuments(clientFilter);

    const taskStats = await Task.aggregate([
        { $match: taskFilter },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const getCount = (status: string) => {
        const stat = taskStats.find(item => item._id === status);
        return stat ? stat.count : 0;
    };

    res.status(StatusCodes.OK).json({
        clientsCount,
        tasksCountPending: getCount("pending"),
        tasksCountInProgress: getCount("in_progress"),
        tasksCountCompleted: getCount("completed")
    });
};

export const getRecentActivities = async (req: Request, res: Response) => {
    const selection = req.query.selection as string || "my";
    const userId = req.user?._id;

    if (!userId) {
        throw new BadRequestError("User is not authenticated");
    }

    const clientFilter = selection === "my" ? { managerId: userId } : {};
    const taskFilter = selection === "my" ? {
        assigneeId: userId
    } : {};

    const lastUpdatedClients = await Client.find(clientFilter)
        .sort({ updatedAt: -1 })
        .limit(3);

    const lastUpdatedTasks = await Task.find(taskFilter)
        .sort({ updatedAt: -1 })
        .limit(3);

    res.status(StatusCodes.OK).json({
        lastUpdatedClients,
        lastUpdatedTasks
    });
};