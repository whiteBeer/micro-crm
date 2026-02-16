import { IJwtPayload } from "../types/global";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../errors";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtPayload;
    const user = await User.findById(payload.userId).select("-password");
    if (user && user._id) {
        req.user = user;
        next();
    } else {
        throw new UnauthenticatedError("user_not_found");
    }
};

export default auth;
