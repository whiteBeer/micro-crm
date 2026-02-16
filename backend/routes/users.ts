import express from "express";
const router = express.Router();

import {
    getUser,
    updateUser
} from "../controllers/users";

router.route("/me").get(getUser);
router.route("/profile").put(updateUser);

export default router;
