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
import {
    listTasksAccessControl,
    oneTaskAccessControl,
    deleteTaskAccessControl
} from "../middleware/access-control/tasks";
import reminderMiddlewareDeferred from "../middleware/reminder";
import { paginationValidators } from "../middleware/validation/pagination";
import { validateRequest } from "../middleware/validate-request";

router.route("/").get(listTasksAccessControl, paginationValidators, validateRequest, getTasks);
router.route("/:id").get(getTask);
router.route("/").post(reminderMiddlewareDeferred, createTask);
router.route("/:id").put(reminderMiddlewareDeferred, oneTaskAccessControl, updateTask);
router.route("/:id").delete(reminderMiddlewareDeferred, deleteTaskAccessControl, deleteTask);
router.route("/:id/status").patch(updateTaskStatus);

export default router;