import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

const validateUserIsSelfOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req?.user?._id?.toString() !== req.params.id && req?.user?.role !== "admin") {
        throw new BadRequestError("Access denied");
    }
    next();
};

export default validateUserIsSelfOrAdmin;
