import { IClient } from "../types/global";
import mongoose from "mongoose";
import {BadRequestError} from "../errors";
import { emailRegExp, phoneRegExp } from "../util/regexp";

const ClientSchema = new mongoose.Schema<IClient>({
    name: {
        type: String,
        required: [true, "incorrect_name"],
        minlength: [3, "incorrect_name"],
        maxlength: [150, "incorrect_name"],
        index: true
    },
    email: {
        type: String,
        required: false,
        default: null,
        match: [
            emailRegExp,
            "incorrect_email_address"
        ]
    },
    phone: {
        type: String,
        required: false,
        default: null,
        match: [
            phoneRegExp,
            "incorrect_phone_number"
        ]
    },
    company: {
        type: String,
        required: false,
        default: null
    },
    notes: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive", "lead"],
        default: "lead"
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

ClientSchema.index({ name: "text" });

ClientSchema.pre("validate", async function () {
    if (!this.email && !this.phone) {
        throw new BadRequestError("either_phone_or_email_required");
    }
});

const Client = mongoose.model<IClient>("Client", ClientSchema);
export default Client;
