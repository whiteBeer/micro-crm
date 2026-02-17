import express from "express";
const router = express.Router();

import {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
} from "../controllers/clients";
import {
    deleteClientAccessControl,
    listClientsAccessControl,
    oneClientAccessControl
} from "../middleware/access-control/clients";
import {cacheMiddleware} from "../middleware/cache";
import { paginationValidators } from "../middleware/validation/pagination";
import { validateRequest } from "../middleware/validate-request";

router.route("/").get(
    listClientsAccessControl,
    paginationValidators,
    validateRequest,
    cacheMiddleware("clients", 300),
    getClients
);
router.route("/:id").get(oneClientAccessControl, getClient);
router.route("/").post(createClient);
router.route("/:id").put(oneClientAccessControl, updateClient);
router.route("/:id").delete(deleteClientAccessControl, deleteClient);

export default router;
