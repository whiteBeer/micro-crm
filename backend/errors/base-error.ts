import { StatusCodes } from "http-status-codes";

class BaseError extends Error {

    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

export default BaseError;
