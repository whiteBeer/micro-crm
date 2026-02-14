import express from "express";
const router = express.Router();

import {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
} from "../controllers/clients";

router.route("/").get(getClients);
router.route("/:id").get(getClient);
router.route("/").post(createClient);
router.route("/:id").put(updateClient);
router.route("/:id").delete(deleteClient);

export default router;
