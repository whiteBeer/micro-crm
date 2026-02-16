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
        msg: "unknown_error",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };

    if (err instanceof BaseError) {
        customError = {
            statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            msg: err.message
        };
    } else if (err instanceof mongoose.Error.ValidationError) {
        if (err.name === "ValidationError") {
            try {
                const error = Object.values(err.errors)[0];
                if (error.name === "CastError") {
                    customError.msg = "cast_error_" + error.path;
                } else {
                    customError.msg = error.message;
                }
            } catch (e) {
                customError.msg = "unknown_error";
            }
        } else {
            customError.msg = "validation_error";
        }
        customError.statusCode = 400;
    } else if (err instanceof mongoose.Error.CastError) {
        customError.msg = "cast_error";
        customError.statusCode = 400;
    }

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
