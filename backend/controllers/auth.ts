import { IUser, IErrorMongoose, IJwtPayload } from "../types/global";
import { Request, Response } from "express";
import User from "../models/User";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken";
import {redisClient} from "../db/redis";

const withoutPassword = (user:IUser) => {
    const {password, ...userWithoutPassword} = user.toObject();
    return userWithoutPassword;
};

const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError("provide_name_email_password");
    }
    const role = req.body.role || "manager";
    const avatar = req.body.avatar || "default_avatar.jpg";

    try {
        const user = await User.create({
            ...req.body,
            ...{role, avatar}
        });
        const token = await user.createJWT();
        res.status(StatusCodes.CREATED).json({ user: withoutPassword(user), token });
    } catch (err:unknown) {
        const knownError = err as IErrorMongoose;
        if (knownError.code === 11000) {
            throw new BadRequestError("email_already_exists");
        } else {
            throw err;
        }
    }
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("email_password_required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new BadRequestError("invalid_credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new BadRequestError("invalid_credentials");
    }

    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({ user: withoutPassword(user), token });
};

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            console.log(decoded);
            if (decoded && decoded.exp) {
                const ttl = decoded.exp - Math.floor(Date.now() / 1000);
                if (ttl > 0 && redisClient.isOpen) {
                    console.log("Redis cache set: ", `jwt-blacklist:${token}, ttl: ${ttl}`);
                    await redisClient.setEx(`jwt-blacklist:${token}`, ttl, "true");
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
    res.status(StatusCodes.OK).json({ msg: "user_logged_out" });
};

export {
    register,
    login,
    logout
};
