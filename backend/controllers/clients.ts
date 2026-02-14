import { Request, Response } from "express";
import Client from "../models/Client";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

export const getClients = async (req: Request, res: Response) => {
    const managerId = req.user?._id;

    if (!managerId) {
        throw new BadRequestError("User is not authenticated");
    }

    const clients = await Client.find({ managerId: managerId });

    res.status(StatusCodes.OK).json(clients);
};

export const getClient = async (req: Request, res: Response) => {
    const {
        id: clientId
    } = req.params;

    const client = await Client.findOne({ _id: clientId });

    res.status(StatusCodes.OK).json({ client });
};

export const createClient = async (req: Request, res: Response) => {
    const newClient = {
        ...req.body,
        managerId: req.user?._id
    };
    const client = await Client.create(newClient);
    res.status(StatusCodes.OK).json({ client });
};

export const updateClient = async (req: Request, res: Response) => {
    const {
        params: { id: clientId }
    } = req;
    const userId = req.user?._id;

    const updatedClient = await Client.findOneAndUpdate(
        { _id: clientId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedClient) {
        throw new NotFoundError(`No client with id ${clientId}`);
    }
    res.status(StatusCodes.OK).json({ updatedClient });
};

export const deleteClient = async (req: Request, res: Response) => {
    const {
        params: { id: clientId }
    } = req;

    const job = await Client.findOneAndDelete({
        _id: clientId
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${clientId}`);
    }
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
};