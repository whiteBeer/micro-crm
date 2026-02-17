import express from "express";
const router = express.Router();

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} from "../controllers/tasks";

import reminderMiddlewareDefered from "../middleware/reminder";

router.route("/").get(getTasks);
router.route("/:id").get(getTask);
router.route("/").post(reminderMiddlewareDefered, createTask);
router.route("/:id").put(reminderMiddlewareDefered, updateTask);
router.route("/:id").delete(reminderMiddlewareDefered, deleteTask);
router.route("/:id/status").patch(updateTaskStatus);

export default router;