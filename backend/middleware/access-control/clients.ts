import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import {NotFoundError, ForbiddenError} from "../../errors";
import Client from "../../models/Client";

export const listClientsAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const selection:string = ((req.query.selection as string) || "");
    const user = req.user;
    if (selection === "all" && user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};

export const oneClientAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id: clientId } } = req;
    const user = req.user;

    const client = await Client.findOne({
        _id: clientId
    });

    if (!client) {
        throw new NotFoundError("client_not_found");
    } else if (!client.managerId.equals(user?._id) && user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};

export const deleteClientAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};
