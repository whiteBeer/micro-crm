import { Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

const getUser = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user =
        await User.findOne({ _id: userId })
            .select("-password");

    if (!user) {
        throw new NotFoundError("user_not_found");
    }

    res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
        throw new NotFoundError("user_not_found");
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: userId},
        req.body,
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({
        updatedUser: updatedUser
    });
};

export {
    getUser,
    updateUser
};
