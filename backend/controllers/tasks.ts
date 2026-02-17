import { Request, Response } from "express";
import Task from "../models/Task";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import {safeSearchRegExp} from "../util/regexp";
import {invalidateCacheByPrefix} from "../db/redis";

const invalidateCaches = async (userId: string) => {
    console.log("____");
    await invalidateCacheByPrefix("dashboard:" + userId);
    await invalidateCacheByPrefix("dashboard:all");
};

export const getTasks = async (req: Request, res: Response) => {
    const assigneeId = req.user?._id;
    const search: string = ((req.query.search as string) || "").replace(safeSearchRegExp, "");
    const selection: string = ((req.query.selection as string) || "");

    if (!assigneeId) {
        throw new BadRequestError("User is not authenticated");
    }

    //TODO: in real need to use $text search for better performance
    const filter = search ? {
        $or: [
            { title: { $regex: search, $options: "i" } }
        ]
    } : {};
    const selectionFilter =  selection === "all" ? {} : {
        assigneeId: new mongoose.Types.ObjectId(assigneeId)
    };

    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;

    const tasks = await Task.aggregate([
        {
            $match: {
                ...filter,
                ...selectionFilter
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "clients",
                localField: "clientId",
                foreignField: "_id",
                as: "client"
            }
        },
        {
            $unwind: {
                path: "$client",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                status: 1,
                priority: 1,
                dueDate: {
                    $dateToString: { format: "%Y-%m-%d", date: "$dueDate" }
                },
                assigneeId: 1,
                createdAt: 1,
                updatedAt: 1,
                client: {
                    _id: "$client._id",
                    name: "$client.name"
                }
            }
        }
    ]);

    const total = await Task.countDocuments({
        ...filter,
        ...selectionFilter
    });

    res.status(StatusCodes.OK).json({
        total,
        tasks
    });
};

export const getTask = async (req: Request, res: Response) => {
    const {
        id: taskId
    } = req.params;

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
        throw new NotFoundError(`No task with id ${taskId}`);
    }

    res.status(StatusCodes.OK).json({ task });
};

export const createTask = async (req: Request, res: Response) => {
    const assigneeId = req.user?._id;
    const newTask = {
        ...req.body,
        assigneeId: assigneeId
    };
    const task = await Task.create(newTask);

    res.locals.task = task;
    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.CREATED).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
    const {
        params: { id: taskId }
    } = req;

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedTask) {
        throw new NotFoundError(`No task with id ${taskId}`);
    }

    res.locals.task = updatedTask;
    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.OK).json({ updatedTask });
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const {
        params: { id: taskId },
        body: { status }
    } = req;

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { status },
        { new: true, runValidators: true }
    );

    if (!updatedTask) {
        throw new NotFoundError(`No task with id ${taskId}`);
    }

    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.OK).json({ updatedTask });
};

export const deleteTask = async (req: Request, res: Response) => {
    const {
        params: { id: taskId }
    } = req;

    const task = await Task.findOneAndDelete({ _id: taskId });

    if (!task) {
        throw new NotFoundError(`No task with id ${taskId}`);
    }

    res.locals.deletedTaskId = taskId;
    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
};