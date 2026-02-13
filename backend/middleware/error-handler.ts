import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import BaseError from "../errors/base-error";
import mongoose from "mongoose";

const errorHandlerMiddleware = (
    err: BaseError | mongoose.Error | unknown,
    req: Request, res: Response, next: NextFunction
) => {
    console.log(err);

    let customError = {
        msg: "Unknown error",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };

    if (err instanceof BaseError) {
        customError = {
            statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            msg: err.message
        };
    } else if (err instanceof mongoose.Error.ValidationError) {
        if (err.name === 'ValidationError') {
            customError.msg = Object.values(err.errors)
                .map((item: any) => item.path + ": " + item.message)
                .join(',');
            customError.statusCode = 400
        }
    }

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
