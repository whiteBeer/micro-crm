import { ITask } from "../types/global";
import mongoose, {Types} from "mongoose";

const TaskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: [true, "Please provide full name"],
        minlength: [3, "must be at least 3 characters"],
        maxlength: [150, "cannot be more than 150 characters"],
        index: true
    },
    description: {
        type: String,
        required: [true, "Please provide task description"],
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
        required: true,
    },
    clientId: {
        type: Types.ObjectId,
        required: true,
    },
    assigneeId: {
        type: Types.ObjectId,
        required: true,
    }
}, { versionKey: false });

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
