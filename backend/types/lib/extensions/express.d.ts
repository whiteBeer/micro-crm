import { IUser } from "../../global";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}