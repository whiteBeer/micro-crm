import { Request, Response } from "express";
import {invalidateCacheByPrefix, redisClient} from "../db/redis";
import Client from "../models/Client";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import {safeSearchRegExp} from "../util/regexp";

const invalidateCaches = async (userId: string) => {
    console.log("____");
    await invalidateCacheByPrefix("clients:" + userId);
    await invalidateCacheByPrefix("clients:all");
    await invalidateCacheByPrefix("dashboard:" + userId);
    await invalidateCacheByPrefix("dashboard:all");
};

export const getClients = async (req: Request, res: Response) => {
    const managerId = req.user?._id;
    const search:string = ((req.query.search as string) || "").replace(safeSearchRegExp, "");
    const selection:string = ((req.query.selection as string) || "");

    if (!managerId) {
        throw new BadRequestError("User is not authenticated");
    }

    //TODO: in real need to use $text search for better performance
    const filter = search ? {
        $or: [
            { name: {$regex: search, $options: "i"} }
        ]
    } : {};
    const selectionFilter =  selection === "all" ? {} : {managerId};

    let result = Client.find({
        ...filter,
        ...selectionFilter
    });
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 10;

    result = result.sort("-createdAt").skip(skip).limit(limit);
    const total = await Client.countDocuments({
        ...filter,
        ...selectionFilter
    });
    const clients = await result;

    res.status(StatusCodes.OK).json({
        total,
        clients
    });
};

export const getClient = async (req: Request, res: Response) => {
    const {
        id: clientId
    } = req.params;

    const client = await Client.findOne({ _id: clientId });

    res.status(StatusCodes.OK).json({ client });
};

export const createClient = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const newClient = {
        ...req.body,
        managerId: userId
    };
    const client = await Client.create(newClient);

    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.CREATED).json({ client });
};

export const updateClient = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const {
        params: { id: clientId }
    } = req;

    const updatedClient = await Client.findOneAndUpdate(
        { _id: clientId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedClient) {
        throw new NotFoundError(`No client with id ${clientId}`);
    }

    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.OK).json({ updatedClient });
};

export const deleteClient = async (req: Request, res: Response) => {
    const {
        params: { id: clientId }
    } = req;

    const client = await Client.findOneAndDelete({
        _id: clientId
    });

    if (!client) {
        throw new NotFoundError(`No client with id ${clientId}`);
    }

    if (req.user?._id) {
        invalidateCaches(req.user?._id.toString());
    }

    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
};