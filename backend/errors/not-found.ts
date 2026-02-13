import { StatusCodes } from "http-status-codes";
import BaseError from "./base-error";

class NotFoundError extends BaseError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export default NotFoundError;
