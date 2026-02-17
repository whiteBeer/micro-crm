import express from "express";
const router = express.Router();

import { login, register, logout } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
