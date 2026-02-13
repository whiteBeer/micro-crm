import { IClient } from "../types/global";
import mongoose, {Types} from "mongoose";
import { emailRegExp } from "../util/regexp";

const ClientSchema = new mongoose.Schema<IClient>({
    name: {
        type: String,
        required: [true, "Please provide full name"],
        minlength: [3, "must be at least 3 characters"],
        maxlength: [150, "cannot be more than 150 characters"],
        index: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            emailRegExp,
            "should be an email address"
        ]
    },
    phone: {
        type: String,
        required: [true, "Please provide client phone number"],
    },
    company: {
        type: String,
        required: [true, "Please provide client company"],
    },
    notes: {
        type: String,
        required: [true, "Please provide notes"],
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive", "lead"]
    },
    managerId: {
        type: Types.ObjectId,
        required: true,
    }
}, { versionKey: false });

const Client = mongoose.model<IClient>("Client", ClientSchema);
export default Client;
