import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import connectDB from "../db/mongo";

// important if run tests without Docker
import dotenv from "dotenv";
dotenv.config();

beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI;
    await connectDB(mongoURI || "");
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});

describe("Auth Endpoints", () => {
    describe("POST /api/v1/auth/register", () => {
        it("1. should register a new user and return a valid token with userId and name", async () => {
            const userData = {
                name: "Test User",
                email: "test@example.com",
                password: "Password123!"
            };

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("user");
            expect(res.body.user.name).toEqual(userData.name);
            expect(res.body).toHaveProperty("token");

            const decoded = jwt.decode(res.body.token) as { userId: string };
            expect(decoded).toBeTruthy();
            expect(decoded).toHaveProperty("userId");
            expect(typeof decoded.userId).toBe("string");
        });

        it("2. should not register a user with existing email", async () => {
            await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test User",
                    email: "test@example.com",
                    password: "Password123!"
                });

            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "Test User 2",
                    email: "test@example.com",
                    password: "Password123!"
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.msg).toEqual("email_already_exists");
        });

        it("3. should validate input fields", async () => {
            const res = await request(app)
                .post("/api/v1/auth/register")
                .send({
                    name: "",
                    email: "invalid-email",
                    password: "123"
                });

            expect(res.statusCode).toEqual(400);
        });
    });
});