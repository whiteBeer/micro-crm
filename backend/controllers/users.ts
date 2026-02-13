import { Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

const getUser = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new BadRequestError("User is not authenticated");
    }

    const user =
        await User.findOne({ _id: userId })
            .select("-password");

    if (!user) {
        throw new NotFoundError(`No user with id ${userId}`);
    }

    res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req: Request, res: Response) => {
    const {
        id: userId
    } = req.params;

    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
        throw new NotFoundError(`No user with id ${userId}`);
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: userId},
        existingUser,
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({
        isStatusUpdated: updatedUser && updatedUser.status !== existingUser.status
    });
};

export {
    getUser,
    updateUser
};
