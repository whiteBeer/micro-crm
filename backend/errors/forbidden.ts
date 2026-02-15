import { StatusCodes } from "http-status-codes";
import BaseError from "./base-error";

class ForbiddenError extends BaseError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export default ForbiddenError;
