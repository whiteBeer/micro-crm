import { StatusCodes } from "http-status-codes";
import BaseError from "./base-error";

class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequestError;
