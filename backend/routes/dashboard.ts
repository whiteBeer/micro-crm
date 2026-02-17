import express from "express";
const router = express.Router();

import {
    getStats,
    getRecentActivities
} from "../controllers/dashboard";
import {
    dashboardAccessControl
} from "../middleware/access-control/dashboard";
import {cacheMiddleware} from "../middleware/cache";

router.route("/stats").get(dashboardAccessControl, cacheMiddleware("dashboard", 180), getStats);
router.route("/recent-activities").get(dashboardAccessControl, getRecentActivities);

export default router;
