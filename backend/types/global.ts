import {Document, Types} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    status: "active" | "inactive";
    avatar: string,
    createJWT(): Promise<string>;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IClient extends Document {
    name: string;
    email: string;
    phone: string;
    company: string;
    status: "active" | "inactive" | "lead";
    managerId: Types.ObjectId;
    notes: string;
}

export interface ITask extends Document {
    title: string;
    description: string;
    clientId: Types.ObjectId;
    assigneeId: Types.ObjectId;
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: Date | null;
}

export interface IJwtPayload {
    userId: string;
    name: string;
}

export interface IErrorMongoose extends Error {
    code: number;
}