import express from "express";
const router = express.Router();

import {
    getStats,
    getRecentActivities
} from "../controllers/dashboard";

import {
    dashboardAccessControl
} from "../middleware/access-control/dashboard";

router.route("/").get(dashboardAccessControl, getStats);
router.route("/recent-activities").get(dashboardAccessControl, getRecentActivities);

export default router;
