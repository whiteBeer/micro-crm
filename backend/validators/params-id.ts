import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

const validateParamsId = async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new BadRequestError("Invalid id parameter");
    }
    next();
};

export default validateParamsId;
