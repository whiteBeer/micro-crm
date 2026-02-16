import { Request, Response, NextFunction } from "express";
import {ForbiddenError} from "../../errors";

export const dashboardAccessControl = async (req: Request, res: Response, next: NextFunction) => {
    const selection:string = ((req.query.selection as string) || "");
    const user = req.user;
    if (selection === "all" && user?.role !== "admin") {
        throw new ForbiddenError("access_denied");
    }
    next();
};