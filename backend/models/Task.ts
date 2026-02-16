import { ITask } from "../types/global";
import mongoose, {Types} from "mongoose";

const TaskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: [true, "incorrect_task_name"],
        minlength: [3, "incorrect_task_name"],
        maxlength: [150, "incorrect_task_name"],
        index: true
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "in_progress", "completed"]
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"]
    },
    dueDate: {
        type: Date,
        required: false,
        default: null
    },
    clientId: {
        type: Types.ObjectId,
        required: [true, "client_id_required"]
    },
    assigneeId: {
        type: Types.ObjectId,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
