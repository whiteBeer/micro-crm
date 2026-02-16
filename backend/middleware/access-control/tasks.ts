import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import {NotFoundError, ForbiddenError} from "../../errors";
import Task from "../../models/Task";

export const listTasksAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const selection:string = ((req.query.selection as string) || "");
    const user = req.user;
    if (selection === "all" && user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};

export const oneTaskAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id: taskId } } = req;
    const user = req.user;

    const task = await Task.findOne({
        _id: taskId
    });

    if (!task) {
        throw new NotFoundError("client_not_found");
    } else if (!task.assigneeId.equals(user?._id) && user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};

export const deleteTaskAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};
