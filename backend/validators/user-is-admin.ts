import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

const validateUserIsAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req?.user?.role !== "admin") {
        throw new BadRequestError("Access denied");
    }
    next();
};

export default validateUserIsAdmin;
