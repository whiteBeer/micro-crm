import { IUser } from "../types/global";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "node:util";
import { emailRegExp, passwordRegExp } from "../util/regexp";

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, "Please provide full name"],
        minlength: [3, "must be at least 3 characters"],
        maxlength: [150, "cannot be more than 150 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            emailRegExp,
            "should be an email address"
        ],
        index: { unique: true }
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: [8, "must be at least 8 characters"],
        match: [
            passwordRegExp,
            "should be at least a symbol, upper and lower case letters and a number"
        ]
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "manager"]
    },
    avatar: {
        type: String,
        required: true,
    }
}, { versionKey: false });

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = async function () {
    const promisifiedSign = promisify(jwt.sign);
    const token = await promisifiedSign(
        { userId: this._id, name: this.fullName },
        // @ts-expect-error some types mismatching after promisify
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.JWT_LIFETIME || "1h"
        }
    );
    return token;
};

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
