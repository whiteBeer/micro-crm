import express from "express";
const router = express.Router();

import {
    getTasks,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
} from "../controllers/tasks";

import {
    deleteTaskAccessControl,
    listTasksAccessControl,
    oneTaskAccessControl
} from "../middleware/access-control/tasks";

router.route("/").get(listTasksAccessControl, getTasks);
router.route("/:id").get(oneTaskAccessControl, getTask);
router.route("/").post(createTask);
router.route("/:id").put(oneTaskAccessControl, updateTask);
router.route("/:id/status").patch(oneTaskAccessControl, updateTaskStatus);
router.route("/:id").delete(deleteTaskAccessControl, deleteTask);

export default router;
