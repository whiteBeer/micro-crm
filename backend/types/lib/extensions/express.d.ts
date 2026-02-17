import { IUser, ITask } from "../../global";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
        interface Response {
            locals: {
                task?: ITask;
                deletedTaskId?: string;
            }
        }
    }
}